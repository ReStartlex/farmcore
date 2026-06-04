import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

/**
 * Проверяемая репутация продавца на FunPay — главный аргумент доверия.
 * Никаких выдуманных скринов: только реальные цифры и живая ссылка на профиль.
 */
export function FunPayProof() {
  const { funpay } = site;
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="glow-blob right-[-10%] top-[-40%] h-56 w-56 bg-money/15" />

        <div className="relative grid items-center gap-7 md:grid-cols-[auto_1fr_auto] md:gap-8">
          {/* Рейтинг + звёзды */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="font-display text-5xl font-extrabold leading-none text-ink">
                {funpay.rating}
              </div>
              <Stars />
            </div>
            <div className="h-14 w-px bg-line md:h-16" />
            <div>
              <div className="font-display text-2xl font-extrabold text-money-ink sm:text-3xl">
                {funpay.reviews}
              </div>
              <div className="text-sm text-muted">отзывов</div>
            </div>
          </div>

          {/* Текст */}
          <div className="md:px-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-money-soft px-3 py-1 text-xs font-semibold text-money-ink">
              <Verified />
              Проверенный продавец
            </div>
            <h3 className="mt-3 font-display text-lg font-extrabold text-ink sm:text-xl">
              Репутация, которую видно — а не обещания
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              На FunPay с {funpay.sinceYear} года ({funpay.years} лет) и {funpay.reviews} отзывов с
              рейтингом {funpay.rating}. Профиль открыт — можете проверить каждую сделку сами, до
              обращения ко мне.
            </p>
          </div>

          {/* Кнопка */}
          <div className="md:justify-self-end">
            <a
              href={funpay.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center md:w-auto"
            >
              Проверить профиль на FunPay
              <ArrowUpRight />
            </a>
            <p className="mt-2 text-center text-[11px] text-muted md:text-right">
              откроется FunPay в новой вкладке
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Stars() {
  return (
    <div className="mt-1 flex justify-center gap-0.5 text-money" aria-label="Рейтинг 5 из 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.55l-5.91 3.11 1.13-6.57L2.45 9.44l6.6-.96L12 2.5Z" />
        </svg>
      ))}
    </div>
  );
}

function Verified() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="ml-1.5">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}
