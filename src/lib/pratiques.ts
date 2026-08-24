/**
 * Pratiques Adapter — single entry point for normalized practice data.
 *
 * Currently sources from local i18n translations + a small canonical table.
 * When the backend is ready, replace the internals — callers remain unchanged.
 *
 * Public API:
 *   getAllPratiques(locale)        → Pratique[]
 *   getPratiqueBySlug(slug, loc)   → Pratique | undefined
 *   getAllPratiqueSlugs()          → string[]
 */
import fr from "@/i18n/fr";
import en from "@/i18n/en";

// ─── Domain Model ──────────────────────────────────────────────

export interface Pratique {
  /** Stable identifier — equals slug, used as backend primary key */
  id: string;
  /** URL-safe slug — stable across locales, backend-compatible */
  slug: string;
  /** Locale-resolved display title */
  title: string;
  /** Locale-resolved short description */
  description: string;
  /** Rich article body (HTML). Provided by backend. Undefined in local data. */
  details?: string;
  /** Hero / card image URL */
  image: string;
  /** Filter category key (manualTherapies, mentalHealth, nutrition, holisticWellness) */
  category: string;
}

// ─── Canonical data (non-translatable) ─────────────────────────
// Slugs are stable, lowercase, ASCII-only, backend-compatible.

interface CanonicalPratique {
  slug: string;
  image: string;
  category: string;
  /** Index in the i18n items array — used to resolve title/desc */
  i18nIndex: number;
}

const canonicalPratiques: CanonicalPratique[] = [
  { slug: "kinesitherapie",          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop", category: "manualTherapies",    i18nIndex: 0 },
  { slug: "osteopathie",             image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop", category: "manualTherapies",    i18nIndex: 1 },
  { slug: "psychologie-clinique",    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop", category: "mentalHealth",        i18nIndex: 2 },
  { slug: "neuropsychologie",        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80&auto=format&fit=crop", category: "mentalHealth",        i18nIndex: 3 },
  { slug: "nutrition",               image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&auto=format&fit=crop", category: "nutrition",           i18nIndex: 4 },
  { slug: "orthophonie",             image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80&auto=format&fit=crop", category: "holisticWellness",    i18nIndex: 5 },
  { slug: "naturopathie",            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80&auto=format&fit=crop", category: "holisticWellness",    i18nIndex: 6 },
  { slug: "psychomotricite",         image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&auto=format&fit=crop", category: "holisticWellness",    i18nIndex: 7 },
  { slug: "therapies-complementaires", image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80&auto=format&fit=crop", category: "holisticWellness",  i18nIndex: 8 },
];

// ─── Locale resolution ─────────────────────────────────────────

type LocaleItem = { title: string; desc: string };

function getLocaleItems(locale: string): LocaleItem[] {
  const bundle = locale === "en" ? en : fr;
  return ((bundle as Record<string, unknown>).pratiques as Record<string, unknown>).items as unknown as LocaleItem[];
}

// ─── Normalizer ────────────────────────────────────────────────

function normalize(canonical: CanonicalPratique, locale: string): Pratique {
  const items = getLocaleItems(locale);
  const item = items[canonical.i18nIndex];

  return {
    id: canonical.slug,
    slug: canonical.slug,
    title: item?.title ?? canonical.slug,
    description: item?.desc ?? "",
    image: canonical.image,
    category: canonical.category,
  };
}

// ─── Public API ────────────────────────────────────────────────

/** Get all practices normalized to the Pratique model */
export function getAllPratiques(locale: string = "fr"): Pratique[] {
  return canonicalPratiques.map((c) => normalize(c, locale));
}

/** Get a single practice by slug, or undefined */
export function getPratiqueBySlug(slug: string, locale: string = "fr"): Pratique | undefined {
  const canonical = canonicalPratiques.find((c) => c.slug === slug);
  if (!canonical) return undefined;
  return normalize(canonical, locale);
}

/** Get all practice slugs (for generateStaticParams) */
export function getAllPratiqueSlugs(): string[] {
  return canonicalPratiques.map((c) => c.slug);
}
