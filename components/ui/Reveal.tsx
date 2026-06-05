"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Появление по скроллу. Намеренно НЕ используем IntersectionObserver
 * (в т.ч. через framer-motion whileInView): в некоторых мобильных браузерах,
 * например Яндекс.Браузере, обсервер не срабатывает и контент навсегда
 * застывает на opacity:0. Здесь — проверка позиции по событию scroll
 * (работает во всех браузерах) + гарантированный показ через таймаут.
 * Класс reveal-anim оставлен для no-JS fallback (см. <noscript> в layout).
 */
export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    let done = false;
    let fallback = 0;
    let ticking = false;

    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallback);
    };

    const check = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Элемент вошёл в зону видимости (с запасом 80px снизу).
      if (rect.top < vh - 80 && rect.bottom > 0) reveal();
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        check();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Страховка: показать в любом случае, даже если события не пришли.
    fallback = window.setTimeout(reveal, 2500);
    // Сразу проверяем — вдруг блок уже в зоне видимости при загрузке.
    check();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallback);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={cn("reveal-anim", className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.6s ${delay}s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s ${delay}s cubic-bezier(0.22, 1, 0.36, 1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
