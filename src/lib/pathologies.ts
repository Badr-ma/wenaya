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
      summary: "Accompagnement complet pendant et après la grossesse : kinésithérapie périnéale, ostéopathie, nutrition prénatale et soutien psychologique pour les futures et jeunes mamans.",
    },
    en: {
      title: "Pregnancy & Motherhood",
      summary: "Comprehensive support during and after pregnancy: perineal physiotherapy, osteopathy, prenatal nutrition and psychological support for expectant and new mothers.",
    },
  },
  {
    slug: "troubles-apprentissage",
    image: "/pratiques/orthophonie.jpg",
    relatedPracticeSlugs: ["orthophonie", "psychomotricite", "neuropsychologie"],
    fr: {
      title: "Troubles de l'apprentissage",
      summary: "Bilan et prise en charge des troubles dys, de l'attention et des apprentissages chez l'enfant et l'adolescent via orthophonie, psychomotricité et neuropsychologie.",
    },
    en: {
      title: "Learning difficulties",
      summary: "Assessment and care for dyslexia, attention and learning difficulties in children and adolescents through speech therapy, psychomotor therapy and neuropsychology.",
    },
  },
  {
    slug: "vertiges",
    image: "/pratiques/osteopathie.jpg",
    relatedPracticeSlugs: ["kinesitherapie", "osteopathie"],
    fr: {
      title: "Vertiges",
      summary: "Évaluation et rééducation des vertiges et des troubles de l'équilibre par des spécialistes en kinésithérapie vestibulaire et ostéopathie.",
    },
    en: {
      title: "Vertigo",
      summary: "Assessment and rehabilitation of vertigo and balance disorders by specialists in vestibular physiotherapy and osteopathy.",
    },
  },
  {
    slug: "alzheimer",
    image: "/pratiques/neuropsychologie.png",
    relatedPracticeSlugs: ["neuropsychologie", "psychologie", "psychomotricite"],
    fr: {
      title: "Maladie d'Alzheimer",
      summary: "Accompagnement des patients atteints de la maladie d'Alzheimer et de leurs proches : stimulation cognitive, maintien de l'autonomie et soutien psychologique.",
    },
    en: {
      title: "Alzheimer's disease",
      summary: "Support for patients with Alzheimer's disease and their loved ones: cognitive stimulation, maintaining independence and psychological support.",
    },
  },
  {
    slug: "sante-holistique",
    image: "/pratiques/sophrologie.jpg",
    relatedPracticeSlugs: ["naturopathie", "sophrologie", "meditation", "yoga"],
    fr: {
      title: "Santé holistique",
      summary: "Approche globale de la santé combinant kinésithérapie, nutrition, sophrologie et thérapies complémentaires pour un bien-être physique, mental et émotionnel.",
    },
    en: {
      title: "Holistic health",
      summary: "A global approach to health combining physiotherapy, nutrition, sophrology and complementary therapies for physical, mental and emotional well-being.",
    },
  },
  {
    slug: "tecar-therapie",
    image: "/pratiques/massotherapie.jpg",
    relatedPracticeSlugs: ["kinesitherapie"],
    fr: {
      title: "TECAR Thérapie",
      summary: "Thérapie par radiofréquence pour le traitement des douleurs chroniques, des inflammations et la accélération de la récupération musculaire et articulaire.",
    },
    en: {
      title: "TECAR therapy",
      summary: "Radiofrequency therapy for treating chronic pain, inflammation and accelerating muscle and joint recovery.",
    },
  },
  {
    slug: "kinesitherapie-avc",
    image: "/pratiques/psychomotricite.png",
    relatedPracticeSlugs: ["kinesitherapie", "neuropsychologie", "psychomotricite"],
    fr: {
      title: "Kinésithérapie & AVC",
      summary: "Rééducation fonctionnelle post-AVC : récupération motrice, réapprentissage des mouvements et accompagnement dans la réadaptation à la vie quotidienne.",
    },
    en: {
      title: "Physiotherapy & stroke",
      summary: "Post-stroke functional rehabilitation: motor recovery, relearning movement and support in readapting to daily life.",
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