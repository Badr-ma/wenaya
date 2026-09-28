/**
 * Practice detail → Professionals listing internal link.
 *
 * Every practice page gains a compact crawlable link to the professionals
 * listing pre-filtered on this practice's specialty, e.g.
 * `/pratiques/coaching-sportif` → `/search/coaching-sportif`
 * (EN mirror under `/en/...`).
 *
 * Single slug system: the path segment IS the canonical practice slug
 * (`pratiques.ts` `SLUG_ORDER` and the verified specialty option set), so the
 * link always lands on the exact pre-filtered listing the filter chips
 * produce — nothing is invented.
 *
 * The link is only emitted when the practice's slug is present in the VERIFIED
 * specialty option set derived from the live professionals dataset (fallback
 * dataset on any failure). If the specialty currently has no professional, the
 * helper returns null and the page renders no (dead-end) link.
 */
import type { Specialist } from "./specialistes";
import { h, type HrefLocale } from "./href";
import { getSpecialtyOptions } from "./specialist-filters";

/**
 * Resolve the locale-aware professionals-listing href pre-filtered on the
 * practice's specialty, or null when that specialty is not in the verified
 * option set. Reuses the exact canonical slug of the listing filter.
 */
export function resolvePracticeProfessionalsHref(
  locale: HrefLocale,
  practiceSlug: string,
  professionals: Specialist[],
): string | null {
  const verified = getSpecialtyOptions(professionals).map((option) => option.slug);
  if (!verified.includes(practiceSlug)) return null;
  return h(locale, `/search/${practiceSlug}`);
}