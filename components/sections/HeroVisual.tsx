"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { calcFarm, formatMonths, formatNumber, formatRub } from "@/lib/calc";

const demo = calcFarm(50);

/**
 * Премиальная «парящая» композиция: стеклянная карточка результата + чипы дропа,
 * с лёгким parallax при движении мыши. Реализовано на CSS/SVG + framer-motion
 * (без тяжёлого 3D), чтобы не вредить скорости и SEO.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 });

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto w-full max-w-md select-none"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
        {/* Главная стеклянная карточка */}
        <div className="card relative overflow-hidden p-6 shadow-card">
          <div className="glow-blob right-[-20%] top-[-30%] h-48 w-48 bg-accent/30" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              Ваш сценарий
            </span>
            <span className="rounded-full bg-money-soft px-2.5 py-1 text-xs font-semibold text-money-ink">
              {demo.accountsCount} аккаунтов
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniStat label="Нужно на старт" value={formatRub(demo.startBudget)} />
            <MiniStat
              label="Дроп / мес"
              value={`${formatNumber(demo.monthlyIncomeMin)}–${formatRub(demo.monthlyIncomeMax)}`}
              tone="money"
            />
            <MiniStat label="Средний / мес" value={formatRub(demo.monthlyIncomeBase)} tone="money" />
            <MiniStat label="Окупаемость" value={`≈ ${formatMonths(demo.paybackMonthsBase)}`} />
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-[64%] rounded-full bg-accent-grad" />
          </div>
          <p className="mt-2 text-xs text-muted">
            Цена за аккаунт — {formatRub(demo.accountPrice)} · доход растёт с объёмом
          </p>
        </div>

        {/* Парящие чипы */}
        <FloatingChip
          className="-left-6 top-10 animate-float"
          style={{ transform: "translateZ(60px)" }}
          title="Дроп"
          sub="новый кейс"
          tone="accent"
        />
        <FloatingChip
          className="-right-4 bottom-16 animate-float-slow"
          style={{ transform: "translateZ(80px)" }}
          title="+1 попытка"
          sub="каждую неделю"
          tone="money"
        />
        <FloatingChip
          className="-bottom-6 left-10 animate-float"
          style={{ transform: "translateZ(40px)" }}
          title="С 2014"
          sub="опыт в Steam"
          tone="ink"
        />
      </motion.div>
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "money";
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg/60 p-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</div>
      <div
        className={`stat-num mt-1 text-sm font-bold ${tone === "money" ? "text-money-ink" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function FloatingChip({
  className,
  style,
  title,
  sub,
  tone,
}: {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  sub: string;
  tone: "accent" | "money" | "ink";
}) {
  const dot =
    tone === "accent" ? "bg-accent" : tone === "money" ? "bg-money" : "bg-ink";
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-card backdrop-blur ${className ?? ""}`}
      style={style}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span className="leading-tight">
        <span className="block text-sm font-bold text-ink">{title}</span>
        <span className="block text-[11px] text-muted">{sub}</span>
      </span>
    </div>
  );
}
