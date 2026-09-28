"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SpecialistHero from "./SpecialistHero";
import SpecialistListItem from "./SpecialistListItem";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import type { Specialist } from "@/lib/specialistes";
import type { SpecialtyOption } from "@/lib/specialist-filters";
import {
  buildSearchQuery,
  SPECIALIST_SEARCH_DEBOUNCE_MS,
} from "@/lib/specialist-filters";

interface SpecialistsPageProps {
  /** Already filtered server-side by `specialty` + `q`. */
  specialists: Specialist[];
  /** Unique specialty chips (first-appearance order over the full dataset). */
  specialtyOptions: SpecialtyOption[];
  /** Active specialty slug from the URL ("all" → "", never navigable alone). */
  specialty: string;
  /** Search term from the URL ("" when none). */
  q: string;
}

export default function SpecialistsPage({
  specialists,
  specialtyOptions,
  specialty,
  q,
}: SpecialistsPageProps) {
  const { t, locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(q);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const inputRef = useRef(searchInput);
  const debounceRef = useRef<number | null>(null);

  // Keep the input in sync with the URL (back/forward, chip clicks, reload).
  // Guarded compare keeps `react-hooks/set-state-in-effect` happy.
  useEffect(() => {
    if (inputRef.current !== q) {
      inputRef.current = q;
      setSearchInput(q);
    }
  }, [q]);

  // Clear any pending search rewrite on unmount.
  useEffect(
    () => () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    },
    [],
  );

  const activeSlug = hoveredSlug;
  const listEmpty = specialists.length === 0;

  const clearFilters = () => {
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    if (inputRef.current !== "") {
      inputRef.current = "";
      setSearchInput("");
    }
    router.push(h(locale, "/search/all"), { scroll: false });
  };

  const onSearchChange = (value: string) => {
    inputRef.current = value;
    setSearchInput(value);
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const qs = buildSearchQuery(inputRef.current);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, SPECIALIST_SEARCH_DEBOUNCE_MS);
  };

  const onSpecialtyClick = (slug: string) => {
    if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    // "Tous / All" is the explicit reset: clears specialty AND search.
    if (slug === "") {
      clearFilters();
      return;
    }
    const qs = buildSearchQuery(inputRef.current);
    const base = h(locale, `/search/${slug}`);
    router.push(qs ? `${base}?${qs}` : base, { scroll: false });
  };

  return (
    <section className="bg-[#F2EFE9] min-h-screen">
      <SpecialistHero
        searchQuery={searchInput}
        onSearchChange={onSearchChange}
        resultCount={specialists.length}
      />

      <div className="mx-auto max-w-7xl px-6 pb-1">
        <div
          className="flex gap-2 overflow-x-auto py-1 scrollbar-hide"
          role="group"
          aria-label={t("specialistes.list.specialty")}
        >
          <button
            onClick={() => onSpecialtyClick("")}
            aria-pressed={specialty === ""}
            className={`shrink-0 inline-flex items-center gap-1.5 h-8 whitespace-nowrap rounded-full px-3.5 text-[12px] font-medium transition-all border ${
              specialty === ""
                ? "bg-[#0B1220] text-white border-[#0B1220]"
                : "bg-[#FAF8F4] text-[#0B1220] border-[#0B1220]/[0.10] hover:border-[#0B1220]/25"
            }`}
          >
            <svg className="w-3 h-3 text-[#B88A5A]" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.04 4.5A6.25 6.25 0 0 0 2.83 6.5m0 0 1.9-1.9m-1.9 1.9 1.87 1.9M2.96 11.5A6.25 6.25 0 0 0 13.17 9.5m0 0-1.9-1.9m1.9 1.9-1.87 1.9" />
            </svg>
            {t("specialistes.list.allLabel")}
          </button>
          {specialtyOptions.map((opt) => (
            <button
              key={opt.slug}
              onClick={() => onSpecialtyClick(opt.slug)}
              aria-pressed={specialty === opt.slug}
              className={`shrink-0 inline-flex items-center gap-1.5 h-8 whitespace-nowrap rounded-full px-3.5 text-[12px] font-medium transition-all border ${
                specialty === opt.slug
                  ? "bg-[#0B1220] text-white border-[#0B1220]"
                  : "bg-[#FAF8F4] text-[#0B1220] border-[#0B1220]/[0.10] hover:border-[#0B1220]/25"
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full bg-[#B88A5A] transition-opacity ${
                  specialty === opt.slug ? "opacity-100" : "opacity-0"
                }`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-10 lg:mt-14 pb-16 sm:pb-20">
        <h2 className="heading-serif text-[#0B1220] text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.1] mb-5 sm:mb-6">
          {t("specialistes.list.findRightSpecialist")}
        </h2>

        {listEmpty ? (
          <div className="py-16 text-center">
            <p className="text-sm text-[#2B2F36]/60 mb-6 max-w-md mx-auto">
              {t("specialistes.list.noResults")}
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-full text-[12px] font-medium transition-all bg-[#0B1220] text-white hover:bg-[#B88A5A]"
            >
              {t("specialistes.list.resetFilters")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {specialists.map((specialist) => (
              <SpecialistListItem
                key={specialist.slug}
                specialist={specialist}
                isActive={activeSlug === specialist.slug}
                onHover={setHoveredSlug}
                onLeave={() => setHoveredSlug(null)}
                onClick={() => setHoveredSlug(null)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}