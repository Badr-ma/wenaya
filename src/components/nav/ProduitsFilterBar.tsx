/**
 * Products Filter Bar — compact filter controls that replace the main nav
 * when the /produits page filter bar scrolls past the nav.
 * Shows search, category dropdown, goals, and result count.
 */
"use client";

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
  return (
    <div className="flex items-center flex-1 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className={`text-xs sm:text-sm whitespace-nowrap shrink-0 ${isDark ? "text-white/65" : "text-[#2B2F36]/65"}`}>
          {filterCount} brands
        </span>
        <div className={`hidden sm:block w-px h-4 ${isDark ? "bg-white/[0.1]" : "bg-[#0B1220]/[0.06]"}`} />
        <div className="hidden sm:flex items-center gap-2">
          <MinimalDropdown
            label="Goals"
            options={["longevity", "sleep", "stress", "recovery", "skin", "heart", "energy", "brain"]}
            selected={filterGoals}
            onChange={(v) => onFilterChange("selectedGoals", v)}
            multi
            dark={isDark}
          />
          <MinimalDropdown
            label={filterCategory ?? "Categories"}
            options={["supplements", "devices", "wearables", "skincare", "programs"]}
            selected={filterCategory ? [filterCategory] : []}
            onChange={(v) => onFilterChange("selectedCategory", v[0] ?? null)}
            multi={false}
            dark={isDark}
          />
          <MinimalDropdown
            label="Topics"
            options={["magnesium", "omega-3", "glucose", "collagen", "peptides", "sleep-tracking", "heart-rate", "meditation", "breathwork"]}
            selected={filterTopics}
            onChange={(v) => onFilterChange("selectedTopics", v)}
            multi
            dark={isDark}
          />
          <MinimalDropdown
            label={filterSort === "bestRated" ? "Sort by" : filterSort === "mostPopular" ? "Most popular" : "Newest"}
            options={["bestRated", "mostPopular", "newest"]}
            selected={[filterSort]}
            onChange={(v) => onFilterChange("sort", v[0] ?? "bestRated")}
            multi={false}
            dark={isDark}
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
          placeholder="Search brands"
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
