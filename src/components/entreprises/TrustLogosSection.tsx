/**
 * Trust Logos — "Ils nous font confiance" band with 5 neutral, abstract
 * partner marks (no invented brand names/assets). Quiet editorial ivory band,
 * one centered row, monochrome marks. Creative marks are decorative and
 * aria-hidden. Single gentle GSAP fade.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function Mark({ variant }: { variant: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 48"
      className="h-7 w-auto shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {variant === 0 && (
        <path d="M20 14h56a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H20a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" opacity="0.85" />
      )}
      {variant === 1 && (
        <path d="M48 10c-4.4 0-8 4-8 9s3.6 9 8 9 8-4 8-9-3.6-9-8-9z" opacity="0.85" />
      )}
      {variant === 2 && (
        <path d="M24 34a28 28 0 0 1 48 0" opacity="0.85" />
      )}
      {variant === 3 && (
        <path d="M14 34V18m12 16V10m12 24V14a6 6 0 0 1 12 0v20m-12-10h12m12 10V18m12 16V12a4 4 0 0 1 8 0v22" opacity="0.85" />
      )}
      {variant === 4 && (
        <path d="M14 32c8-16 60-16 68 0" opacity="0.85" />
      )}
    </svg>
  );
}

export default function TrustLogosSection() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tl-head", { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.55, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".tl-gap", { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-14 sm:py-18 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="tl-head flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.trustLogos.title")}
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
          </span>
        </div>
        <div className="tl-gap mt-9 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-20 text-[#0B1220]/20">
          {[0, 1, 2, 3, 4].map((v) => (
            <Mark key={v} variant={v} />
          ))}
        </div>
      </div>
    </section>
  );
}