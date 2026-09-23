/**
 * Corporate hero — human-editorial 55/45 split.
 * Deep navy, left-aligned editorial copy (eyebrow + serif H1 + supporting
 * paragraph + rectangular CTA + underline text-link + value bullets + trust
 * metrics row) set against a real project photograph on the right. No
 * gradient melt, no full-bleed overlay, no cards. Wenaya copy and CTA
 * destinations untouched.
 */

"use client";

import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function Hero(): React.JSX.Element {
  const { t, tRaw } = useLocale();
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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".ch-eyebrow",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          ".ch-h1",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.45",
        )
        .fromTo(
          ".ch-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.5",
        )
        .fromTo(
          ".ch-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.45",
        )
        .fromTo(
          ".ch-proof",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          ".ch-stats",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35",
        )
        .fromTo(
          ".ch-photo",
          { opacity: 0, y: 20, scale: 1.02 },
          { opacity: 1, y: 0, scale: 1, duration: 1 },
          "-=0.7",
        );
    }, section);

    return () => ctx.revert();
  }, [ready, sectionRef]);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label={t("entreprises.hero.badge")}
      className="relative overflow-hidden scroll-mt-0 bg-[#0B1220]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-28 lg:grid lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-32">
        {/* ── Copy (7 cols ≈ 55%) ─────────────────────────────── */}
        <div className="order-1 flex flex-col justify-center lg:col-span-7">
          <span className="ch-eyebrow mb-5 block font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-[#B88A5A] sm:text-xs">
            {t("entreprises.hero.badge")}
          </span>

          <h1 className="ch-h1 max-w-[26ch] font-serif text-[clamp(2.5rem,6vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.01em] text-white">
            <span className="block text-white">{t("entreprises.hero.heading1")}</span>{" "}
            <span className="block italic text-[#D4A56A]">{t("entreprises.hero.heading2")}</span>
          </h1>

          <p className="ch-sub mt-6 max-w-[54ch] text-base leading-relaxed text-white/70 sm:text-lg">
            {t("entreprises.hero.desc")}
          </p>

          <div className="ch-cta mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#B88A5A] px-7 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9A6E3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A56A]"
            >
              {t("entreprises.hero.cta1")}
              <svg
                className="ml-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3" />
              </svg>
            </a>
            <a
              href="#downloads"
              className="inline-flex items-center gap-1.5 border-b border-white/30 pb-0.5 text-sm font-semibold text-white transition-colors hover:border-[#B88A5A] hover:text-[#D4A56A]"
            >
              {t("entreprises.hero.cta2")}
            </a>
          </div>

          <ul className="ch-proof mt-9 flex flex-col gap-2.5">
            {bullets.map((bullet, i) => (
              <li
                key={`${i}-${bullet}`}
                className="flex items-start gap-3 text-sm text-white/65"
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

          <div className="ch-stats mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-4">
            {metrics.map((m, i) => (
              <div key={`${i}-${m.label}`}>
                <span className="font-serif text-2xl leading-none text-[#D4A56A] sm:text-[1.7rem]">
                  {m.number}
                </span>
                <p className="mt-2 text-xs leading-snug text-white/60 sm:text-[13px]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Photograph (5 cols ≈ 45%) ───────────────────────── */}
        <div className="order-2 lg:col-span-5 lg:self-center">
          <div className="ch-photo relative aspect-[4/3] overflow-hidden rounded-md lg:aspect-[5/4]">
            <Image
              src="/images/business-meeting.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}