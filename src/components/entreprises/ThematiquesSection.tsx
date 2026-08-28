/**
 * Thématiques — interactive explorer: 01–05 selectors + one active stage.
 * All five themes stay in the DOM for SEO/LLM discoverability; inactive stages
 * are visually hidden but remain accessible/semantically present. No cards.
 * Swipe is a supplemental control on touch; arrow keys work when focus is inside.
 */
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const themeImages = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=100",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=100",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=100",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=100",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=100",
];

export default function ThematiquesSection() {
  const { t, tRaw } = useLocale();
  const themes = tRaw<Array<{ title: string; desc: string }>>("entreprises.thematiques.themes");
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".th-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".th-selector", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const slideTo = useCallback((i: number) => setActive((i + themes.length) % themes.length), [themes.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); slideTo(active - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); slideTo(active + 1); }
  };

  const onTablistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + themes.length) % themes.length;
    setActive(next);
    document.getElementById(`theme-tab-${next}`)?.focus();
  };

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-16 sm:py-24 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="th-head flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <span className="w-8 h-px bg-[#B88A5A]/40" />
              {t("entreprises.thematiques.title")}
            </span>
            <h2 className="heading-serif text-[#0B1220] mt-5 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              {t("entreprises.thematiques.subtitle")}
            </h2>
          </div>
        </div>

        {/* selector tabs 01–05 */}
        <div
          role="tablist"
          aria-label={t("entreprises.thematiques.selectLabel")}
          className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#0B1220]/10 mb-10 sm:mb-12"
          onKeyDown={onTablistKeyDown}
        >
          {themes.map((th, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                id={`theme-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`theme-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                className={`th-selector group inline-flex items-end gap-2.5 px-4 sm:px-6 pt-4 pb-4 border-b-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE9] ${
                  isActive
                    ? "border-[#B88A5A] text-[#0B1220]"
                    : "border-transparent text-[#0B1220]/35 hover:text-[#0B1220]/70"
                }`}
              >
                <span className="font-heading font-bold text-sm sm:text-base leading-none tabular-nums select-none" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm sm:text-base font-semibold leading-none tracking-wide">
                  {th.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* stage — all themes in DOM, inactive visually hidden but accessible */}
        <div
          className="relative"
          onKeyDown={onKeyDown}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) slideTo(dx < 0 ? active + 1 : active - 1);
          }}
        >
          {themes.map((th, i) => {
            const isActive = i === active;
            return (
              <div
                key={i}
                id={`theme-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`theme-tab-${i}`}
                aria-hidden={!isActive}
                className={`transition-opacity duration-500 motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "sr-only absolute inset-0"
                }`}
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                      <Image
                        src={themeImages[i % themeImages.length]}
                        alt={th.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        loading={isActive ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-[#0B1220]/5" aria-hidden />
                      <span aria-hidden className="absolute -bottom-8 right-6 font-heading font-bold leading-none select-none" style={{ fontSize: "clamp(4.1rem, 8.2vw, 6.55rem)", color: "transparent", WebkitTextStroke: "1.5px rgba(11,18,32,0.12)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="w-12 h-px bg-[#B88A5A]/40 mb-6" aria-hidden />
                    <h3 className="heading-serif text-[#0B1220] font-semibold leading-[1.1]" style={{ fontSize: "clamp(1.6rem, 2.85vw, 2.5rem)" }}>
                      {th.title}
                    </h3>
                    <p className="text-[#2B2F36]/55 text-base sm:text-lg leading-relaxed mt-4 max-w-xl">
                      {th.desc}
                    </p>
                    <div className="mt-6 h-px w-12 bg-[#B88A5A]/40" aria-hidden />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
