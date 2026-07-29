"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import type { Specialist } from "@/lib/specialistes";

export default function FeaturedSpecialists({ specialists }: { specialists: Specialist[] }) {
  const { t } = useLocale();
  if (!specialists.length) return null;

  const [first, second, third] = specialists;

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-2">
          {t("specialistes.list.featuredHeading")}
        </p>
        <p className="text-sm text-[#2B2F36]/40 mb-6">
          {t("specialistes.list.featuredDesc")}
        </p>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {first && (
            <Link
              href={`/specialistes/${first.slug}`}
              className="group relative w-full md:w-[58%] aspect-[4/5] md:aspect-auto md:h-[520px] overflow-hidden rounded-xl bg-[#E8E2D9]"
            >
              <Image
                src={first.image}
                alt={first.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-2">
                  {first.specialty}
                </p>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  {first.name}
                </h3>
                <p className="text-sm text-white/60 mt-1">{first.role}</p>
              </div>
            </Link>
          )}

          <div className="flex flex-row md:flex-col w-full md:w-[42%] gap-4 sm:gap-6">
            {second && (
              <Link
                href={`/specialistes/${second.slug}`}
                className="group relative flex-1 aspect-[4/3] md:aspect-auto md:min-h-[200px] overflow-hidden rounded-xl bg-[#E8E2D9]"
              >
                <Image
                  src={second.image}
                  alt={second.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 50vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-1">
                    {second.specialty}
                  </p>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                    {second.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">{second.role}</p>
                </div>
              </Link>
            )}
            {third && (
              <Link
                href={`/specialistes/${third.slug}`}
                className="group relative flex-1 aspect-[4/3] md:aspect-auto md:min-h-[200px] overflow-hidden rounded-xl bg-[#E8E2D9]"
              >
                <Image
                  src={third.image}
                  alt={third.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 50vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-1">
                    {third.specialty}
                  </p>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                    {third.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">{third.role}</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-[13px] text-[#2B2F36]/30 font-mono uppercase tracking-[0.15em]">
          — {t("specialistes.list.viewAllSpecialists")} —
        </p>
      </div>
    </section>
  );
}
