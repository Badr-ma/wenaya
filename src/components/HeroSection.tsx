"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import HeroVideoSequence, { type HeroClip } from "@/components/HeroVideoSequence";
import type { HeroContent } from "@/lib/homepage-types";

/* ── Hero Section ──────────────────────────────────────────── */
interface HeroSectionProps {
  content?: HeroContent;
}

const HERO_CLIPS: HeroClip[] = [
  {
    src: "/videos/homepage-hero/homepage-hero-01.mp4",
    poster: "/videos/homepage-hero/homepage-hero-01-poster.webp",
  },
  {
    src: "/videos/homepage-hero/homepage-hero-02.mp4",
    poster: "/videos/homepage-hero/homepage-hero-02-poster.webp",
  },
  {
    src: "/videos/homepage-hero/homepage-hero-03.mp4",
    poster: "/videos/homepage-hero/homepage-hero-03-poster.webp",
  },
  {
    src: "/videos/homepage-hero/homepage-hero-04.mp4",
    poster: "/videos/homepage-hero/homepage-hero-04-poster.webp",
  },
];

const HERO_MEDIA_POSITION = "center 30%";

export default function HeroSection({ content }: HeroSectionProps): React.JSX.Element {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(".hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(".hero-line", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, "-=0.3")
        .fromTo(".hero-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .fromTo(trustRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.25");
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  const stats = [
    { value: "35", label: t("hero.stats.therapeutes") },
    { value: "+2 000", label: t("hero.stats.patients") },
    { value: "99%", label: t("hero.stats.satisfaction") },
  ];

  return (
    <section
      ref={sectionRef}
      className="homepage-hero relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Video background sequence — posters are the LCP/fallback layer ── */}
      <HeroVideoSequence
        clips={HERO_CLIPS}
        className="absolute inset-0 z-0"
        objectPosition={HERO_MEDIA_POSITION}
      />

      {/* ── Directional overlay: light scrim only where the copy sits, video stays readable ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: "linear-gradient(96deg, rgba(6,10,22,0.72) 0%, rgba(6,10,22,0.6) 26%, rgba(6,10,22,0.4) 48%, rgba(6,10,22,0.18) 66%, rgba(6,10,22,0.05) 82%, rgba(6,10,22,0.12) 100%)",
        }}
      />
      {/* Bottom weld so the hero melts into the section below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-[2]"
        style={{
          background: "linear-gradient(to top, rgba(6,10,22,0.55) 0%, rgba(6,10,22,0.25) 18%, transparent 55%)",
        }}
      />
      {/* Top fade — the fixed nav already carries its own dark glass */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, rgba(6,10,22,0.32) 0%, transparent 100%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="max-w-2xl">
          <div>
            {/* Eyebrow */}
            <p className="hero-eyebrow flex items-center gap-2.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" aria-hidden="true" />
              <span
                className="text-[#B88A5A] text-[11px] sm:text-xs font-semibold tracking-[0.24em] uppercase"
                style={{ textShadow: "0 1px 10px rgba(6,10,22,0.6)" }}
              >
                {content?.eyebrow ?? t("hero.eyebrow")}
              </span>
            </p>

            {/* Headline */}
            <h1
              className="text-white leading-[1.08]"
              style={{
                fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
                fontSize: "clamp(2.2rem, 4vw, 3.9rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 30px rgba(6,10,22,0.55), 0 1px 3px rgba(6,10,22,0.55)",
              }}
            >
              <span className="hero-line block">{content?.heading1 ?? t("hero.heading1")}</span>
              <span className="hero-line block">
                <span
                  style={{
                    background: "linear-gradient(135deg, #D4A870 0%, #B88A5A 45%, #E8C99A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {content?.heading2 ?? t("hero.heading2")}
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p
              className="hero-sub mt-6 max-w-[560px] leading-[1.78]"
              style={{
                color: "rgba(255,255,255,0.8)",
                textShadow: "0 1px 14px rgba(6,10,22,0.7)",
                fontSize: "clamp(0.93rem, 1.4vw, 1.05rem)",
              }}
            >
              {content?.sub ?? t("hero.sub")}
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-9">
              <a
                href="#acces-directs"
                className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px hover:brightness-110 active:translate-y-0"
                style={{
                  background: "#B88A5A",
                }}
              >
                {content?.ctaLabel ?? t("hero.cta")}
              </a>
              <Link
                href={h(locale, "/contact-us") + "?type=booking"}
                className="inline-flex items-center justify-center h-11 px-7 rounded-xl border border-white/35 text-[13.5px] font-semibold text-white transition-all duration-300 hover:border-white/55 hover:bg-white/5"
              >
                {content?.ctaSecondary ?? t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>

        </div>

        {/* Trust bar */}
        <div
          ref={trustRef}
          className="mt-10 sm:mt-20 pt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 sm:gap-y-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.16)" }}
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div
                className="font-heading font-bold text-[22px] tracking-tight text-white"
                style={{ textShadow: "0 1px 12px rgba(6,10,22,0.6)" }}
              >
                {s.value}
              </div>
              <div
                className="text-[11.5px] text-white/60"
                style={{ textShadow: "0 1px 10px rgba(6,10,22,0.65)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
