/**
 * Clinic Intro — integrated-health ecosystem section for the Clinic/B2C page.
 * Editorial two-column: narrative + WHO statement + feature list. No cards.
 */
"use client";

import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicFeatures } from "@/lib/clinic-content";

export default function ClinicIntro(): React.JSX.Element {
  const { t } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const features = clinicFeatures;

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: narrative */}
          <div className="lg:col-span-5">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.intro.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.intro.heading1")}
              <br />
              {t("clinic.intro.heading2")}
            </h2>
            <div className="mt-8 space-y-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
              <p>{t("clinic.intro.p1")}</p>
              <p>{t("clinic.intro.p2")}</p>
            </div>

            {/* WHO statement */}
            <div className="mt-10 lg:mt-14 border-l-2 border-[#B88A5A] pl-6">
              <blockquote className="text-[#0B1220]/80 text-xl lg:text-2xl font-light italic leading-relaxed">
                “{t("clinic.intro.whoQuote")}”
              </blockquote>
              <p className="mt-3 text-[#B88A5A] text-sm font-semibold tracking-wide">
                — {t("clinic.intro.whoSource")}
              </p>
              <p className="mt-4 text-[#0B1220]/55 text-base leading-relaxed">
                {t("clinic.intro.whoCommitment")}
              </p>
            </div>
          </div>

          {/* Right: features, numbered editorial rows */}
          <div className="lg:col-span-7">
            <div className="space-y-0 divide-y divide-[#0B1220]/[0.06]">
              {features.map((f, i) => (
                <div key={f.title} className={`py-8 lg:py-9 ${i === 0 ? "pt-0" : ""}`}>
                  <div className="flex items-start gap-5 lg:gap-8">
                    <span className="text-[#B88A5A] text-sm font-mono w-8 shrink-0 translate-y-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="heading-serif text-[#0B1220] text-xl lg:text-2xl">
                        {f.title}
                      </h3>
                      <p className="mt-2 text-[#0B1220]/60 text-base leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
