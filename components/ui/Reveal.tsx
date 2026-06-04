"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduce = useReducedMotion();

  // Пользователям с prefers-reduced-motion — без анимации, сразу видимый контент.
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  // Класс reveal-anim нужен для no-JS fallback (см. <noscript> в layout):
  // без JS контент остаётся видимым, а не «застывает» на opacity:0.
  return (
    <motion.div
      className={cn("reveal-anim", className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
