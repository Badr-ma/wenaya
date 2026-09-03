/**
 * Clinic Team — multidisciplinary specialists for the Clinic/B2C page.
 * Editorial photo-led rows linking to /specialistes. No cards.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";
import { getAllSpecialists } from "@/lib/specialistes";
import { h } from "@/lib/href";

const TEAM_SLUGS = [
  "nadine-kita",
  "dr-amal-benali",
  "khalid-ouazzani",
];

export default function ClinicTeam(): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionRef } = useIntersectionDeferred();
  const isEn = locale === "en";
  const all = getAllSpecialists();
  const team = TEAM_SLUGS.map((slug) => all.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.team.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              {t("clinic.team.heading1")}
              <br />
              {t("clinic.team.heading2")}
            </h2>
          </div>
          <p className="text-[#0B1220]/55 text-base leading-relaxed max-w-sm lg:pb-2">
            {t("clinic.team.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
          {team.map((s, i) => (
            <Link key={s.slug} href={h(locale, "/specialistes")} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-[#0B1220]/5">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="heading-serif text-[#0B1220] text-xl group-hover:text-[#159AA9] transition-colors">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-[#0B1220]/45 text-sm">{isEn ? (s.roleEn ?? s.role) : s.role}</p>
                </div>
                <span className="text-[#B88A5A] font-mono text-sm mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 lg:mt-16">
          <Link
            href={h(locale, "/specialistes")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group"
          >
            {t("clinic.team.cta")}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
