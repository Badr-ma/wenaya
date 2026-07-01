"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import Link from "next/link";
import HiggsField from "@/components/HiggsField";

gsap.registerPlugin(ScrollTrigger);

const practiceImages: string[] = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80&auto=format&fit=crop",
];

const categoryMap: Record<string, number[]> = {
  all: [],
  manualTherapies: [0, 1],
  mentalHealth: [2, 3],
  nutrition: [4],
  holisticWellness: [5, 6, 7, 8],
};

const bronzePalette: [number, number, number][] = [
  [184, 138, 90],
  [201, 155, 104],
  [212, 168, 112],
];

export default function PratiquesGrid(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const items = tRaw<{ title: string; desc: string }[]>("pratiques.items");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filterKeys = ["all", "manualTherapies", "mentalHealth", "nutrition", "holisticWellness"] as const;

  const displayedItems = useMemo(() => {
    const categoryFiltered = activeFilter === "all"
      ? items
      : (categoryMap[activeFilter] || []).map((i) => items[i]).filter(Boolean);

    if (!searchQuery.trim()) return categoryFiltered;

    const q = searchQuery.trim().toLowerCase();
    return categoryFiltered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
  }, [activeFilter, searchQuery, items]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pratique-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [activeFilter, searchQuery]);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-16 sm:py-24 sm:py-28 px-6">
      <HiggsField parentRef={sectionRef as React.RefObject<HTMLElement | null>} palette={bronzePalette} />
      <div className="relative z-[2] max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">{t("pratiques.hero.title1")} {t("pratiques.hero.title2")}</span>
          </div>
          <h1 className="heading-serif text-[clamp(2.2rem,4vw,3.8rem)] text-[#0B1220] leading-[1.08] tracking-[-0.01em]">
            {t("pratiques.hero.title1")}{" "}
            <span style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t("pratiques.hero.title2")}
            </span>
          </h1>
          <p className="text-[#2B2F36]/50 text-[14px] sm:text-[15px] max-w-lg mx-auto mt-4 leading-relaxed">
            {t("pratiques.hero.sub")}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 sm:mb-14">
          {filterKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-all duration-300 ${
                activeFilter === key
                  ? "bg-[#0B1220] text-white shadow-sm"
                  : "bg-white text-[#2B2F36]/55 border border-[#2B2F36]/10 hover:border-[#B88A5A]/30 hover:text-[#B88A5A]"
              }`}
            >
              {t(`pratiques.filters.${key}`)}
            </button>
          ))}
          <div className="relative w-48 sm:w-56">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2B2F36]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("pratiques.search")}
              className="w-full h-9 pl-9 pr-3.5 rounded-full border border-[#0B1220]/[0.08] bg-white/80 text-[12px] text-[#0B1220] placeholder:text-[#2B2F36]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
            />
          </div>
        </div>

        {/* Count */}
        <p className="text-[#2B2F36]/35 text-[12.5px] text-center mb-8 sm:mb-10">
          {displayedItems.length} {t("pratiques.count")}
          {items.length > 0 && (
            <span className="text-[#2B2F36]/15"> / {items.length} total</span>
          )}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedItems.map((item) => {
            const originalIndex = items.indexOf(item);
            const imgSrc = practiceImages[originalIndex] ?? practiceImages[0];
            const categoryKey = filterKeys.find((fk) => (categoryMap[fk] || []).includes(originalIndex)) || "all";

            return (
              <div
                key={item.title}
                className="pratique-card group rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-4px_rgba(184,138,90,0.12)]"
                style={{
                  background: "#E8E2D9",
                  border: "1px solid rgba(11,18,32,0.08)",
                  boxShadow: "0 2px 24px rgba(11,18,32,0.06)",
                }}
              >
                {/* Image area */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/50 via-[#0B1220]/5 to-transparent z-[1]" />

                  <Image
                    src={imgSrc}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Ghost number */}
                  <span
                    className="absolute top-2 right-3 sm:top-3 sm:right-4 font-heading font-bold leading-none z-[2] pointer-events-none select-none"
                    style={{
                      fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                      color: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {String(originalIndex + 1).padStart(2, "0")}
                  </span>

                  {/* Category badge */}
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[2]">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#B88A5A]/20 text-[#B88A5A] backdrop-blur-[2px] border border-[#B88A5A]/15">
                      {categoryKey !== "all" ? t(`pratiques.filters.${categoryKey}`) : ""}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2.5 px-5 py-4 sm:px-6 sm:py-5 flex-1">
                  <h3 className="font-heading font-bold text-[17px] sm:text-[19px] text-[#0B1220] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[#2B2F36]/50 text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Accent bar */}
                <div
                  className="mx-5 sm:mx-6 mb-4 sm:mb-5 h-[2px] rounded-full transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(184,138,90,0.3), rgba(184,138,90,0.5), rgba(184,138,90,0.3), transparent)",
                    opacity: 0.4,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 h-11 px-7 rounded-xl text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.35)",
            }}
          >
            {t("pratiques.cta")}
            <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
