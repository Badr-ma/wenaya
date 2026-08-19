/**
 * Products Grid — filterable, searchable product listing for /produits page.
 * Features: multi-select goal/category/topic filters, search, sort, active filter pills,
 * product cards via ProductCard. Syncs state to nav filter bar via custom DOM events.
 */
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { MinimalDropdown } from "./FilterDropdown";
import ProductCard from "./ProductCard";
import ActiveFilters from "./ActiveFilters";
import type { ActiveFilter } from "./ActiveFilters";
import EmptyState from "./EmptyState";
import SkeletonCard from "./SkeletonCard";
import type { Product } from "@/types/product";
import { h } from "@/lib/href";

type ProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  goals: string[];
  topics: string[];
};

type ApiResponse = {
  items: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

const goalOptions = ["longevity", "sleep", "stress", "recovery", "skin", "heart", "energy", "brain"];
const categoryOptions = ["supplements", "devices", "wearables", "skincare", "programs"];
const topicOptions = ["magnesium", "omega-3", "glucose", "collagen", "peptides", "sleep-tracking", "heart-rate", "meditation", "breathwork"];
const PAGE_LIMIT = 12;

/** Convert legacy ProductItem to shared Product type for ProductCard */
function toProduct(item: ProductItem): Product {
  return {
    id: item.slug,
    slug: item.slug,
    name: item.title,
    description: item.desc,
    category: item.category,
    goals: item.goals,
    topics: item.topics,
    images: [{ src: item.image, alt: item.title }],
    thumbnail: item.image,
    rating: item.rating,
    reviewCount: item.reviews,
  };
}

export default function ProductsGrid({ initial }: { initial?: ApiResponse }): React.JSX.Element {
  const { t, locale } = useLocale();
  const [items, setItems] = useState<ProductItem[]>(initial?.items ?? []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initial?.hasMore ?? true);
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("bestRated");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  const filterKey = useMemo(
    () => JSON.stringify({ search, sort, selectedCategory, selectedGoals, selectedTopics }),
    [search, sort, selectedCategory, selectedGoals, selectedTopics]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      switch (key) {
        case "search": setSearch(value); break;
        case "selectedGoals": setSelectedGoals(value); break;
        case "selectedCategory": setSelectedCategory(value); break;
        case "selectedTopics": setSelectedTopics(value); break;
        case "sort": setSort(value); break;
      }
    };
    window.addEventListener("products-filter-request", handler);
    return () => window.removeEventListener("products-filter-request", handler);
  }, []);

  const fetchPage = useCallback(async (pageNum: number, filters: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ locale, page: String(pageNum), limit: String(PAGE_LIMIT), sort });
      const f = JSON.parse(filters);
      if (f.search) params.set("search", f.search);
      if (f.selectedCategory) params.set("category", f.selectedCategory);
      if (f.selectedGoals?.length) params.set("goals", f.selectedGoals.join(","));
      if (f.selectedTopics?.length) params.set("topics", f.selectedTopics.join(","));

      const res = await fetch(`/api/produits?${params}`);
      const data: ApiResponse = await res.json();
      return data;
    } finally {
      setLoading(false);
    }
  }, [locale, sort]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    setTotal(0);
    initialLoadDone.current = false;
  }, [filterKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const isDefaultView =
        !search &&
        sort === "bestRated" &&
        !selectedCategory &&
        selectedGoals.length === 0 &&
        selectedTopics.length === 0;
      if (initial && page === 1 && isDefaultView) {
        initialLoadDone.current = true;
        return;
      }
      const data = await fetchPage(page, filterKey);
      if (cancelled) return;
      if (data) {
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    })();
    return () => { cancelled = true; };
  }, [page, filterKey, fetchPage, initial]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading || !initialLoadDone.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (items.length > 0 && !initialLoadDone.current) {
      initialLoadDone.current = true;
    }
  }, [items]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("products-update", {
        detail: { search, count: total, selectedGoals, selectedCategory, selectedTopics, sort },
      })
    );
  }, [search, total, selectedGoals, selectedCategory, selectedTopics, sort]);

  // ── Active filter pills ──
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const filters: ActiveFilter[] = [];
    if (search) filters.push({ type: "search", value: search, label: search });
    if (selectedCategory) filters.push({ type: "category", value: selectedCategory, label: t(`produits.filters.${selectedCategory}`) });
    selectedGoals.forEach((g) => filters.push({ type: "goal", value: g, label: t(`produits.filters.goalLabels.${g}`) }));
    selectedTopics.forEach((tp) => filters.push({ type: "topic", value: tp, label: t(`produits.filters.topicLabels.${tp}`) }));
    if (sort !== "bestRated") filters.push({ type: "sort", value: sort, label: t(`produits.sort.${sort}`) });
    return filters;
  }, [search, selectedCategory, selectedGoals, selectedTopics, sort, t]);

  const removeFilter = useCallback((filter: ActiveFilter) => {
    switch (filter.type) {
      case "search": setSearch(""); break;
      case "category": setSelectedCategory(null); break;
      case "goal": setSelectedGoals((prev) => prev.filter((g) => g !== filter.value)); break;
      case "topic": setSelectedTopics((prev) => prev.filter((tp) => tp !== filter.value)); break;
      case "sort": setSort("bestRated"); break;
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedGoals([]);
    setSelectedTopics([]);
    setSort("bestRated");
  }, []);

  const hasActiveFilters = activeFilters.length > 0;

  // ── Translated labels for dropdown items ──
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
    (["bestRated", "mostPopular", "newest"] as const).forEach((s) => { map[s] = t(`produits.sort.${s}`); });
    return map;
  }, [t]);

  return (
    <section data-section-bg="light" className="bg-[#F2EFE9] pt-36 sm:pt-44 pb-20 sm:pb-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220]">
            {t("produits.hero.title1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("produits.hero.title2")}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#2B2F36]/50 mt-3 max-w-md mx-auto leading-relaxed">
            {t("produits.hero.sub")}
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div data-filter-bar className="mb-6">
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            <MinimalDropdown
              label={t("produits.filters.goals")}
              options={goalOptions}
              selected={selectedGoals}
              onChange={setSelectedGoals}
              multi
              labels={goalLabels}
            />
            <MinimalDropdown
              label={selectedCategory ? t(`produits.filters.${selectedCategory}`) : t("produits.filters.categories")}
              options={categoryOptions}
              selected={selectedCategory ? [selectedCategory] : []}
              onChange={(v) => setSelectedCategory(v[0] || null)}
              multi={false}
              labels={categoryLabels}
            />
            <MinimalDropdown
              label={t("produits.filters.topics")}
              options={topicOptions}
              selected={selectedTopics}
              onChange={setSelectedTopics}
              multi
              labels={topicLabels}
            />
            <MinimalDropdown
              label={t(`produits.sort.${sort}`)}
              options={["bestRated", "mostPopular", "newest"]}
              selected={[sort]}
              onChange={(v) => setSort(v[0] || "bestRated")}
              multi={false}
              labels={sortLabels}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("produits.search")}
              className="shrink-0 w-[140px] sm:w-[160px] py-1 bg-transparent border-b border-[#0B1220]/[0.08] text-xs text-[#0B1220] placeholder-[#2B2F36]/20 outline-none focus:border-[#0B1220]/30 transition-colors"
            />
          </div>
        </div>

        {/* ── Active filter pills ── */}
        <ActiveFilters
          filters={activeFilters}
          onRemove={removeFilter}
          onClearAll={hasActiveFilters ? clearAllFilters : undefined}
          clearLabel={t("produits.filters.clearAll")}
        />

        {/* ── Result count ── */}
        <p className="text-xs text-[#2B2F36]/25 whitespace-nowrap mt-4 mb-10" aria-live="polite">
          {total} {t("produits.count")}
        </p>

        {/* ── Product grid ── */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
            {items.map((item) => (
              <ProductCard
                key={item.slug}
                product={toProduct(item)}
                locale={locale as "fr" | "en"}
              />
            ))}
          </div>
        ) : !loading ? (
          <EmptyState message={t("produits.noProducts")} />
        ) : null}

        {/* ── Loading skeleton ── */}
        {loading && items.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Sentinel for infinite scroll ── */}
        {hasMore && (
          <div ref={sentinelRef} className="h-10 w-full" />
        )}

        {/* ── Loading indicator (page 2+) ── */}
        {loading && items.length > 0 && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-[#B88A5A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}
