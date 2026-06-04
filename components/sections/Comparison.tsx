"use client";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { calcFarm, formatMonths, formatRub } from "@/lib/calc";
import { FARM_PRESET_EVENT } from "@/components/sections/Calculator";

const volumes = [10, 50, 100, 300];

const rows: { label: string; get: (r: ReturnType<typeof calcFarm>) => string; tone?: "money" }[] = [
  { label: "Цена за аккаунт", get: (r) => formatRub(r.accountPrice) },
  { label: "Нужно на старт", get: (r) => formatRub(r.startBudget) },
  { label: "Средний доход / мес", get: (r) => formatRub(r.monthlyIncomeBase), tone: "money" },
  { label: "Окупаемость", get: (r) => formatMonths(r.paybackMonthsBase) },
  { label: "Прибыль за 12 мес", get: (r) => formatRub(r.yearlyProfitBase), tone: "money" },
];

export function Comparison() {
  function pick(preset: number) {
    window.dispatchEvent(new CustomEvent(FARM_PRESET_EVENT, { detail: preset }));
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const data = volumes.map((v) => calcFarm(v));

  return (
    <Section id="comparison">
      <Reveal>
        <SectionHeading
          center
          eyebrow="Сравнение объёмов"
          title={
            <>
              Чем больше ферма —{" "}
              <span className="bg-accent-grad bg-clip-text text-transparent">тем выгоднее</span>
            </>
          }
          subtitle="Цена за аккаунт ниже, окупаемость быстрее, а прибыль за год растёт нелинейно. Сравните сами."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
          <div className="-mx-px overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Шапка с объёмами */}
              <div className="grid grid-cols-[1.1fr_repeat(4,1fr)] border-b border-line bg-bg/50">
                <div className="p-3 text-xs font-semibold uppercase tracking-wider text-muted sm:p-4">
                  Показатель
                </div>
                {data.map((r, i) => (
                  <div
                    key={r.accountsCount}
                    className={`p-3 text-center sm:p-4 ${i === data.length - 1 ? "bg-accent-soft" : ""}`}
                  >
                    <div className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                      {r.accountsCount}
                    </div>
                    <div className="text-[11px] text-muted">аккаунтов</div>
                  </div>
                ))}
              </div>

              {/* Строки */}
              {rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.1fr_repeat(4,1fr)] items-center ${
                    ri % 2 ? "bg-bg/30" : ""
                  }`}
                >
                  <div className="p-3 text-xs font-medium text-muted sm:p-4 sm:text-sm">
                    {row.label}
                  </div>
                  {data.map((r, i) => (
                    <div
                      key={r.accountsCount}
                      className={`whitespace-nowrap p-3 text-center text-sm font-bold sm:p-4 sm:text-base ${
                        i === data.length - 1 ? "bg-accent-soft/60" : ""
                      } ${row.tone === "money" ? "text-money-ink" : "text-ink"} stat-num`}
                    >
                      {row.get(r)}
                    </div>
                  ))}
                </div>
              ))}

              {/* CTA-строка */}
              <div className="grid grid-cols-[1.1fr_repeat(4,1fr)] items-center border-t border-line">
                <div className="p-3 sm:p-4" />
                {data.map((r, i) => (
                  <div
                    key={r.accountsCount}
                    className={`p-2 sm:p-3 ${i === data.length - 1 ? "bg-accent-soft" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => pick(r.accountsCount)}
                      className="w-full rounded-full border border-line bg-surface px-2 py-2 text-xs font-semibold text-accent-ink transition-colors hover:border-accent/50 hover:bg-accent-soft"
                    >
                      Выбрать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-3 text-center text-[11px] text-muted sm:hidden" aria-hidden="true">
          ← листайте таблицу →
        </p>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs text-muted">
          Значения ориентировочные и рассчитаны по среднему сценарию. Реальный доход зависит от
          дропа и рынка и может отличаться.
        </p>
      </Reveal>
    </Section>
  );
}
