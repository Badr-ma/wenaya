"use client";

import { useState, useMemo, useEffect } from "react";
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

const goalOptions = ["longevity", "sleep", "stress", "recovery", "skin", "heart", "energy", "brain"];

const categoryOptions = ["supplements", "devices", "wearables", "skincare", "programs"];

const topicOptions = ["magnesium", "omega-3", "glucose", "collagen", "peptides", "sleep-tracking", "heart-rate", "meditation", "breathwork"];

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
  const { t, tRaw } = useLocale();
  const items = tRaw<ProductItem[]>("produits.items");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("bestRated");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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

  const filtered = useMemo(() => {
    const result = items.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedGoals.length > 0 && !item.goals.some((g) => selectedGoals.includes(g))) return false;
      if (selectedTopics.length > 0 && !item.topics.some((t) => selectedTopics.includes(t))) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!item.title.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "bestRated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "mostPopular":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [items, search, sort, selectedCategory, selectedGoals, selectedTopics]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("products-update", {
      detail: {
        search,
        count: filtered.length,
        selectedGoals,
        selectedCategory,
        selectedTopics,
        sort,
      },
    }));
  }, [search, filtered.length, selectedGoals, selectedCategory, selectedTopics, sort]);

  return (
    <section data-section-bg="light" className="bg-[#F2EFE9] pt-36 sm:pt-44 pb-20 sm:pb-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220]">
            {t("produits.hero.title1")}{" "}
            <span style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{t("produits.hero.title2")}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#2B2F36]/50 mt-3 max-w-md mx-auto leading-relaxed">
            {t("produits.hero.sub")}
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div data-filter-bar className="flex items-center gap-4 sm:gap-5 flex-wrap mb-10">
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
            className="w-[140px] sm:w-[160px] py-1 bg-transparent border-b border-[#0B1220]/[0.08] text-xs text-[#0B1220] placeholder-[#2B2F36]/20 outline-none focus:border-[#0B1220]/30 transition-colors"
          />

          <span className="text-xs text-[#2B2F36]/25 whitespace-nowrap">
            {filtered.length} {t("produits.count")}
          </span>
        </div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
          {filtered.map((product) => (
            <article key={product.slug}>
              <Link href={`/produits/${product.slug}`} className="block group">
                <div className="relative aspect-square mb-5 overflow-hidden bg-[#E8E2D9] rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </div>
                <h3 className="font-heading font-semibold text-base sm:text-lg text-[#0B1220] leading-snug transition-colors duration-300 group-hover:text-[#B88A5A]">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 mb-2.5">
                  <DotRating rating={product.rating} />
                  <span className="text-xs text-[#2B2F36]/40">
                    <span className="text-[#2B2F36]/60 font-medium">{product.rating}</span>
                    <span className="mx-1">·</span>
                    {product.reviews} {t("produits.reviews")}
                  </span>
                </div>
                <p className="text-sm text-[#2B2F36]/50 leading-relaxed line-clamp-2">
                  {product.desc}
                </p>
              </Link>
            </article>
          ))}
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <p className="text-center py-20 text-sm text-[#2B2F36]/25">
            No products match your criteria.
          </p>
        )}
      </div>
    </section>
  );
}
