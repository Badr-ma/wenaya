/**
 * Blog practitioner allowlist — maps article creators (by their Wenaya
 * user slug) to the professional profile used for the booking CTA on the
 * FR article editorial page.
 *
 * Only these verified practitioners get a "Réserver une séance" CTA; every
 * other author (Yasmine Sekkat, Wenaya Clinic, unknown) renders none.
 * The mapping key is the creator's wire `slug` (exposed via the shared
 * article adapter projection) and returns the professional page slug.
 */
import { ArticleCreator } from "./blog-articles-api";

export interface BlogPractitioner {
  slug: string;
  name: string;
}

const PRACTITIONER_SLUGS = new Set(["nadine-kita", "mehdi-sebti", "rose-mavoungou"]);

/**
 * Resolve an article creator to a bookable practitioner when they are on the
 * allowlist. Returns null for every non-listed author.
 */
export function getBlogPractitioner(
  creator: Pick<ArticleCreator, "slug" | "firstName" | "lastName"> | null
): BlogPractitioner | null {
  if (!creator?.slug || !PRACTITIONER_SLUGS.has(creator.slug)) return null;
  const name = [creator.firstName, creator.lastName].filter(Boolean).join(" ").trim();
  return {
    slug: creator.slug,
    name: name || creator.slug,
  };
}