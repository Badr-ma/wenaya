/**
 * Clinic Team — multidisciplinary specialists for the Clinic/B2C page.
 * Editorial, photo-led: one large featured portrait opposite two specialist
 * rows. No specialist cards. CTA → /professional.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { getAllSpecialists } from "@/lib/specialistes";
import { h } from "@/lib/href";

const TEAM_SLUGS = ["nadine-kita", "dr-amal-benali", "khalid-ouazzani"];

export default function ClinicTeam(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const isEn = locale === "en";
  const all = getAllSpecialists();
  const team = TEAM_SLUGS
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const [featured, ...rest] = team;

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.team.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.team.heading1")}
              <br />
              {t("clinic.team.heading2")}
            </h2>
          </div>
          <p className="text-[#0B1220]/55 text-base leading-relaxed max-w-sm lg:pb-2">
            {t("clinic.team.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Featured portrait */}
          {featured ? (
            <div className="lg:col-span-7">
              <Link href={h(locale, "/professional")} className="group block">
                <div className="relative aspect-[4/5] sm:aspect-[7/6] w-full overflow-hidden rounded-t-[24px] bg-[#0B1220]/5">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 flex items-end justify-between gap-6">
                    <div>
                      <h3 className="heading-serif text-white text-2xl lg:text-3xl leading-tight">
                        {featured.name}
                      </h3>
                      <p className="mt-1.5 text-white/70 text-sm lg:text-base">
                        {isEn ? (featured.roleEn ?? featured.role) : featured.role}
                      </p>
                    </div>
                    <span className="text-white/40 font-mono text-sm hidden sm:inline">01</span>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          {/* Secondary rows */}
          <div className="lg:col-span-5 flex flex-col justify-end">
            <div className="space-y-0 divide-y divide-[#0B1220]/[0.06]">
              {rest.map((s, i) => (
                <Link
                  key={s.slug}
                  href={h(locale, "/professional")}
                  className="group flex items-center gap-5 py-5"
                >
                  <div className="relative h-20 w-16 md:h-24 md:w-20 overflow-hidden rounded-lg bg-[#0B1220]/5 shrink-0">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="80px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.18em] uppercase">
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <h3 className="heading-serif text-[#0B1220] text-xl lg:text-2xl leading-snug group-hover:text-[#B88A5A] transition-colors">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-[#0B1220]/45 text-sm">
                      {isEn ? (s.roleEn ?? s.role) : s.role}
                    </p>
                  </div>
                  <svg className="w-4 h-4 shrink-0 text-[#0B1220]/30 transition-transform group-hover:translate-x-1 group-hover:text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={h(locale, "/professional")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group"
              >
                <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
                  {t("clinic.team.cta")}
                </span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
