"use client";

import SpecialistCard from "./SpecialistCard";
import MapView from "./MapView";
import type { Specialist } from "@/lib/specialistes";
import { useLocale } from "@/contexts/LanguageContext";

export default function SpecialistsList({ specialists }: { specialists: Specialist[] }) {
  const { t } = useLocale();

  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14">
          <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">
            {t("specialistes.list.eyebrow")}
          </p>
          <h1 className="font-heading font-bold text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[#0B1220] mb-4">
            {t("specialistes.list.heading")}
          </h1>
          <p className="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#2B2F36]/50 leading-[1.8] max-w-lg">
            {t("specialistes.list.desc")}
          </p>
        </div>

        <div className="mb-16">
          <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">
            {t("specialistes.list.locationEyebrow")}
          </p>
          <p className="text-sm text-[#2B2F36]/40 mb-6">
            {t("specialistes.list.locationDesc")}
          </p>
          <MapView specialists={specialists} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {specialists.map((specialist) => (
            <SpecialistCard key={specialist.slug} specialist={specialist} />
          ))}
        </div>
      </div>
    </section>
  );
}
