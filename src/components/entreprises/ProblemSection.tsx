/**
 * Problem — editorial band framing the status quo (sans Wenaya) against the
 * Wenaya outcome (avec Wenaya) as a flat three-row before → after comparison:
 * each row pairs a muted problem state (left) with the Wenaya response (right)
 * across a thin bronze connector. Sand band; restrained once-only GSAP entrance.
 * The "Par où commencer ?" levels content lives in LevelsSection; nothing else
 * consumes approach.* here. (approach.stats moved to the hero trust metrics row.)
 */

"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Comparison = {
  heading: string;
  sub: string;
  without: { label: string; desc: string }[];
  with: { label: string; desc: string }[];
};

export default function ProblemSection() {
  const { tRaw } = useLocale();
  const comparison = tRaw<Comparison>("entreprises.approach.comparison");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pb-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pb-cols", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pb-cell-left", { opacity: 0, x: -14 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pb-line", { opacity: 0, scaleX: 0, transformOrigin: "left center" }, {
        opacity: 1, scaleX: 1, duration: 0.6, stagger: 0.1, delay: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".pb-cell-right", { opacity: 0, x: 14 }, {
        opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.18, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const rows = comparison.without.slice(0, 3).map((w, i) => ({ without: w, with: comparison.with[i] }));
  const headingParts = comparison.heading.split("/").map((s) => s.trim());
  const withoutLabel = headingParts[0] ?? comparison.heading;
  const withLabel = headingParts[1] ?? "";

  return (
    <section ref={sectionRef} className="relative scroll-mt-20 overflow-hidden bg-[#F2EFE9] px-6 py-10 sm:py-13 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="pb-head mx-auto max-w-2xl text-center">
          <span className="mx-auto mb-4 block h-px w-8 bg-[#B88A5A]/40" aria-hidden />
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.4rem)" }}>
            {comparison.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] sm:text-base leading-relaxed text-[#2B2F36]/55">{comparison.sub}</p>
        </div>

        <div className="pb-cols mt-8 lg:mt-10">
          {/* ── Column labels (desktop) ── */}
          <div className="hidden border-b border-[#0B1220]/10 pb-3 lg:grid lg:grid-cols-[1fr_3rem_1fr] lg:items-end lg:gap-x-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2F36]/40">
              {withoutLabel}
            </span>
            <span aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A]">
              {withLabel}
            </span>
          </div>

          {/* ── Three-row before → after comparison ── */}
          <div className="divide-y divide-[#0B1220]/[0.08]">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-y-2 py-5 lg:grid-cols-[1fr_3rem_1fr] lg:items-center lg:gap-x-8 lg:py-6"
              >
                {/* Sans Wenaya — status quo */}
                <div className="pb-cell-left">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2B2F36]/40 lg:hidden">
                    {withoutLabel}
                  </span>
                  <p className="font-semibold text-[#2B2F36]/60">{row.without.label}</p>
                </div>

                {/* Connector — thin bronze line + arrow */}
                <div className="pb-connector flex items-center lg:justify-center" aria-hidden>
                  <svg
                    className="pb-line hidden h-4 w-12 text-[#B88A5A] lg:block"
                    viewBox="0 0 48 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M0 8h42" />
                    <path d="M35 2l7 6-7 6" />
                  </svg>
                  <svg
                    className="h-4 w-4 text-[#B88A5A] lg:hidden"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 1v13" />
                    <path d="M3 9l5 5 5-5" />
                  </svg>
                </div>

                {/* Avec Wenaya — Wenaya response */}
                <div className="pb-cell-right">
                  <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B88A5A] lg:hidden">
                    {withLabel}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <svg
                      className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-[#159AA9]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="font-semibold text-[#0B1220]">{row.with.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}