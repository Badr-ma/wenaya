/**
 * Security — dashboard-style indexing of the security & confidentiality
 * commitments (yolo.securite.*). Five tiles (status dot + shield mark +
 * title + one-line description) under the security title; a supporting intro
 * line draws on the FAQ answer about data protection, closed by a bronze
 * "En savoir plus" link to #downloads. Restrained once-only GSAP entrance.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type SecurityItem = { title: string; desc: string };

function Shield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-[#159AA9]">
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SecuritySection() {
  const { t, tRaw } = useLocale();
  const items = tRaw<SecurityItem[]>("entreprises.yolo.securite.items");
  const faqIntro = tRaw<Array<{ q: string; a: string }>>("entreprises.faq.items")[0]?.a ?? "";
  const learnMore = t("entreprises.approach.featuredCallout.link");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sc-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".sc-row", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-9 sm:py-13 lg:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="sc-head mx-auto max-w-2xl text-center">
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.yolo.securite.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] sm:text-base text-[#2B2F36]/55 leading-relaxed">{faqIntro}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="sc-row flex items-start gap-4 rounded-[6px] bg-white border border-[#0B1220]/[0.08] px-5 py-5"
            >
              <span className="mt-1.5 size-2 rounded-full bg-[#159AA9]" aria-hidden />
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Shield />
                  <h3 className="heading-serif text-[#0B1220] text-lg font-semibold leading-snug">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#2B2F36]/55">{item.desc}</p>
              </div>
            </div>
          ))}

          {learnMore && (
            <a
              href="#downloads"
              className="sc-row group flex items-center justify-between gap-4 rounded-[6px] border border-[#B88A5A]/30 bg-[#B88A5A]/[0.06] px-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
            >
              <span className="text-sm font-semibold text-[#0B1220]">{learnMore}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-[#B88A5A] transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}