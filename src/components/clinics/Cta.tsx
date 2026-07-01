"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function ClinicsCta(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".cc-badge", ".cc-title", ".cc-desc", ".cc-actions"],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32 px-6 bg-[#0B1220]">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(184,138,90,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="cc-badge inline-flex items-center gap-2 mb-6">
          <span className="w-1 h-1 rounded-full bg-[#B88A5A]" />
          <span className="text-[#B88A5A]/60 text-[11px] font-semibold tracking-[0.2em] uppercase">
            {t("clinics.cta.badge")}
          </span>
        </div>

        <h2 className="cc-title heading-serif text-[clamp(2rem,4vw,3.5rem)] text-white">
          {t("clinics.cta.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("clinics.cta.heading2")}
</span>
        </h2>

        <p className="cc-desc mt-6 max-w-lg mx-auto text-white/35 text-[15px] leading-relaxed">
          {t("clinics.cta.desc")}
        </p>

        <div className="cc-actions flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link href="#"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(21,154,169,0.3)",
            }}
          >
            {t("clinics.cta.cta1")}
            <svg className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="#"
            className="inline-flex items-center h-12 px-7 rounded-xl text-white/40 text-sm font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16]"
          >
            {t("clinics.cta.cta2")}
          </Link>
        </div>

        <p className="mt-10 text-[11px] tracking-[0.08em] text-white/15">
          {t("clinics.cta.contact")}
        </p>
      </div>
    </section>
  );
}
