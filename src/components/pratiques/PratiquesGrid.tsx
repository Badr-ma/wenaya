/**
 * Pratiques Grid — filterable listing of all wellness practices (kinésithérapie,
 * ostéopathie, psychologie, nutrition, etc.) for the /pratiques page.
 *
 * Infinite scroll: the page SSR's the first batch (props) for SEO, then the grid
 * appends batches via `getPracticesPageAsync` as the sentinel approaches the
 * viewport. Filtering/search always run against the FULL dataset (in the
 * data-access layer) BEFORE pagination — never on the visible batch.
 *
 * Features: search, category filter tabs, IntersectionObserver sentinel
 * (rootMargin 400px), skeleton/spinner loading, "Load more" fallback button,
 * retry on failure, end-of-list state, and the existing GSAP entrance for the
 * initial batch (appended batches use a lightweight CSS fade-in).
 */
"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h, groupSessionsHref } from "@/lib/href";
import Link from "next/link";
import HiggsField from "@/components/HiggsField";
import {
  PRACTICE_FILTER_KEYS,
  PRACTICE_CATEGORY_MAP,
  PRATIQUES_PAGE_SIZE,
  getAllPratiqueSlugs,
  type Pratique,
  type PaginatedPratiques,
} from "@/lib/pratiques";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const bronzePalette: [number, number, number][] = [
  [184, 138, 90],
  [201, 155, 104],
  [212, 168, 112],
];

interface ProxyQuery {
  locale: string;
  page: number;
  pageSize: number;
  category: string | null;
  search: string;
}

/**
 * Load a practices batch through the `/api/pratiques` proxy (the browser never
 * calls the Wenaya backend directly). The proxy answers with the same paginated
 * contract the SSR seam produces — including the `X-Data-Source` header which
 * tells QA whether the batch came from the live API or the local fallback.
 */
async function fetchPracticesProxy(query: ProxyQuery): Promise<PaginatedPratiques> {
  const params = new URLSearchParams();
  params.set("locale", query.locale);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  if (query.category) params.set("category", query.category);
  if (query.search.trim()) params.set("search", query.search.trim());

  const res = await fetch(`/api/pratiques?${params.toString()}`);
  if (!res.ok) throw new Error(`pratiques proxy HTTP ${res.status}`);
  return (await res.json()) as PaginatedPratiques;
}

interface PratiquesGridProps {
  /** SSR'd first batch — keeps the initial HTML crawlable (SEO). */
  initialItems?: Pratique[];
  /** Total matching practices (full filtered dataset), from the same SSR query. */
  initialTotal?: number;
  /** Whether more pages exist beyond the SSR batch. */
  initialHasMore?: boolean;
  /** Size of the unfiltered dataset (used by the count line). */
  totalAll?: number;
}

export default function PratiquesGrid({
  initialItems = [],
  initialTotal,
  initialHasMore,
  totalAll,
}: PratiquesGridProps): React.JSX.Element {
  const { t, locale } = useLocale();
  const { elRef: sectionElRef, ready } = useIntersectionDeferred();

  // ─── Pagination state ────────────────────────────────────────
  const [items, setItems] = useState<Pratique[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore ?? initialItems.length > 0);
  const [total, setTotal] = useState(initialTotal ?? initialItems.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Guards against stale responses after a filter change (increments invalidate
  // any in-flight page fetch). With the future API this doubles as the request id.
  const requestSeqRef = useRef(0);
  const firstRunRef = useRef(true);

  // Ghost numbers come from the canonical crawlable order, stable across batches.
  const orderIndex = useMemo(() => {
    const m = new Map<string, number>();
    getAllPratiqueSlugs().forEach((slug, i) => m.set(slug, i));
    return m;
  }, []);

  const resolvedTotalAll = totalAll ?? getAllPratiqueSlugs().length;

  // Batch #1 of a freshly loaded set starts animating from index 0. Appended
  // batches start at the previous list length. Reset with each new dataset.
  const [batchStart, setBatchStart] = useState(initialItems.length);

  const filterKeys = PRACTICE_FILTER_KEYS;

  // ─── Filtering / counting ────────────────────────────────────
  // The count line reflects the FULL matching dataset (before pagination), so it
  // stays stable as the user scrolls — the visible window is a slice of `total`.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pratiques-update", {
      detail: {
        searchQuery,
        activeFilter,
      },
    }));
  }, [searchQuery, activeFilter]);

  // ─── Load next page ──────────────────────────────────────────
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    const seq = ++requestSeqRef.current;
    setIsLoadingMore(true);
    setLoadError(false);
    try {
      const res = await fetchPracticesProxy({
        locale,
        page: page + 1,
        pageSize: PRATIQUES_PAGE_SIZE,
        category: activeFilter === "all" ? null : activeFilter,
        search: searchQuery,
      });
      if (seq !== requestSeqRef.current) return; // superseded (filter changed)
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.slug));
        const fresh = res.items.filter((p) => !seen.has(p.slug));
        return fresh.length > 0 ? [...prev, ...fresh] : prev;
      });
      setPage(res.page);
      setHasMore(res.hasMore);
      setTotal(res.total);
    } catch {
      if (seq === requestSeqRef.current) setLoadError(true);
    } finally {
      if (seq === requestSeqRef.current) setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, locale, activeFilter, searchQuery]);

  /** Reset pagination and load the first batch of the current filter/search. */
  const resetAndLoadFirst = useCallback(async () => {
    requestSeqRef.current += 1; // invalidate any in-flight page
    const seq = requestSeqRef.current;
    setBatchStart(0);
    setItems([]);
    setPage(1);
    setTotal(0);
    setIsLoadingMore(true);
    setLoadError(false);
    try {
      const res = await fetchPracticesProxy({
        locale,
        page: 1,
        pageSize: PRATIQUES_PAGE_SIZE,
        category: activeFilter === "all" ? null : activeFilter,
        search: searchQuery,
      });
      if (seq !== requestSeqRef.current) return;
      setItems(res.items);
      setHasMore(res.hasMore);
      setTotal(res.total);
    } catch {
      if (seq === requestSeqRef.current) setLoadError(true);
    } finally {
      if (seq === requestSeqRef.current) setIsLoadingMore(false);
    }
  }, [locale, activeFilter, searchQuery]);

  // Reset on every filter/search change (not on mount — SSR state already valid).
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    resetAndLoadFirst();
  }, [activeFilter, searchQuery, resetAndLoadFirst]);

  // External filter bar (Nav) → keeps this grid in sync.
  useEffect(() => {
    const handler = (e: Event) => {
      const { key, value } = (e as CustomEvent).detail;
      if (key === "activeFilter") setActiveFilter(value);
      if (key === "searchQuery") setSearchQuery(value);
    };
    window.addEventListener("pratiques-filter-request", handler);
    return () => window.removeEventListener("pratiques-filter-request", handler);
  }, []);

  // ─── Infinite scroll sentinel ────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadNextPage();
      },
      // Pre-fetch well before the user actually reaches the bottom.
      { rootMargin: "400px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  // ─── Initial-batch GSAP entrance (existing behavior) ─────────
  useEffect(() => {
    if (!ready) return;
    const el = sectionElRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pratique-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
        }
      );
    }, el);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section ref={sectionElRef as React.RefObject<HTMLElement | null>} data-section-bg="light" className="relative bg-[#F2EFE9] py-16 sm:py-24 sm:py-28 px-6">
      <HiggsField parentRef={sectionElRef as React.RefObject<HTMLElement | null>} palette={bronzePalette} />
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
        <div data-filter-bar className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {filterKeys.map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`shrink-0 px-4 py-2 sm:px-5 sm:py-2 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-all duration-300 min-h-[44px] ${
                  activeFilter === key
                    ? "bg-[#0B1220] text-white shadow-sm"
                    : "bg-white text-[#2B2F36]/55 border border-[#2B2F36]/10 hover:border-[#B88A5A]/30 hover:text-[#B88A5A]"
                }`}
              >
                {t(`pratiques.filters.${key}`)}
              </button>
            ))}
            <div className="relative shrink-0 w-full sm:w-56">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2B2F36]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("pratiques.search")}
                className="w-full h-11 pl-9 pr-3.5 rounded-full border border-[#0B1220]/[0.08] bg-white/80 text-[12px] text-[#0B1220] placeholder:text-[#2B2F36]/25 outline-none transition-all duration-200 focus:border-[#B88A5A]/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)]"
              />
            </div>
          </div>
        </div>

        {/* Count — full matching dataset, stable while scrolling */}
        <p className="text-[#2B2F36]/35 text-[12.5px] text-center mb-8 sm:mb-10">
          {total} {t("pratiques.count")}
          {resolvedTotalAll > 0 && (
            <span className="text-[#2B2F36]/15"> / {resolvedTotalAll} total</span>
          )}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((pratique, idx) => {
            const categoryKey = filterKeys.find((fk) => (PRACTICE_CATEGORY_MAP[fk] || []).includes(pratique.category)) || "all";

            return (
              <Link
                key={pratique.slug}
                href={h(locale, `/pratiques/${pratique.slug}`)}
                className={`pratique-card group rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-4px_rgba(184,138,90,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2${
                  idx >= batchStart ? " pratique-card--entering" : ""
                }`}
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
                    src={pratique.image}
                    alt={pratique.title}
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
                    {String((orderIndex.get(pratique.slug) ?? 0) + 1).padStart(2, "0")}
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
                  <h2 className="font-heading font-bold text-[17px] sm:text-[19px] text-[#0B1220] leading-snug">
                    {pratique.title}
                  </h2>

                  <p className="text-[#2B2F36]/50 text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-3">
                    {pratique.description}
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
              </Link>
            );
          })}
        </div>

        {/* Infinite-scroll sentinel + status area */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />

        <div className="flex flex-col items-center justify-center gap-4 mt-10 min-h-[56px]">
          {/* Lightweight loading state — does not shift the already-loaded grid */}
          {isLoadingMore && (
            <span role="status" className="inline-flex items-center gap-2.5 text-[12.5px] text-[#2B2F36]/45">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-[#B88A5A]/25 border-t-[#B88A5A] animate-spin" />
              {t("pratiques.pagination.loading")}
            </span>
          )}

          {/* Error state — keep loaded practices, offer retry */}
          {loadError && !isLoadingMore && (
            <button
              onClick={() => (items.length === 0 ? resetAndLoadFirst() : loadNextPage())}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[12.5px] font-medium border border-[#B88A5A]/30 text-[#B88A5A] hover:bg-[#B88A5A]/10 transition-colors"
            >
              {t("pratiques.pagination.retry")}
            </button>
          )}

          {/* Accessibility fallback — same loadNextPage as the observer */}
          {hasMore && !isLoadingMore && !loadError && (
            <button
              onClick={() => loadNextPage()}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[12.5px] font-medium text-[#2B2F36]/55 border border-[#2B2F36]/15 hover:border-[#B88A5A]/30 hover:text-[#B88A5A] transition-colors"
            >
              {t("pratiques.pagination.loadMore")}
            </button>
          )}

          {/* End state */}
          {!hasMore && !isLoadingMore && items.length > 0 && total > 0 && (
            <p className="text-[12.5px] text-[#2B2F36]/35">
              {t("pratiques.pagination.end")}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href={h(locale, "/contact")}
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
          <div className="mt-6">
            <Link
              href={groupSessionsHref(locale)}
              className="inline-flex items-center gap-2 text-[13px] text-[#0B1220]/60 hover:text-[#B88A5A] transition-colors underline underline-offset-4"
            >
              {t("seanceDeGroupe.crossFromPratiques")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}