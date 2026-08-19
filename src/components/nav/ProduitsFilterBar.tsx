/**
 * Products Filter Bar — compact filter controls that replace the main nav
 * when the /produits page filter bar scrolls past the nav.
 * Shows search, category dropdown, goals, and result count.
 * All labels use the locale-aware `t` function.
 */
"use client";

import { useMemo } from "react";
import { MinimalDropdown } from "../produits/FilterDropdown";

interface Props {
  filterCount: number;
  filterSearch: string;
  filterGoals: string[];
  filterCategory: string | null;
  filterTopics: string[];
  filterSort: string;
  onFilterChange: (key: string, value: unknown) => void;
  isDark: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  t: (key: string) => string;
}

const goalOptions = ["longevity", "sleep", "stress", "recovery", "skin", "heart", "energy", "brain"];
const categoryOptions = ["supplements", "devices", "wearables", "skincare", "programs"];
const topicOptions = ["magnesium", "omega-3", "glucose", "collagen", "peptides", "sleep-tracking", "heart-rate", "meditation", "breathwork"];
const sortOptions = ["bestRated", "mostPopular", "newest"] as const;

export default function ProduitsFilterBar({
  filterCount,
  filterSearch,
  filterGoals,
  filterCategory,
  filterTopics,
  filterSort,
  onFilterChange,
  isDark,
  mobileOpen,
  onToggleMobile,
  t,
}: Props) {
  const goalLabels = useMemo(() => {
    const map: Record<string, string> = {};
    goalOptions.forEach((g) => { map[g] = t(`produits.filters.goalLabels.${g}`); });
    return map;
  }, [t]);

  const categoryLabels = useMemo(() => {
    const map: Record<string, string> = {};
    categoryOptions.forEach((c) => { map[c] = t(`produits.filters.${c}`); });
    return map;
  }, [t]);

  const topicLabels = useMemo(() => {
    const map: Record<string, string> = {};
    topicOptions.forEach((tp) => { map[tp] = t(`produits.filters.topicLabels.${tp}`); });
    return map;
  }, [t]);

  const sortLabels = useMemo(() => {
    const map: Record<string, string> = {};
    sortOptions.forEach((s) => { map[s] = t(`produits.sort.${s}`); });
    return map;
  }, [t]);

  return (
    <div className="flex items-center flex-1 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className={`text-xs sm:text-sm whitespace-nowrap shrink-0 ${isDark ? "text-white/65" : "text-[#2B2F36]/65"}`}>
          {filterCount} {t("produits.count")}
        </span>
        <div className={`hidden sm:block w-px h-4 ${isDark ? "bg-white/[0.1]" : "bg-[#0B1220]/[0.06]"}`} />
        <div className="hidden sm:flex items-center gap-2">
          <MinimalDropdown
            label={t("produits.filters.goals")}
            options={goalOptions}
            selected={filterGoals}
            onChange={(v) => onFilterChange("selectedGoals", v)}
            multi
            dark={isDark}
            labels={goalLabels}
          />
          <MinimalDropdown
            label={filterCategory ? t(`produits.filters.${filterCategory}`) : t("produits.filters.categories")}
            options={categoryOptions}
            selected={filterCategory ? [filterCategory] : []}
            onChange={(v) => onFilterChange("selectedCategory", v[0] ?? null)}
            multi={false}
            dark={isDark}
            labels={categoryLabels}
          />
          <MinimalDropdown
            label={t("produits.filters.topics")}
            options={topicOptions}
            selected={filterTopics}
            onChange={(v) => onFilterChange("selectedTopics", v)}
            multi
            dark={isDark}
            labels={topicLabels}
          />
          <MinimalDropdown
            label={t(`produits.sort.${filterSort}`)}
            options={sortOptions as unknown as string[]}
            selected={[filterSort]}
            onChange={(v) => onFilterChange("sort", v[0] ?? "bestRated")}
            multi={false}
            dark={isDark}
            labels={sortLabels}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <svg className={`w-4 h-4 ${isDark ? "text-white/55" : "text-[#2B2F36]/55"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={filterSearch}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder={t("produits.search")}
          className={`w-[110px] sm:w-[170px] py-1.5 bg-transparent border-b text-sm outline-none transition-colors ${
            isDark
              ? "text-white/85 placeholder-white/30 border-white/[0.2] focus:border-white/40"
              : "text-[#0B1220] placeholder-[#2B2F36]/35 border-[#0B1220]/[0.15] focus:border-[#0B1220]/40"
          }`}
        />
        <button
          onClick={onToggleMobile}
          className={`lg:hidden relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-colors ml-1 sm:ml-0 ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.06]"}`}
          aria-label={t("nav.menu")}
        >
          <span className={`block w-[17px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
        </button>
      </div>
    </div>
  );
}
