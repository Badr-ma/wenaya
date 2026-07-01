"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";

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
    <span className="inline-flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((dot) => {
        const remainder = rating - (dot - 1);
        let fill: "full" | "half" | "empty" = "empty";
        if (remainder >= 1) fill = "full";
        else if (remainder > 0) fill = "half";
        return (
          <svg key={dot} className="w-3.5 h-3.5" viewBox="0 0 10 10">
            {fill === "full" && <circle cx="5" cy="5" r="4.5" fill="#FEBB58" />}
            {fill === "half" && (
              <>
                <circle cx="5" cy="5" r="4.5" fill="#D4C9B8" />
                <clipPath id={`hc-${dot}-${rating}`}><rect x="0" y="0" width="5" height="10" /></clipPath>
                <circle cx="5" cy="5" r="4.5" fill="#FEBB58" clipPath={`url(#hc-${dot}-${rating})`} />
              </>
            )}
            {fill === "empty" && <circle cx="5" cy="5" r="4.5" fill="#D4C9B8" />}
          </svg>
        );
      })}
    </span>
  );
}

function DropdownMenu({
  label,
  options,
  selected,
  onChange,
  multi,
  getCount,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  multi: boolean;
  getCount: (val: string) => number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (val: string) => {
    if (multi) {
      onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
    } else {
      onChange(selected.includes(val) ? [] : [val]);
    }
  };

  return (
    <div className="relative shrink-0 font-mono text-sm" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 border rounded-full py-2 px-4 leading-tight transition-colors ${
          selected.length > 0
            ? "border-[#0B1220] text-[#0B1220]"
            : "border-[#0B1220]/10 text-[#2B2F36]/50 hover:text-[#0B1220] hover:border-[#0B1220]/30"
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="opacity-40">{selected.length}</span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 16l-6-6h12z" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-[#0B1220]/10 rounded-xl shadow-lg py-1 min-w-[160px] right-0 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                  active ? "text-[#0B1220] font-semibold" : "text-[#2B2F36]/60 hover:text-[#0B1220]"
                }`}
              >
                {multi && (
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                    active ? "bg-[#0B1220] border-[#0B1220]" : "border-[#0B1220]/20"
                  }`}>
                    {active && (
                      <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5 9-9" />
                      </svg>
                    )}
                  </span>
                )}
                <span className="flex-1">{opt}</span>
                <span className="opacity-30">{getCount(opt)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsGrid(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const items = tRaw<ProductItem[]>("produits.items");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("bestRated");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const result = items.filter((item) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(item.category)) return false;
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
  }, [items, search, sort, selectedGoals, selectedCategories, selectedTopics]);

  const countBy = (key: string, field: "category" | "goals" | "topics") => {
    if (field === "category") return items.filter((i) => i.category === key).length;
    return items.filter((i) => i[field].includes(key)).length;
  };

  const clearFilters = () => {
    setSelectedGoals([]);
    setSelectedCategories([]);
    setSelectedTopics([]);
    setSearch("");
  };

  const hasFilters = selectedGoals.length > 0 || selectedCategories.length > 0 || selectedTopics.length > 0 || search !== "";

  return (
    <section className="bg-[#F2EFE9] pt-36 sm:pt-44 pb-20 sm:pb-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#FEBB58]" />
            <span className="text-[#FEBB58] text-[11px] font-semibold tracking-[0.22em] uppercase">
              Wenaya
            </span>
          </div>
          <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220]">
            {t("produits.hero.title1")}{" "}
            <span style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t("produits.hero.title2")}
            </span>
          </h1>
          <p className="text-[#2B2F36]/50 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            {t("produits.hero.sub")}
          </p>
        </div>

        {/* ── Dropdowns · Search · Count (single row) ── */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu
              label="Goals"
              options={goalOptions}
              selected={selectedGoals}
              onChange={setSelectedGoals}
              multi
              getCount={(v) => countBy(v, "goals")}
            />
            <DropdownMenu
              label="Categories"
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              multi
              getCount={(v) => countBy(v, "category")}
            />
            <DropdownMenu
              label="Topics"
              options={topicOptions}
              selected={selectedTopics}
              onChange={setSelectedTopics}
              multi
              getCount={(v) => countBy(v, "topics")}
            />
            <DropdownMenu
              label="Sort by"
              options={["bestRated", "mostPopular", "newest"]}
              selected={[sort]}
              onChange={(v) => setSort(v[0] || "bestRated")}
              multi={false}
              getCount={() => 0}
            />

            <span className="shrink-0 text-sm text-[#2B2F36]/40 font-mono">
              {filtered.length}
            </span>

            <div className="relative shrink-0 ml-auto">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2B2F36]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("produits.search")}
                className="w-[160px] sm:w-[220px] pl-10 pr-4 py-2 bg-transparent border border-[#0B1220]/10 rounded-full text-sm font-mono text-[#0B1220] placeholder-[#2B2F36]/30 outline-none transition-colors hover:border-[#0B1220]/30 focus:border-[#0B1220]"
              />
            </div>
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {selectedGoals.map((g) => (
              <span key={g} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[10px] font-mono text-[#0B1220]">
                {g}
                <button onClick={() => setSelectedGoals(selectedGoals.filter((v) => v !== g))} className="hover:opacity-60">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </span>
            ))}
            {selectedCategories.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[10px] font-mono text-[#0B1220]">
                {c}
                <button onClick={() => setSelectedCategories(selectedCategories.filter((v) => v !== c))} className="hover:opacity-60">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </span>
            ))}
            {selectedTopics.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[10px] font-mono text-[#0B1220]">
                {t}
                <button onClick={() => setSelectedTopics(selectedTopics.filter((v) => v !== t))} className="hover:opacity-60">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </span>
            ))}
            <button onClick={clearFilters} className="text-[10px] font-mono text-[#2B2F36]/30 hover:text-[#2B2F36]/50 underline underline-offset-2">
              Clear all
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <Link
              key={product.slug}
              href={`/produits/${product.slug}`}
              className="group bg-[#E8E2D9] rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Ghost number */}
                <span
                  className="absolute -bottom-4 -right-4 font-heading font-black leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "8rem",
                    color: "rgba(255,255,255,0.08)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[10px] font-semibold tracking-wider uppercase text-[#0B1220]">
                  {t(`produits.filters.${product.category}`)}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className="font-heading font-extrabold text-lg text-[#0B1220] leading-snug">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <DotRating rating={product.rating} />
                  <span className="text-xs font-semibold text-[#0B1220]">{product.rating}</span>
                  <span className="text-xs text-[#2B2F36]/30">•</span>
                  <span className="text-xs text-[#2B2F36]/40">
                    {product.reviews} {t("produits.reviews")}
                  </span>
                </div>

                <p className="text-sm text-[#2B2F36]/60 leading-relaxed flex-1">
                  {product.desc}
                </p>

                {/* Bronze accent bar + CTA */}
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <div className="w-8 h-px bg-[#B88A5A]" />
                  <button className="text-xs font-semibold text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors">
                    {t("produits.cta")} →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#2B2F36]/30 text-sm">No products match your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
