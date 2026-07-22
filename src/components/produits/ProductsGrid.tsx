/**
 * Products Grid — filterable, searchable product listing for /produits page.
 * Features: multi-select goal/category/topic filters, search, sort, grid/list toggle,
 * product cards with images and badges. Syncs state to nav filter bar via custom DOM events.
 */
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { MinimalDropdown } from "./FilterDropdown";

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

function DotRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((dot) => {
        const remainder = rating - (dot - 1);
        let fill: "full" | "half" | "empty" = "empty";
        if (remainder >= 1) fill = "full";
        else if (remainder > 0) fill = "half";
        return (
          <svg key={dot} className="w-2.5 h-2.5" viewBox="0 0 10 10">
            {fill === "full" && <circle cx="5" cy="5" r="4" fill="#FEBB58" />}
            {fill === "half" && (
              <>
                <circle cx="5" cy="5" r="4" fill="#D4C9B8" />
                <clipPath id={`dr-${dot}-${rating}`}><rect x="0" y="0" width="5" height="10" /></clipPath>
                <circle cx="5" cy="5" r="4" fill="#FEBB58" clipPath={`url(#dr-${dot}-${rating})`} />
              </>
            )}
            {fill === "empty" && <circle cx="5" cy="5" r="4" fill="#D4C9B8" />}
          </svg>
        );
      })}
    </span>
  );
}

export default function ProductsGrid(): React.JSX.Element {
  const { t, locale } = useLocale();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
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
      const data = await fetchPage(page, filterKey);
      if (cancelled) return;
      if (data) {
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    })();
    return () => { cancelled = true; };
  }, [page, filterKey, fetchPage]);

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
        <div data-filter-bar className="mb-10">
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            <MinimalDropdown
              label="Goals"
              options={goalOptions}
              selected={selectedGoals}
              onChange={setSelectedGoals}
              multi
            />
            <MinimalDropdown
              label={selectedCategory ? t(`produits.filters.${selectedCategory}`) : "Categories"}
              options={categoryOptions}
              selected={selectedCategory ? [selectedCategory] : []}
              onChange={(v) => setSelectedCategory(v[0] || null)}
              multi={false}
            />
            <MinimalDropdown
              label="Topics"
              options={topicOptions}
              selected={selectedTopics}
              onChange={setSelectedTopics}
              multi
            />
            <MinimalDropdown
              label={sort === "bestRated" ? "Best rated" : sort === "mostPopular" ? "Most popular" : "Newest"}
              options={["bestRated", "mostPopular", "newest"]}
              selected={[sort]}
              onChange={(v) => setSort(v[0] || "bestRated")}
              multi={false}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("produits.search")}
              className="shrink-0 w-[140px] sm:w-[160px] py-1 bg-transparent border-b border-[#0B1220]/[0.08] text-xs text-[#0B1220] placeholder-[#2B2F36]/20 outline-none focus:border-[#0B1220]/30 transition-colors"
            />
          </div>
          <span className="text-xs text-[#2B2F36]/25 whitespace-nowrap mt-2 block">
            {total} {t("produits.count")}
          </span>
        </div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
          {items.map((product) => (
            <article key={product.slug} className="group relative">
              <Link href={`/produits/${product.slug}`} className="block">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#0B1220] mt-4 leading-snug">
                  {product.title}
                </h3>
                <div className="flex items-center gap-0.5 mt-1 mb-4">
                  <DotRating rating={product.rating} />
                  <span className="text-xs text-[#2B2F36]/50 ml-1">
                    <span className="font-medium">{product.rating}</span>
                    <span className="mx-1">·</span>
                    {product.reviews} {t("produits.reviews")}
                  </span>
                </div>
                <p className="text-sm text-[#2B2F36]/60 leading-relaxed line-clamp-3">
                  {product.desc}
                </p>
              </Link>
            </article>
          ))}
        </div>

        {/* ── Sentinel for infinite scroll ── */}
        {hasMore && (
          <div ref={sentinelRef} className="h-10 w-full" />
        )}

        {/* ── Loading indicator ── */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-[#B88A5A] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && items.length === 0 && (
          <p className="text-center py-20 text-sm text-[#2B2F36]/25">
            No products match your criteria.
          </p>
        )}
      </div>
    </section>
  );
}
