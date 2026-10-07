/**
 * Specialist listing filter helpers (shared by the FR + EN listing pages and
 * the client `SpecialistsPage`).
 *
 * URL contract:
 *   /search/all                    (no specialty selected)
 *   /search/<canonical-slug>       (pre-filtered on a specialty)
 *   /search/<...>?q=<term>         (specialty + optional search term)
 *   /en/search/all, /en/search/<slug>  (EN mirrors — `en` prefix)
 *
 * The specialty is encoded in the PATH (not a query), so cleaned URLs stay
 * canonical. `<id>`-style slugs: `all` = unfiltered, otherwise the
 * accent-stripped slug of a practice label (e.g. "Ostéopathie" →
 * "osteopathie"). Canonical practice slugs live in `pratiques.ts`
 * `SLUG_ORDER`. The search term stays a `q=` query (never canonical).
 * Filtering is server-side over the fetched dataset; the URL is the single
 * source of truth (back/forward, reload and direct-paste all work).
 *
 * The backend payload carries no specialty id/slug (only `speciality_names[]`
 * French display labels), so membership is derived deterministically: each
 * display label maps to a stable slug, and a professional matches a requested
 * specialty when ANY of their specialty labels maps to that slug. Legacy
 * local pros (fallback dataset) use their single `specialty` label.
 */

import type { Specialist } from "./specialistes";

/** Stable label → slug overrides. Backend labels whose plain accent-stripped
 *  slug would NOT equal the canonical practice slug in `SLUG_ORDER`. */
const SPECIALTY_SLUG_OVERRIDES: Record<string, string> = {
  // Backend typo for "Neuropsychologie" (p/s transposed).
  "Neuropscyhologie": "neuropsychologie",
};

/**
 * Deterministic slug for a specialty display label (e.g. "Kinésithérapie" →
 * "kinesitherapie"; "Coaching Sportif" → "coaching-sportif"). Strips accents,
 * lowercases, then maps every non-alphanumeric run to a single dash.
 */
export function specialtyDisplayToSlug(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "";
  if (SPECIALTY_SLUG_OVERRIDES[trimmed]) return SPECIALTY_SLUG_OVERRIDES[trimmed];
  const slug = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

/** Accent-insensitive, case-insensitive, whitespace-trimmed fold for a string. */
export function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Every canonical slug a professional belongs to (any specialty label). */
export function getProfessionalSpecialtySlugs(p: Specialist): string[] {
  if (p.specialtySlugs && p.specialtySlugs.length > 0) return p.specialtySlugs;
  const slug = specialtyDisplayToSlug(p.specialty);
  return slug ? [slug] : [];
}

/** True when the professional belongs to the requested specialty slug. */
export function matchesSpecialty(p: Specialist, specialtySlug: string): boolean {
  if (!specialtySlug) return true;
  return getProfessionalSpecialtySlugs(p).includes(specialtySlug);
}

/**
 * True when every query token (accent-folded) appears somewhere in the
 * professional's name, role (FR + EN), specialty, specialty tags, service
 * titles or city. All tokens must match (AND semantics inside the query too).
 */
export function matchesSearch(p: Specialist, q: string): boolean {
  const tokens = fold(q).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = fold(
    [
      p.name,
      p.role,
      p.roleEn ?? "",
      p.specialty,
      ...p.specialtyTags,
      ...p.services.map((s) => s.title),
      p.location.city,
    ].join(" "),
  );

  return tokens.every((token) => haystack.includes(token));
}

export interface SpecialistFilter {
  specialty?: string;
  q?: string;
}

/**
 * Apply the URL filters server-side. Specialty AND search (never OR): a
 * professional must belong to the specialty (when one is selected) AND match
 * the query (when one is present).
 */
export function filterSpecialists(
  input: Specialist[],
  { specialty, q }: SpecialistFilter,
): Specialist[] {
  if (!specialty && !q?.trim()) return input;
  let result = input;
  if (specialty) result = result.filter((p) => matchesSpecialty(p, specialty));
  if (q?.trim()) result = result.filter((p) => matchesSearch(p, q));
  return result;
}

export interface SpecialtyOption {
  slug: string;
  label: string;
}

/**
 * Unique specialty options in first-appearance order over the dataset, derived
 * ONLY from verified specialty labels (API pros: every `speciality_names`
 * entry; legacy pros: their single `specialty` label). Never synthesized.
 */
export function getSpecialtyOptions(specialists: Specialist[]): SpecialtyOption[] {
  const seen = new Set<string>();
  const options: SpecialtyOption[] = [];

  const addLabel = (label: string) => {
    const slug = specialtyDisplayToSlug(label);
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    options.push({ slug, label });
  };

  for (const p of specialists) {
    if (p.specialtySlugs && p.specialtySlugs.length > 0) {
      p.specialtyTags.forEach(addLabel);
    } else {
      addLabel(p.specialty);
    }
  }

  return options;
}

/** Build the `?q=<term>` query string for the listing URL (empty when blank).
 *  The specialty lives in the URL PATH, so only the search term is built here. */
export function buildSearchQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return "";
  return new URLSearchParams({ q: trimmed }).toString();
}

/** Search-as-you-type debounce before pushing a history entry. */
export const SPECIALIST_SEARCH_DEBOUNCE_MS = 350;

/**
 * Whether a `/search/<slug>` URL must 404.
 *
 * `all` is always valid. A specialty slug is valid when it exists in the
 * dataset. An EMPTY dataset is NOT proof of a bad slug — `getLiveSpecialists`
 * has no demo fallback and returns `[]` when the API is unreachable, so 404ing
 * on an empty set would take the entire specialty family offline during an API
 * outage. Return false in that case and let the page render its empty state.
 */
export function isUnknownSpecialistSlug(
  all: Specialist[],
  slug: string,
): boolean {
  if (slug === "all") return false;
  if (all.length === 0) return false;
  return !getSpecialtyOptions(all).some((o) => o.slug === slug);
}