/**
 * Clinic Intro — integrated-health ecosystem story for the Clinic/B2C page.
 * Editorial image/text split: a large photograph opposite the narrative, the
 * WHO statement pull quote, and numbered principles as simple rows. No cards.
 */
"use client";

import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicFeatures } from "@/lib/clinic-content";

export default function ClinicIntro(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const features = clinicFeatures(locale);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
          {t("clinic.intro.badge")}
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10">
          {/* Image story */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-t-[24px]">
              <Image
                src={locale === "en" ? "/images/diverse-team.jpg" : "/images/diverse-team.jpg"}
                alt={locale === "en" ? "The multidisciplinary Wenaya team" : "L'équipe pluridisciplinaire Wenaya"}
                fill={false}
                width={900}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Editorial text */}
          <div className="lg:col-span-6 lg:pl-4">
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.intro.heading1")}
              <br />
              {t("clinic.intro.heading2")}
            </h2>

            <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed max-w-lg">
              {t("clinic.intro.p1")}
            </p>

            {/* WHO statement */}
            <div className="mt-7 lg:mt-8 border-l-2 border-[#B88A5A] pl-6 max-w-lg">
              <blockquote className="text-[#0B1220]/80 text-lg lg:text-xl font-light italic leading-relaxed">
                “{t("clinic.intro.whoQuote")}”
              </blockquote>
              <p className="mt-2.5 text-[#B88A5A] text-sm font-semibold tracking-wide">
                — {t("clinic.intro.whoSource")}
              </p>
            </div>
          </div>
        </div>

        {/* Numbered principles as rows */}
        <div className="mt-9 lg:mt-10 max-w-5xl">
          <div className="space-y-0 divide-y divide-[#0B1220]/[0.06]">
            {features.map((f, i) => (
              <div key={f.title} className="grid grid-cols-1 md:grid-cols-[64px_1fr_2fr] gap-2 md:gap-8 py-3.5 lg:py-4 items-baseline">
                <span className="text-[#B88A5A] text-sm font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="heading-serif text-[#0B1220] text-lg lg:text-xl leading-snug">
                  {f.title}
                </h3>
                <p className="text-[#0B1220]/60 text-base leading-relaxed md:text-right">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
