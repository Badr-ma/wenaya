"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import HiggsField from "./HiggsField";

gsap.registerPlugin(ScrollTrigger);

const sessionsData = [
  { key: "yoga", img: "/images/cours-ateliers/yoga.jpg", accent: "#B88A5A" },
  { key: "sophrologie", img: "/images/cours-ateliers/nature.jpg", accent: "#C99B68" },
  { key: "nutrition", img: "/images/cours-ateliers/nutrition.jpg", accent: "#D4A870" },
  { key: "breathwork", img: "/images/cours-ateliers/wellness.jpg", accent: "#B88A5A" },
  { key: "jjb", img: "/images/wellness-stretch.jpg", accent: "#C99B68" },
  { key: "pilates", img: "/images/cours-ateliers/yoga.jpg", accent: "#D4A870" },
] as const;

export default function CoursAteliers(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollMore = () => {
    if (!scrollRef.current) return;
    const amt = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({ left: amt, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 1);
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
            <span className="text-[#B88A5A]/50 text-[10px] font-semibold tracking-[0.24em] uppercase">{t("coursAteliers.badge")}</span>
          </span>
          <h2 className="heading-serif text-white text-[clamp(1.6rem,3.5vw,3rem)]">{t("coursAteliers.heading")}</h2>
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
                  <div key={s.key} className="ca-card group w-[calc(25%-12px)] shrink-0 snap-start rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-[#B88A5A]/5"
                    style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Image area */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <Image
                        src={s.img}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-[1.08]"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-[#0B1220]/10 to-transparent" />

                      {/* Number badge */}
                      <div className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-lg flex items-center justify-center"
                        style={{ background: `${s.accent}18`, border: `1px solid ${s.accent}25`, boxShadow: `0 0 20px ${s.accent}10` }}
                      >
                        <span className="font-heading font-bold text-[10px] sm:text-xs tabular-nums" style={{ color: s.accent }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="absolute bottom-3 left-4 right-4 text-white font-heading font-semibold text-sm sm:text-base leading-tight">
                        {title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="flex-1 flex flex-col justify-center px-4 py-3 sm:py-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-px h-8 self-stretch shrink-0 rounded-full opacity-40 mt-0.5"
                          style={{ background: `linear-gradient(to bottom, ${s.accent}, transparent)` }}
                        />
                        <p className="text-white/35 text-xs leading-relaxed line-clamp-2">{desc}</p>
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div className="mx-4 mb-3 h-[2px] rounded-full opacity-50"
                      style={{ background: `linear-gradient(90deg, transparent, ${s.accent}30, ${s.accent}50, ${s.accent}30, transparent)` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swipe button */}
          <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-32 z-20 pointer-events-none flex items-center justify-end">
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
                  {t("coursAteliers.swipe")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="ca-head flex items-center justify-center gap-1.5 mt-6">
          {sessionsData.slice(0, -2).map((_, i) => {
            const segStart = i / (sessionsData.length - 2);
            const segEnd = (i + 1) / (sessionsData.length - 2);
            const active = scrollProgress >= segStart && scrollProgress < segEnd;
            return (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: active ? "20px" : "6px",
                  background: active ? "rgba(184,138,90,0.5)" : "rgba(255,255,255,0.08)",
                }}
              />
            );
          })}
        </div>

        {/* Bottom link */}
        <div className="ca-head text-center mt-6">
          <a
            href="/seance-de-groupe"
            className="inline-flex items-center gap-2 text-[#B88A5A] text-xs font-semibold transition-all duration-300 hover:gap-3 group"
          >
            <span className="w-5 h-px bg-[#B88A5A]/30 transition-all duration-300 group-hover:w-7" />
            {t("coursAteliers.cta")}
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
