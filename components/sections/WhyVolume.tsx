import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const points = [
  {
    title: "Каждый аккаунт — отдельные попытки",
    text: "Дроп начисляется по аккаунтам еженедельно. Больше аккаунтов — больше независимых попыток получить предмет каждую неделю.",
  },
  {
    title: "Меньше скачков от недели к неделе",
    text: "С небольшим количеством аккаунтов результат заметно «прыгает». С большим объёмом поток дропа выравнивается и становится предсказуемее.",
  },
  {
    title: "Выше шанс на дорогой дроп",
    text: "Чем больше аккаунтов, тем выше вероятность, что один из них поймает дорогой предмет или кейс — особенно в периоды обновлений CS2.",
  },
];

export function WhyVolume() {
  return (
    <Section id="why" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Почему объём важен"
            title={
              <>
                Больше аккаунтов —{" "}
                <span className="bg-accent-grad bg-clip-text text-transparent">
                  больше попыток
                </span>{" "}
                поймать дроп
              </>
            }
            subtitle="Объём влияет не только на цену за аккаунт, но и на стабильность и потолок дохода. Вот как это работает простым языком."
          />
        </Reveal>

        <div className="grid gap-4">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="card flex gap-4 p-5 transition-transform hover:-translate-y-0.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-grad font-display text-base font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.26}>
            <VolumeChart />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function VolumeChart() {
  const bars = [
    { label: "10 акк", h: 28 },
    { label: "30 акк", h: 48 },
    { label: "50 акк", h: 64 },
    { label: "100 акк", h: 92 },
  ];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink">Условная стабильность дропа</span>
        <span className="text-xs text-muted">чем выше — тем ровнее поток</span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end">
              <div
                className="w-full rounded-t-xl bg-accent-grad transition-all"
                style={{ height: `${b.h}%` }}
              />
            </div>
            <span className="text-xs text-muted">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
