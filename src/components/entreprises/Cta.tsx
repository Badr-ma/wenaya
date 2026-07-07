"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

export default function EntreprisesCta(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cta-line").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0B1220]">
      {/* Amber glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(184,138,90,0.05) 0%, transparent 65%)" }} />

      {/* ── Newsletter — inline capture ── */}
      <div className="section-padding px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="cta-line text-center mb-2">
            <span className="text-[#B88A5A]/40 text-[10px] font-semibold tracking-[0.2em] uppercase">Newsletter</span>
          </div>
          <h2 className="cta-line heading-serif text-white text-center" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            {t("entreprises.cta.newsletter.heading")}
          </h2>
          <p className="cta-line text-white/60 text-base text-center leading-relaxed mt-3 max-w-sm mx-auto">
            {t("entreprises.cta.newsletter.sub")}
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="cta-line flex items-center justify-center gap-3 mt-8 max-w-md mx-auto border-b border-white/[0.08] pb-3"
          >
            <input
              type="email"
              placeholder={t("entreprises.cta.newsletter.placeholder")}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/20 outline-none py-2"
            />
            <button
              type="submit"
              className="text-[#B88A5A] text-xs font-semibold tracking-[0.12em] uppercase hover:text-white transition-colors shrink-0"
            >
              {t("entreprises.cta.newsletter.btn")}
            </button>
          </form>
        </div>
      </div>

      {/* Separator */}
      <div className="cta-line max-w-3xl mx-auto px-6">
        <hr className="border-white/[0.05]" />
      </div>

      {/* ── Final CTA ── */}
      <div className="section-padding px-6 pt-0 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Testimonial */}
          <div className="cta-line mb-10">
            <svg className="w-7 h-7 mx-auto mb-5" viewBox="0 0 32 32" fill="none" style={{ color: "rgba(184,138,90,0.3)" }}>
              <path d="M9.333 20c0-2.667 1.334-5.333 4-8L16 8l1.333 1.333C15.111 11.556 14 13.778 14 16v4H9.333zM20 20c0-2.667 1.333-5.333 4-8L26.667 8 28 9.333c-2.222 2.223-3.333 4.445-3.333 6.667V20H20z" fill="currentColor" />
            </svg>
            <blockquote className="text-white/60 leading-relaxed mx-auto max-w-2xl text-base sm:text-lg" style={{ fontStyle: "italic" }}>
              {t("entreprises.cta.quote")}
            </blockquote>
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="w-5 h-px bg-[#B88A5A]/30 shrink-0" />
              <span className="text-white/50 text-xs font-medium tracking-[0.15em] uppercase">{t("entreprises.cta.quoteAttr")}</span>
              <div className="w-5 h-px bg-[#B88A5A]/30 shrink-0" />
            </div>
          </div>

          <h2 className="cta-line text-white" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.02em" }}>
            {t("entreprises.cta.finalHeading")}
          </h2>

          <p className="cta-line mt-5 max-w-md mx-auto leading-relaxed text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t("entreprises.cta.finalSub")}
          </p>

          <div className="cta-line flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-10">
            <a
              href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 sm:w-auto w-full"
              style={{ background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)", boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(184,138,90,0.35)" }}
            >
              {t("entreprises.cta.cta1")}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-white/40 text-sm font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16] sm:w-auto w-full"
            >
              {t("entreprises.cta.cta2")}
            </a>
          </div>

          <p className="cta-line mt-10 text-xs tracking-[0.1em] text-white/40">
            {t("entreprises.cta.contact")}
          </p>
        </div>
      </div>
    </section>
  );
}
