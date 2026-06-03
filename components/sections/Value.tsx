import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    title: "Готовые аккаунты для фермы",
    text: "Подобранные под объём аккаунты Steam для дропа CS2.",
    icon: "accounts",
  },
  {
    title: "Понятный расчёт",
    text: "Стартовый бюджет, ориентир по доходу и окупаемость — до покупки.",
    icon: "calc",
  },
  {
    title: "Помощь с выбором объёма",
    text: "Подберём количество аккаунтов под ваш бюджет и задачу.",
    icon: "target",
  },
  {
    title: "Рекомендации по запуску",
    text: "Базовые шаги, чтобы ферма заработала без лишней воды.",
    icon: "rocket",
  },
  {
    title: "Сопровождение после покупки",
    text: "Останусь на связи и помогу с вопросами по ходу запуска.",
    icon: "support",
  },
  {
    title: "Связь напрямую",
    text: "Telegram или звонок — как удобнее. Без посредников.",
    icon: "chat",
  },
];

export function Value() {
  return (
    <Section id="value" className="bg-surface">
      <Reveal>
        <SectionHeading
          center
          eyebrow="Что вы получаете"
          title={
            <>
              Не просто аккаунты, а{" "}
              <span className="bg-accent-grad bg-clip-text text-transparent">запуск под ключ</span>
            </>
          }
          subtitle="Базовая помощь и расчёт входят в покупку — это часть ценности, а не платные опции."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.07}>
            <div className="card flex h-full flex-col gap-3 p-6 transition-transform hover:-translate-y-1">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon name={item.icon} />
              </span>
              <h3 className="text-base font-bold text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Icon({ name }: { name: string }) {
  const common = { width: 24, height: 24, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "accounts":
      return (
        <svg viewBox="0 0 24 24" {...common}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 9h18M7 14h4" /></svg>
      );
    case "calc":
      return (
        <svg viewBox="0 0 24 24" {...common}><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M9 7h6M9 11h0M12 11h0M15 11h0M9 15h0M12 15h3" /></svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /></svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 24 24" {...common}><path d="M5 15c0-5 3-9 7-11 4 2 7 6 7 11l-3 2H8l-3-2Z" /><circle cx="12" cy="9" r="1.6" /><path d="M9 19l-1 2M15 19l1 2" /></svg>
      );
    case "support":
      return (
        <svg viewBox="0 0 24 24" {...common}><path d="M4 12a8 8 0 0 1 16 0v4a3 3 0 0 1-3 3h-2" /><rect x="3" y="11" width="3.5" height="6" rx="1.5" /><rect x="17.5" y="11" width="3.5" height="6" rx="1.5" /></svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}><path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-4 4v-4a3 3 0 0 1-1-2V6Z" /></svg>
      );
  }
}
