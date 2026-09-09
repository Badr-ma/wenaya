/**
 * Care journey PRESENTATION config — visual/editorial metadata for the detail
 * pages. It is kept strictly separate from the live-verbatim CONTENT adapter
 * (`care-journeys.ts`) so a redesign never touches medical copy. Only adds
 * layout hints: hero + secondary imagery, the section chosen for the navy
 * editorial break, and the two related journeys for "Continuer à explorer".
 */

export interface JourneyPresentation {
  /** Full-bleed hero image (Wenaya-owned, from public/pratiques). */
  heroImage: string;
  /**
   * sectionIndex -> secondary contextual image rendered as a Type-A
   * "text left + visual right" split for that section.
   */
  imagePlacements?: Record<number, string>;
  /** Index (0-based) of the section rendered as the navy editorial break. */
  breakIndex?: number;
  /** Two related journey slugs for the closing "explore more" block. */
  relatedSlugs: [string, string];
  /**
   * Canonical practice slugs recommended for this journey's care situation.
   * Derived strictly from the journey's own content (the disciplines its text
   * actually names): never invented, always resolved against the canonical
   * practice set before rendering. Drives the "Pratiques recommandées" section
   * and the orientation CTA. Length > 1 marks a pluridisciplinary journey.
   */
  recommendedSlugs?: string[];
}

/** Fallback hero used if a slug is somehow missing from the map. */
export const DEFAULT_HERO = "/pratiques/kinesitherapie.jpg";

/**
 * Recommended practice disciplines per journey — sourced from each journey's
 * own article content (the practices its text explicitly names). Examples:
 * grossesse names yoga prénatal / massothérapie / nutrition / psychologie;
 * holistique names naturopathie, yoga, méditation (+ réflexologie/aromathérapie
 * which have no canonical practice page, so omitted); vertige/tecar/avc are
 * kinésithérapie-led; apprentissage names orthophonie + neuropsychologue.
 */
const RECOMMENDED: Record<string, string[]> = {
  "grossesse-&-maternite": ["yoga", "massotherapie", "nutrition", "psychologie"],
  "les-troubles-de-l-apprentissage": ["orthophonie", "neuropsychologie"],
  "le-vertige-positionnel": ["kinesitherapie"],
  "la-maladie-d-alzheimer": ["neuropsychologie"],
  "sante-holistique": ["naturopathie", "yoga", "meditation"],
  "tecar-therapie": ["kinesitherapie"],
  "kinesitherapie-&-avc": ["kinesitherapie"],
};

/** Look up the practices recommended by a journey's content (canonical slugs). */
export function getJourneyRecommendedSlugs(slug: string): string[] {
  return RECOMMENDED[slug] ?? [];
}

/** Per-journey visual/presentation metadata (keyed by canonical slug). */
export const CARE_JOURNEY_PRESENTATION: Record<string, JourneyPresentation> = {
  "grossesse-&-maternite": {
    heroImage: "/pratiques/yoga.jpg",
    imagePlacements: {
      0: "/pratiques/psychologie.png",
    },
    relatedSlugs: ["sante-holistique", "tecar-therapie"],
  },
  "les-troubles-de-l-apprentissage": {
    heroImage: "/pratiques/orthophonie.jpg",
    imagePlacements: {
      1: "/pratiques/psychologie.png",
    },
    breakIndex: 2,
    relatedSlugs: ["le-vertige-positionnel", "sante-holistique"],
  },
  "le-vertige-positionnel": {
    heroImage: "/pratiques/kinesitherapie.jpg",
    imagePlacements: {
      0: "/pratiques/osteopathie.jpg",
    },
    breakIndex: 4,
    relatedSlugs: ["tecar-therapie", "kinesitherapie-&-avc"],
  },
  "la-maladie-d-alzheimer": {
    heroImage: "/pratiques/neuropsychologie.png",
    imagePlacements: {
      1: "/pratiques/nutrition.jpg",
    },
    breakIndex: 0,
    relatedSlugs: ["sante-holistique", "les-troubles-de-l-apprentissage"],
  },
  "sante-holistique": {
    heroImage: "/pratiques/meditation.png",
    imagePlacements: {
      0: "/pratiques/naturopathie.jpg",
    },
    relatedSlugs: ["tecar-therapie", "le-vertige-positionnel"],
  },
  "tecar-therapie": {
    heroImage: "/pratiques/sono-therapie.jpg",
    imagePlacements: {
      0: "/pratiques/kinesitherapie.jpg",
    },
    breakIndex: 1,
    relatedSlugs: ["le-vertige-positionnel", "kinesitherapie-&-avc"],
  },
  "kinesitherapie-&-avc": {
    heroImage: "/pratiques/massotherapie.jpg",
    imagePlacements: {
      2: "/pratiques/kinesitherapie.jpg",
    },
    breakIndex: 1,
    relatedSlugs: ["le-vertige-positionnel", "la-maladie-d-alzheimer"],
  },
};

/** Look up presentation metadata for a journey slug (fallback hero always set). */
export function getJourneyPresentation(slug: string): JourneyPresentation {
  return (
    CARE_JOURNEY_PRESENTATION[slug] ?? {
      heroImage: DEFAULT_HERO,
      relatedSlugs: ["sante-holistique", "tecar-therapie"],
    }
  );
}
