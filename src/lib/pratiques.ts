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
 */
import { practicesContent, type PracticeSection } from "./practice-content";
import { EN_ARTICLE_DEMO } from "./en-translations";

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