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

export const clinicMetrics = (locale: "fr" | "en"): ClinicMetric[] =>
  locale === "en"
    ? [
        { value: "99%", label: "of our users recommend their practitioner" },
        { value: "+148", label: "Google reviews" },
        { value: "9", label: "care disciplines" },
        { value: "1", label: "multidisciplinary center" },
      ]
    : [
        { value: "99%", label: "de nos utilisateurs recommandent leur praticien" },
        { value: "+148", label: "avis Google" },
        { value: "9", label: "disciplines de soin" },
        { value: "1", label: "centre pluridisciplinaire" },
      ];

export const clinicFeatures = (locale: "fr" | "en"): ClinicFeature[] =>
  locale === "en"
    ? [
        { title: "Multidisciplinary specialists", description: "9 disciplines in one place." },
        { title: "Comprehensive assessments", description: "An overall view of your health." },
        { title: "Assessment technologies", description: "Precise, personalized monitoring." },
        { title: "Longevity", description: "Prevent today to last longer." },
        { title: "Warm environment", description: "A place designed for your well-being." },
      ]
    : [
        { title: "Spécialistes pluridisciplinaires", description: "9 disciplines réunies au même endroit." },
        { title: "Bilans complets", description: "Une vision globale de votre santé." },
        { title: "Technologies d'évaluation", description: "Un suivi précis et personnalisé." },
        { title: "Longévité", description: "Prévenir aujourd'hui pour mieux durer." },
        { title: "Environnement chaleureux", description: "Un lieu pensé pour votre bien-être." },
      ];

/** WHO statement reference used on the live site */
export const whoStatement = {
  quote: "La santé est un état de complet bien-être physique, mental et social.",
  source: "OMS",
  commitment: "Wenaya s'engage à vous offrir un accompagnement global pour vous aider à atteindre cet équilibre.",
};

export const clinicPracticalInfo = (locale: "fr" | "en") =>
  locale === "en"
    ? {
        name: "Wenaya Clinic",
        hours: "Monday to Saturday, 8am to 8pm",
        appointment: "Consultations by appointment only",
        address: "88 Rue De Jabal Azourki, Casablanca 20930",
        phone: "0666-124035",
      }
    : {
        name: "Wenaya Clinic",
        hours: "Du lundi au samedi de 8h à 20h",
        appointment: "Consultations uniquement sur rendez-vous",
        address: "88 Rue De Jabal Azourki, Casablanca 20930",
        phone: "0666-124035",
      };
