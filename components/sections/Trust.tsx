import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const pillars = [
  {
    title: "Опыт с 2014 года",
    text: "Не первый день в Steam: операции, дропы, предметы и работа аккаунтов — на практике, а не по статьям.",
  },
  {
    title: "Прозрачный расчёт до оплаты",
    text: "Сначала считаем старт и окупаемость, потом вы решаете. Никаких «узнаете цену в личке».",
  },
  {
    title: "Вы владеете аккаунтами",
    text: "После покупки аккаунты ваши. Я не прошу доступ к вашим данным и не беру оплату «за воздух».",
  },
  {
    title: "Базовая помощь входит в покупку",
    text: "Подбор объёма, рекомендации по запуску и сопровождение — часть сделки, а не платные опции.",
  },
  {
    title: "Связь напрямую",
    text: "Общаемся лично в Telegram, без менеджеров и колл-центров. Отвечаю на вопросы по делу.",
  },
  {
    title: "Честные формулировки",
    text: "Не обещаю «гарантированный доход». Объясняю риски и средний сценарий, чтобы вы решали трезво.",
  },
];

const doubts = [
  {
    q: "«Это какой-то обман?»",
    a: "Нет. Ферма — это легальная механика: аккаунты получают дроп, который продаётся на площадке Steam. Я продаю аккаунты и помогаю с запуском, а расчёт показываю до оплаты.",
  },
  {
    q: "«Я ничего не понимаю в CS2»",
    a: "Это нормально. Объясню механику простым языком и проведу по шагам — от выбора объёма до запуска.",
  },
  {
    q: "«А если не окупится так быстро?»",
    a: "Все цифры — ориентир, а не гарантия. Я честно показываю и быстрый, и медленный край окупаемости, чтобы не было завышенных ожиданий.",
  },
];

export function Trust() {
  return (
    <Section id="trust" className="bg-surface">
      <Reveal>
        <SectionHeading
          center
          eyebrow="Доверие"
          title={
            <>
              Почему мне{" "}
              <span className="bg-accent-grad bg-clip-text text-transparent">можно доверять</span>
            </>
          }
          subtitle="Без громких обещаний. Просто опыт, прозрачность и прямая связь — то, на чём строится нормальная сделка."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.07}>
            <div className="card flex h-full gap-4 p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-money-soft text-money-ink">
                <Shield />
              </span>
              <div>
                <h3 className="text-base font-bold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Развеиваем сомнения */}
      <Reveal delay={0.1}>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {doubts.map((d) => (
            <div key={d.q} className="rounded-3xl border border-line bg-bg/60 p-6">
              <h3 className="text-base font-bold text-accent-ink">{d.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d.a}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Отзывы и кейсы — в Telegram (честно, без выдуманных скринов) */}
      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-accent-grad px-6 py-8 text-center text-white shadow-glow sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-lg font-extrabold">Хотите увидеть отзывы и примеры запусков?</h3>
            <p className="mt-1 max-w-xl text-sm text-white/80">
              Покажу реальные кейсы и отвечу на вопросы лично — без скриншотов-фейков на сайте.
            </p>
          </div>
          <a
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-light shrink-0"
          >
            Смотреть в Telegram
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

function Shield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
