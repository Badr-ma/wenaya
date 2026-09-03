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
      summary: "Lombalgies, cervicalgies, hernies discales — kinésithérapie et ostéopathie pour soulager et prévenir.",
    },
    en: {
      title: "Back pain",
      summary: "Lower back pain, neck pain, herniated discs — physiotherapy and osteopathy to relieve and prevent.",
    },
  },
  {
    slug: "stress-anxiete",
    relatedPracticeSlugs: ["psychologie", "sophrologie", "meditation"],
    fr: {
      title: "Stress & anxiété",
      summary: "Gestion du stress, troubles anxieux et burn-out — accompagnement psychologique et thérapies douces.",
    },
    en: {
      title: "Stress & anxiety",
      summary: "Stress management, anxiety disorders and burnout — psychological support and gentle therapies.",
    },
  },
  {
    slug: "troubles-du-sommeil",
    relatedPracticeSlugs: ["psychologie", "sophrologie", "meditation"],
    fr: {
      title: "Troubles du sommeil",
      summary: "Insomnies, apnées du sommeil, hygiene du sommeil — évaluation et prise en charge multidisciplinaire.",
    },
    en: {
      title: "Sleep disorders",
      summary: "Insomnia, sleep apnoea, sleep hygiene — assessment and multidisciplinary care.",
    },
  },
  {
    slug: "reeducation-posturale",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "coaching-sportif"],
    fr: {
      title: "Rééducation posturale",
      summary: "Déséquilibres posturaux, scolioses, douleurs articulaires — rééducation et renforcement musculaire.",
    },
    en: {
      title: "Postural rehabilitation",
      summary: "Postural imbalances, scoliosis, joint pain — rehabilitation and muscle strengthening.",
    },
  },
  {
    slug: "troubles-alimentaires",
    relatedPracticeSlugs: ["nutrition", "psychologie"],
    fr: {
      title: "Troubles alimentaires",
      summary: "Relation difficile avec la nourriture, troubles du comportement alimentaire — soutien nutritionnel et psychologique.",
    },
    en: {
      title: "Eating disorders",
      summary: "A difficult relationship with food, eating disorders — nutritional and psychological support.",
    },
  },
  {
    slug: "recherche-equilibre",
    relatedPracticeSlugs: ["naturopathie", "sophrologie", "meditation", "yoga"],
    fr: {
      title: "Recherche d'équilibre",
      summary: "Bien-être général, prévention, harmonie corps-esprit — approche holistique et préventive.",
    },
    en: {
      title: "Seeking balance",
      summary: "General well-being, prevention, mind-body harmony — a holistic and preventive approach.",
    },
  },
  {
    slug: "douleurs-articulaires",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "massotherapie"],
    fr: {
      title: "Douleurs articulaires",
      summary: "Arthrose, tendinites, douleurs chroniques — kinésithérapie, ostéopathie et thérapies complémentaires.",
    },
    en: {
      title: "Joint pain",
      summary: "Osteoarthritis, tendinitis, chronic pain — physiotherapy, osteopathy and complementary therapies.",
    },
  },
  {
    slug: "sante-mentale-enfant",
    relatedPracticeSlugs: ["psychologie", "psychomotricite", "neuropsychologie", "orthophonie"],
    fr: {
      title: "Santé mentale enfant",
      summary: "Difficultés émotionnelles, troubles du comportement, troubles des apprentissages — accompagnement spécialisé.",
    },
    en: {
      title: "Children's mental health",
      summary: "Emotional difficulties, behavioural issues, learning difficulties — specialised support.",
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