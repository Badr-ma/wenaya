/**
 * Corporate hero — cinematic full-bleed hero aligned to the HOMEPAGE hero
 * design language (src/components/HeroSection.tsx): full-bleed photograph,
 * directional + top-fade overlays, vertically centered content, Manrope 500
 * H1 (clamp 2.2–3.9rem, 1.08 leading) with a bronze gradient accent line,
 * rounded-xl `h-11 px-7` pill CTAs, and a homepage-style trust/metrics row
 * (hairline border-t, white/90 bold values, white/32 micro labels). Wenaya
 * copy, image, CTA destinations (external audit calendar + `#downloads`),
 * value bullets and the 4 metrics + partner logo are all preserved — only the
 * visual language changed. No bottom melt: the next section (TrustBand) is a
 * light band, so the overlay fades cleanly to the section edge.
 *
 * Animation mirrors the homepage: content is hidden at first paint via
 * `.ch-fade` (globals.css), then revealed by GSAP `fromTo` tweens in order
 * eyebrow → H1 → sub → CTAs → bullets → metrics/logo. Reduced motion renders
 * everything statically visible (CSS + JS `matchMedia` bail).
 */
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const STAT_ORDER = [
  // stat 0: 35+ — five-column grid column 1 (left)
  "order-1 lg:order-none lg:col-start-1 lg:row-start-1",
  // stat 1: +2 000 — column 2 (left), right-aligned on mobile
  "order-1 lg:order-none lg:col-start-2 lg:row-start-1",
  // stat 2: 96% — column 4 (right of the centred logo)
  "order-3 lg:order-none lg:col-start-4 lg:row-start-1",
  // stat 3: 7 — column 5 (right), right-aligned on mobile
  "order-3 lg:order-none lg:col-start-5 lg:row-start-1",
];

export default function Hero(): React.JSX.Element {
  const { t, tRaw, locale } = useLocale();
  const bullets = tRaw<string[]>("entreprises.hero.bullets");
  const metrics = tRaw<{ number: string; label: string }[]>("entreprises.approach.stats");
  const { elRef: sectionRef, ready } = useIntersectionDeferred();

  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          ".hero-line",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(".hero-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.25"
        )
        .fromTo(".ch-proof", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(".ch-stats", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.3");
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label={t("entreprises.hero.badge")}
      className="relative flex items-center overflow-hidden bg-[#0B1220] min-h-[80vh] sm:min-h-screen"
    >
      {/* ── Background — full-bleed photograph ── */}
      <Image
        src="/images/business-meeting.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Directional overlay — dark-left for text, lighter-right for depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(108deg, rgba(11,18,32,0.94) 0%, rgba(11,18,32,0.88) 38%, rgba(11,18,32,0.68) 60%, rgba(11,18,32,0.52) 80%, rgba(11,18,32,0.42) 100%)",
        }}
      />
      {/* Top dark fade (hides image at nav level) */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, rgba(11,18,32,0.7) 0%, transparent 100%)" }}
      />

      {/* ── Content — homepage container + centered copy ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        {/* Eyebrow */}
        <p className="hero-eyebrow ch-fade flex items-center gap-2.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" aria-hidden="true" />
          <span className="text-[#B88A5A] text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase">
            {t("entreprises.hero.badge")}
          </span>
        </p>

        {/* H1 — exactly one, two lines, bronze gradient accent on line 2 */}
        <h1
          className="max-w-[680px] text-white leading-[1.08]"
          style={{
            fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
            fontSize: "clamp(2.2rem, 4vw, 3.9rem)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          <span className="hero-line ch-fade block">{t("entreprises.hero.heading1")}</span>
          <span className="hero-line ch-fade block">
            <span
              style={{
                background: "linear-gradient(135deg, #D4A870 0%, #B88A5A 45%, #E8C99A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("entreprises.hero.heading2")}
            </span>
          </span>
        </h1>

        {/* Single supporting paragraph */}
        <p
          className="hero-sub ch-fade mt-6 max-w-[560px] leading-[1.78]"
          style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.93rem, 1.4vw, 1.05rem)" }}
        >
          {t("entreprises.hero.desc")}
        </p>

        {/* CTAs — homepage pills; primary solid bronze (external), secondary outline */}
        <div className="hero-cta ch-fade mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <a
            href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px hover:brightness-110 active:translate-y-0"
            style={{ background: "#B88A5A" }}
            aria-label={`${t("entreprises.hero.cta1")} (${locale === "en" ? "opens in a new tab" : "s'ouvre dans un nouvel onglet"})`}
          >
            {t("entreprises.hero.cta1")}
          </a>
          <a
            href="#downloads"
            className="inline-flex items-center justify-center h-11 px-7 rounded-xl border border-white/25 text-[13.5px] font-semibold text-white/90 transition-all duration-300 hover:border-white/45 hover:bg-white/5"
          >
            {t("entreprises.hero.cta2")}
          </a>
        </div>

        {/* Value bullets */}
        <ul className="ch-proof ch-fade mt-9 flex flex-col gap-2.5">
          {bullets.map((bullet, i) => (
            <li
              key={`${i}-${bullet}`}
              className="flex items-start gap-3 text-sm text-white/75"
            >
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-[#B88A5A]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3" />
              </svg>
              {bullet}
            </li>
          ))}
        </ul>

        {/* Trust/metrics row — homepage trust-bar language (hairline top border).
            Desktop (lg) uses five symmetric columns [1fr 1fr auto 1fr 1fr]: the
            two metrics then the logo sit in the left tracks and the two metrics
            right in the right tracks, so the logo column centre always equals the
            row centre. Each stat is its own min-w-0 wrapper (number over label)
            so labels wrap within their track instead of colliding. */}
        <div className="ch-stats ch-fade mt-10 sm:mt-20 pt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/[0.08] lg:grid-cols-[1fr_1fr_auto_1fr_1fr] lg:items-start lg:gap-x-10">
          {metrics.map((m, i) => {
            const mobileRight = i % 2 === 1;
            const rightGroup = i >= 2;
            return (
              <div
                key={`stat-${i}-${m.label}`}
                className={`min-w-0 ${STAT_ORDER[i]} flex flex-col ${
                  mobileRight ? "items-end" : "items-start"
                } ${rightGroup ? "lg:items-end" : "lg:items-start"}`}
              >
                <span className="whitespace-nowrap font-heading font-bold text-[22px] tracking-tight text-white/90">
                  {m.number}
                </span>
                <p className="mt-1.5 max-w-full text-[11.5px] leading-snug text-white/32">
                  {m.label}
                </p>
              </div>
            );
          })}

          <span className="ch-logo order-2 col-start-1 col-end-3 flex items-center justify-center py-1 lg:order-none lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:py-0">
            <span className="relative block aspect-[1204/293] w-[104px] sm:w-[132px] lg:w-[190px]">
              <Image
                src="/images/Logo%20Corpo%2023%20sept.%202026%2C%2010_15_58.png"
                alt={t("entreprises.hero.logoAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 190px, (min-width: 640px) 132px, 104px"
                className="object-cover object-[50%_52.5%] brightness-0 invert"
              />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}