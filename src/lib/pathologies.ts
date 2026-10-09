/**
 * Pathologies — typed, API-ready data for the Clinic page pathology explorer.
 *
 * Sources: live wenaya.com homepage pathology section (2026-09-03).
 * Each pathology represents a real care domain that Wenaya addresses.
 * Localized: FR uses the live wenaya.com content; EN is an equivalent translation.
 *
 * Future: replace with API fetch. Components consume this adapter.
 *
 * DESTINATION POLICY (`careJourneySlug`): a pathology is a health SITUATION, so
 * its page must be the care-journey page that explains that situation
 * (`src/lib/care-journeys.ts`) — NOT a discipline page picked out of
 * `relatedPracticeSlugs`. The two datasets describe the same seven conditions
 * and each journey's `hubLabel` is identical to the pathology `title`, so the
 * mapping is a 1:1 key into verified local data, never an invented URL.
 * `careJourneySlug` is a CANDIDATE: the consumer must verify it against
 * `getAllCareJourneySlugs()` before linking, so a future dataset change can
 * never produce a 404. `relatedPracticeSlugs` is retained as a secondary
 * tier only (a discipline page that does mention the condition).
 */

export interface PathologyTopic {
  slug: string;
  title: string;
  summary: string;
  relatedPracticeSlugs?: string[];
  /** Candidate canonical care-journey slug; verify before linking. */
  careJourneySlug?: string;
}

/** Raw bilingual source entry (dev-traceable, never rendered directly) */
interface PathologySource {
  slug: string;
  relatedPracticeSlugs?: string[];
  /** Canonical `CARE_JOURNEYS[].slug` for this condition (1:1 with the journey set). */
  careJourneySlug: string;
  fr: { title: string; summary: string };
  en: { title: string; summary: string };
}

const pathologySources: PathologySource[] = [
  {
    slug: "grossesse-maternite",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "nutrition", "psychologie"],
    careJourneySlug: "grossesse-&-maternite",
    fr: {
      title: "Grossesse & Maternité",
      summary: "Accompagnement complet avant et après la naissance.",
    },
    en: {
      title: "Pregnancy & Motherhood",
      summary: "Complete care before and after birth.",
    },
  },
  {
    slug: "troubles-apprentissage",
    relatedPracticeSlugs: ["orthophonie", "psychomotricite", "neuropsychologie"],
    careJourneySlug: "les-troubles-de-l-apprentissage",
    fr: {
      title: "Troubles de l'apprentissage",
      summary: "Bilan et prise en charge des troubles dys et de l'attention.",
    },
    en: {
      title: "Learning difficulties",
      summary: "Assessment and care for learning difficulties.",
    },
  },
  {
    slug: "vertiges",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie"],
    careJourneySlug: "le-vertige-positionnel",
    fr: {
      title: "Vertiges",
      summary: "Rééducation des vertiges et de l'équilibre.",
    },
    en: {
      title: "Vertigo",
      summary: "Rehabilitation for vertigo and balance.",
    },
  },
  {
    slug: "alzheimer",
    relatedPracticeSlugs: ["neuropsychologie", "psychologie", "psychomotricite"],
    careJourneySlug: "la-maladie-d-alzheimer",
    fr: {
      title: "Maladie d'Alzheimer",
      summary: "Stimulation cognitive et soutien aux proches.",
    },
    en: {
      title: "Alzheimer's disease",
      summary: "Cognitive stimulation and support for loved ones.",
    },
  },
  {
    slug: "sante-holistique",
    relatedPracticeSlugs: ["naturopathie", "sophrologie", "meditation", "yoga"],
    careJourneySlug: "sante-holistique",
    fr: {
      title: "Santé holistique",
      summary: "Une approche globale pour votre bien-être.",
    },
    en: {
      title: "Holistic health",
      summary: "A global approach to your well-being.",
    },
  },
  {
    slug: "tecar-therapie",
    relatedPracticeSlugs: ["kinesitherapie"],
    careJourneySlug: "tecar-therapie",
    fr: {
      title: "TECAR Thérapie",
      summary: "Radiofréquence pour soulager douleurs et inflammations.",
    },
    en: {
      title: "TECAR therapy",
      summary: "Radiofrequency to relieve pain and inflammation.",
    },
  },
  {
    slug: "kinesitherapie-avc",
    relatedPracticeSlugs: ["kinesitherapie", "neuropsychologie", "psychomotricite"],
    careJourneySlug: "kinesitherapie-&-avc",
    fr: {
      title: "Kinésithérapie & AVC",
      summary: "Rééducation motrice après un AVC.",
    },
    en: {
      title: "Physiotherapy & stroke",
      summary: "Motor rehabilitation after a stroke.",
    },
  },
];

type Locale = "fr" | "en";

function normalize(s: PathologySource, locale: Locale): PathologyTopic {
  const copy = locale === "en" ? s.en : s.fr;
  return {
    slug: s.slug,
    title: copy.title,
    summary: copy.summary,
    relatedPracticeSlugs: s.relatedPracticeSlugs,
    careJourneySlug: s.careJourneySlug,
  };
}

export const pathologies: PathologyTopic[] = pathologySources.map((s) => normalize(s, "fr"));

export function getPathologies(locale: Locale = "fr"): PathologyTopic[] {
  return pathologySources.map((s) => normalize(s, locale));
}