"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function EntreprisesCta(): React.JSX.Element {
  const { t, tRaw } = useLocale();

  const supportIcons: React.JSX.Element[] = [
    (<svg key="chat" viewBox="0 0 48 48" className="w-5 h-5" fill="none">
      <path d="M24 6c-8.837 0-16 5.373-16 12 0 3.708 2.087 7.047 5.333 9.333L12 38l6.667-4.667A18.27 18.27 0 0024 34c8.837 0 16-5.373 16-12S32.837 6 24 6z" stroke="currentColor" strokeWidth="1.5" />
    </svg>),
    (<svg key="docs" viewBox="0 0 48 48" className="w-5 h-5" fill="none">
      <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 18h12M18 26h8M18 34h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>),
    (<svg key="chart" viewBox="0 0 48 48" className="w-5 h-5" fill="none">
      <path d="M10 38V16l8-4 12 8 8-4v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 24v10M28 20v14M38 16v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>),
  ];

  const supports = (tRaw<Array<{title: string; desc: string}>>("entreprises.cta.supportCards")).map((s, i) => ({ ...s, icon: supportIcons[i] }));

  const dirigeantsBullets = tRaw<string[]>("entreprises.cta.dirigeantsBullets");

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ecta-section").forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll(".ecta-fade"),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
          }
        );
        gsap.fromTo(
          section.querySelectorAll(".ecta-card"),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#0B1220" }}>
      {/* ── Dedicated support ── */}
      <div className="ecta-section section-padding px-6 relative z-10">
        {/* Decorative image */}
        <div className="absolute right-0 top-0 w-1/3 md:w-1/2 h-full pointer-events-none overflow-hidden opacity-[0.35]">
          <Image
            src="/images/business-meeting.jpg"
            alt=""
            fill
            className="object-cover object-left brightness-[0.55] saturate-[0.8]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B1220]/60 to-[#0B1220]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(184,138,90,0.12) 100%)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(184,138,90,0.06) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mx-auto mb-14 text-center">
            <div className="ecta-fade">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {t("entreprises.cta.supportBadge")}
              </span>
            </div>
            <h2 className="ecta-fade heading-serif text-[clamp(2rem,4vw,3.5rem)] text-white mt-5">{t("entreprises.cta.supportHeading")}</h2>
            <p className="ecta-fade text-white/40 text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto">
              {t("entreprises.cta.supportDesc")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-24">
            {supports.map((s, i) => (
              <div key={i} className="ecta-card group relative bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.08]">
                <div className="w-10 h-10 rounded-lg bg-[#B88A5A]/8 border border-[#B88A5A]/15 flex items-center justify-center text-[#B88A5A]/60 transition-all duration-300 group-hover:bg-[#B88A5A] group-hover:text-white group-hover:border-[#B88A5A]">
                  {s.icon}
                </div>
                <h3 className="text-white font-heading font-semibold text-base sm:text-lg mt-4">{s.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Diamond separator ── */}
      <div className="flex items-center justify-center gap-4 py-6 relative z-10">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <div
          className="w-2 h-2 rotate-45 border border-[#B88A5A]/30"
          style={{ background: "rgba(184,138,90,0.06)" }}
        />
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>

      {/* ── Executive ── */}
      <div className="ecta-section section-padding px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.06]">
            {/* Decorative gradient image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#159AA9]/10 via-[#0B1220] to-[#B88A5A]/5" />
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#B88A5A]/8 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 sm:p-10 lg:p-14">
              <div>
                <div className="ecta-fade">
                  <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                    <span className="w-3 h-px bg-[#B88A5A]/40" />
                    {t("entreprises.cta.dirigeantsBadge")}
                  </span>
                </div>
                <h3 className="ecta-fade text-white font-heading font-semibold mt-5" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", lineHeight: 1.15 }}>
                  {t("entreprises.cta.dirigeantsHeading")}
                </h3>
                <p className="ecta-fade text-white/40 text-sm sm:text-base leading-relaxed mt-4">
                  {t("entreprises.cta.dirigeantsDesc")}
                </p>
                <ul className="ecta-fade mt-6 space-y-3">
                  {dirigeantsBullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/50 text-sm">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="ecta-fade inline-flex items-center gap-2 mt-6 text-[#B88A5A] text-sm font-medium hover:gap-3 transition-all duration-200"
                >
                  {t("entreprises.cta.dirigeantsCta")}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              {/* Visual */}
              <div className="ecta-card relative hidden md:block w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] group">
                <Image
                  src="/images/executive-team.jpg"
                  alt=""
                  fill
                  className="object-cover transition-all duration-[1.8s] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Dark gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-[#0B1220]/20 to-transparent" />
                {/* Warm bronze corner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#B88A5A]/20" />
                {/* Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1220]/60 backdrop-blur-sm border border-white/[0.06] text-white/60 text-[10px] font-medium tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]/60" />
                    {t("entreprises.cta.imageBadge")}
                  </span>
                </div>
                <div className="absolute inset-0 ring-1 ring-white/[0.06] ring-inset rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="ecta-section section-padding px-6 pt-0 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Testimonial */}
          <div className="ecta-fade mb-10">
            <svg className="w-8 h-8 mx-auto mb-5" viewBox="0 0 32 32" fill="none" style={{ color: "rgba(184,138,90,0.4)" }}>
              <path d="M9.333 20c0-2.667 1.334-5.333 4-8L16 8l1.333 1.333C15.111 11.556 14 13.778 14 16v4H9.333zM20 20c0-2.667 1.333-5.333 4-8L26.667 8 28 9.333c-2.222 2.223-3.333 4.445-3.333 6.667V20H20z" fill="currentColor" />
            </svg>
            <blockquote className="text-white/55 leading-relaxed mx-auto max-w-2xl" style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", fontStyle: "italic" }}>
              {t("entreprises.cta.quote")}
            </blockquote>
            <div className="mt-5 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-4 sm:w-6 h-px bg-[#B88A5A]/40 shrink-0" />
              <span className="text-white/30 text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-center">
                {t("entreprises.cta.quoteAttr")}
              </span>
              <div className="w-4 sm:w-6 h-px bg-[#B88A5A]/40 shrink-0" />
            </div>
          </div>

          {/* Divider */}
          <div className="ecta-fade flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]/40" />
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* Headline */}
          <h2 className="ecta-fade text-white" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", fontWeight: 500, lineHeight: 1.06, letterSpacing: "-0.02em" }}>
            {t("entreprises.cta.finalHeading")}
          </h2>

          {/* Sub */}
          <p className="ecta-fade mt-6 max-w-lg mx-auto leading-[1.75]" style={{ color: "rgba(255,255,255,0.38)", fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)" }}>
            {t("entreprises.cta.finalSub")}
          </p>

          {/* CTAs */}
          <div className="ecta-fade flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-10">
            <a
              href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 sm:w-auto w-full"
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
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-white/45 text-sm font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03] sm:w-auto w-full"
            >
              {t("entreprises.cta.cta2")}
            </a>
          </div>

          {/* Contact */}
          <p className="ecta-fade mt-10 text-[11px] tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.18)" }}>
            {t("entreprises.cta.contact")}
          </p>
        </div>
      </div>
    </section>
  );
}
