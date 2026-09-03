/**
 * Clinic Health Needs (Maux-troubles) — discovery section for the Clinic/B2C
 * page. Editorial: large question on the left, numbered care-need rows on the
 * right with thin separators. Rows are intentionally non-interactive (no
 * destintination routes), so they are styled as editorial text, not clickable
 * links. No cards.
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
    <section ref={sectionRef} className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-5">
              {t("clinic.healthNeeds.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.healthNeeds.heading1")}
              <br />
              {t("clinic.healthNeeds.heading2")}
            </h2>
            <p className="mt-5 text-[#B88A5A] text-lg lg:text-xl font-light leading-relaxed max-w-md">
              &ldquo;{locale === "en" ? "What is your need?" : "Quel est votre besoin ?"}&rdquo;
            </p>
            <p className="mt-3 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md">
              {t("clinic.healthNeeds.sub")}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-0 divide-y divide-[#0B1220]/[0.08]">
              {healthNeeds.map((n, i) => (
                <div key={n.slug} className="flex items-baseline gap-5 lg:gap-7 py-3.5 lg:py-4">
                  <span className="text-[#B88A5A] font-mono text-sm shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="heading-serif text-[#0B1220] text-lg lg:text-xl leading-snug">
                      {n.title}
                    </h3>
                    <p className="mt-0.5 text-[#0B1220]/50 text-sm leading-snug max-w-xl">
                      {n.summary}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-[#B88A5A]/60 text-lg lg:text-xl shrink-0">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
