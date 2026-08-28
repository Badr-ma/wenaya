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
          {/* Resources (40%) */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                className="rf-cell group flex items-start gap-4 rounded-2xl border border-[#0B1220]/[0.08] bg-white p-4 sm:p-5 transition-colors duration-300"
              >
                <div className="w-10 h-11 rounded-lg bg-[#0B1220]/[0.03] border border-[#0B1220]/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0B1220] text-sm font-semibold leading-snug group-hover:text-[#B88A5A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#2B2F36]/45 text-xs leading-relaxed mt-1.5">{item.desc}</p>
                  <div className="inline-flex items-center gap-1.5 text-[#B88A5A] text-[11px] font-semibold tracking-[0.12em] uppercase mt-3">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    PDF
                  </div>
                </div>
              </motion.a>
            ))}
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
