/**
 * Clinic Practical Info — location/contact/client info for the Clinic/B2C page.
 * Editorial: a large clinic environment photograph opposite the practical
 * details (address, hours, appointments, phone) with call + book CTAs. No cards.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { clinicPracticalInfo } from "@/lib/clinic-content";
import { h } from "@/lib/href";

export default function ClinicPractical(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const isEn = locale === "en";
  const info = clinicPracticalInfo(locale);

  const rows = [
    { label: t("clinic.practical.addressLabel"), value: info.address, sub: info.name },
    { label: t("clinic.practical.hoursLabel"), value: info.hours, sub: null as string | null },
    { label: t("clinic.practical.appointmentLabel"), value: info.appointment, sub: null as string | null },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
          {t("clinic.practical.badge")}
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Large clinic image */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-t-[24px] bg-[#0B1220]/5 min-h-[240px] sm:min-h-[320px] lg:h-full">
              <Image
                src="/pratiques/infirmerie.jpg"
                alt={isEn ? "Inside the Wenaya Clinic in Casablanca" : "L'intérieur de la Wenaya Clinic à Casablanca"}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/45 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 flex items-end justify-between gap-6">
                <div>
                  <h3 className="heading-serif text-white text-2xl lg:text-3xl leading-tight">
                    {info.name}
                  </h3>
                  <p className="mt-1.5 text-white/70 text-sm">
                    {info.address}
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-2 text-white/70 text-[11px] tracking-[0.18em] uppercase shrink-0">
                  <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {isEn ? "Casablanca" : "Casablanca"}
                </span>
              </div>
            </div>
          </div>

          {/* Practical details + CTAs */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.practical.heading1")}
              <br />
              {t("clinic.practical.heading2")}
            </h2>

            <div className="mt-8 space-y-0 divide-y divide-[#0B1220]/[0.08]">
              {rows.map((r) => (
                <div key={r.label} className="py-5">
                  <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.2em] uppercase block mb-2">
                    {r.label}
                  </span>
                  <p className="heading-serif text-[#0B1220] text-lg lg:text-xl leading-snug">
                    {r.value}
                  </p>
                  {r.sub ? (
                    <p className="mt-1.5 text-[#0B1220]/45 text-sm">{r.sub}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="tel:+212666124035"
                className="inline-flex items-center justify-center gap-2.5 h-13 px-8 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {t("clinic.practical.ctaCall")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={h(locale, "/professional")}
                className="inline-flex items-center justify-center gap-2 h-13 px-6 text-[#0B1220] text-sm font-medium border border-[#0B1220]/[0.16] transition-all duration-300 hover:border-[#0B1220]/[0.35]"
              >
                {isEn ? "Book" : "Réserver"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
