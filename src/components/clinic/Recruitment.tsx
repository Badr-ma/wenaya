/**
 * Clinic Recruitment — practitioner recruitment CTA for the Clinic/B2C page.
 * Live wenaya copy: "Vous êtes praticiens ?" → "Nous Rejoindre". Editorial full-width.
 */
"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { h } from "@/lib/href";

export default function ClinicRecruitment(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] px-6 sm:px-10 overflow-hidden">
      {/* subtle accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 80% 50%, rgba(184,138,90,0.1) 0%, transparent 55%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
          <div className="max-w-2xl">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.recruitment.badge")}
            </span>
            <h2 className="heading-serif text-white leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}>
              {t("clinic.recruitment.heading1")}
            </h2>
            <p className="mt-6 text-white/45 text-base lg:text-lg leading-relaxed max-w-xl">
              {t("clinic.recruitment.desc")}
            </p>
          </div>

          <Link
            href={h(locale, "/contact")}
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl text-white text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
            }}
          >
            {t("clinic.recruitment.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
