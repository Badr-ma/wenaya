/**
 * Pratique booking CTA resolution.
 *
 * The primary booking action on a practice detail page is derived from how many
 * specialists genuinely cover that practice (see `pratique-specialists.ts`), so
 * the user flows practice → specialist(s) → booking in as few steps as possible:
 *
 *   0 specialists → /professional          (the listing — no single match)
 *   1 specialist  → /professional/[slug]   (straight to the right specialist)
 *   2+ specialists→ #specialists           (scroll to the in-page list to choose)
 *
 * Locale-aware via the shared `h()` helper. Kept here once so no practice
 * component re-implements the decision.
 */
import { h, type HrefLocale } from "./href";

export type PratiqueCtaLabel = "view" | "book" | "choose";

export interface PratiqueCta {
  /** Resolved locale-aware href for the primary booking action. */
  href: string;
  /** Which translation string the CTA should display. */
  label: PratiqueCtaLabel;
}

/** Resolve the primary booking CTA for a practice from its mapped specialists. */
export function getPratiqueBookingCta(
  locale: HrefLocale,
  specialistCount: number,
  singleSlug?: string
): PratiqueCta {
  if (specialistCount === 1 && singleSlug) {
    return { href: h(locale, `/professional/${singleSlug}`), label: "book" };
  }
  if (specialistCount >= 2) {
    return { href: "#specialists", label: "choose" };
  }
  return { href: h(locale, "/professional"), label: "view" };
}
