/**
 * Clinic Content — typed, API-ready data for the Clinic/B2C page.
 *
 * Sources: live wenaya.com homepage content (2026-09-03).
 * All copy is faithfully imported from the live site. Encoding cleaned,
 * spacing normalized, but medical meaning preserved as-is.
 *
 * Future: replace with API/CMS fetch. Components consume this adapter.
 */

export interface ClinicMetric {
  value: string;
  label: string;
}

export interface ClinicFeature {
  title: string;
  description: string;
}

export const clinicMetrics: ClinicMetric[] = [
  { value: "99%", label: "de nos utilisateurs recommandent leur praticien" },
  { value: "+148", label: "avis Google" },
  { value: "9", label: "disciplines de soin" },
  { value: "1", label: "centre pluridisciplinaire" },
];

export const clinicFeatures: ClinicFeature[] = [
  {
    title: "Spécialistes pluridisciplinaires",
    description: "Kinésithérapie, ostéopathie, psychologie, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires.",
  },
  {
    title: "Bilans complets",
    description: "Évaluations approfondies et prises en charge coordonnées pour soutenir votre santé physique, mentale et cognitive.",
  },
  {
    title: "Technologies d'évaluation",
    description: "Dernières technologies d'évaluation, de suivi et d'analyse pour un accompagnement précis, personnalisé et évolutif.",
  },
  {
    title: "Longévité",
    description: "La longévité au cœur de notre mission — vous aider à atteindre un équilibre global de santé.",
  },
  {
    title: "Environnement chaleureux",
    description: "Un cadre accueillant et convivial pour que chaque visite soit une expérience agréable.",
  },
];

/** WHO statement reference used on the live site */
export const whoStatement = {
  quote: "La santé est un état de complet bien-être physique, mental et social.",
  source: "OMS",
  commitment: "Wenaya s'engage à vous offrir un accompagnement global pour vous aider à atteindre cet équilibre.",
};

export const clinicPracticalInfo = {
  name: "Wenaya Clinic",
  hours: "Du lundi au samedi de 8h à 20h",
  appointment: "Consultations uniquement sur rendez-vous",
  address: "88 Rue De Jabal Azourki, Casablanca 20930",
  phone: "0666-124035",
};
