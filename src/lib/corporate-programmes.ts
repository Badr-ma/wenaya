/**
 * Corporate Programmes — single shared data source for the /corporate/programmes
 * listing page, the /corporate carousel section, and the programme detail pages.
 *
 * CONTENT POLICY: All French copy is verbatim from the live Wenaya corporate
 * programme pages (captured 2026-09-09); the French set is the source of truth and
 * must stay byte-unchanged. The live site has NO official English translation —
 * /en/corporate/programmes/{slug} serves the same French content under lang="en" —
 * so module-level EN translations (reviewed, authored in project) mirror the French
 * meaning exactly without inventing claims, certifications, outcomes, durations,
 * prices, tools or facts. Programme names and the audit-calendar destination are
 * shared across locales; localised chrome lives in i18n.
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
  cardFormat?: string;
  cardAnimator?: string;
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

/** Locale-localised portion of a programme. Slug is locale-independent. */
interface ProgrammeContent {
  name: string;
  badge: string;
  pitch: string;
  intro: string[];
  blocks: ProgrammeBlock[];
  practical: ProgrammePracticalRow[];
  note: string;
  ctas: ProgrammeCTA[];
  cardFormat?: string;
  cardAnimator?: string;
}

interface LocalizedProgramme {
  slug: string;
  fr: ProgrammeContent;
  en: ProgrammeContent;
}

const AUDIT_CTA_FR: ProgrammeCTA = {
  label: "Réserver un échange",
  href: PROGRAMME_AUDIT_CALENDAR_URL,
  external: true,
};
const QUOTE_CTA_FR: ProgrammeCTA = {
  label: "Demander un devis",
  href: "/corporate#contact",
};
const AUDIT_CTA_EN: ProgrammeCTA = {
  label: "Book a meeting",
  href: PROGRAMME_AUDIT_CALENDAR_URL,
  external: true,
};
const QUOTE_CTA_EN: ProgrammeCTA = {
  label: "Request a quote",
  href: "/corporate#contact",
};

export const PROGRAMMES: LocalizedProgramme[] = [
  {
    slug: "leadership-360",
    fr: {
      name: "Leadership 360°",
      badge: "5 AXES",
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
      ctas: [AUDIT_CTA_FR, QUOTE_CTA_FR],
      cardFormat: "Format : 3 jours (1+1+1) · Inter ou intra-entreprise",
      cardAnimator: "Animée par un formateur Wenaya certifié",
    },
    en: {
      name: "Leadership 360°",
      badge: "5 PILLARS",
      pitch: "Develop high-performing, human leadership.",
      intro: [
        "The Leadership 360° programme is a managerial development programme designed to support managers in strengthening their interpersonal, relational and organisational skills.",
        "In a context where companies must balance performance, team engagement and the quality of working relationships, this programme offers practical tools to develop effective, responsible and inspiring management.",
      ],
      blocks: [
        {
          title: "The 5 pillars of the programme",
          type: "cards",
          cards: [
            {
              title: "1. Self-awareness and self-management",
              desc: "Self-esteem, emotional and stress management, personal motivation, balance and energy at work.",
            },
            {
              title: "2. Relationships and communication",
              desc: "Active listening, empathy, assertive communication, handling difficult relational situations, adapting to different profiles.",
            },
            {
              title: "3. Role and mission within the company",
              desc: "Professional identity, managerial vision and mission, priorities and objectives, performance indicators.",
            },
            {
              title: "4. Personal and managerial effectiveness",
              desc: "Time and priority management, clarifying objectives, structuring action, decision-making.",
            },
            {
              title: "5. People management and team management",
              desc: "Management styles, mobilising and motivating teams, talent management, team dynamics, supporting team members.",
            },
          ],
        },
        {
          title: "Why offer this programme in your company?",
          type: "bullets",
          items: [
            "Develop more confident and more effective managers",
            "Strengthen the quality of leadership within teams",
            "Improve internal communication and cooperation",
            "Boost team member engagement and motivation",
            "Support collective, sustainable performance",
          ],
        },
      ],
      practical: [
        { label: "Duration", value: "3 days (1 + 1 + 1)" },
        { label: "Format", value: "Open-enrolment or in-house" },
        { label: "Facilitation", value: "Certified Wenaya facilitator" },
      ],
      note: "Fee on personalised quote · Format adapted to your constraints.",
      ctas: [AUDIT_CTA_EN, QUOTE_CTA_EN],
      cardFormat: "Format: 3 days (1+1+1) · Open-enrolment or in-house",
      cardAnimator: "Facilitated by a certified Wenaya facilitator",
    },
  },
  {
    slug: "pcm",
    fr: {
      name: "Process Communication Model®",
      badge: "NASA · 1978",
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
      ctas: [AUDIT_CTA_FR, QUOTE_CTA_FR],
      cardFormat: "Format : 2 jours · Inter ou intra-entreprise",
      cardAnimator: "Animée par une formatrice Wenaya certifiée PCM",
    },
    en: {
      name: "Process Communication Model®",
      badge: "NASA · 1978",
      pitch: "Understand yourself, understand others, to work better together.",
      intro: [
        "In a professional environment where communication and collaboration are essential, understanding how different people function becomes a genuine performance lever.",
        "The Process Communication seminar enables participants to discover their own way of functioning and that of their counterparts, in order to develop smoother, more constructive and more effective communication.",
        "Thanks to an internationally recognised model — used by NASA since 1978 to train its astronauts in high-pressure communication — teams learn to adapt their communication, prevent tension and strengthen the quality of professional relationships.",
      ],
      blocks: [
        {
          title: "What you will learn",
          type: "bullets",
          items: [
            "Discover the 6 personality types of the Process Communication model",
            "Identify your personal profile through an individual inventory",
            "Understand the communication styles suited to each profile",
            "Recognise the psychological needs that drive behaviours",
            "Identify stress signals and learn to manage them better",
            "Develop practical tools to improve everyday communication",
          ],
        },
        {
          title: "Why offer this seminar in your company?",
          type: "bullets",
          items: [
            "Smoother communication between team members",
            "Strengthen team cohesion and collaboration",
            "Prevent and manage tense or conflictual situations",
            "Adapt management to different personality profiles",
            "Foster a calmer, more productive work climate",
          ],
        },
        {
          title: "The benefits for participants",
          type: "bullets",
          items: [
            "A better understanding of how they personally function",
            "A finer understanding of others' reactions and behaviour",
            "Practical tools to communicate effectively in every situation",
            "Strategies for managing stress and difficult interactions",
            "A strengthened ability to build positive professional relationships",
          ],
        },
      ],
      practical: [
        { label: "Duration", value: "2 days" },
        { label: "Format", value: "Open-enrolment or in-house" },
        { label: "Facilitation", value: "Certified PCM Wenaya facilitator" },
        { label: "Included", value: "PCM personality inventory + individual teaching materials" },
      ],
      note: "Fee on personalised quote · Format adapted to your constraints.",
      ctas: [AUDIT_CTA_EN, QUOTE_CTA_EN],
      cardFormat: "Format: 2 days · Open-enrolment or in-house",
      cardAnimator: "Facilitated by a certified PCM Wenaya facilitator",
    },
  },
  {
    slug: "art-des-priorites",
    fr: {
      name: "L'Art des Priorités",
      badge: "ANTI-SURCHARGE",
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
      ctas: [AUDIT_CTA_FR, QUOTE_CTA_FR],
      cardFormat: "Format : 2 jours · Outil Key Timer optionnel",
      cardAnimator: "Animée par un formateur Wenaya certifié",
    },
    en: {
      name: "The Art of Priorities",
      badge: "ANTI-OVERLOAD",
      pitch: "Stop the overload. Make way for effectiveness. Work better, not necessarily more.",
      intro: [
        "In a professional environment where demands are constant and requirements ever-growing, the ability to manage one's time and priorities effectively has become a key skill.",
        "This seminar provides participants with practical methods and tools to organise their work better, clarify their priorities and gain effectiveness, while reducing pressure and cognitive overload.",
      ],
      blocks: [
        {
          title: "Seminar objectives",
          type: "bullets",
          items: [
            "Identify the main sources of wasted time",
            "Clarify professional priorities",
            "Develop an effective work organisation",
            "Learn to manage interruptions and emergencies",
            "Improve concentration and decision-making ability",
            "Find a better balance between effectiveness and well-being",
          ],
        },
        {
          title: "Seminar content",
          type: "cards",
          cards: [
            {
              title: "Understanding your relationship with time",
              desc: "Perceptions of time, identifying habits and time-stealers, clarifying goals and priorities.",
            },
            {
              title: "Defining and managing priorities",
              desc: "Urgent/important matrix, prioritising tasks, effective activity planning.",
            },
            {
              title: "Organisation and effectiveness methods",
              desc: "Structuring your day and week, planning methods, managing interruptions, focus.",
            },
            {
              title: "Communicating and setting boundaries",
              desc: "Saying no constructively, managing requests, communication around priorities.",
            },
          ],
        },
      ],
      practical: [
        { label: "Duration", value: "2 days" },
        { label: "Format", value: "Open-enrolment or in-house" },
        { label: "Facilitation", value: "Certified Wenaya facilitator" },
        { label: "Option", value: "Key Timer tool available as an option" },
      ],
      note: "Fee on personalised quote · Format adapted to your constraints.",
      ctas: [AUDIT_CTA_EN, QUOTE_CTA_EN],
      cardFormat: "Format: 2 days · Key Timer tool optional",
      cardAnimator: "Facilitated by a certified Wenaya facilitator",
    },
  },
  {
    slug: "people-model-canvas",
    fr: {
      name: "People Model Canvas",
      badge: "20+ ANS · RECHERCHE & TERRAIN",
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
      ctas: [AUDIT_CTA_FR, QUOTE_CTA_FR],
      cardFormat: "Format sur mesure · Adapté à vos enjeux",
      cardAnimator: "Animée par un consultant Wenaya certifié",
    },
    en: {
      name: "People Model Canvas",
      badge: "20+ YEARS · RESEARCH & FIELD WORK",
      pitch: "A common language to steer your strategic HR decisions.",
      intro: [
        "The result of more than 20 years of academic research and in-company implementation, the People Model Canvas offers a structured approach to human resources management.",
        "It provides a common language that enables HR professionals and managers to make strategic decisions based on objective, relevant data.",
        "The programme stands out for its flexibility: its format, intensity and content adapt entirely to your organisation's challenges, maturity and constraints.",
      ],
      blocks: [
        {
          title: "What the People Model Canvas brings to your organisation",
          type: "bullets",
          items: [
            "A structured framework for analysing and steering your HR challenges",
            "A common language between leadership, HR and managers",
            "Strategic decisions based on objective data",
            "A cross-functional view of the human levers of performance",
            "A toolkit proven by research and field practice",
          ],
        },
        {
          title: "Who is it for?",
          type: "bullets",
          items: [
            "Executive teams looking to align people strategy and business strategy",
            "HR leadership in transformation or structuring",
            "Managers on an upward trajectory",
            "Executive committees and project teams in strategic reflection",
          ],
        },
        {
          title: "A format designed to measure",
          type: "paragraphs",
          paragraphs: [
            "Unlike standard seminars, the People Model Canvas is calibrated specifically for your organisation. Duration, intensity, profiles and sequencing are defined during an initial scoping session with your leadership.",
            "Formats can range from a one-day workshop for an executive committee to a programme spread over several months to deeply transform your HR function.",
          ],
        },
      ],
      practical: [
        { label: "Duration", value: "Bespoke — defined during the initial scoping session" },
        { label: "Format", value: "In-house · open-enrolment possible on request" },
        { label: "Audience", value: "Leadership, HR, managers — according to your brief" },
        { label: "Facilitation", value: "Certified Wenaya consultant" },
      ],
      note: "Fee on personalised quote · Format adapted to your constraints.",
      ctas: [AUDIT_CTA_EN, QUOTE_CTA_EN],
      cardFormat: "Bespoke format · Adapted to your challenges",
      cardAnimator: "Facilitated by a certified Wenaya consultant",
    },
  },
];

function resolveProgramme(raw: LocalizedProgramme, locale: HrefLocale): Programme {
  const content = locale === "en" ? raw.en : raw.fr;
  return {
    slug: raw.slug,
    name: content.name,
    badge: content.badge,
    pitch: content.pitch,
    intro: content.intro,
    blocks: content.blocks,
    practical: content.practical,
    note: content.note,
    ctas: content.ctas,
    cardFormat: content.cardFormat,
    cardAnimator: content.cardAnimator,
  };
}

export function getProgramme(slug: string, locale: HrefLocale = "fr"): Programme | null {
  const raw = PROGRAMMES.find((p) => p.slug === slug);
  if (!raw) return null;
  return resolveProgramme(raw, locale);
}

export function getAllProgrammeSlugs(): string[] {
  return PROGRAMMES.map((p) => p.slug);
}

export function getAllProgrammes(locale: HrefLocale = "fr"): Programme[] {
  return PROGRAMMES.map((p) => resolveProgramme(p, locale));
}

export function getProgrammeHref(locale: HrefLocale, slug: string): string {
  return h(locale, `/corporate/programmes/${slug}`);
}

export function getProgrammesListingHref(locale: HrefLocale): string {
  return h(locale, "/corporate/programmes");
}

/** Card-level projection shared by the listing page and the /corporate carousel. */
export function toProgrammeCard(p: Programme): ProgrammeCard {
  const derivedFormat = p.practical[0]?.value ?? "";
  const derivedAnimator =
    p.practical.find((r) => r.label === "Animation" || r.label === "Facilitation")?.value ?? "";
  return {
    slug: p.slug,
    badge: p.badge,
    name: p.name,
    pitch: p.pitch,
    desc: p.intro[0] ?? "",
    format: p.cardFormat ?? derivedFormat,
    animator: p.cardAnimator ?? derivedAnimator,
  };
}

export function getAllProgrammeCards(locale: HrefLocale = "fr"): ProgrammeCard[] {
  return getAllProgrammes(locale).map(toProgrammeCard);
}