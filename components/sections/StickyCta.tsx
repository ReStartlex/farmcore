"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Мобильная sticky-кнопка Telegram. Появляется после скролла. */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-4 transition-all duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="container-x flex gap-2">
        <a href="#calculator" className="btn-ghost flex-1 bg-surface/95 backdrop-blur">
          Рассчитать
        </a>
        <a
          href={site.telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1"
        >
          Написать в Telegram
        </a>
      </div>
    </div>
  );
}
