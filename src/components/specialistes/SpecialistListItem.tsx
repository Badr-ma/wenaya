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
  const { locale } = useLocale();

  return (
    <Link
      id={`specialist-${specialist.slug}`}
      href={h(locale, `/professional/${specialist.slug}`)}
      onClick={onClick}
      onMouseEnter={() => onHover(specialist.slug)}
      onMouseLeave={onLeave}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
        isActive
          ? "border-[#B88A5A]/50 shadow-[0_10px_30px_rgba(184,138,90,0.12)]"
          : "border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 hover:shadow-[0_10px_30px_rgba(11,18,32,0.06)]"
      }`}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#E8E2D9]">
        <Image
          src={specialist.image}
          alt={specialist.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute top-3 left-3 text-[10px] font-mono text-white/60 tabular-nums bg-[#0B1220]/55 px-1.5 py-0.5 rounded-[4px] backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col px-4 sm:px-5 py-3 sm:py-4 flex-1 min-w-0">
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#0B1220] transition-colors group-hover:text-[#B88A5A] truncate">
          {specialist.name}
        </h3>
        <p className="mt-1 text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em]">
          {specialist.specialty}
        </p>
        {specialist.specialtyTags.length > 0 && (
          <p className="mt-1 text-[12px] text-[#2B2F36]/50 truncate">
            {specialist.specialtyTags.slice(0, 2).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
