/**
 * Quick Access Section — four-card navigation hub (homepage).
 *
 * Helps visitors who already know what they're looking for: needs/symptoms,
 * pathologies, care disciplines, or a specific practitioner. Cards link to
 * existing project routes. Content driven via i18n quickAccess block.
 *
 * Visual: ivory bg, gold eyebrow, heading-serif H2, 4 editorial cards with a
 * landscape image strip, thin bronze rule, navy title/body, bronze CTA.
 * GSAP entrance gated on useIntersectionDeferred. Reduced-motion safe.
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import type { QuickLinksContent } from "@/lib/homepage-types";

interface QuickAccessProps {
  content?: QuickLinksContent;
}

/**
 * CTA routes — reuse existing valid project routes only, locale-aware via h().
 * Paired with a local Wenaya editorial image strip for the card visual.
 */
const LINKS = [
  { path: "/pratiques", image: "/pratiques/sophrologie.jpg" },
  { path: "/parcours-de-soins", image: "/pratiques/kinesitherapie.jpg" },
  { path: "/pratiques", image: "/pratiques/nutrition.jpg" },
  { path: "/professional", image: "/images/diverse-team.jpg" },
];

export default function QuickAccessSection({ content }: QuickAccessProps): React.JSX.Element {
  const { locale, t, tRaw } = useLocale();
  const { elRef, ready } = useIntersectionDeferred();
  const links = tRaw<{ title: string; text: string; cta: string }[]>("quickAccess.links");

  const reduceMotion = (): boolean =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!ready) return;
    const el = elRef.current;
    if (!el) return;
    if (reduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".qa-card",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section ref={elRef} className="bg-[#FAF8F4] py-14 sm:py-20 px-6" id="acces-directs">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span
              className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif" }}
            >
              {t("quickAccess.badge")}
            </span>
          </div>
          <h2
            className="text-[#0B1220] heading-serif"
            style={{
              fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            {content?.heading ?? t("quickAccess.heading")}
          </h2>
          <p className="text-[#2B2F36]/50 text-[14px] leading-relaxed max-w-lg mx-auto mt-4">
            {content?.sub ?? t("quickAccess.sub")}
          </p>
        </div>

        {/* 4-card grid — 1 col mobile, 2×2 tablet, 4 in a row desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {links.map((link, i) => (
            <Link
              key={i}
              href={h(locale, LINKS[i].path)}
              className="qa-card group flex flex-col overflow-hidden rounded-2xl bg-white border border-[rgba(184,138,90,0.14)] shadow-[0_1px_2px_rgba(11,18,32,0.04)] transition-colors duration-500 hover:border-[rgba(184,138,90,0.3)] hover:shadow-[0_14px_34px_rgba(11,18,32,0.08)]"
            >
              {/* Image strip */}
              <div className="relative aspect-[16/8] overflow-hidden bg-[#0B1220]">
                <Image
                  src={LINKS[i].image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 23vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0B1220]/20 to-transparent" aria-hidden="true" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="w-8 h-[2px] bg-[#B88A5A] mb-4 sm:mb-5" aria-hidden="true" />
                <h3
                  className="text-[#0B1220] font-semibold text-base leading-snug tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif" }}
                >
                  {link.title}
                </h3>
                <p className="text-[#2B2F36]/50 text-[13px] leading-[1.65] mt-2">
                  {link.text}
                </p>

                {/* Custom editorial CTA tab — bottom-right, outlined, offset block */}
                <div className="mt-auto pt-5 sm:pt-6 flex justify-end">
                  <span className="qa-tab relative inline-flex h-9 items-center gap-2 rounded-lg border-[1.5px] border-[#B88A5A]/80 bg-white pl-4 pr-3.5 -rotate-2 transition-all duration-300 group-hover:rotate-0 group-hover:bg-[#B88A5A]/5 group-hover:border-[#B88A5A]">
                    <span
                      className="absolute -top-[11.5px] -right-[11.5px] flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-[#B88A5A] bg-[#FAF8F4] text-[#B88A5A] transition-colors duration-300 group-hover:border-[#B88A5A] group-hover:bg-[#B88A5A] group-hover:text-white"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-[13px] h-[13px]"
                        aria-hidden="true"
                      >
                        <path d="M19 5L15 17L12 5L9 17L5 5" />
                      </svg>
                    </span>
                    <span
                      className="text-[12px] font-semibold tracking-[0.02em] text-[#B88A5A]"
                      style={{ fontFamily: "var(--font-manrope), 'Manrope', ui-sans-serif, system-ui, sans-serif" }}
                    >
                      {link.cta}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-[#B88A5A] transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}