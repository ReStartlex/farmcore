import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { t: "Выбираете объём или бюджет", d: "Двигаете калькулятор или просто называете сумму, на которую рассчитываете." },
  { t: "Подбираем сценарий", d: "Помогаю определить количество аккаунтов под вашу задачу и бюджет." },
  { t: "Считаем старт и окупаемость", d: "Вы видите стартовый бюджет и ориентировочную окупаемость до покупки." },
  { t: "Вы получаете аккаунты", d: "Передаю готовые аккаунты для фермы — под выбранный объём." },
  { t: "Объясняю запуск", d: "Рассказываю дальнейшие действия, чтобы ферма заработала." },
  { t: "Запускаете и спрашиваете", d: "Ферма работает, а я остаюсь на связи по любым вопросам." },
];

export function Process() {
  return (
    <Section id="process">
      <Reveal>
        <SectionHeading
          center
          eyebrow="Как проходит запуск"
          title={
            <>
              От расчёта до{" "}
              <span className="bg-accent-grad bg-clip-text text-transparent">работающей фермы</span>
            </>
          }
          subtitle="Прозрачный путь без сюрпризов: вы понимаете каждый шаг ещё до покупки."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={(i % 3) * 0.07}>
            <div className="card relative h-full overflow-hidden p-6">
              <span className="absolute right-4 top-2 font-display text-6xl font-extrabold text-accent/[0.07]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-grad text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
