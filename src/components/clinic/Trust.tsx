/**
 * Clinic Trust — trust/proof strip for the Clinic/B2C page.
 * Editorial horizontal metrics with thin dividers — no boxes, no cards.
 * Alternates with the hero (deep navy) and flows into the ivory intro.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicMetrics } from "@/lib/clinic-content";

export default function ClinicTrust(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred();

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] px-6 sm:px-10" aria-label={t("clinic.trust.badge")}>
      <div className="max-w-7xl mx-auto pt-3 pb-4 lg:pt-4 lg:pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-4 lg:mb-5 lg:justify-between">
          <span className="text-[#B88A5A] text-[10px] font-semibold tracking-[0.24em] uppercase">
            {t("clinic.trust.badge")}
          </span>
          <p className="text-white/35 text-[11px] lg:text-xs leading-relaxed max-w-[220px] lg:text-right">
            {t("clinic.trust.note")}
          </p>
        </div>

        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-0 ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>
          {clinicMetrics(locale).map((m, i) => (
            <div
              key={m.label}
              className={`py-2.5 lg:py-1 px-2 lg:px-4 ${i > 0 ? "lg:border-l lg:border-white/[0.08]" : ""} ${i % 2 === 1 ? "border-l border-white/[0.06] lg:border-l" : ""}`}
            >
              <div className="heading-serif text-white text-3xl lg:text-4xl font-light tracking-tight">
                {m.value}
              </div>
              <div className="mt-1 text-white/35 text-[11px] lg:text-[12px] leading-snug max-w-[150px]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
