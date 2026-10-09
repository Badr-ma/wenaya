/**
 * Practice-image resolution helpers — ALWAYS the live dev-API `image_web` /
 * `image_mobile`, never local substitutes. Missing/broken images resolve to
 * empty strings (RecommendedPractices) or null (QuickAccess); callers render
 * the existing empty navy state or hide the image via onError — a local
 * `/pratiques/*.jpg` is never served on these surfaces.
 *
 * Consumed by:
 *  - the care-journey "Pratiques recommandées" cards (RecommendedPractices)
 *  - the homepage "Accès directs" quick-access cards (QuickAccessSection)
 *  - the practice detail pages /pratiques/[slug] + /en/pratiques/[slug] hero
 */
import { getLivePratiques } from "@/lib/pratiques";

export type PracticeImageMap = Record<string, string>;

/**
 * Map of canonical practice slug -> live API image URL for every practice the
 * dev-API serves right now. Strictly API-only: entries without an
 * `image_web`/`image_mobile` are omitted. Any failure returns {} — callers
 * then render the empty/hidden state (NEVER a local substitute).
 */
export async function getLivePracticeImageMap(
  locale: "fr" | "en" = "fr",
): Promise<PracticeImageMap> {
  try {
    const practices = await getLivePratiques(locale);
    const map: PracticeImageMap = {};
    for (const p of practices) {
      if (p.image) map[p.slug] = p.image;
    }
    return map;
  } catch (error) {
    console.warn(
      "[practice-images] backend unavailable, returning empty image map:",
      error,
    );
    return {};
  }
}

const QUICK_ACCESS_SLUGS = [
  "sophrologie",
  "kinesitherapie",
  "nutrition",
] as const;

/**
 * The three "Accès directs" card image strips, resolved against the live API
 * in card order (0 = sophrologie, 1 = kinesitherapie, 2 = nutrition). Index 3
 * (the "Professionnels" editorial card) is intentionally left unset so the
 * local editorial image keeps serving. Missing/broken API entries resolve to
 * null (caller then renders the empty navy strip, never a substitute).
 */
export async function getQuickAccessImages(
  locale: "fr" | "en" = "fr",
): Promise<(string | null)[]> {
  const map = await getLivePracticeImageMap(locale);
  return QUICK_ACCESS_SLUGS.map((slug) => map[slug] ?? null);
}