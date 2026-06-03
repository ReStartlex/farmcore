"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { ymGoal } from "@/lib/analytics";

type Mode = "telegram" | "phone";
type Status = "idle" | "loading" | "ok" | "error";

/** Мягкая проверка контакта: ник Telegram или телефон (10–15 цифр). */
function isValidContact(mode: Mode, value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (mode === "telegram") {
    const handle = v
      .replace(/^https?:\/\//i, "")
      .replace(/^(t\.me|telegram\.me)\//i, "")
      .replace(/^@/, "");
    return /^[A-Za-z0-9_]{4,32}$/.test(handle);
  }
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function FinalCta() {
  const [mode, setMode] = useState<Mode>("telegram");
  const [contact, setContact] = useState("");
  const [accounts, setAccounts] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);
  // Honeypot — заполняется только ботами, людям невидим.
  const [company, setCompany] = useState("");

  const contactValid = isValidContact(mode, contact);
  const showContactError = touched && contact.trim().length > 0 && !contactValid;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!contactValid || !consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, contact, accounts, consent, company }),
      });
      if (res.ok) {
        setStatus("ok");
        ymGoal("lead_submit", { mode });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white shadow-card sm:px-12 sm:py-16">
          <div className="glow-blob left-[-5%] top-[-30%] h-72 w-72 bg-accent/50" />
          <div className="glow-blob bottom-[-40%] right-[0%] h-72 w-72 bg-money/30" />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-money" />
                Финальный шаг
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                Рассчитаем вашу{" "}
                <span className="bg-gradient-to-r from-[#A99CFF] to-[#7A6CF0] bg-clip-text text-transparent">
                  CS2-ферму
                </span>{" "}
                под бюджет
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                Напишите — подберу объём аккаунтов, посчитаю старт и окупаемость и объясню механику
                до покупки. Отвечу в Telegram или перезвоню, если оставите номер.
              </p>
              <a
                href={site.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light mt-7 text-base"
              >
                Написать {site.telegram.handle}
              </a>
            </div>

            {/* Форма заявки */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:p-7">
              {status === "ok" ? (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-money text-2xl">
                    ✓
                  </span>
                  <h3 className="mt-4 text-lg font-bold">Заявка принята</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Свяжусь с вами в ближайшее время. Если удобно — можете сразу написать в Telegram.
                  </p>
                  <a
                    href={site.telegram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-light mt-5"
                  >
                    Открыть Telegram
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2 rounded-full bg-white/10 p-1">
                    <ToggleBtn active={mode === "telegram"} onClick={() => setMode("telegram")}>
                      Telegram
                    </ToggleBtn>
                    <ToggleBtn active={mode === "phone"} onClick={() => setMode("phone")}>
                      Телефон
                    </ToggleBtn>
                  </div>

                  <div>
                    <Field
                      label={mode === "telegram" ? "Ваш Telegram" : "Ваш телефон"}
                      placeholder={mode === "telegram" ? "@username" : "+7 ___ ___-__-__"}
                      type={mode === "telegram" ? "text" : "tel"}
                      value={contact}
                      onChange={setContact}
                      onBlur={() => setTouched(true)}
                      invalid={showContactError}
                    />
                    {showContactError ? (
                      <p className="mt-1.5 text-xs text-[#FFB4B4]">
                        {mode === "telegram"
                          ? "Укажите ник в формате @username."
                          : "Укажите корректный номер телефона."}
                      </p>
                    ) : null}
                  </div>
                  <Field
                    label="Сколько аккаунтов интересует (необязательно)"
                    placeholder="например, 50"
                    type="text"
                    value={accounts}
                    onChange={setAccounts}
                  />

                  {/* Honeypot — скрыт от людей, ловит ботов */}
                  <input
                    type="text"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-white/65">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#7A6CF0]"
                    />
                    <span>
                      Согласен на обработку персональных данных для связи по заявке. См.{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/40 underline-offset-2 hover:text-white"
                      >
                        политику конфиденциальности
                      </a>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === "loading" || !contactValid || !consent}
                    className="btn bg-accent-grad text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? "Отправляю…" : "Получить расчёт"}
                  </button>

                  {status === "error" ? (
                    <p className="text-center text-sm text-[#FFB4B4]">
                      Не удалось отправить. Напишите напрямую в Telegram {site.telegram.handle}.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-white text-ink" : "text-white/70 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  placeholder,
  type,
  value,
  onChange,
  onBlur,
  invalid,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        className={`w-full rounded-2xl border bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors ${
          invalid ? "border-[#FFB4B4]/60 focus:border-[#FFB4B4]" : "border-white/15 focus:border-white/40"
        }`}
      />
    </label>
  );
}
