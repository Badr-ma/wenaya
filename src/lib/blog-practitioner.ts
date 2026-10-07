/**
 * Blog practitioner resolution — maps article creators (by their Wenaya user
 * slug) to the professional profile used for the booking CTA on the FR/EN
 * article editorial page.
 *
 * LIVE-ONLY: a creator earns the "Réserver une séance" CTA only when their slug
 * resolves to a REAL professional in the live specialists feed. There is no
 * hardcoded allowlist, so a creator who left, was hidden, or never existed can
 * never produce a booking CTA pointing at a dead `/professional/[slug]` route.
 * When the feed cannot be reached the CTA is simply absent — never fabricated.
 */
import type { ArticleCreator } from "./blog-articles-api";
import { getLiveSpecialists } from "./professionals";

export interface BlogPractitioner {
  slug: string;
  name: string;
}

/**
 * Resolve an article creator to a bookable practitioner, validated against the
 * live specialists feed. Returns null for every non-practitioner author
 * (Yasmine Sekkat, Wenaya Clinic, unknown) and when the feed is unreachable.
 */
export async function getBlogPractitioner(
  creator: Pick<ArticleCreator, "slug" | "firstName" | "lastName"> | null
): Promise<BlogPractitioner | null> {
  if (!creator?.slug) return null;

  const slug = creator.slug.trim();
  if (!slug) return null;

  const specialists = await getLiveSpecialists();
  const professional = specialists.find((s) => s.slug === slug);
  if (!professional) return null;

  const name = [creator.firstName, creator.lastName].filter(Boolean).join(" ").trim();
  return {
    slug: professional.slug,
    name: name || professional.name || professional.slug,
  };
}