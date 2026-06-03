"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CALC_LIMITS,
  calcFarm,
  formatMonths,
  formatNumber,
  formatRub,
  maxAccountsForBudget,
} from "@/lib/calc";
import { telegramLink } from "@/data/site";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const FARM_PRESET_EVENT = "farm:preset";

type Mode = "count" | "budget";

export function Calculator() {
  const [count, setCount] = useState(50);
  const [mode, setMode] = useState<Mode>("count");
  const [budget, setBudget] = useState(80000);
  const [budgetEnough, setBudgetEnough] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") {
        setMode("count");
        setCount(detail);
      }
    };
    window.addEventListener(FARM_PRESET_EVENT, handler);
    return () => window.removeEventListener(FARM_PRESET_EVENT, handler);
  }, []);

  function applyBudget(value: number) {
    setBudget(value);
    const { count: c, enough } = maxAccountsForBudget(value);
    setBudgetEnough(enough);
    setCount(c);
  }

  const r = useMemo(() => calcFarm(count), [count]);

  const tgMessage = useMemo(
    () =>
      `Привет! Хочу рассчитать CS2-ферму на ${r.accountsCount} аккаунтов.\n` +
      `Старт: ${formatRub(r.startBudget)}, цена за аккаунт: ${formatRub(r.accountPrice)}.\n` +
      `Подскажите по запуску и окупаемости.`,
    [r]
  );

  const progress = ((r.accountsCount - CALC_LIMITS.min) / (CALC_LIMITS.max - CALC_LIMITS.min)) * 100;

  return (
    <section id="calculator" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Калькулятор"
            title={
              <>
                Калькулятор CS2-фермы:{" "}
                <span className="bg-accent-grad bg-clip-text text-transparent">
                  старт и окупаемость
                </span>
              </>
            }
            subtitle="Двигайте ползунок — расчёт обновляется мгновенно. Это ориентир, а не гарантия: итог зависит от дропа, рынка и количества аккаунтов."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            {/* Управление */}
            <div className="card flex flex-col gap-7 p-6 sm:p-8">
              {/* Переключатель режима */}
              <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-bg p-1.5">
                <button
                  type="button"
                  onClick={() => setMode("count")}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    mode === "count" ? "bg-accent text-white shadow-glow" : "text-ink-soft hover:text-accent"
                  }`}
                >
                  По количеству
                </button>
                <button
                  type="button"
                  onClick={() => setMode("budget")}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    mode === "budget" ? "bg-accent text-white shadow-glow" : "text-ink-soft hover:text-accent"
                  }`}
                >
                  По бюджету
                </button>
              </div>

              {mode === "budget" ? (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Ваш бюджет на старт
                  </span>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-line bg-bg/60 px-4 py-3 focus-within:border-accent/50">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1000}
                      value={budget}
                      onChange={(e) => applyBudget(Number(e.target.value))}
                      className="stat-num w-full bg-transparent text-2xl font-extrabold text-ink outline-none"
                      aria-label="Бюджет в рублях"
                    />
                    <span className="text-lg font-bold text-muted">₽</span>
                  </div>
                  <p className={`mt-2 text-sm ${budgetEnough ? "text-money-ink" : "text-accent-ink"}`}>
                    {budgetEnough
                      ? `На этот бюджет можно взять ${r.accountsCount} аккаунтов.`
                      : `Минимальный старт — 10 аккаунтов (${formatRub(16000)}). Укажите бюджет от 16 000 ₽.`}
                  </p>
                </div>
              ) : null}

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                      {mode === "budget" ? "Получится аккаунтов" : "Количество аккаунтов"}
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="stat-num font-display text-6xl font-extrabold leading-none text-ink">
                        {r.accountsCount}
                      </span>
                      <span className="text-sm text-muted">шт.</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StepButton
                      label="−"
                      onClick={() => {
                        setMode("count");
                        setCount((c) => Math.max(CALC_LIMITS.min, c - CALC_LIMITS.step));
                      }}
                    />
                    <StepButton
                      label="+"
                      onClick={() => {
                        setMode("count");
                        setCount((c) => Math.min(CALC_LIMITS.max, c + CALC_LIMITS.step));
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <input
                    type="range"
                    className="farm-range"
                    min={CALC_LIMITS.min}
                    max={CALC_LIMITS.max}
                    step={CALC_LIMITS.step}
                    value={r.accountsCount}
                    onChange={(e) => {
                      setMode("count");
                      setCount(Number(e.target.value));
                    }}
                    style={{
                      background: `linear-gradient(90deg, #5B5BD6 ${progress}%, #E7E9F0 ${progress}%)`,
                    }}
                    aria-label="Количество аккаунтов"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>{CALC_LIMITS.min}</span>
                    <span>{CALC_LIMITS.max}</span>
                  </div>
                </div>
              </div>

              {/* Быстрые пресеты */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Быстрый выбор
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[10, 30, 50, 100, 200].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setMode("count");
                        setCount(p);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        r.accountsCount === p
                          ? "border-accent bg-accent text-white"
                          : "border-line bg-bg text-ink-soft hover:border-accent/40 hover:text-accent"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Подсказка масштаба */}
              <ScaleHint result={r} />
            </div>

            {/* Результат */}
            <div className="card relative overflow-hidden p-6 sm:p-8">
              <div className="glow-blob right-[-10%] top-[-20%] h-56 w-56 bg-accent/15" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                Итоговый расчёт
              </span>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                <ResultCard label="Цена за аккаунт" value={r.accountPrice} format={formatRub} />
                <ResultCard label="Нужно на старт" value={r.startBudget} format={formatRub} accent />
                <ResultCard
                  label="Ориентир по дропу / мес"
                  valueNode={
                    <span className="stat-num">
                      <AnimatedNumber value={r.monthlyIncomeMin} format={formatNumber} />
                      {"–"}
                      <AnimatedNumber value={r.monthlyIncomeMax} format={formatRub} />
                    </span>
                  }
                  tone="money"
                />
                <ResultCard
                  label="Средний сценарий / мес"
                  value={r.monthlyIncomeBase}
                  format={formatRub}
                  tone="money"
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-bg/60 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                      Когда может отбиться
                    </span>
                  </div>
                  <div className="stat-num mt-1 font-display text-3xl font-extrabold text-ink">
                    <AnimatedNumber value={r.paybackMonthsBase} format={(n) => formatMonths(n)} />
                  </div>
                  <div className="mt-1 text-[11px] text-muted">
                    диапазон {formatMonths(r.paybackMonthsMin)} – {formatMonths(r.paybackMonthsMax)}
                  </div>
                </div>

                <div className="rounded-2xl border border-money/30 bg-money-soft p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-money-ink">
                    Прибыль за 12 мес
                  </span>
                  <div className="stat-num mt-1 font-display text-3xl font-extrabold text-money-ink">
                    <AnimatedNumber value={r.yearlyProfitBase} format={formatRub} />
                  </div>
                  <div className="mt-1 text-[11px] text-money-ink/70">
                    доход за год минус старт
                  </div>
                </div>
              </div>

              {r.paybackImprovementPct > 0 ? (
                <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-accent-soft px-4 py-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    %
                  </span>
                  <p className="text-sm font-medium text-accent-ink">
                    Окупаемость на ~{r.paybackImprovementPct}% быстрее, чем на минимальном старте
                    (10 акк), и доход на аккаунт выше — {formatRub(r.incomePerAccount)}/мес.
                  </p>
                </div>
              ) : null}

              <a
                href={telegramLink(tgMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 w-full text-base"
              >
                Получить точный расчёт в Telegram
              </a>

              <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                Расчёт ориентировочный. Доход зависит от выпавших предметов и рынка и может
                отличаться. Это не гарантия прибыли.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-bg text-2xl font-bold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
      aria-label={label === "−" ? "Меньше" : "Больше"}
    >
      {label}
    </button>
  );
}

function ResultCard({
  label,
  value,
  valueNode,
  format,
  accent,
  tone = "ink",
}: {
  label: string;
  value?: number;
  valueNode?: React.ReactNode;
  format?: (n: number) => string;
  accent?: boolean;
  tone?: "ink" | "money";
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "border-accent/30 bg-accent-soft" : "border-line bg-bg/60"
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-wider ${
          accent ? "text-accent-ink" : tone === "money" ? "text-money-ink/80" : "text-muted"
        }`}
      >
        {label}
      </div>
      <div
        className={`stat-num mt-1.5 text-lg font-extrabold sm:text-xl ${
          tone === "money" ? "text-money-ink" : "text-ink"
        }`}
      >
        {valueNode ?? (format && value !== undefined ? (
          <AnimatedNumber value={value} format={format} />
        ) : null)}
      </div>
    </div>
  );
}

function ScaleHint({ result }: { result: ReturnType<typeof calcFarm> }) {
  let text: string;
  if (result.tier === "start") {
    text = "Возьмёте от 30 аккаунтов — цена упадёт до 1550 ₽, а окупаемость продолжит ускоряться с каждым шагом.";
  } else if (result.tier === "mid") {
    text = "От 100 аккаунтов — лучшая цена 1500 ₽ и максимум попыток поймать дорогой дроп. Дальше окупаемость всё ещё растёт.";
  } else {
    text = "Чем больше аккаунтов, тем выше средний доход на аккаунт и быстрее окупаемость — потолка по объёму нет.";
  }
  return (
    <motion.div
      key={result.tier}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-auto flex items-start gap-3 rounded-2xl bg-accent-soft p-4"
    >
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
        ↑
      </span>
      <p className="text-sm leading-relaxed text-accent-ink">{text}</p>
    </motion.div>
  );
}
