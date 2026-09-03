/**
 * Health Needs (Maux-troubles) — typed, API-ready data for the Clinic page
 * health-needs discovery section.
 *
 * Sources: live wenaya.com "Maux-troubles" concept.
 * This represents the "I know my problem but not which care I need" user journey.
 * Localized: FR source content, EN translation.
 *
 * Future: replace with API fetch. Components consume this adapter.
 */

export interface HealthNeed {
  slug: string;
  title: string;
  summary: string;
  relatedPracticeSlugs: string[];
}

/** Raw bilingual source entry (dev-traceable, never rendered directly) */
interface HealthNeedSource {
  slug: string;
  relatedPracticeSlugs: string[];
  fr: { title: string; summary: string };
  en: { title: string; summary: string };
}

const healthNeedSources: HealthNeedSource[] = [
  {
    slug: "douleurs-du-dos",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie"],
    fr: {
      title: "Douleurs du dos",
      summary: "Lombalgies, cervicalgies et douleurs persistantes.",
    },
    en: {
      title: "Back pain",
      summary: "Lower back, neck and persistent pain.",
    },
  },
  {
    slug: "stress-anxiete",
    relatedPracticeSlugs: ["psychologie", "sophrologie", "meditation"],
    fr: {
      title: "Stress & anxiété",
      summary: "Stress, anxiété et épuisement.",
    },
    en: {
      title: "Stress & anxiety",
      summary: "Stress, anxiety and exhaustion.",
    },
  },
  {
    slug: "troubles-du-sommeil",
    relatedPracticeSlugs: ["psychologie", "sophrologie", "meditation"],
    fr: {
      title: "Troubles du sommeil",
      summary: "Insomnie et qualité du sommeil.",
    },
    en: {
      title: "Sleep disorders",
      summary: "Insomnia and sleep quality.",
    },
  },
  {
    slug: "reeducation-posturale",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "coaching-sportif"],
    fr: {
      title: "Rééducation posturale",
      summary: "Posture, mobilité et équilibre musculaire.",
    },
    en: {
      title: "Postural rehabilitation",
      summary: "Posture, mobility and muscular balance.",
    },
  },
  {
    slug: "troubles-alimentaires",
    relatedPracticeSlugs: ["nutrition", "psychologie"],
    fr: {
      title: "Troubles alimentaires",
      summary: "Nutrition et relation à l'alimentation.",
    },
    en: {
      title: "Eating disorders",
      summary: "Nutrition and your relationship with food.",
    },
  },
  {
    slug: "recherche-equilibre",
    relatedPracticeSlugs: ["naturopathie", "sophrologie", "meditation", "yoga"],
    fr: {
      title: "Recherche d'équilibre",
      summary: "Bien-être, prévention et équilibre global.",
    },
    en: {
      title: "Seeking balance",
      summary: "Well-being, prevention and overall balance.",
    },
  },
  {
    slug: "douleurs-articulaires",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "massotherapie"],
    fr: {
      title: "Douleurs articulaires",
      summary: "Arthrose, tendinites et douleurs chroniques.",
    },
    en: {
      title: "Joint pain",
      summary: "Osteoarthritis, tendinitis and chronic pain.",
    },
  },
  {
    slug: "sante-mentale-enfant",
    relatedPracticeSlugs: ["psychologie", "psychomotricite", "neuropsychologie", "orthophonie"],
    fr: {
      title: "Santé mentale enfant",
      summary: "Émotions, comportement et apprentissage.",
    },
    en: {
      title: "Children's mental health",
      summary: "Emotions, behaviour and learning.",
    },
  },
];

type Locale = "fr" | "en";

function normalize(s: HealthNeedSource, locale: Locale): HealthNeed {
  const copy = locale === "en" ? s.en : s.fr;
  return {
    slug: s.slug,
    title: copy.title,
    summary: copy.summary,
    relatedPracticeSlugs: s.relatedPracticeSlugs,
  };
}

export const healthNeeds: HealthNeed[] = healthNeedSources.map((s) => normalize(s, "fr"));

export function getHealthNeeds(locale: Locale = "fr"): HealthNeed[] {
  return healthNeedSources.map((s) => normalize(s, locale));
}

export function getHealthNeedBySlug(slug: string, locale: Locale = "fr"): HealthNeed | undefined {
  const s = healthNeedSources.find((n) => n.slug === slug);
  return s ? normalize(s, locale) : undefined;
}

export function getAllHealthNeedSlugs(): string[] {
  return healthNeedSources.map((n) => n.slug);
}