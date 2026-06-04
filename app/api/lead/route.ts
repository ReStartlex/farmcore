import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BOT_TOKEN = process.env.Bot_Token ?? process.env.BOT_TOKEN ?? "";
const LEAD_CHAT_ID = process.env.LEAD_CHAT_ID ?? "";
const TELEGRAM_PROXY = process.env.TELEGRAM_PROXY ?? "";

// ───────── Анти-спам: лимит по IP (in-memory, на инстанс) ─────────
const RATE_LIMIT = 4; // не больше N заявок
const RATE_WINDOW_MS = 10 * 60 * 1000; // за 10 минут
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  // За Cloudflare Tunnel реальный IP клиента приходит в CF-Connecting-IP;
  // x-forwarded-for/коннектор туннеля иначе дали бы один IP на всех.
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  // Лёгкая уборка, чтобы Map не рос бесконечно.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > RATE_LIMIT;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Прокси нужен на случай, если с РУ-хостинга api.telegram.org недоступен напрямую.
 * Если TELEGRAM_PROXY задан — отправка идёт через него (undici ProxyAgent).
 */
async function buildFetchOptions(payload: object): Promise<RequestInit> {
  const base: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  if (!TELEGRAM_PROXY) return base;
  try {
    const { ProxyAgent } = await import("undici");
    // @ts-expect-error — dispatcher поддерживается рантаймом undici в Node.
    base.dispatcher = new ProxyAgent(TELEGRAM_PROXY);
  } catch {
    // Прокси не подключился — пробуем напрямую.
  }
  return base;
}

async function sendToTelegram(text: string): Promise<boolean> {
  if (!BOT_TOKEN || !LEAD_CHAT_ID) return false;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: LEAD_CHAT_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };

  // 1) Через прокси (если задан). 2) Фолбэк — напрямую.
  if (TELEGRAM_PROXY) {
    try {
      const opts = await buildFetchOptions(payload);
      const res = await fetch(url, opts);
      if (res.ok) return true;
    } catch {
      // переходим к прямой попытке
    }
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Приём заявок: отправляет уведомление в Telegram владельцу (LEAD_CHAT_ID)
 * через бота (Bot_Token). Если переменные не заданы — заявка логируется,
 * а форма всё равно отрабатывает корректно.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mode = String(body?.mode ?? "").slice(0, 20);
    const contact = String(body?.contact ?? "").trim().slice(0, 120);
    const accounts = String(body?.accounts ?? "").trim().slice(0, 40);
    const consent = Boolean(body?.consent);
    // Honeypot: скрытое поле, которое заполняют только боты.
    const honeypot = String(body?.company ?? "").trim();

    // Бот попался в ловушку — отвечаем «успехом», но ничего не отправляем.
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (isRateLimited(clientIp(request))) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    if (!contact) {
      return NextResponse.json({ ok: false, error: "empty_contact" }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ ok: false, error: "no_consent" }, { status: 400 });
    }

    const label = mode === "phone" ? "📞 Телефон" : "✈️ Telegram";
    const text =
      `🟢 <b>Новая заявка с сайта FARMCORE</b>\n\n` +
      `<b>${label}:</b> ${escapeHtml(contact)}\n` +
      `<b>Аккаунтов интересует:</b> ${accounts ? escapeHtml(accounts) : "не указано"}\n` +
      `<b>Время:</b> ${new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })} (МСК)`;

    const sent = await sendToTelegram(text);

    if (!sent && BOT_TOKEN && LEAD_CHAT_ID) {
      // Настроено, но отправка не удалась — сообщаем фронту, чтобы предложить прямой контакт.
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }

    if (!sent) {
      // Не настроено — не теряем лид хотя бы в логах.
      console.log("[lead]", { mode, contact, accounts, at: new Date().toISOString() });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
