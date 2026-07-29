"use client";

import { useLocale } from "@/contexts/LanguageContext";

export default function SpecialistHero({
  searchQuery,
  onSearchChange,
  resultCount,
}: {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  resultCount: number;
}) {
  const { t } = useLocale();

  return (
    <section className="pt-28 sm:pt-36 pb-8 sm:pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">
          {t("specialistes.list.eyebrow")}
        </p>
        <h1 className="font-heading font-bold text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-[#0B1220] mb-5 max-w-4xl">
          {t("specialistes.list.heading")}
        </h1>
        <p className="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#2B2F36]/50 leading-[1.8] max-w-2xl mb-10">
          {t("specialistes.list.desc")}
        </p>

        <div className="relative max-w-xl">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2B2F36]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("specialistes.list.searchPlaceholder")}
            className="w-full pl-14 pr-6 py-4 rounded-xl border border-[#0B1220]/[0.08] bg-white text-[#0B1220] text-[0.95rem] placeholder:text-[#2B2F36]/25 focus:outline-none focus:border-[#B88A5A]/40 focus:ring-2 focus:ring-[#B88A5A]/10 transition-all"
          />
          {searchQuery && (
            <p className="text-xs text-[#2B2F36]/30 mt-2">
              {resultCount} {resultCount === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        <p className="text-[13px] text-[#2B2F36]/25 mt-3 ml-1">
          {t("specialistes.list.searchHint")}
        </p>
      </div>
    </section>
  );
}
