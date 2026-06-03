"use client";

import { scenarios } from "@/data/scenarios";
import { calcFarm, formatRub } from "@/lib/calc";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FARM_PRESET_EVENT } from "@/components/sections/Calculator";

export function Scenarios() {
  function pick(preset: number) {
    window.dispatchEvent(new CustomEvent(FARM_PRESET_EVENT, { detail: preset }));
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="scenarios" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            center
            eyebrow="Сценарии запуска"
            title={
              <>
                Сценарии запуска фермы CS2:{" "}
                <span className="bg-accent-grad bg-clip-text text-transparent">
                  от старта до масштаба
                </span>
              </>
            }
            subtitle="Не жёсткие тарифы, а ориентиры под задачу и бюджет. Точный объём подберём вместе."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {scenarios.map((s, i) => {
            const r = calcFarm(s.preset);
            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <div
                  className={`card relative flex h-full flex-col p-6 transition-transform hover:-translate-y-1 ${
                    s.popular ? "border-accent/40 shadow-lift" : ""
                  }`}
                >
                  {s.popular ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-accent-grad px-3 py-1 text-xs font-bold text-white shadow-glow">
                      Популярное
                    </span>
                  ) : null}

                  <h3 className="font-display text-xl font-extrabold text-ink">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted">{s.range}</p>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="stat-num font-display text-3xl font-extrabold text-ink">
                      {formatRub(s.pricePerAccount)}
                    </span>
                    <span className="text-sm text-muted">/ аккаунт</span>
                  </div>
                  <p className="mt-1 text-sm text-money-ink">
                    старт около {formatRub(r.startBudget)}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-ink-soft">{s.who}</p>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {s.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Check />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => pick(s.preset)}
                    className={`mt-7 w-full ${s.popular ? "btn-primary" : "btn-ghost"}`}
                  >
                    Рассчитать этот сценарий
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#EEEDFB" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        stroke="#5B5BD6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
