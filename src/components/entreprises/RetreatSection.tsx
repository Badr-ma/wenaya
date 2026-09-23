/**
 * Retreat — compact interactive showcase (single active experience at a time).
 *
 * Centered eyebrow → H2 → one lead line → 3 text selectors (roving-tabindex
 * tabs, bronze active underline) → ONE shared image (active chapter only,
 * 4:3 mobile / 16:7 desktop, centered max-w) → 3 theme keywords + one short
 * native line → the Objectif→Expertises→Format→Expérience build line → the
 * unchanged contact CTA. Only one experience is visually expanded at a time;
 * switching tabs swaps image + keywords. No repeated large images, no full
 * cards, no Build-Your-Retreat blocks (labels live in i18n, tiny near CTA).
 * Restrained once-only GSAP entrance, reduced-motion safe.
 */
"use client";

import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Chapter = { number: string; title: string; theme?: string; desc?: string; capabilities: string[] };

const RETREAT_IMAGES = [
  "/images/cours-ateliers/wellness.jpg",
  "/images/business-meeting.jpg",
  "/pratiques/coaching-sportif.jpg",
];

export default function RetreatSection() {
  const { t, tRaw } = useLocale();
  const chapters = tRaw<Chapter[]>("entreprises.retreat.chapters");
  const steps = tRaw<{ label: string }[]>("entreprises.retreat.design.steps");
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);

  const activeChapter = chapters[active] ?? chapters[0];

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = chapters.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next !== null && next !== i) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rf-head", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".rf-tabs", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".rf-photo", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".rf-footer", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-9 sm:py-10 lg:py-12 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Centered head */}
        <div className="rf-head">
          <span className="inline-flex items-center justify-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.retreat.badge")}
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
          </span>
          <h2 className="heading-serif text-[#0B1220] leading-[1.06] mt-4" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.retreat.heading1")} <span className="text-[#B88A5A]">{t("entreprises.retreat.heading2")}</span>
          </h2>
          <p className="mt-3.5 text-[#2B2F36]/55 leading-relaxed text-[15px] sm:text-base">{t("entreprises.retreat.lead")}</p>
        </div>

        {/* Selectors — roving-tabindex tabs, bronze active underline */}
        <div
          role="tablist"
          aria-label={t("entreprises.retreat.counter")}
          className="rf-tabs mt-6 flex overflow-x-auto sm:justify-center gap-1 sm:gap-2 pb-1 -mx-1 px-1"
        >
          {chapters.map((ch, i) => (
            <button
              key={ch.number}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`rf-tab-${i}`}
              aria-selected={active === i}
              aria-controls="rf-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onKeyDown={onKeyDown(i)}
              className={`shrink-0 whitespace-nowrap inline-flex items-baseline gap-2 px-3 sm:px-4 pb-2.5 border-b-2 text-sm sm:text-base font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] ${
                active === i
                  ? "border-[#B88A5A] text-[#0B1220]"
                  : "border-transparent text-[#2B2F36]/45 hover:text-[#0B1220]"
              }`}
            >
              <span className="font-mono text-[#B88A5A] text-xs tracking-[0.1em]">{ch.number}</span>
              <span>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Active showcase — single experience */}
        {activeChapter && (
          <div
            key={active}
            id="rf-panel"
            role="tabpanel"
            aria-labelledby={`rf-tab-${active}`}
            className="hn-fade mt-5 sm:mt-6"
          >
            <div className="rf-photo relative aspect-[4/3] sm:aspect-[16/7] max-w-[520px] mx-auto overflow-hidden rounded-[16px] bg-[#0B1220]">
              <Image
                src={RETREAT_IMAGES[active] ?? RETREAT_IMAGES[0]}
                alt={`${activeChapter.title} — ${t("entreprises.retreat.badge")}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 45vw"
              />
            </div>
            <p className="mt-4 text-sm sm:text-base text-[#0B1220]/80 font-medium leading-relaxed">
              {activeChapter.capabilities.map((k, i) => (
                <span key={k} className="inline-flex items-center gap-2">
                  {i > 0 && <span className="text-[#B88A5A]" aria-hidden>·</span>}
                  {k}
                </span>
              ))}
            </p>
            {activeChapter.desc && (
              <p className="mt-1.5 text-[#2B2F36]/55 text-sm leading-relaxed">{activeChapter.desc}</p>
            )}
          </div>
        )}

        {/* Build line + CTA */}
        <div className="rf-footer mt-6 flex flex-col items-center gap-5">
          {steps.length === 4 && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2B2F36]/45">
              {steps.map((s, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-[#B88A5A] mx-2" aria-hidden>·</span>}
                  {s.label}
                </span>
              ))}
            </p>
          )}
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md bg-[#0B1220] px-7 h-12 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] shrink-0"
          >
            {t("entreprises.retreat.cta")}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
              <path d="M17 8l4 4-4 4M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}