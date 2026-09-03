/**
 * Clinic Practical Info — location/contact/client info for the Clinic/B2C page.
 * Editorial three-column rows. Uses real clinic info + contact route. No cards.
 */
"use client";

import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicPracticalInfo } from "@/lib/clinic-content";

export default function ClinicPractical(): React.JSX.Element {
  const { t } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();

  const rows = [
    {
      label: t("clinic.practical.addressLabel"),
      value: clinicPracticalInfo.address,
      sub: clinicPracticalInfo.name,
    },
    {
      label: t("clinic.practical.hoursLabel"),
      value: clinicPracticalInfo.hours,
      sub: null as string | null,
    },
    {
      label: t("clinic.practical.appointmentLabel"),
      value: clinicPracticalInfo.appointment,
      sub: null as string | null,
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.practical.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.practical.heading1")}
              <br />
              {t("clinic.practical.heading2")}
            </h2>
          </div>
          <Link
            href="tel:+212666124035"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            {t("clinic.practical.ctaCall")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 divide-y md:divide-y-0 md:divide-x divide-[#0B1220]/[0.08]">
          {rows.map((r) => (
            <div key={r.label} className="py-8 md:py-0 md:pr-8 lg:pr-10 first:pt-0 md:first:pt-0">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.2em] uppercase block mb-3">
                {r.label}
              </span>
              <p className="heading-serif text-[#0B1220] text-xl lg:text-2xl leading-snug">
                {r.value}
              </p>
              {r.sub ? (
                <p className="mt-2 text-[#0B1220]/45 text-sm">{r.sub}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
