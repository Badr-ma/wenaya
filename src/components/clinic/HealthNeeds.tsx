/**
 * Clinic Health Needs (Maux-troubles) — discovery section for the Clinic/B2C page.
 * Editorial: describes "I know my condition, not who to see", then lists care needs.
 * No cards.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { getHealthNeeds } from "@/lib/health-needs";

export default function ClinicHealthNeeds(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const healthNeeds = getHealthNeeds(locale as "fr" | "en");

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.healthNeeds.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 3.6vw, 3.2rem)" }}>
              {t("clinic.healthNeeds.heading1")}
              <br />
              {t("clinic.healthNeeds.heading2")}
            </h2>
            <p className="mt-6 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed">
              {t("clinic.healthNeeds.sub")}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {healthNeeds.map((n, i) => (
                <div key={n.slug} className="border-t border-[#0B1220]/[0.08] pt-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[#B88A5A] font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="heading-serif text-[#0B1220] text-lg">{n.title}</h3>
                  </div>
                  <p className="mt-2 text-[#0B1220]/55 text-sm leading-relaxed">{n.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
