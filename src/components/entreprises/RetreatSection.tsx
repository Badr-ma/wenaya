/**
 * Corporate Retreat — one interactive editorial slider stage built from Wenaya's
 * existing retreat chapters (Reset & Recharge, Team Health & Cohesion, Active
 * Wellness), followed by a compact "Build Your Retreat" progression and CTA that
 * scrolls to the contact section. All chapters remain in the DOM for SEO/LLM and
 * accessibility. No cards, no pinning, no autoplay.
 */
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

interface Chapter {
  number: string;
  title: string;
  theme: string;
  desc: string;
  capabilities: string[];
}

interface DesignStep {
  number: string;
  label: string;
  desc: string;
}

const chapterImages = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1800&q=100",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=100",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1800&q=100",
];

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function scrollToContact(e: React.MouseEvent<HTMLAnchorElement>) {
  if (reducedMotion) return;
  e.preventDefault();
  const el = document.querySelector("#contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function RetreatSection(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const chapters = tRaw<Chapter[]>("entreprises.retreat.chapters");
  const steps = tRaw<DesignStep[]>("entreprises.retreat.design.steps");
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rt-eyebrow", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 74%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".rt-headline").forEach((line, i) => {
        gsap.fromTo(line, { yPercent: 110 }, {
          yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.08 * i,
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none none" },
        });
      });
      gsap.fromTo(".rt-lead", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 64%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".rt-design-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".rt-trackline").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0, scaleY: 0 }, {
          scaleX: 1, scaleY: 1, duration: 1.1, ease: "power2.inOut",
          scrollTrigger: { trigger: ".rt-steps", start: "top 85%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".rt-stage").forEach((stage, i) => {
        gsap.fromTo(stage, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.45, delay: 0.1 * i, ease: "power3.out",
          scrollTrigger: { trigger: ".rt-steps", start: "top 82%", toggleActions: "play none none none" },
        });
      });
      gsap.fromTo(".rt-cta", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "bottom 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const slideTo = useCallback((i: number) => {
    setActive((i + chapters.length) % chapters.length);
  }, [chapters.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); slideTo(active - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); slideTo(active + 1); }
  };

  const activeChapter = chapters[active] ?? chapters[0];

  const arrowBtn =
    "inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:border-[#B88A5A] hover:text-[#B88A5A] transition-colors duration-200";

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] py-20 sm:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[640px] h-[640px] rounded-full bg-[#B88A5A]/[0.06] blur-3xl translate-x-1/4 -translate-y-1/4" />
      </div>

      <div className="max-w-[88rem] mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 sm:mb-16">
          <div className="lg:col-span-9">
            <span className="rt-eyebrow inline-flex items-center gap-3 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase mb-8">
              <span className="w-10 h-px bg-[#B88A5A]/40" />
              {t("entreprises.retreat.badge")}
            </span>
            <h2 className="heading-serif text-white" style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.9rem)", fontWeight: 500, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              <span className="rt-headline block overflow-hidden pb-1">{t("entreprises.retreat.heading1")}</span>
              <span className="rt-headline block overflow-hidden pb-1">
                {t("entreprises.retreat.heading2").split(" ")[0]}{" "}
                <em className="not-italic text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 55%, #B88A5A 100%)" }}>
                  {t("entreprises.retreat.heading2").split(" ").slice(1).join(" ")}
                </em>
              </span>
            </h2>
            <p className="rt-lead text-white/55 text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
              {t("entreprises.retreat.lead")}
            </p>
          </div>
          <div className="lg:col-span-3 hidden lg:block justify-self-end">
            <p className="text-right text-white/35 text-xs leading-relaxed tracking-[0.08em] uppercase" style={{ maxWidth: "16rem" }}>
              {t("entreprises.retreat.chaptersIntro")}
            </p>
          </div>
        </div>

        {/* Interactive retreat stage */}
        <div
          ref={stageRef}
          className="relative border-t border-white/[0.06] pt-12 sm:pt-16"
          onKeyDown={onKeyDown}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) slideTo(dx < 0 ? active + 1 : active - 1);
          }}
        >
          {/* all chapters kept in DOM for SEO/LLM + accessibility; inactive visually hidden */}
          <div className="relative">
            {chapters.map((c, i) => {
              const isActive = i === active;
              return (
                <article
                  key={i}
                  className={`transition-opacity duration-500 motion-reduce:transition-none ${isActive ? "opacity-100" : "sr-only absolute inset-0"}`}
                  aria-hidden={!isActive}
                >
                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-7">
                      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden">
                        <div className="w-full h-full transition-transform duration-[1200ms] motion-reduce:transition-none scale-100" style={{ transform: isActive ? "scale(1)" : "scale(1.06)" }}>
                          <Image
                            src={chapterImages[i % chapterImages.length]}
                            alt={c.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 62vw"
                            loading={isActive ? "eager" : "lazy"}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/45 via-transparent to-transparent" aria-hidden />
                        <span aria-hidden className="hidden lg:block absolute -bottom-10 left-6 font-heading font-bold leading-none select-none" style={{ fontSize: "clamp(4.9rem, 9.8vw, 8.2rem)", color: "transparent", WebkitTextStroke: "1.5px rgba(184,138,90,0.3)" }}>
                          {c.number}
                        </span>
                      </div>
                    </div>
                    <div className="lg:col-span-5 lg:px-6">
                      <span className="lg:hidden font-heading font-bold text-[#B88A5A] text-[2.5rem] leading-none block mb-4 tracking-tight">{c.number}</span>
                      <div className="w-12 h-px bg-[#B88A5A]/40 mb-6" aria-hidden />
                      <h3 className="heading-serif text-white font-semibold leading-[1.05]" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.85rem)" }}>{c.title}</h3>
                      <p className="mt-4 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase">{c.theme}</p>
                      <p className="mt-5 text-white/55 text-base sm:text-lg leading-relaxed max-w-xl">{c.desc}</p>
                      <div className="mt-8">
                        {c.capabilities.map((cap, ci) => (
                          <div key={ci}>
                            <p className="py-3.5 text-white/80 text-sm font-medium tracking-[0.14em] uppercase">{cap}</p>
                            {ci < c.capabilities.length - 1 && <div className="h-px bg-[#B88A5A]/15" aria-hidden />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* controls */}
          <div className="mt-10 sm:mt-12 border-t border-white/[0.06] pt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => slideTo(active - 1)} aria-label={t("entreprises.retreat.prev")} className={arrowBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={() => slideTo(active + 1)} aria-label={t("entreprises.retreat.next")} className={arrowBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/25 text-xs font-semibold tracking-[0.14em] uppercase" aria-hidden="true">{t("entreprises.retreat.counter")}</span>
              <span className="text-white text-sm sm:text-base font-medium tabular-nums">
                {String(activeChapter.number)} <span className="text-white/30">/ {String(chapters.length).padStart(2, "0")}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Compact Build Your Retreat */}
        <div className="mt-20 sm:mt-28 border-t border-white/[0.06] pt-14 sm:pt-16">
          <div className="rt-design-head max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase mb-6">
              <span className="w-10 h-px bg-[#B88A5A]/40" />
              {t("entreprises.retreat.design.badge")}
            </span>
            <h3 className="heading-serif text-white" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              {t("entreprises.retreat.design.title")}
            </h3>
            <p className="rt-design-intro mt-4 text-white/55 text-base leading-relaxed max-w-xl">
              {t("entreprises.retreat.design.intro")}
            </p>
          </div>

          <div className="rt-steps relative mt-10 sm:mt-12">
            <div className="rt-track absolute hidden lg:block left-0 right-0 top-[0.375rem] h-px bg-[#B88A5A]/15" aria-hidden />
            <div className="rt-trackline absolute hidden lg:block left-0 top-[0.375rem] w-full h-px bg-[#B88A5A]/70 origin-left" aria-hidden />
            <div className="rt-track absolute lg:hidden left-[0.375rem] top-0 bottom-0 w-px bg-[#B88A5A]/15" aria-hidden />
            <div className="rt-trackline absolute lg:hidden left-[0.375rem] top-0 bottom-0 w-px bg-[#B88A5A]/70 origin-top" aria-hidden />

            <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 pl-10 lg:pl-0">
              {steps.map((s) => (
                <div key={s.number} className="rt-stage relative">
                  <span className="absolute -left-10 lg:-left-2.5 top-0 lg:top-[-0.09rem] w-2.5 h-2.5 rounded-full bg-[#B88A5A]" aria-hidden />
                  <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-0">
                    <span className="font-heading font-bold text-[#B88A5A] text-3xl leading-none tracking-tight">{s.number}</span>
                    <span className="text-white text-base font-semibold tracking-wide uppercase lg:mt-3">{s.label}</span>
                  </div>
                  <p className="mt-2.5 lg:mt-3 text-white/45 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <p className="rt-precta heading-serif text-white text-xl sm:text-2xl leading-tight" style={{ maxWidth: "32rem" }}>
              {t("entreprises.retreat.preCta")}
            </p>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="rt-cta group inline-flex items-center justify-center gap-4 text-white px-9 h-14 rounded-full text-base font-semibold tracking-wide transition-all duration-300 hover:bg-[#A07848] sm:w-auto w-full shrink-0"
              style={{ background: "#B88A5A", boxShadow: "0 12px 40px rgba(184,138,90,0.28)" }}
            >
              {t("entreprises.retreat.cta")}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
