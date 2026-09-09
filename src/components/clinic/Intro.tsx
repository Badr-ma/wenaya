/**
 * Clinic Intro — paragraph-led editorial manifesto for the Clinic/B2C page.
 *
 * No cards, no accordion, no numbered index: a large statement heading, a serif
 * lead-in line, and the five ecosystem ideas expressed as real paragraphs
 * (each stays in the approved copy). A photograph sits beside the reading
 * column on desktop; the WHO statement closes the section as a typographic
 * pull-quote. Nothing is numbered and interactions are zero.
 *
 * A calm, non-interactive section. Content is always visible in the HTML
 * (no-JS / SSR safe); a single gentle GSAP fade-in (eyebrow → heading →
 * lead → paragraphs → image → quote) fires only when the section approaches
 * the viewport. Skipped entirely under prefers-reduced-motion. No scrolling
 * effects, no loops.
 */
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

/** Fade-in uses an `overflow-anchor` penalty only while running; reduced-motion users get static content. */
const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ClinicIntro(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred();
  const paragraphs = tRaw<string[]>("clinic.intro.paragraphs");

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    if (reduceMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
      tl.fromTo(".ci-eyebrow", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
        .fromTo(".ci-h2", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, 0.12)
        .fromTo(".ci-lead", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.26)
        .fromTo(
          ".ci-p",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          0.32
        )
        .fromTo(".ci-img", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65 }, 0.52)
        .fromTo(".ci-quote", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, 0.64);
    }, el);

    return () => ctx.revert();
  }, [ready, sectionRef]);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        {/* ── Paragraph-led manifesto (left) + photograph (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <span className="ci-eyebrow text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.intro.badge")}
            </span>
            <h2
              className="ci-h2 heading-serif text-[#0B1220] leading-[1.02]"
              style={{ fontSize: "clamp(2.3rem, 4.2vw, 3.6rem)" }}
            >
              {t("clinic.intro.heading1")}
              <br />
              {t("clinic.intro.heading2")}
            </h2>
            <p className="ci-lead mt-6 text-[#0B1220] font-medium text-lg lg:text-xl leading-relaxed max-w-xl">
              {t("clinic.intro.p1")}
            </p>
            <div className="mt-6 lg:mt-7 space-y-4">
              {paragraphs.map((p) => (
                <p key={p} className="ci-p text-[#0B1220]/70 text-base lg:text-lg leading-relaxed max-w-xl">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="ci-img lg:col-span-5">
            <div className="relative overflow-hidden rounded-t-[24px]">
              <Image
                src="/images/diverse-team.jpg"
                alt={t("clinic.intro.imageAlt")}
                fill={false}
                width={900}
                height={600}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── WHO pull-quote ── */}
        <div className="ci-quote mt-14 lg:mt-20 max-w-3xl">
          <div className="border-l-2 border-[#B88A5A] pl-6 sm:pl-8">
            <blockquote className="text-[#0B1220]/80 text-2xl lg:text-[1.9rem] font-light italic leading-snug">
              “{t("clinic.intro.whoQuote")}”
            </blockquote>
            <p className="mt-3 text-[#B88A5A] text-sm font-semibold tracking-wide">
              — {t("clinic.intro.whoSource")}
            </p>
            <p className="mt-5 text-[#0B1220]/50 text-sm leading-relaxed max-w-2xl">
              {t("clinic.intro.whoCommitment")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}