import { NextResponse } from "next/server";
import https from "node:https";
import net from "node:net";
import tls from "node:tls";
import { appendFileSync } from "node:fs";
import path from "node:path";
import { fetch as undiciFetch, ProxyAgent } from "undici";

export const runtime = "nodejs";

const TELEGRAM_FETCH_TIMEOUT_MS = 25_000;

// ───────── Анти-спам: лимит по IP (in-memory, на инстанс) ─────────
const RATE_LIMIT = 4; // не больше N заявок
const RATE_WINDOW_MS = 10 * 60 * 1000; // за 10 минут
const hits = new Map<string, number[]>();

type TelegramEnv = {
  botToken: string;
  chatId: string;
  httpProxy: string;
  socksProxy: string;
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
  error_code?: number;
};

type DeliveryAttempt =
  | "manual_connect"
  | "http_proxy"
  | "http_proxy_undici"
  | "socks5_proxy"
  | "direct";

type DeliveryResult = {
  ok: boolean;
  status: number;
  body: TelegramApiResponse;
  raw: string;
};

function getTelegramEnv(): TelegramEnv {
  // Динамический доступ — Next.js не подставляет значения на этапе build.
  const env = process.env;
  return {
    botToken: env["Bot_Token"] ?? env["BOT_TOKEN"] ?? "",
    chatId: env["LEAD_CHAT_ID"] ?? "",
    httpProxy: env["TELEGRAM_PROXY"] ?? "",
    socksProxy: env["TELEGRAM_PROXY_SOCKS5"] ?? "",
  };
}

function maskProxy(proxyUrl: string): string {
  if (!proxyUrl) return "";
  try {
    const u = new URL(proxyUrl);
    return `${u.protocol}//${u.hostname}:${u.port || (u.protocol === "https:" ? "443" : "80")}`;
  } catch {
    return "(invalid_proxy_url)";
  }
}

function logLead(event: string, details: Record<string, unknown>): void {
  console.log("[lead]", event, details);
}

/**
 * Резервная копия заявки на диск (JSON Lines). Срабатывает на КАЖДУЮ заявку,
 * поэтому ни один лид не теряется, даже если Telegram/прокси недоступны.
 * Путь можно переопределить переменной LEADS_FILE; по умолчанию — leads.jsonl
 * в рабочей папке приложения (на VPS это /opt/farmcore/leads.jsonl).
 */
function leadsFilePath(): string {
  return process.env["LEADS_FILE"] || path.join(process.cwd(), "leads.jsonl");
}

function persistLead(record: Record<string, unknown>): boolean {
  try {
    appendFileSync(leadsFilePath(), `${JSON.stringify(record)}\n`, "utf8");
    return true;
  } catch (err) {
    logLead("persist_error", {
      message: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

function createProxyAgent(proxyUrl: string): ProxyAgent {
  try {
    return new ProxyAgent({ uri: proxyUrl });
  } catch {
    return new ProxyAgent(proxyUrl);
  }
}

function parseTelegramBody(raw: string): TelegramApiResponse {
  try {
    return JSON.parse(raw) as TelegramApiResponse;
  } catch {
    return {};
  }
}

function isTelegramSuccess(status: number, body: TelegramApiResponse): boolean {
  return status >= 200 && status < 300 && body.ok === true;
}

function buildDeliveryResult(status: number, raw: string): DeliveryResult {
  const body = parseTelegramBody(raw);
  return {
    ok: isTelegramSuccess(status, body),
    status,
    body,
    raw: raw.slice(0, 500),
  };
}

async function sendViaHttpsRequest(
  url: string,
  body: string,
  agent?: https.Agent,
  errorLabel = "https_request_error",
  proxyUrl?: string,
): Promise<DeliveryResult> {
  const target = new URL(url);

  return new Promise((resolve) => {
    const req = https.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        agent,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk: Buffer | string) => {
          raw += chunk.toString();
        });
        res.on("end", () => {
          clearTimeout(timer);
          resolve(buildDeliveryResult(res.statusCode ?? 0, raw));
        });
      },
    );

    const timer = setTimeout(() => {
      req.destroy(new Error("https_request_timeout"));
    }, TELEGRAM_FETCH_TIMEOUT_MS);

    req.on("error", (err) => {
      clearTimeout(timer);
      logLead(errorLabel, {
        message: err.message,
        proxy: proxyUrl ? maskProxy(proxyUrl) : null,
      });
      resolve({ ok: false, status: 0, body: {}, raw: "" });
    });

    req.write(body);
    req.end();
  });
}

/**
 * Открывает CONNECT-туннель через HTTP-прокси вручную — ровно как `curl -x`.
 * Возвращает уже установленный TCP-сокет до целевого хоста (ещё без TLS).
 * Логирует статус CONNECT-ответа прокси (например 407 — неверный логин/пароль),
 * чего не видно при использовании https-proxy-agent / undici.
 */
function openProxyTunnel(
  proxyUrl: string,
  targetHost: string,
  targetPort: number,
): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const proxy = new URL(proxyUrl);
    const socket = net.connect({
      host: proxy.hostname,
      port: Number(proxy.port) || 80,
    });

    let buf = Buffer.alloc(0);

    const cleanup = () => {
      socket.removeListener("data", onData);
      socket.removeListener("error", onError);
      socket.removeListener("end", onEnd);
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const onEnd = () => {
      cleanup();
      reject(new Error("proxy_closed_before_connect_response"));
    };
    const onData = (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk]);
      const headerEnd = buf.indexOf("\r\n\r\n");
      if (headerEnd === -1) return; // ждём полный заголовок ответа на CONNECT
      cleanup();
      const head = buf.slice(0, headerEnd).toString("latin1");
      const statusLine = head.split("\r\n")[0] ?? "";
      const m = statusLine.match(/^HTTP\/\d\.\d\s+(\d{3})/);
      const status = m ? Number(m[1]) : 0;
      if (status === 200) {
        resolve(socket);
      } else {
        socket.destroy();
        reject(
          Object.assign(new Error(`proxy_connect_status_${status || "unknown"}`), {
            connectStatus: status,
            statusLine,
          }),
        );
      }
    };

    socket.once("connect", () => {
      const hasAuth = Boolean(proxy.username || proxy.password);
      const authHeader = hasAuth
        ? `Proxy-Authorization: Basic ${Buffer.from(
            `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`,
          ).toString("base64")}\r\n`
        : "";
      socket.write(
        `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\n` +
          `Host: ${targetHost}:${targetPort}\r\n` +
          authHeader +
          `Proxy-Connection: Keep-Alive\r\n` +
          `\r\n`,
      );
    });

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("end", onEnd);
  });
}

async function sendViaManualConnect(
  url: string,
  body: string,
  proxyUrl: string,
): Promise<DeliveryResult> {
  const target = new URL(url);
  const targetHost = target.hostname;
  const targetPort = Number(target.port) || 443;

  let tunnel: net.Socket;
  try {
    tunnel = await openProxyTunnel(proxyUrl, targetHost, targetPort);
  } catch (err) {
    const e = err as Error & { connectStatus?: number; statusLine?: string };
    logLead("manual_connect_failed", {
      proxy: maskProxy(proxyUrl),
      message: e.message,
      connectStatus: e.connectStatus ?? null,
    });
    return { ok: false, status: 0, body: {}, raw: "" };
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (r: DeliveryResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };

    const req = https.request(
      {
        host: targetHost,
        port: targetPort,
        method: "POST",
        path: `${target.pathname}${target.search}`,
        headers: {
          Host: targetHost,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        // TLS поверх уже установленного CONNECT-туннеля.
        createConnection: () => tls.connect({ socket: tunnel, servername: targetHost }),
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => {
          raw += chunk;
        });
        res.on("end", () => finish(buildDeliveryResult(res.statusCode ?? 0, raw)));
      },
    );

    const timer = setTimeout(() => {
      req.destroy(new Error("manual_connect_request_timeout"));
    }, TELEGRAM_FETCH_TIMEOUT_MS);

    req.on("error", (err) => {
      logLead("manual_connect_request_error", {
        proxy: maskProxy(proxyUrl),
        message: err.message,
      });
      finish({ ok: false, status: 0, body: {}, raw: "" });
    });

    req.write(body);
    req.end();
  });
}

async function sendViaHttpProxy(
  url: string,
  body: string,
  proxyUrl: string,
): Promise<DeliveryResult> {
  try {
    const { HttpsProxyAgent } = await import("https-proxy-agent");
    const agent = new HttpsProxyAgent(proxyUrl);
    return sendViaHttpsRequest(url, body, agent, "http_proxy_request_error", proxyUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logLead("http_proxy_agent_unavailable", { message });
    return { ok: false, status: 0, body: {}, raw: "" };
  }
}

async function sendViaSocks5(
  url: string,
  body: string,
  proxyUrl: string,
): Promise<DeliveryResult> {
  try {
    const { SocksProxyAgent } = await import("socks-proxy-agent");
    const agent = new SocksProxyAgent(proxyUrl);
    return sendViaHttpsRequest(url, body, agent, "socks5_request_error", proxyUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logLead("socks5_agent_unavailable", { message });
    return { ok: false, status: 0, body: {}, raw: "" };
  }
}

async function sendViaUndici(
  url: string,
  body: string,
  attempt: DeliveryAttempt,
  proxyUrl?: string,
): Promise<DeliveryResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TELEGRAM_FETCH_TIMEOUT_MS);

  try {
    const init: Parameters<typeof undiciFetch>[1] = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: controller.signal,
    };

    if (proxyUrl) {
      init.dispatcher = createProxyAgent(proxyUrl);
    }

    const res = await undiciFetch(url, init);
    const raw = await res.text();
    return buildDeliveryResult(res.status, raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const cause =
      err instanceof Error && err.cause instanceof Error ? err.cause.message : undefined;
    logLead("undici_request_error", {
      attempt,
      proxy: proxyUrl ? maskProxy(proxyUrl) : null,
      message,
      cause: cause ?? null,
    });
    return { ok: false, status: 0, body: {}, raw: "" };
  } finally {
    clearTimeout(timer);
  }
}

function isSocksProxy(proxyUrl: string): boolean {
  return /^socks/i.test(proxyUrl);
}

async function sendToTelegram(text: string): Promise<boolean> {
  const { botToken, chatId, httpProxy, socksProxy } = getTelegramEnv();

  logLead("env_check", {
    hasBotToken: Boolean(botToken),
    botTokenLen: botToken.length,
    hasChatId: Boolean(chatId),
    chatIdLen: chatId.length,
    hasHttpProxy: Boolean(httpProxy) && !isSocksProxy(httpProxy),
    httpProxy: maskProxy(httpProxy),
    hasSocksProxy: Boolean(socksProxy),
    socksProxy: maskProxy(socksProxy),
  });

  if (!botToken || !chatId) return false;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  const attempts: Array<{ attempt: DeliveryAttempt; proxyUrl?: string }> = [];

  if (httpProxy) {
    if (isSocksProxy(httpProxy)) {
      attempts.push({ attempt: "socks5_proxy", proxyUrl: httpProxy });
    } else {
      // Ручной CONNECT-туннель — точная копия `curl -x`, явно шлёт Proxy-Authorization
      // и логирует статус CONNECT-ответа прокси. Это основной путь.
      attempts.push({ attempt: "manual_connect", proxyUrl: httpProxy });
      // Запасные пути на случай, если ручной туннель не сработает.
      attempts.push({ attempt: "http_proxy", proxyUrl: httpProxy });
      attempts.push({ attempt: "http_proxy_undici", proxyUrl: httpProxy });
    }
  }

  if (socksProxy && !attempts.some((a) => a.proxyUrl === socksProxy)) {
    attempts.push({ attempt: "socks5_proxy", proxyUrl: socksProxy });
  }

  // Прямой доступ с VPS не работает — пробуем только если прокси не задан.
  if (!httpProxy && !socksProxy) {
    attempts.push({ attempt: "direct" });
  }

  for (const { attempt, proxyUrl } of attempts) {
    let result: DeliveryResult;

    if (attempt === "manual_connect" && proxyUrl) {
      result = await sendViaManualConnect(url, payload, proxyUrl);
    } else if (attempt === "http_proxy" && proxyUrl) {
      result = await sendViaHttpProxy(url, payload, proxyUrl);
    } else if (attempt === "socks5_proxy" && proxyUrl) {
      result = await sendViaSocks5(url, payload, proxyUrl);
    } else {
      result = await sendViaUndici(url, payload, attempt, proxyUrl);
    }

    logLead("telegram_attempt", {
      attempt,
      proxy: proxyUrl ? maskProxy(proxyUrl) : null,
      status: result.status,
      telegramOk: result.body.ok ?? false,
      telegramError: result.body.description ?? null,
      telegramErrorCode: result.body.error_code ?? null,
      responsePreview: result.raw || null,
    });

    if (result.ok) return true;
  }

  return false;
}

function clientIp(request: Request): string {
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
    const honeypot = String(body?.company ?? "").trim();

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

    const { botToken, chatId } = getTelegramEnv();
    const sent = await sendToTelegram(text);

    // Резервная копия пишется ВСЕГДА (и при успехе — как аудит-лог всех заявок).
    const saved = persistLead({
      at: new Date().toISOString(),
      mode,
      contact,
      accounts: accounts || null,
      ip: clientIp(request),
      delivered: sent,
    });

    if (!sent) {
      logLead("delivery_failed", { saved, hasBot: Boolean(botToken && chatId) });
      // Лид сохранён на диск — не показываем посетителю ошибку, заявка не потеряна.
      if (saved) {
        return NextResponse.json({ ok: true, saved: true });
      }
      // Сохранить не удалось И Telegram настроен, но не доставил — только тогда ошибка.
      if (botToken && chatId) {
        return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logLead("bad_request", { message });
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
