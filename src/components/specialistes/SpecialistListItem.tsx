"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import type { Specialist } from "@/lib/specialistes";

export default function SpecialistListItem({
  specialist,
  index,
  isActive,
  onHover,
  onLeave,
  onClick,
}: {
  specialist: Specialist;
  index: number;
  isActive: boolean;
  onHover: (slug: string | null) => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const { t, locale } = useLocale();

  return (
    <Link
      id={`specialist-${specialist.slug}`}
      href={h(locale, `/specialistes/${specialist.slug}`)}
      onClick={onClick}
      onMouseEnter={() => onHover(specialist.slug)}
      onMouseLeave={onLeave}
      className={`group flex items-stretch gap-5 sm:gap-8 py-5 sm:py-6 border-b border-[#0B1220]/[0.04] transition-all duration-300 ${
        isActive ? "bg-[#0B1220]/[0.02] -mx-4 sm:-mx-6 px-4 sm:px-6" : ""
      }`}
    >
      <span className="hidden sm:block text-[11px] font-mono text-[#2B2F36]/20 w-8 pt-1 shrink-0 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative w-24 sm:w-28 aspect-[3/4] shrink-0 overflow-hidden rounded-lg bg-[#E8E2D9]">
        <Image
          src={specialist.image}
          alt={specialist.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          sizes="112px"
        />
      </div>

      <div className="flex flex-col justify-between py-1 min-w-0 flex-1">
        <div>
          <p className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-1">
            {specialist.specialty}
          </p>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#0B1220] transition-colors group-hover:text-[#B88A5A] truncate">
            {specialist.name}
          </h3>
          <p className="text-sm text-[#2B2F36]/40 mt-0.5">{locale === "en" ? (specialist.roleEn ?? specialist.role) : specialist.role}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#2B2F36]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="text-[12px] text-[#2B2F36]/40">{specialist.location.city}</span>
          </div>
          <span className="text-[#2B2F36]/10">·</span>
          <span className="text-[12px] text-[#2B2F36]/40">{specialist.specialtyTags.slice(0, 2).join(", ")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 mt-2">
          <span className="text-[12px] text-[#2B2F36]/40">{specialist.languages.join(" · ")}</span>
        </div>

        <div className="flex items-center gap-1 text-[13px] font-medium text-[#B88A5A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
          {t("specialistes.list.viewProfile")}
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
