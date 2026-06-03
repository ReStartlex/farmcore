import { site } from "@/data/site";
import { landings } from "@/data/landings";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-lg font-extrabold text-ink">{site.brand}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Фермы CS2 / Steam под ключ: расчёт, аккаунты и запуск под ваш бюджет. Опыт в Steam
              с {site.expSince} года.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Разделы</h3>
            <ul className="mt-4 space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-ink-soft hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Популярные запросы
            </h3>
            <ul className="mt-4 space-y-2.5">
              {landings.map((l) => (
                <li key={l.slug}>
                  <a href={`/${l.slug}`} className="text-sm text-ink-soft hover:text-accent">
                    {l.eyebrow}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">Связь</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={site.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-accent hover:text-accent-ink"
                >
                  Telegram {site.telegram.handle}
                </a>
              </li>
              <li>
                <a href="#calculator" className="text-sm text-ink-soft hover:text-accent">
                  Рассчитать ферму
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-ink-soft hover:text-accent">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-muted">
            © {year} {site.brand}. Все расчёты на сайте — ориентировочные и не являются гарантией
            дохода. Доход от дропа CS2 зависит от выпавших предметов, рынка и количества аккаунтов
            и может отличаться от расчётных значений.
          </p>
        </div>
      </div>
    </footer>
  );
}
