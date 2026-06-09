"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { ymGoal } from "@/lib/analytics";

type Mode = "telegram" | "phone";
type Status = "idle" | "loading" | "ok" | "error";

/** Калькулятор присылает сюда выбранное количество аккаунтов — форма заполняется и подсвечивается. */
export const FORM_PREFILL_EVENT = "lead:prefill";

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
  const [highlight, setHighlight] = useState(false);
  // Honeypot — заполняется только ботами, людям невидим.
  const [company, setCompany] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  // Калькулятор/сценарии передают сюда выбранное количество аккаунтов.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") {
        setAccounts(String(detail));
        setHighlight(true);
        window.setTimeout(() => setHighlight(false), 2000);
      }
    };
    window.addEventListener(FORM_PREFILL_EVENT, handler);
    return () => window.removeEventListener(FORM_PREFILL_EVENT, handler);
  }, []);

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
    <section id="lead" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#1d1a3e_0%,#100e1c_100%)] px-6 py-12 text-white shadow-card sm:px-12 sm:py-16">
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

              <a
                href={site.funpay.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <span className="text-money">★</span>
                <span>
                  Проверенный продавец FunPay · {site.funpay.reviews} отзывов · {site.funpay.rating}
                </span>
              </a>
            </div>

            {/* Форма заявки — светлая карточка в стиле сайта (поля как в калькуляторе). */}
            <div
              ref={cardRef}
              className={`rounded-3xl bg-surface p-6 text-ink shadow-card transition-all duration-300 sm:p-7 ${
                highlight ? "shadow-lift ring-2 ring-accent" : ""
              }`}
            >
              {status === "ok" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex h-full min-h-[260px] flex-col items-center justify-center text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-money text-2xl text-white">
                    ✓
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">Заявка принята</h3>
                  <p className="mt-2 text-sm text-muted">
                    Свяжусь с вами в ближайшее время. Если удобно — можете сразу написать в Telegram.
                  </p>
                  <a
                    href={site.telegram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-5"
                  >
                    Открыть Telegram
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-bg p-1.5">
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
                      <p className="mt-1.5 text-xs text-red-600">
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

                  <label className="flex cursor-pointer items-start gap-2.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                    />
                    <span>
                      Согласен на обработку персональных данных для связи по заявке. См.{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline decoration-accent/40 underline-offset-2 hover:text-accent-ink"
                      >
                        политику конфиденциальности
                      </a>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === "loading" || !contactValid || !consent}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {status === "loading" ? "Отправляю…" : "Получить расчёт"}
                  </button>

                  <p className="text-center text-[11px] leading-relaxed text-muted">
                    Без спама — только расчёт и ответы на ваши вопросы.
                  </p>

                  {status === "error" ? (
                    <p role="alert" className="text-center text-sm text-red-600">
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
      className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-accent text-white shadow-glow" : "text-ink-soft hover:text-accent"
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
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        className={`w-full rounded-2xl border bg-bg/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors ${
          invalid ? "border-red-400 focus:border-red-500" : "border-line focus:border-accent/50"
        }`}
      />
    </label>
  );
}
