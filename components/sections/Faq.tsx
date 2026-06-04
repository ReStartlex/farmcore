"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faq as defaultFaq, type FaqItem } from "@/data/faq";
import { faqJsonLd } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Faq({ items = defaultFaq, title }: { items?: FaqItem[]; title?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-28">
      {/* FAQPage-разметка скоупится сюда: появляется только там, где FAQ виден. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
      <div className="container-x">
        <Reveal>
          <SectionHeading
            center
            eyebrow="FAQ"
            title={
              title ?? (
                <>
                  Частые вопросы{" "}
                  <span className="bg-accent-grad bg-clip-text text-transparent">о ферме CS2</span>
                </>
              )
            }
            subtitle="Коротко и по делу — закрываем главные вопросы перед покупкой."
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={Math.min(i, 6) * 0.03}>
                <div className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-ink">{item.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-accent-soft" : ""
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-12 text-sm leading-relaxed text-muted">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
