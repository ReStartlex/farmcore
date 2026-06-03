import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const timeline = [
  { year: "2014", text: "Старт в Steam. Операция Bravo, первые операции и дроп." },
  { year: "2016–2020", text: "Глубоко изучил предметы, рынок и механику заработка." },
  { year: "2021–2024", text: "Тестировал стратегии фермы и работу аккаунтов на практике." },
  { year: "2026", text: "Помогаю запускать CS2 / Steam фермы под ключ и под бюджет." },
];

export function About() {
  return (
    <Section id="about" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          {/* Визуальная «карточка эксперта» вместо фото */}
          <div className="card relative overflow-hidden p-8">
            <div className="glow-blob left-[-15%] top-[-20%] h-56 w-56 bg-accent/25" />
            <div className="glow-blob bottom-[-20%] right-[-10%] h-48 w-48 bg-money/20" />

            <div className="relative flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-grad font-display text-2xl font-extrabold text-white shadow-glow">
                FC
              </span>
              <div>
                <div className="font-display text-lg font-extrabold text-ink">
                  Эксперт {site.brand}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-money" />
                  на связи · {site.telegram.handle}
                </div>
              </div>
            </div>

            <ol className="relative mt-8 space-y-5 border-l border-line pl-6">
              {timeline.map((t) => (
                <li key={t.year} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-accent bg-surface" />
                  <div className="font-display text-sm font-extrabold text-accent-ink">{t.year}</div>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <SectionHeading
              eyebrow="О проекте"
              title={
                <>
                  Опыт в Steam{" "}
                  <span className="bg-accent-grad bg-clip-text text-transparent">с 2014 года</span>
                </>
              }
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Я в Steam-направлении с {site.expSince} года — ещё со времён операции Bravo.
                Проходил операции, разбирался в дропах, предметах, механике заработка и работе
                аккаунтов.
              </p>
              <p>
                За эти годы накопил опыт, который теперь использую, чтобы помогать людям запускать
                CS2 / Steam фермы — без лишней воды и непонятных обещаний, под понятный бюджет.
              </p>
              <p>
                Моя задача — сделать вход в нишу прозрачным: честно посчитать старт и окупаемость,
                подобрать объём аккаунтов и довести вас до запуска.
              </p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Написать {site.telegram.handle}
              </a>
              <a href="#calculator" className="btn-ghost">
                Сначала рассчитать
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
