/**
 * Clinic Recruitment — practitioner recruitment CTA ("Join the team").
 * Full-width image with a controlled dark overlay and editorial split text.
 * CTA opens the {@link RecruitmentModal} (instead of routing to /contact).
 */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import RecruitmentModal from "./RecruitmentModal";

export default function ClinicRecruitment(): React.JSX.Element {
  const { t } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const [open, setOpen] = useState(false);

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] px-6 sm:px-10 overflow-hidden">
      {/* Full-width background image + overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/executive-team.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(11,18,32,0.92) 0%, rgba(11,18,32,0.6) 45%, rgba(11,18,32,0.35) 100%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-2 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {t("clinic.recruitment.badge")}
              </span>
            </span>
            <h2 className="heading-serif text-white leading-[1.02]" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}>
              {t("clinic.recruitment.heading1")}
            </h2>
            <p className="mt-6 text-white/65 text-base lg:text-lg leading-relaxed max-w-xl">
              {t("clinic.recruitment.desc")}
            </p>
          </div>

          <div className="lg:col-span-4 flex items-end">
            <div className="w-full">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto h-13 px-8 py-4 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {t("clinic.recruitment.cta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <RecruitmentModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
