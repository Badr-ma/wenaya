/**
 * Clinic Pathologies — explorer for the Clinic/B2C page.
 * Editorial two-column: intro + full-width image row of care domains. No cards.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { getPathologies } from "@/lib/pathologies";
import { h } from "@/lib/href";

export default function ClinicPathologies(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const pathologies = getPathologies(locale as "fr" | "en");

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14 lg:mb-20">
          <div className="lg:col-span-5">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.pathologies.badge")}
            </span>
            <h2 className="heading-serif text-white leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.pathologies.heading1")}
              <br />
              {t("clinic.pathologies.heading2")}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:flex lg:items-end">
            <p className="text-white/45 text-base lg:text-lg leading-relaxed max-w-md">
              {t("clinic.pathologies.sub")}
            </p>
          </div>
        </div>

        {/* Image-led editorial rows — one alternating, no cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {pathologies.map((p, i) => (
            <Link key={p.slug} href={h(locale, "/pratiques")} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/[0.04]">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-5 text-white/50 font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 pr-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="heading-serif text-white text-lg lg:text-xl leading-snug group-hover:text-[#B88A5A] transition-colors">
                    {p.title}
                  </h3>
                  <svg className="w-4 h-4 shrink-0 text-[#B88A5A] mt-1.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <p className="mt-2.5 text-white/40 text-sm leading-relaxed line-clamp-3">
                  {p.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
