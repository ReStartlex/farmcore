import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="glow-blob left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 bg-accent/25" />
      </div>

      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Logo className="h-9 w-9" />
        <span className="font-display text-xl font-extrabold text-ink">{site.brand}</span>
      </Link>

      <div className="font-display text-7xl font-extrabold leading-none">
        <span className="bg-accent-grad bg-clip-text text-transparent">404</span>
      </div>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-ink sm:text-3xl">
        Страница не найдена
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Возможно, ссылка устарела. Вернитесь на главную и рассчитайте свою CS2-ферму или напишите
        в Telegram.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          На главную
        </Link>
        <a
          href={site.telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Написать в Telegram
        </a>
      </div>
    </main>
  );
}
