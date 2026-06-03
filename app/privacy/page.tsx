import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | FARMCORE",
  description:
    "Политика обработки персональных данных сайта FARMCORE: какие данные собираются и как используются.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/privacy" },
};

const updated = "3 июня 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="container-x flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg font-extrabold text-ink">{site.brand}</span>
          </Link>
          <Link href="/" className="btn-ghost">
            На главную
          </Link>
        </div>
      </header>

      <article className="container-x max-w-3xl py-14">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Политика конфиденциальности
        </h1>
        <p className="mt-3 text-sm text-muted">Последнее обновление: {updated}</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-ink-soft">
          <Block n="1" title="Общие положения">
            Настоящая Политика описывает порядок обработки персональных данных пользователей сайта
            {" "}{site.brand} (далее — «Сайт»). Оставляя заявку, вы подтверждаете согласие с условиями
            настоящей Политики в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
          </Block>

          <Block n="2" title="Какие данные мы собираем">
            Мы обрабатываем только те данные, которые вы добровольно указываете в форме заявки:
            контакт для связи (имя пользователя Telegram или номер телефона) и, по желанию,
            ориентировочное количество аккаунтов. Сайт не собирает паспортные данные, платёжную
            информацию и не запрашивает доступ к вашим аккаунтам.
          </Block>

          <Block n="3" title="Цели обработки">
            Данные используются исключительно для связи с вами по вашей заявке: чтобы рассчитать
            стартовый бюджет и окупаемость, подобрать объём аккаунтов и ответить на вопросы. Мы не
            используем данные для массовых рассылок без вашего согласия.
          </Block>

          <Block n="4" title="Передача третьим лицам">
            Мы не продаём и не передаём ваши данные третьим лицам, за исключением технических
            сервисов, необходимых для доставки заявки (например, мессенджер Telegram), и случаев,
            предусмотренных законодательством РФ.
          </Block>

          <Block n="5" title="Хранение и удаление">
            Данные хранятся столько, сколько необходимо для обработки заявки и связи с вами. Вы
            можете в любой момент отозвать согласие и попросить удалить ваши данные, написав нам в
            Telegram {site.telegram.handle}.
          </Block>

          <Block n="6" title="Cookies и аналитика">
            Сайт может использовать технические файлы cookies и сервисы веб-аналитики для оценки
            посещаемости в обезличенном виде. Эти данные не позволяют идентифицировать вас лично.
          </Block>

          <Block n="7" title="Контакты">
            По любым вопросам об обработке персональных данных пишите в Telegram:{" "}
            <a
              href={site.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:text-accent-ink"
            >
              {site.telegram.handle}
            </a>
            .
          </Block>
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-5 text-sm text-muted">
          Все расчёты на Сайте носят ориентировочный характер и не являются публичной офертой или
          гарантией дохода.
        </div>
      </article>
    </main>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-bold text-ink">
        {n}. {title}
      </h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
