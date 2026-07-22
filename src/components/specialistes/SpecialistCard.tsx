"use client";

import Image from "next/image";
import Link from "next/link";

type SpecialistCardData = {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
};

export default function SpecialistCard({ specialist }: { specialist: SpecialistCardData }) {
  return (
    <Link href={`/specialistes/${specialist.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E2D9] mb-4">
        <Image
          src={specialist.image}
          alt={specialist.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <p className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-1.5">
        {specialist.specialty}
      </p>
      <h3 className="font-heading font-bold text-base text-[#0B1220]">
        {specialist.name}
      </h3>
      <p className="text-sm text-[#2B2F36]/40 mt-0.5 mb-2 line-clamp-2">
        {specialist.role}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-[2px]">
          {[1, 2, 3, 4, 5].map((d) => (
            <svg key={d} className="w-3 h-3" viewBox="0 0 10 10">
              <circle cx="5" cy="5" r="4" fill={specialist.rating >= d ? "#FEBB58" : "#D4C9B8"} />
            </svg>
          ))}
        </span>
        <span className="text-[12px] text-[#0B1220] font-medium">{specialist.rating}</span>
        <span className="text-[11px] text-[#2B2F36]/25">({specialist.reviewCount})</span>
      </div>
    </Link>
  );
}
