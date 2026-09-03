/**
 * Pratiques Filter Bar — compact filter controls that replace the main nav
 * when the /pratiques page filter bar scrolls past the nav.
 * Shows search input and active filter indicator.
 */
"use client";

interface Props {
  pratiquesSearch: string;
  pratiquesActiveFilter: string;
  onFilterChange: (key: string, value: string) => void;
  isDark: boolean;
  t: (key: string) => string;
}

export default function PratiquesFilterBar({
  pratiquesSearch,
  pratiquesActiveFilter,
  onFilterChange,
  isDark,
  t,
}: Props) {
  return (
    <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-0">
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
        {(["all", "manualTherapies", "mentalHealth", "nutrition", "holisticWellness", "soins"] as const).map((key) => (
          <button
            key={key}
            onClick={() => onFilterChange("activeFilter", key)}
            className={`shrink-0 text-xs sm:text-sm tracking-wider transition-all duration-200 rounded-full px-2.5 sm:px-3 py-1.5 border ${
              isDark
                ? pratiquesActiveFilter === key
                  ? "border-white text-white font-semibold"
                  : "border-white/60 text-white/70 hover:border-white hover:text-white"
                : pratiquesActiveFilter === key
                  ? "border-[#0B1220] text-[#0B1220] font-semibold"
                  : "border-[#0B1220]/60 text-[#2B2F36]/70 hover:border-[#0B1220] hover:text-[#0B1220]"
            }`}
          >
            {t(`pratiques.filters.${key}`)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-auto hidden sm:flex">
        <svg className={`w-4 h-4 ${isDark ? "text-white/55" : "text-[#2B2F36]/55"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={pratiquesSearch}
          onChange={(e) => onFilterChange("searchQuery", e.target.value)}
          placeholder="Search practices…"
          className={`w-[130px] sm:w-[170px] py-1.5 bg-transparent border-b text-sm outline-none transition-colors ${
            isDark
              ? "text-white/85 placeholder-white/30 border-white/[0.2] focus:border-white/40"
              : "text-[#0B1220] placeholder-[#2B2F36]/35 border-[#0B1220]/[0.15] focus:border-[#0B1220]/40"
          }`}
        />
      </div>
    </div>
  );
}
