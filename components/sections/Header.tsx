"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/80 bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-20">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              {site.brand}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              {site.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-accent-soft hover:text-accent-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#calculator" className="btn-ghost hidden lg:inline-flex">
            Рассчитать
          </a>
          <a
            href={site.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden lg:inline-flex"
          >
            Написать в Telegram
          </a>
          <button
            type="button"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-4 bg-ink transition-transform",
                  open && "translate-y-[5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-4 bg-ink transition-transform",
                  open && "-translate-y-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink-soft hover:bg-accent-soft"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 px-1 pt-1">
              <a
                href="#calculator"
                onClick={() => setOpen(false)}
                className="btn-ghost w-full"
              >
                Рассчитать
              </a>
              <a
                href={site.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Telegram
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
