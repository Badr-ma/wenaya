/**
 * Corporate FAQ Section — single-open accordion. Widened content, tightened
 * rhythm, accessible region pairing, reduced-motion safe (content toggles
 * without height animation).
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function FaqItem({ q, a, isOpen, onClick, id }: { q: string; a: string; isOpen: boolean; onClick: () => void; id: string }) {
  const panelId = `faq-${id}-panel`;
  return (
    <div className="border-b border-[#0B1220]/[0.08] last:border-b-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full flex items-center justify-between py-5 sm:py-6 text-left gap-4"
      >
        <span className={`text-[#0B1220] text-base sm:text-lg font-medium flex-1 transition-colors duration-200 ${isOpen ? "text-[#B88A5A]" : "group-hover:text-[#B88A5A]"}`}>
          {q}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      {reducedMotion ? (
        isOpen && (
          <div id={panelId} role="region">
            <p className="text-[#2B2F36]/55 text-sm leading-relaxed pb-6 max-w-2xl">{a}</p>
          </div>
        )
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              id={panelId}
              role="region"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-[#2B2F36]/55 text-sm leading-relaxed pb-6 max-w-2xl">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function FaqSection() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Array<{ q: string; a: string }>>("entreprises.faq.items");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".fq-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-20 sm:py-28 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="fq-head flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.faq.title")}
          </span>
          <span className="text-[#0B1220]/25 text-xs font-semibold tracking-[0.14em] uppercase hidden sm:inline">
            {String(items.length).padStart(2, "0")}
          </span>
        </div>

        <div>
          {items.map((item, i) => (
            <FaqItem
              key={i}
              id={String(i)}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
