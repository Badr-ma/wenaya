/**
 * Courses & Workshops section — displays upcoming wellness courses and workshops.
 * Features: horizontal scroll carousel, image cards with GSAP animations,
 * and category/filter tabs (all, yoga, nutrition, mindfulness, etc.).
 */
"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import type { CoursAteliersContent } from "@/lib/homepage-types";
import HiggsField from "./HiggsField";


const sessionsData = [
  { key: "yoga", img: "/images/cours-ateliers/yoga.jpg", accent: "#B88A5A" },
  { key: "sophrologie", img: "/images/cours-ateliers/nature.jpg", accent: "#C99B68" },
  { key: "nutrition", img: "/images/cours-ateliers/nutrition.jpg", accent: "#D4A870" },
  { key: "breathwork", img: "/images/cours-ateliers/wellness.jpg", accent: "#B88A5A" },
  { key: "jjb", img: "/images/wellness-stretch.jpg", accent: "#C99B68" },
  { key: "pilates", img: "/images/cours-ateliers/yoga.jpg", accent: "#D4A870" },
] as const;

interface CoursAteliersProps {
  content?: CoursAteliersContent;
}

export default function CoursAteliers({ content }: CoursAteliersProps): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const tickingRef = useRef(false);

  const scrollMore = () => {
    if (!scrollRef.current) return;
    const amt = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: amt, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current || tickingRef.current) return;
    tickingRef.current = true;
    requestAnimationFrame(() => {
      tickingRef.current = false;
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 1);
    });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ca-head",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".ca-card", { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0B1220] py-16 sm:py-20 px-6">
      <HiggsField parentRef={sectionRef as React.RefObject<HTMLElement | null>} />

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#B88A5A]/3 to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/10 to-transparent z-[2]" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="ca-head text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A]/50 text-[10px] font-semibold tracking-[0.24em] uppercase">{content?.badge ?? t("coursAteliers.badge")}</span>
          </span>
          <h2 className="heading-serif text-white text-[clamp(1.6rem,3.5vw,3rem)]">{content?.heading1 ?? t("coursAteliers.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {content?.heading2 ?? t("coursAteliers.heading2")}
</span></h2>
        </div>

        {/* Horizontal scroll — exactly 4 cards visible */}
        <div className="relative max-w-6xl mx-auto">
          <div className="w-full overflow-hidden rounded-2xl">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {sessionsData.map((s, i) => {
                const title = t(`coursAteliers.${s.key}.title`);
                const desc = t(`coursAteliers.${s.key}.desc`);

                return (
                  <div key={s.key} className="ca-card group w-[80vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)] shrink-0 snap-start rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_-4px_rgba(184,138,90,0.15)]"
                    style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Image area */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <Image
                        src={s.img}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                        sizes="80vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-[#0B1220]/10 to-transparent" />

                      {/* Number badge */}
                      <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                        style={{ background: `${s.accent}18`, border: `1px solid ${s.accent}25`, boxShadow: `0 0 20px ${s.accent}10` }}
                      >
                        <span className="font-heading font-bold text-[10px] sm:text-xs tabular-nums transition-colors duration-500 group-hover:text-white" style={{ color: s.accent }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="absolute bottom-3 left-4 right-4 font-heading font-semibold text-sm sm:text-base leading-tight transition-colors duration-500 group-hover:text-[#B88A5A]" style={{ color: "rgba(255,255,255,0.95)" }}>
                        {title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="flex-1 flex flex-col justify-center px-5 py-4 sm:py-5">
                      <div className="flex items-start gap-3">
                        <div className="w-px h-10 self-stretch shrink-0 rounded-full mt-0.5 transition-opacity duration-500 group-hover:opacity-70"
                          style={{ background: `linear-gradient(to bottom, ${s.accent}, transparent)`, opacity: 0.4 }}
                        />
                        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{desc}</p>
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div className="mx-5 mb-4 h-[2px] rounded-full transition-opacity duration-500 group-hover:opacity-80"
                      style={{ background: `linear-gradient(90deg, transparent, ${s.accent}30, ${s.accent}50, ${s.accent}30, transparent)`, opacity: 0.5 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swipe button */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-20 pointer-events-none flex items-center justify-end">
            <div className="w-full h-full bg-gradient-to-l from-[#0B1220] via-[#0B1220]/70 to-transparent rounded-r-2xl flex items-center justify-center pr-2 pointer-events-auto cursor-pointer group/overlay"
              onClick={scrollMore}
            >
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover/overlay:scale-110 group-hover/overlay:bg-[#B88A5A]/15"
                  style={{ border: "1px solid rgba(184,138,90,0.25)", background: "rgba(184,138,90,0.06)" }}
                >
                  <svg className="w-4 h-4 text-[#B88A5A] transition-transform duration-500 group-hover/overlay:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <span className="text-[#B88A5A]/40 text-[9px] font-semibold tracking-[0.15em] uppercase whitespace-nowrap">
                  {content?.swipe ?? t("coursAteliers.swipe")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="ca-head flex items-center justify-center gap-2 mt-8">
          {sessionsData.slice(0, -2).map((_, i) => {
            const segStart = i / (sessionsData.length - 2);
            const segEnd = (i + 1) / (sessionsData.length - 2);
            const active = scrollProgress >= segStart && scrollProgress < segEnd;
            return (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: active ? "24px" : "6px",
                  height: "6px",
                  background: active ? "#B88A5A" : "rgba(255,255,255,0.08)",
                  boxShadow: active ? "0 0 8px rgba(184,138,90,0.35)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Bottom link */}
        <div className="ca-head text-center mt-8">
          <a
            href="/pratiques"
            className="inline-flex items-center gap-3 text-[#B88A5A] text-sm font-semibold transition-all duration-500 group rounded-xl border border-[#B88A5A]/20 px-5 py-2.5 hover:bg-[#B88A5A]/5 hover:border-[#B88A5A]/30 hover:gap-4"
          >
            <span className="w-6 h-px bg-[#B88A5A]/40 transition-all duration-500 group-hover:w-8" />
            {content?.cta ?? t("coursAteliers.cta")}
            <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
