/**
 * Downloads Section — provides downloadable resources (PDFs, brochures) for corporate prospects.
 * Features: Framer Motion card animations, download icons, and file size indicators.
 */
"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

export default function DownloadsSection() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Array<{ title: string; desc: string; link: string }>>("entreprises.downloads.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".dl-cell", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="downloads" ref={sectionRef} className="relative bg-[#F2EFE9] py-16 sm:py-28 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              {t("entreprises.downloads.title")}
            </span>
          </div>
          <h2
            className="heading-serif text-[#0B1220]"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.015em" }}
          >
            {t("entreprises.downloads.subtitle")}
          </h2>
        </div>

        <div className="divide-y divide-[#0B1220]/[0.07]">
          {items.map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" } }}
              className="dl-cell group flex items-center gap-5 py-5 sm:py-6 transition-all duration-300"
            >
              <div className="w-12 h-14 rounded-lg bg-white border border-[#0B1220]/[0.06] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#0B1220] text-sm sm:text-base font-semibold group-hover:text-[#B88A5A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#2B2F36]/40 text-xs sm:text-sm leading-relaxed mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[#B88A5A] text-xs font-semibold tracking-[0.12em] uppercase shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>PDF</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
