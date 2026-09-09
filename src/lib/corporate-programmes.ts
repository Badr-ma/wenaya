/**
 * Corporate Programmes — single shared data source for the /corporate/programmes
 * listing page, the /corporate carousel section, and the programme detail pages.
 *
 * CONTENT POLICY: All copy is verbatim from the live Wenaya corporate programme
 * pages (captured 2026-09-09). The live site has NO official English translation —
 * /en/corporate/programmes/{slug} serves the same French content under lang="en" —
 * so this module keeps ONE French content set used by both locales, matching live.
 * Localised chrome lives in i18n. EN needs translation review (reported, not invented).
 *
 * Live programme pages contain: eyebrow, title (H1), pitch, intro paragraphs,
 * labelled content blocks, practical-information rows, a pricing note, and two CTAs
 * ("Réserver un échange" → Google Calendar audit slot; "Demander un devis" → corporate
 * contact section). No FAQ, no testimonials, no images, no pricing figures exist live.
 */
import { h, type HrefLocale } from "@/lib/href";

/** Google Calendar audit slot — used by the live corporate nav + programme CTAs. */
export const PROGRAMME_AUDIT_CALENDAR_URL = "https://calendar.app.google/YyAirdPSc2ugGbnh9";

export interface ProgrammeBlockCard {
  title: string;
  desc: string;
}

export interface ProgrammeBlock {
  title: string;
  type: "bullets" | "cards" | "paragraphs";
  items?: string[];
  cards?: ProgrammeBlockCard[];
  paragraphs?: string[];
}

export interface ProgrammePracticalRow {
  label: string;
  value: string;
}

export interface ProgrammeCTA {
  label: string;
  href: string;
  external?: boolean;
}

export interface Programme {
  slug: string;
  badge: string;
  name: string;
  pitch: string;
  intro: string[];
  blocks: ProgrammeBlock[];
  practical: ProgrammePracticalRow[];
  note: string;
  ctas: ProgrammeCTA[];
}

export interface ProgrammeCard {
  slug: string;
  badge: string;
  name: string;
  pitch: string;
  desc: string;
  format: string;
  animator: string;
}

const AUDIT_CTA: ProgrammeCTA = {
  label: "Réserver un échange",
  href: PROGRAMME_AUDIT_CALENDAR_URL,
  external: true,
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "leadership-360",
    badge: "PROGRAMME LABELLISÉ · 5 AXES",
    name: "Leadership 360°",
    pitch: "Développer un leadership performant et humain.",
    intro: [
      "Le cursus Leadership 360° est un programme de développement managérial conçu pour accompagner les managers dans le renforcement de leurs compétences humaines, relationnelles et organisationnelles.",
      "Dans un contexte où les entreprises doivent concilier performance, engagement des équipes et qualité des relations de travail, ce programme propose des outils concrets pour développer un management efficace, responsable et inspirant.",
    ],
    blocks: [
      {
        title: "Les 5 axes du programme",
        type: "cards",
        cards: [
          {
            title: "1. Connaissance et gestion de soi",
            desc: "Estime de soi, gestion des émotions et du stress, motivation personnelle, équilibre et énergie au travail.",
          },
          {
            title: "2. Relations et communication",
            desc: "Écoute active, empathie, communication assertive, gestion des situations relationnelles difficiles, adaptation aux profils.",
          },
          {
            title: "3. Fonction et mission dans l'entreprise",
            desc: "Identité professionnelle, vision et mission managériale, priorités et objectifs, indicateurs de performance.",
          },
          {
            title: "4. Efficacité personnelle et managériale",
            desc: "Gestion du temps et des priorités, clarification des objectifs, structuration de l'action, prise de décision.",
          },
          {
            title: "5. People management et gestion d'équipe",
            desc: "Styles de management, mobilisation et motivation, gestion des talents, dynamique d'équipe, accompagnement des collaborateurs.",
          },
        ],
      },
      {
        title: "Pourquoi proposer ce programme dans votre entreprise ?",
        type: "bullets",
        items: [
          "Développer des managers plus confiants et plus efficaces",
          "Renforcer la qualité du leadership au sein des équipes",
          "Améliorer la communication et la coopération interne",
          "Favoriser l'engagement et la motivation des collaborateurs",
          "Soutenir la performance collective et durable",
        ],
      },
    ],
    practical: [
      { label: "Durée", value: "3 jours (1 + 1 + 1)" },
      { label: "Format", value: "Inter-entreprise ou intra-entreprise" },
      { label: "Animation", value: "Formateur Wenaya certifié" },
    ],
    note: "Tarif sur devis personnalisé · Format adapté à vos contraintes.",
    ctas: [
      AUDIT_CTA,
      { label: "Demander un devis", href: "/corporate#contact" },
    ],
  },
  {
    slug: "pcm",
    badge: "PROGRAMME LABELLISÉ · NASA · 1978",
    name: "Process Communication Model®",
    pitch: "Se comprendre, comprendre les autres, pour mieux travailler ensemble.",
    intro: [
      "Dans un environnement professionnel où la communication et la collaboration sont essentielles, comprendre les différences de fonctionnement entre les personnes devient un véritable levier de performance.",
      "Le séminaire Process Communication permet aux participants de découvrir leur propre mode de fonctionnement et celui de leurs interlocuteurs, afin de développer une communication plus fluide, constructive et efficace.",
      "Grâce à un modèle reconnu internationalement — utilisé par la NASA depuis 1978 pour former ses astronautes à la communication sous pression — les équipes apprennent à adapter leur communication, prévenir les tensions et renforcer la qualité des relations professionnelles.",
    ],
    blocks: [
      {
        title: "Ce que vous allez apprendre",
        type: "bullets",
        items: [
          "Découvrir les 6 types de personnalité du modèle Process Communication",
          "Identifier votre profil personnel grâce à un inventaire individuel",
          "Comprendre les modes de communication adaptés à chaque profil",
          "Reconnaître les besoins psychologiques qui motivent les comportements",
          "Identifier les signaux de stress et apprendre à mieux les gérer",
          "Développer des outils concrets pour améliorer la communication au quotidien",
        ],
      },
      {
        title: "Pourquoi proposer ce séminaire dans votre entreprise ?",
        type: "bullets",
        items: [
          "Fluidifier la communication entre collaborateurs",
          "Renforcer la cohésion et la collaboration des équipes",
          "Prévenir et gérer les situations de tension ou de conflit",
          "Adapter le management aux différents profils de personnalité",
          "Favoriser un climat de travail plus serein et plus performant",
        ],
      },
      {
        title: "Les bénéfices pour les participants",
        type: "bullets",
        items: [
          "Une meilleure connaissance de leur fonctionnement personnel",
          "Une compréhension plus fine des réactions et comportements des autres",
          "Des outils concrets pour communiquer efficacement dans toutes les situations",
          "Des stratégies pour gérer le stress et les interactions difficiles",
          "Une capacité renforcée à développer des relations professionnelles positives",
        ],
      },
    ],
    practical: [
      { label: "Durée", value: "2 jours" },
      { label: "Format", value: "Inter-entreprise ou intra-entreprise" },
      { label: "Animation", value: "Formatrice Wenaya certifiée PCM" },
      { label: "Inclus", value: "Inventaire de personnalité PCM + matériel pédagogique individuel" },
    ],
    note: "Tarif sur devis personnalisé · Format adapté à vos contraintes.",
    ctas: [
      AUDIT_CTA,
      { label: "Demander un devis", href: "/corporate#contact" },
    ],
  },
  {
    slug: "art-des-priorites",
    badge: "PROGRAMME LABELLISÉ · ANTI-SURCHARGE",
    name: "L'Art des Priorités",
    pitch: "Stop à la surcharge. Place à l'efficacité. Travailler mieux, pas forcément plus.",
    intro: [
      "Dans un environnement professionnel où les sollicitations sont constantes et les exigences toujours plus nombreuses, la capacité à gérer efficacement son temps et ses priorités est devenue une compétence clé.",
      "Ce séminaire propose aux participants des méthodes et des outils concrets pour mieux organiser leur travail, clarifier leurs priorités et gagner en efficacité, tout en réduisant la pression et la surcharge mentale.",
    ],
    blocks: [
      {
        title: "Objectifs du séminaire",
        type: "bullets",
        items: [
          "Identifier les principaux facteurs de perte de temps",
          "Clarifier ses priorités professionnelles",
          "Développer une organisation de travail efficace",
          "Apprendre à gérer les interruptions et les urgences",
          "Améliorer sa capacité de concentration et de décision",
          "Trouver un meilleur équilibre entre efficacité et bien-être",
        ],
      },
      {
        title: "Contenu du séminaire",
        type: "cards",
        cards: [
          {
            title: "Comprendre son rapport au temps",
            desc: "Perceptions du temps, identification des habitudes et des « voleurs de temps », clarification des objectifs et priorités.",
          },
          {
            title: "Définir et gérer ses priorités",
            desc: "Matrice urgent/important, hiérarchisation des tâches, planification efficace des activités.",
          },
          {
            title: "Méthodes d'organisation et d'efficacité",
            desc: "Structurer sa journée et sa semaine, méthodes de planification, gestion des interruptions, concentration.",
          },
          {
            title: "Communiquer et poser des limites",
            desc: "Savoir dire non de manière constructive, gérer les sollicitations, communication autour des priorités.",
          },
        ],
      },
    ],
    practical: [
      { label: "Durée", value: "2 jours" },
      { label: "Format", value: "Inter-entreprise ou intra-entreprise" },
      { label: "Animation", value: "Formateur Wenaya certifié" },
      { label: "Option", value: "Outil Key Timer en option" },
    ],
    note: "Tarif sur devis personnalisé · Format adapté à vos contraintes.",
    ctas: [
      AUDIT_CTA,
      { label: "Demander un devis", href: "/corporate#contact" },
    ],
  },
  {
    slug: "people-model-canvas",
    badge: "PROGRAMME LABELLISÉ · 20+ ANS DE RECHERCHE & TERRAIN",
    name: "People Model Canvas",
    pitch: "Un langage commun pour piloter vos décisions RH stratégiques.",
    intro: [
      "Fruit de plus de 20 ans de recherche universitaire et de mise en œuvre en entreprise, le People Model Canvas propose une approche structurée de la gestion des ressources humaines.",
      "Il offre un langage commun permettant aux professionnels et aux gestionnaires RH de prendre des décisions stratégiques fondées sur des données objectives et pertinentes.",
      "Le programme se distingue par sa flexibilité : son format, son intensité et ses contenus s'adaptent intégralement aux enjeux, à la maturité et aux contraintes de votre organisation.",
    ],
    blocks: [
      {
        title: "Ce que le People Model Canvas apporte à votre organisation",
        type: "bullets",
        items: [
          "Un cadre structuré pour analyser et piloter vos enjeux RH",
          "Un langage commun entre direction, RH et managers",
          "Des décisions stratégiques fondées sur des données objectives",
          "Une lecture transversale des leviers humains de la performance",
          "Une boîte à outils éprouvée par la recherche et le terrain",
        ],
      },
      {
        title: "Pour qui ?",
        type: "bullets",
        items: [
          "Directions générales souhaitant aligner stratégie humaine et stratégie business",
          "Directions RH en transformation ou en structuration",
          "Managers en montée en puissance",
          "Comités de direction et équipes projet en réflexion stratégique",
        ],
      },
      {
        title: "Un format pensé sur mesure",
        type: "paragraphs",
        paragraphs: [
          "Contrairement aux séminaires standards, le People Model Canvas est calibré spécifiquement pour votre organisation. Durée, intensité, profils et séquençage sont définis lors d'un cadrage initial avec votre direction.",
          "Les modalités peuvent aller d'un atelier d'une journée pour un comité de direction à un parcours étalé sur plusieurs mois pour transformer en profondeur votre fonction RH.",
        ],
      },
    ],
    practical: [
      { label: "Durée", value: "Sur mesure — défini lors du cadrage initial" },
      { label: "Format", value: "Intra-entreprise · Inter possible sur demande" },
      { label: "Public", value: "Direction, RH, managers — selon votre brief" },
      { label: "Animation", value: "Consultant Wenaya certifié" },
    ],
    note: "Tarif sur devis personnalisé · Format adapté à vos contraintes.",
    ctas: [
      AUDIT_CTA,
      { label: "Demander un devis", href: "/corporate#contact" },
    ],
  },
];

export function getProgramme(slug: string): Programme | null {
  return PROGRAMMES.find((p) => p.slug === slug) ?? null;
}

export function getAllProgrammeSlugs(): string[] {
  return PROGRAMMES.map((p) => p.slug);
}

export function getAllProgrammes(): Programme[] {
  return PROGRAMMES;
}

export function getProgrammeHref(locale: HrefLocale, slug: string): string {
  return h(locale, `/corporate/programmes/${slug}`);
}

export function getProgrammesListingHref(locale: HrefLocale): string {
  return h(locale, "/corporate/programmes");
}

/** Card-level projection shared by the listing page and the /corporate carousel. */
export function toProgrammeCard(p: Programme): ProgrammeCard {
  const format = p.practical[0]?.value ?? "";
  const animator = p.practical.find((r) => r.label === "Animation")?.value ?? "";
  return {
    slug: p.slug,
    badge: p.badge,
    name: p.name,
    pitch: p.pitch,
    desc: p.intro[0] ?? "",
    format,
    animator,
  };
}

export function getAllProgrammeCards(): ProgrammeCard[] {
  return PROGRAMMES.map(toProgrammeCard);
}