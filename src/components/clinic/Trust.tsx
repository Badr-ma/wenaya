/**
 * Clinic Trust — trust metrics strip for the Clinic/B2C page.
 * Editorial horizontal row of metrics with dividers. No cards.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicMetrics } from "@/lib/clinic-content";

export default function ClinicTrust(): React.JSX.Element {
  const { t } = useLocale();
  const { elRef: sectionRef, ready } = useIntersectionDeferred();

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0B1220] border-t border-white/[0.06] px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
          <div className="lg:w-1/3 shrink-0">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-3">
              {t("clinic.trust.badge")}
            </span>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              {t("clinic.trust.note")}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {clinicMetrics.map((m, i) => (
              <div
                key={m.label}
                className={`pl-6 ${i > 0 ? "md:border-l md:border-white/[0.08]" : ""}`}
              >
                <div className="text-white text-4xl lg:text-5xl font-light tracking-tight">
                  {m.value}
                </div>
                <div className="mt-2 text-white/35 text-sm leading-snug">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
