/**
 * Practices & Specialties — homepage service-discovery section.
 *
 * Visual twin of Courses & Workshops (CoursAteliers): same dark Deep Navy
 * treatment, header hierarchy, 4:3 image cards with wheel-numbering, hover
 * motion and bronze accent language. Shows a single compact row (the first 3
 * canonical practices) with a "view all" CTA to /pratiques. No carousel.
 *
 * Data is i18n-driven per locale (titles/descriptions/images from the shared
 * practices adapter) — no remote CMS content is fetched, so the EN homepage
 * never inherits French copy.
 */
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { getAllPratiques } from "@/lib/pratiques";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import type { DiseaseMarqueeContent } from "@/lib/homepage-types";
import HiggsField from "./HiggsField";

/** Warm bronze accents shared with the Courses & Workshops card family. */
const ACCENTS = ["#B88A5A", "#C99B68", "#D4A870"] as const;

interface PracticesSectionProps {
  content?: DiseaseMarqueeContent;
}

export default function PracticesSection({ content }: PracticesSectionProps): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred("200px 0px");
  const practices = getAllPratiques(locale).slice(0, 3);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ps-head",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        ".ps-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [ready, sectionRef]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="practices-heading"
      className="relative overflow-hidden bg-[#0B1220] py-16 sm:py-20 px-6"
    >
      <HiggsField parentRef={sectionRef as React.RefObject<HTMLElement | null>} />

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#B88A5A]/3 to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/10 to-transparent z-[2]" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="ps-head text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A]/50 text-[10px] font-semibold tracking-[0.24em] uppercase">
              {content?.badge ?? t("homePractices.eyebrow")}
            </span>
          </span>
          <h2
            id="practices-heading"
            className="heading-serif text-white text-[clamp(1.6rem,3.5vw,3rem)] tracking-tight"
          >
            {content?.heading1 ?? t("homePractices.heading1")}{" "}
            <span style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {content?.heading2 ?? t("homePractices.heading2")}
            </span>
          </h2>
        </div>

        {/* Responsive grid — one compact row (first 3 practices) */}
        <div className="max-w-6xl mx-auto">
          <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {practices.map((p, i) => {
              const accent = ACCENTS[i % ACCENTS.length];

              return (
                <li key={p.slug} className="ps-card">
                  <Link
                    href={h(locale, `/pratiques/${p.slug}`)}
                    className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_-4px_rgba(184,138,90,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
                    style={{ background: "#0B1220", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Image area */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-[#0B1220]/10 to-transparent" />

                      {/* Number badge */}
                      <div
                        className="absolute top-3 left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-lg flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                        style={{ background: `${accent}18`, border: `1px solid ${accent}25`, boxShadow: `0 0 20px ${accent}10` }}
                      >
                        <span className="font-heading font-bold text-[10px] sm:text-xs tabular-nums transition-colors duration-500 group-hover:text-white" style={{ color: accent }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="absolute bottom-3 left-4 right-4 font-heading font-semibold text-sm sm:text-base leading-tight transition-colors duration-500 group-hover:text-[#B88A5A]" style={{ color: "rgba(255,255,255,0.95)" }}>
                        {p.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <div className="flex-1 flex flex-col justify-center px-5 py-4 sm:py-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-px h-10 self-stretch shrink-0 rounded-full mt-0.5 transition-opacity duration-500 group-hover:opacity-70"
                          style={{ background: `linear-gradient(to bottom, ${accent}, transparent)`, opacity: 0.4 }}
                        />
                        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{p.description}</p>
                      </div>
                    </div>

                    {/* Accent bar */}
                    <div
                      className="mx-5 mb-4 h-[2px] rounded-full transition-opacity duration-500 group-hover:opacity-80"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}30, ${accent}50, ${accent}30, transparent)`, opacity: 0.5 }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom link */}
        <div className="ps-head text-center mt-10 sm:mt-12">
          <Link
            href={h(locale, "/pratiques")}
            className="inline-flex items-center gap-3 text-[#B88A5A] text-sm font-semibold transition-all duration-500 group rounded-xl border border-[#B88A5A]/20 px-5 py-2.5 hover:bg-[#B88A5A]/5 hover:border-[#B88A5A]/30 hover:gap-4"
          >
            <span className="w-6 h-px bg-[#B88A5A]/40 transition-all duration-500 group-hover:w-8" />
            {content?.cta ?? t("homePractices.cta")}
            <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}