"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { HeroStage } from "@/components/sections/HeroStage";

const facts = ["От 10 аккаунтов", "Цена от 1500 ₽/акк", "Расчёт до заявки"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* Декоративный фон */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div className="glow-blob left-[-10%] top-[-10%] h-[460px] w-[460px] bg-accent/30" />
        <div className="glow-blob right-[-8%] top-[6%] h-[380px] w-[380px] bg-money/20" />
      </div>

      <div className="container-x grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div>
          <motion.span
            className="reveal-anim eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-money" />
            {site.brand} · {site.tagline}
          </motion.span>

          <motion.h1
            className="reveal-anim mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            CS2-ферма под ключ —{" "}
            <span className="bg-accent-grad bg-clip-text text-transparent">
              расчёт, аккаунты и запуск
            </span>{" "}
            под ваш бюджет
          </motion.h1>

          <motion.p
            className="reveal-anim mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Посчитайте стартовый бюджет и ориентировочную окупаемость за минуту. Подберу объём
            аккаунтов под ваш бюджет, объясню механику дропа и помогу запустить ферму — на опыте
            в Steam с {site.expSince} года.
          </motion.p>

          <motion.div
            className="reveal-anim mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <a href="#calculator" className="btn-primary text-base">
              Рассчитать ферму
            </a>
            <a
              href={site.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-base"
            >
              Написать в Telegram
            </a>
          </motion.div>

          <motion.ul
            className="reveal-anim mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.26 }}
          >
            {facts.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <CheckIcon />
                {f}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroStage />
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill="#E6F7F3" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        stroke="#0B8472"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
