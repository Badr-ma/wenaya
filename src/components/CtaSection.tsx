"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { gsap } from "gsap";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import type { CtaContent } from "@/lib/homepage-types";

interface CtaSectionProps {
  content?: CtaContent;
}

export default function CtaSection({ content }: CtaSectionProps): React.JSX.Element {
  const { t } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred("200px 0px");

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".cta-quote", ".cta-divider", ".cta-headline", ".cta-sub", ".cta-actions", ".cta-info"],
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-14 sm:py-32 px-6"
      style={{ background: "#0B1220" }}
    >
      {/* Atmospheric glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(184,138,90,0.06) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(21,154,169,0.04) 0%, transparent 65%)" }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        {/* Patient testimonial */}
        <div className="cta-quote mb-6 sm:mb-10">
          <svg
            className="w-8 h-8 mx-auto mb-5"
            viewBox="0 0 32 32" fill="none"
            style={{ color: "rgba(184,138,90,0.4)" }}
          >
            <path d="M9.333 20c0-2.667 1.334-5.333 4-8L16 8l1.333 1.333C15.111 11.556 14 13.778 14 16v4H9.333zM20 20c0-2.667 1.333-5.333 4-8L26.667 8 28 9.333c-2.222 2.223-3.333 4.445-3.333 6.667V20H20z"
              fill="currentColor"
            />
          </svg>
          <blockquote
            className="text-white/55 leading-relaxed mx-auto max-w-2xl"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", fontStyle: "italic" }}
          >
            {t("ctaSection.quote")}
          </blockquote>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-[#B88A5A]/40" />
            <span className="text-white/30 text-[11px] font-medium tracking-[0.15em] uppercase">
              {t("ctaSection.attribution")}
            </span>
            <div className="w-6 h-px bg-[#B88A5A]/40" />
          </div>
        </div>

        {/* Divider */}
        <div className="cta-divider flex items-center gap-4 mb-6 sm:mb-10">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="w-1 h-1 rounded-full bg-[#B88A5A]/40" />
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>

        {/* Headline */}
        <h2
          className="cta-headline text-white"
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
          }}
        >
          {content?.heading1 ?? t("ctaSection.heading1")}<br />
          <span
            style={{
              background: "linear-gradient(135deg, #D4A870 0%, #B88A5A 50%, #E8C99A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
            }}
          >
            {content?.heading2 ?? t("ctaSection.heading2")}
          </span>
        </h2>

        {/* Sub */}
        <p
          className="cta-sub mt-6 max-w-lg mx-auto leading-[1.75]"
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
          }}
        >
          {content?.sub ?? t("ctaSection.sub")}
        </p>

        {/* CTAs */}
        <div className="cta-actions flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-10">
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0"
            style={{
              background: "#B88A5A",
            }}
          >
            {content?.ctaLabel ?? t("ctaSection.cta")}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Contact info — minimal, one line */}
        <p className="cta-info mt-6 sm:mt-10 text-[11px] tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.18)" }}>
          {t("ctaSection.contact")}
        </p>
      </div>
    </section>
  );
}
