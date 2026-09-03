/**
 * Pathologies — typed, API-ready data for the Clinic page pathology explorer.
 *
 * Sources: live wenaya.com homepage pathology section (2026-09-03).
 * Each pathology represents a real care domain that Wenaya addresses.
 * Localized: FR uses the live wenaya.com content; EN is an equivalent translation.
 *
 * Future: replace with API fetch. Components consume this adapter.
 */

export interface PathologyTopic {
  slug: string;
  title: string;
  summary: string;
  image: string;
  relatedPracticeSlugs?: string[];
}

/** Raw bilingual source entry (dev-traceable, never rendered directly) */
interface PathologySource {
  slug: string;
  image: string;
  relatedPracticeSlugs?: string[];
  fr: { title: string; summary: string };
  en: { title: string; summary: string };
}

const pathologySources: PathologySource[] = [
  {
    slug: "grossesse-maternite",
    image: "/pratiques/kinesitherapie.jpg",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie", "nutrition", "psychologie"],
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
    image: "/pratiques/orthophonie.jpg",
    relatedPracticeSlugs: ["orthophonie", "psychomotricite", "neuropsychologie"],
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
    image: "/pratiques/osteopathie.jpg",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie"],
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
    image: "/pratiques/neuropsychologie.png",
    relatedPracticeSlugs: ["neuropsychologie", "psychologie", "psychomotricite"],
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
    image: "/pratiques/sophrologie.jpg",
    relatedPracticeSlugs: ["naturopathie", "sophrologie", "meditation", "yoga"],
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
    image: "/pratiques/massotherapie.jpg",
    relatedPracticeSlugs: ["kinesitherapie"],
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
    image: "/pratiques/psychomotricite.png",
    relatedPracticeSlugs: ["kinesitherapie", "neuropsychologie", "psychomotricite"],
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
    image: s.image,
    relatedPracticeSlugs: s.relatedPracticeSlugs,
  };
}

export const pathologies: PathologyTopic[] = pathologySources.map((s) => normalize(s, "fr"));

export function getPathologies(locale: Locale = "fr"): PathologyTopic[] {
  return pathologySources.map((s) => normalize(s, locale));
}

export function getPathologyBySlug(slug: string, locale: Locale = "fr"): PathologyTopic | undefined {
  const s = pathologySources.find((p) => p.slug === slug);
  return s ? normalize(s, locale) : undefined;
}

export function getAllPathologySlugs(): string[] {
  return pathologySources.map((p) => p.slug);
}