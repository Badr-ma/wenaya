/**
 * Resources & FAQ — single combined chapter. Desktop: 40/60 split (downloadable
 * resources left, FAQ accordion right). Mobile: stacked. Preserves id="downloads"
 * for the Hero CTA2 anchor. No dead vertical space between the two blocks.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function FaqItem({ q, a, isOpen, onClick, id }: { q: string; a: string; isOpen: boolean; onClick: () => void; id: string }) {
  const panelId = `faq-${id}-panel`;
  return (
    <div className="border-b border-[#0B1220]/[0.08]">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full flex items-center justify-between py-4 sm:py-5 text-left gap-4"
      >
        <span className={`text-[#0B1220] text-sm sm:text-base font-medium flex-1 transition-colors duration-200 ${isOpen ? "text-[#B88A5A]" : "group-hover:text-[#B88A5A]"}`}>
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
            <p className="text-[#2B2F36]/55 text-sm leading-relaxed pb-5">{a}</p>
          </div>
        )
      ) : (
        <div className="overflow-hidden">
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
              <p className="text-[#2B2F36]/55 text-sm leading-relaxed pb-5">{a}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourcesFaqSection() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Array<{ title: string; desc: string; link: string }>>("entreprises.downloads.items");
  const faqs = tRaw<Array<{ q: string; a: string }>>("entreprises.faq.items");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rf-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".rf-cell", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="downloads" ref={sectionRef} className="relative bg-[#F2EFE9] py-16 sm:py-24 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="rf-head flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#B88A5A]/40" />
              {t("entreprises.downloads.title")}
            </span>
            <h2
              className="heading-serif text-[#0B1220]"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.3rem)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              {t("entreprises.downloads.subtitle")}
            </h2>
          </div>
          <span className="sm:mb-1 text-[#0B1220]/30 text-xs font-semibold tracking-[0.14em] uppercase shrink-0">
            PDF
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Resources (40%) — typography-first rows */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-[#0B1220]/[0.08]">
              {items.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="rf-cell group flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#0B1220] heading-serif text-lg font-semibold leading-snug group-hover:text-[#B88A5A] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[#B88A5A] text-[10px] font-bold tracking-[0.14em] uppercase shrink-0 mt-1">
                        PDF
                      </span>
                    </div>
                    <p className="text-[#2B2F36]/45 text-xs leading-relaxed mt-1.5">{item.desc}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-[#B88A5A] shrink-0 mt-1 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ (60%) */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-baseline justify-between">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-8 h-px bg-[#B88A5A]/40" />
                {t("entreprises.faq.title")}
              </span>
              <span className="text-[#0B1220]/25 text-xs font-semibold tracking-[0.14em] uppercase">
                {String(faqs.length).padStart(2, "0")}
              </span>
            </div>
            <div className="border-t border-[#0B1220]/[0.08]">
              {faqs.map((item, i) => (
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
        </div>
      </div>
    </section>
  );
}
