"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoCustomCTA() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReduced.current) {
        gsap.set([".cc-line1", ".cc-line2", ".cc-sub", ".cc-cta", ".cc-accent"], { opacity: 1, y: 0, scaleX: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".cc-line1", { opacity: 0, y: 40, duration: 0.8, immediateRender: false })
        .from(".cc-line2", { opacity: 0, y: 40, duration: 0.8, immediateRender: false }, "-=0.4")
        .from(".cc-sub", { opacity: 0, y: 20, duration: 0.6, immediateRender: false }, "-=0.3")
        .from(".cc-accent", { opacity: 0, scaleX: 0, transformOrigin: "center", duration: 0.7, immediateRender: false }, "-=0.2")
        .from(".cc-cta", { opacity: 0, y: 16, duration: 0.5, immediateRender: false }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative py-32 sm:py-44 px-6 overflow-hidden"
      data-section-bg="dark"
    >
      <div className="absolute inset-0 bg-[#0B1220]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B88A5A]/[0.06] via-[#0B1220] to-[#1A6B52]/[0.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#B88A5A]/[0.03] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2
          className="cc-line1 text-white font-serif"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: 1.08, fontWeight: 500 }}
        >
          {t("entreprises.customCta.heading1")}
        </h2>
        <h2
          className="cc-line2 text-transparent bg-clip-text mt-3 font-serif"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            lineHeight: 1.08,
            fontWeight: 500,
            backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 50%, #B88A5A 100%)",
          }}
        >
          {t("entreprises.customCta.heading2")}
        </h2>

        <p className="cc-sub text-white/40 text-base sm:text-lg leading-relaxed mt-8 max-w-xl mx-auto">
          {t("entreprises.customCta.desc")}
        </p>

        <div className="cc-cta mt-12 flex flex-col items-center gap-6">
          <div className="cc-accent h-px w-24" style={{ background: "linear-gradient(to right, transparent, #B88A5A, transparent)" }} />
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-[#0B1220] font-semibold text-sm tracking-wide shadow-[0_10px_30px_rgba(184,138,90,0.25)]"
            style={{ background: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)" }}
          >
            {t("entreprises.customCta.cta")}
            <svg className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
