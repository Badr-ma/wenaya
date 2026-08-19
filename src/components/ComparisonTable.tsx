/**
 * Comparison Table — side-by-side comparison of Wenaya vs traditional healthcare.
 * Highlights Wenaya's advantages in a visual table format with checkmarks and X marks.
 * Features: GSAP scroll-triggered fade-in animation.
 */
"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import type { ComparisonTableContent } from "@/lib/homepage-types";

const cardKeys = [
  { key: "clinics", featured: true, href: "/about", icon: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <rect x="10" y="14" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="1" />
      <path d="M22 24v8M18 28h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 14V10a2 2 0 012-2h12a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )},
  { key: "corporate", featured: false, href: "/solutions/entreprises", icon: (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <rect x="8" y="22" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1" />
      <rect x="16" y="10" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M20 30h8M20 34h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )},
];

interface ComparisonTableProps {
  content?: ComparisonTableContent;
}

export default function ComparisonTable({ content }: ComparisonTableProps): React.JSX.Element {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const entries = cardKeys.map((c) => ({
    title: t(`comparisonTable.${c.key}.title`),
    desc: t(`comparisonTable.${c.key}.desc`),
    cta: t(`comparisonTable.${c.key}.cta`),
    stats: t(`comparisonTable.${c.key}.stats`),
    href: h(locale, c.href),
    icon: c.icon,
    featured: c.featured,
  }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-10 sm:py-20 px-6" id="ecosysteme">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-8 sm:mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            {content?.badge ?? t("comparisonTable.badge")}
          </span>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-4">
            {content?.heading1 ?? t("comparisonTable.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {content?.heading2 ?? t("comparisonTable.heading2")}
</span>
          </h2>
          <p className="text-[#2B2F36] text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            {content?.sub ?? t("comparisonTable.sub")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {entries.map((e, i) => (
            <div
              key={e.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`bg-[#E8E2D9] rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                e.featured
                  ? "border-[#B88A5A] shadow-lg shadow-[rgba(184,138,90,0.06)]"
                  : "border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 hover:shadow-lg"
              }`}
            >
              <div className={`mb-5 ${e.featured ? "text-[#B88A5A]" : "text-[#B88A5A]"}`}>
                {e.icon}
              </div>
              <h3 className="heading-serif text-xl text-[#0B1220] mb-2">
                {e.title}
              </h3>
              <p className="text-[#2B2F36] text-sm leading-relaxed flex-1">
                {e.desc}
              </p>
              <p className="text-[#B88A5A] text-xs mt-4 font-medium">
                {e.stats}
              </p>
              <Link
                href={e.href}
                className="mt-6 inline-flex items-center justify-center h-[44px] px-6 rounded-full text-sm font-medium transition-all duration-300 bg-[#0B1220] text-white hover:bg-[#2B2F36]"
              >
                {e.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
