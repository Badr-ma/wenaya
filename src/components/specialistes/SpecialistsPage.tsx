"use client";

import { useState, useMemo } from "react";
import SpecialistHero from "./SpecialistHero";
import FeaturedSpecialists from "./FeaturedSpecialists";
import SpecialistListItem from "./SpecialistListItem";
import MapView from "./MapView";
import { useLocale } from "@/contexts/LanguageContext";
import type { Specialist } from "@/lib/specialistes";

export default function SpecialistsPage({ specialists }: { specialists: Specialist[] }) {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSplitView, setShowSplitView] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mapActiveSlug, setMapActiveSlug] = useState<string | null>(null);

  const activeSlug = hoveredSlug || mapActiveSlug;

  const featured = useMemo(
    () =>
      specialists
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [specialists]
  );

  const allSpecialties = useMemo(
    () => [...new Set(specialists.map((s) => s.specialty))],
    [specialists]
  );

  const filtered = useMemo(() => {
    let result = specialists;

    if (activeFilter !== "all") {
      result = result.filter((s) => s.specialty === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.specialty.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.specialtyTags.some((tag) => tag.toLowerCase().includes(q)) ||
          s.services.some((svc) => svc.title.toLowerCase().includes(q))
      );
    }

    return result;
  }, [specialists, activeFilter, searchQuery]);

  return (
    <section className="bg-[#F2EFE9] min-h-screen">
      <SpecialistHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filtered.length}
      />

      <FeaturedSpecialists specialists={featured} />

      <div className="mx-auto max-w-7xl px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-2xl text-[#0B1220]">
            {t("specialistes.list.findRightSpecialist")}
          </h2>
          <button
            onClick={() => setShowSplitView(!showSplitView)}
            className="shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all border border-[#0B1220]/[0.08] bg-white text-[#2B2F36]/60 hover:border-[#B88A5A]/40 hover:text-[#B88A5A]"
          >
            {showSplitView ? t("specialistes.list.hideMap") : t("specialistes.list.showMap")}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all border ${
              activeFilter === "all"
                ? "bg-[#0B1220] text-white border-[#0B1220]"
                : "bg-white text-[#2B2F36]/60 border-[#0B1220]/[0.08] hover:border-[#0B1220]/20"
            }`}
          >
            {t("specialistes.list.allLabel")}
          </button>
          {allSpecialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setActiveFilter(spec)}
              className={`px-4 py-2 rounded-full text-[12px] font-medium transition-all border ${
                activeFilter === spec
                  ? "bg-[#0B1220] text-white border-[#0B1220]"
                  : "bg-white text-[#2B2F36]/60 border-[#0B1220]/[0.08] hover:border-[#0B1220]/20"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 sm:pb-20">
        {showSplitView ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <p className="text-sm text-[#2B2F36]/30 py-12 text-center">
                  No specialists match your search.
                </p>
              ) : (
                filtered.map((specialist, i) => (
                  <SpecialistListItem
                    key={specialist.slug}
                    specialist={specialist}
                    index={i}
                    isActive={activeSlug === specialist.slug}
                    onHover={setHoveredSlug}
                    onLeave={() => setHoveredSlug(null)}
                    onClick={() => setHoveredSlug(null)}
                  />
                ))
              )}
            </div>
            <div className="lg:w-[420px] xl:w-[480px] shrink-0">
              <div className="lg:sticky lg:top-28 h-[500px] lg:h-[calc(100vh-160px)]">
                <MapView
                  specialists={filtered}
                  activeSpecialistSlug={activeSlug}
                  onPinClick={(slug) => {
                    setMapActiveSlug(slug === mapActiveSlug ? null : slug);
                    setHoveredSlug(null);
                    const el = document.getElementById(`specialist-${slug}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {filtered.length === 0 ? (
              <p className="text-sm text-[#2B2F36]/30 py-12 text-center">
                No specialists match your search.
              </p>
            ) : (
              filtered.map((specialist, i) => (
                <SpecialistListItem
                  key={specialist.slug}
                  specialist={specialist}
                  index={i}
                  isActive={activeSlug === specialist.slug}
                  onHover={setHoveredSlug}
                  onLeave={() => setHoveredSlug(null)}
                  onClick={() => setHoveredSlug(null)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
