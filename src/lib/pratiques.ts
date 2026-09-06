/**
 * Pratiques Adapter — single entry point for normalized practice data.
 *
 * Canonical practice data + the real French editorial article live in
 * `src/lib/practice-content.ts` (migrated from the live wenaya.com pages).
 * The adapter only resolves locale (fr real content, en demo translation) and exposes
 * a stable public API. Replace internals with a backend fetch later — callers
 * remain unchanged.
 *
 * Public API:
 *   getAllPratiques(locale)          → Pratique[]
 *   getPratiqueBySlug(slug, locale)  → Pratique | undefined
 *   getAllPratiqueSlugs()            → string[]
 *   getRelatedPratiques(slug, loc)   → Pratique[]
 *   getPracticesPage(query)          → PaginatedPratiques   (filter → paginate, local sync)
 *   getPracticesPageAsync(query)     → Promise<PaginatedPratiques>  (UI entry point)
 *
 * Pagination model mirrors the established `/api/produits` contract
 * (items / total / page / totalPages / hasMore / dataSource).
 *
 * Data source: the async accessor reads the real Wenaya listing endpoint
 * (see `./practices-api.ts` + `./practice-adapter.ts`);
 * `getPracticesPage` is the pure-local sync path used as fallback when the
 * backend is unreachable. List order for the default listing follows the
 * backend's priority ordering; canonical slugs are preserved via the id map.
 */
import { practicesContent, type PracticeSection } from "./practice-content";
import { EN_ARTICLE_DEMO } from "./en-translations";
import { fetchSpecialitiesPage, fetchAllSpecialities } from "./practices-api";
import { normalizeApiSpeciality } from "./practice-adapter";

// ─── Domain Model ──────────────────────────────────────────────

export interface Pratique {
  /** Stable identifier — equals slug, used as backend primary key */
  id: string;
  /** URL-safe slug — stable across locales, backend-compatible */
  slug: string;
  /** Locale-resolved display title */
  title: string;
  /** Locale-resolved short description (card + metadata lead) */
  description: string;
  /** Hero / card image URL (self-hosted under /public/pratiques) */
  image: string;
  /** Filter category key (manualTherapies, mentalHealth, nutrition, holisticWellness, soins) */
  category: string;
  /** Structured editorial article (FR real content). EN uses the TEMPORARY
   *  demo translation from `./en-translations.ts` — demo only, to be replaced
   *  by real EN editorial/API content. */
  article?: PracticeSection[];
  /** Dev-only source traceability — never rendered. */
  liveId?: number;
  sourceUrl?: string;
}

// ─── Canonical slugs (display order) ───────────────────────────
// Category-grouped so the listing reads naturally.

const SLUG_ORDER: string[] = [
  "kinesitherapie",
  "osteopathie",
  "massotherapie",
  "cupping-therapy-hijama",
  "psychologie",
  "neuropsychologie",
  "psychotherapie",
  "sexologie",
  "meditation",
  "sophrologie",
  "nutrition",
  "coaching-sportif",
  "orthophonie",
  "naturopathie",
  "psychomotricite",
  "art-martial-therapie",
  "sono-therapie",
  "yoga",
  "infirmerie",
];

// ─── Locale resolution ─────────────────────────────────────────

function normalize(slug: string, locale: string): Pratique {
  const content = practicesContent[slug];
  const isFr = locale !== "en";
  // FR → real French article. EN → TEMPORARY demo translation (en-translations.ts),
  // clearly marked as demo; later replaced by real EN editorial/API content.
  const article: PracticeSection[] | undefined = isFr ? content.articleFr : EN_ARTICLE_DEMO[slug];

  return {
    id: slug,
    slug,
    title: isFr ? content.titles.fr : content.titles.en,
    description: isFr ? content.summaries.fr : content.summaries.en,
    image: content.image,
    category: content.category,
    article,
    liveId: content.liveId,
    sourceUrl: content.sourceUrl,
  };
}

// ─── Public API ────────────────────────────────────────────────

/** Get all practices normalized to the Pratique model */
export function getAllPratiques(locale: string = "fr"): Pratique[] {
  return SLUG_ORDER.map((slug) => normalize(slug, locale));
}

/** Get a single practice by slug, or undefined */
export function getPratiqueBySlug(slug: string, locale: string = "fr"): Pratique | undefined {
  if (!practicesContent[slug]) return undefined;
  return normalize(slug, locale);
}

/** Filter bar keys — a filter key maps to exactly one practice `category` value (except "all"). */
export const PRACTICE_FILTER_KEYS = [
  "all",
  "manualTherapies",
  "mentalHealth",
  "nutrition",
  "holisticWellness",
  "soins",
] as const;

export type PracticeFilterKey = (typeof PRACTICE_FILTER_KEYS)[number];

/** filter key → allowed practice categories. Kept in one place so the grid and the
 *  pagination layer never diverge on the dataset the filter applies to. */
export const PRACTICE_CATEGORY_MAP: Record<string, string[]> = {
  all: [],
  manualTherapies: ["manualTherapies"],
  mentalHealth: ["mentalHealth"],
  nutrition: ["nutrition"],
  holisticWellness: ["holisticWellness"],
  soins: ["soins"],
};

/** Practices infinite-scroll batch size — 12 mirrors the /produits default limit. */
export const PRATIQUES_PAGE_SIZE = 12;

/** Paginated result contract (identical shape to ProduitsResult). */
export interface PaginatedPratiques {
  items: Pratique[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  /** Where the batch came from — "api" (live backend) or "local-fallback". */
  dataSource: PratiquesDataSource;
}

export type PratiquesDataSource = "api" | "local-fallback";

export interface PratiquesQuery {
  locale?: string;
  /** 1-based page number */
  page?: number;
  /** items per page (hard-capped at 50, like getProduits) */
  pageSize?: number;
  /** practice category filter — pass null / "all" for the full dataset */
  category?: string | null;
  /** free-text search over title + description */
  search?: string;
}

// ─── Pagination ────────────────────────────────────────────────
// Filtering ALWAYS runs against the full dataset BEFORE slicing, so the
// visible batch is a window over the total match set — never a filter
// applied after pagination.

export function getPracticesPage(query: PratiquesQuery = {}): PaginatedPratiques {
  const locale = query.locale ?? "fr";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, query.pageSize ?? PRATIQUES_PAGE_SIZE));
  const category = query.category && query.category !== "all" ? query.category : null;
  const search = (query.search ?? "").trim();

  let items = getAllPratiques(locale);

  if (category) {
    const allowed = PRACTICE_CATEGORY_MAP[category] ?? [];
    items = items.filter((p) => allowed.includes(p.category));
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    items: paged,
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
    dataSource: "local-fallback",
  };
}

/**
 * Async accessor consumed by the UI — the single seam between the component
 * tree and the data source.
 *
 *   DEFAULT queries → native backend pagination (page 1 → 12 items,
 *                     page 2 → 7 items). SSR pages and the infinite-scroll
 *                     proxy both land here.
 *   FILTERED/SHARED → fetch the FULL remote dataset, merge + normalize,
 *                     then filter/search and paginate locally — filters never
 *                     run over a single loaded page.
 *   FAILURE         → same query answered from local content
 *                     (`getPracticesPage`), flagged `local-fallback`.
 */
export async function getPracticesPageAsync(query: PratiquesQuery = {}): Promise<PaginatedPratiques> {
  const locale = query.locale ?? "fr";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, query.pageSize ?? PRATIQUES_PAGE_SIZE));
  const category = query.category && query.category !== "all" ? query.category : null;
  const search = (query.search ?? "").trim();

  try {
    if (category || search) {
      const all = await fetchAllSpecialities();
      let items = all
        .map((raw) => normalizeApiSpeciality(raw, locale))
        .filter((p): p is Pratique => p !== null);

      if (category) {
        const allowed = PRACTICE_CATEGORY_MAP[category] ?? [];
        items = items.filter((p) => allowed.includes(p.category));
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }

      const total = items.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;

      return {
        items: items.slice(start, start + pageSize),
        total,
        page,
        pageSize,
        totalPages,
        hasMore: page < totalPages,
        dataSource: "api",
      };
    }

    // Default listing — native backend pagination (12/page).
    const res = await fetchSpecialitiesPage(page);
    const items = res.data.data
      .map((raw) => normalizeApiSpeciality(raw, locale))
      .filter((p): p is Pratique => p !== null);

    // Guard against the backend re-sending a slug across pages.
    const seen = new Set<string>();
    const paged = items.filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    });

    return {
      items: paged,
      total: res.data.total,
      page: res.data.current_page,
      pageSize: res.data.per_page,
      totalPages: res.data.last_page,
      hasMore: res.data.current_page < res.data.last_page,
      dataSource: "api",
    };
  } catch (error) {
    console.warn("[pratiques] backend unavailable, serving local fallback:", error);
    return { ...getPracticesPage({ locale, page, pageSize, category, search }), dataSource: "local-fallback" };
  }
}

/** Get all practice slugs (for generateStaticParams) */
export function getAllPratiqueSlugs(): string[] {
  return SLUG_ORDER;
}

/**
 * Get related practices for a practice — same-category practices first (real
 * category grouping), then the remaining practices, capped at `count`.
 */
export function getRelatedPratiques(slug: string, locale: string = "fr", count = 6): Pratique[] {
  const all = getAllPratiques(locale);
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}