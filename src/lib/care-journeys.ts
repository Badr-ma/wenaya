/**
 * Care journeys ("Parcours de soins") — canonical content pages mirroring the real
 * wenaya.com care-pathway articles. Built 2026-09-08 from a byte-faithful capture of
 * the live pages (rendered DOM via CDP; clean article HTML parsed into structured
 * blocks). Content is French — this is also what the live site serves under /en/
 * (verified byte-identical article HTML), so the EN pages mirror the same copy with
 * EN chrome + EN metadata exclusively.
 */
import { safeDecodeURI } from "@/lib/href";

export interface JourneyListItem {
  /** Nesting depth — 0 for top-level items. */
  depth: number;
  /** List style of this item's ancestor list (ol → ordered). */
  ordered?: boolean;
  /** Optional bold lead, e.g. "Yoga prénatal :". */
  lead?: string;
  /** Item text. */
  text: string;
}

export type JourneyBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: JourneyListItem[] };

export interface JourneySection {
  /** Section title (h2). Empty for intro-only blocks before any heading. */
  heading: string;
  blocks: JourneyBlock[];
}

export interface JourneySeoValue {
  title: string;
  description: string;
}

export interface CareJourney {
  /** Canonical ASCII route slug, e.g. "grossesse-&-maternite". */
  slug: string;
  /** Full journey title (page H1). */
  title: string;
  /** Short hub-card category label, e.g. "Vertiges". */
  hubLabel: string;
  /** Hub-card teaser, verbatim from the live hub. */
  hubTeaser: string;
  /** Lead paragraph shown above the article (empty when the article opens at an H2). */
  intro: string;
  sections: JourneySection[];
  /** Per-locale SEO title + description (live, includes " | Wenaya" suffix on titles). */
  seo: { fr: JourneySeoValue; en: JourneySeoValue };
  /** Canonical practice when the journey has a single dominant speciality. */
  relatedPracticeSlug?: string;
  /** True when the journey implicitly maps to the practices listing (multidisciplinary). */
  ctaListing?: boolean;
}

/**
 * Hub-page copy. The live site serves the same content on FR and EN (the /en hub
 * renders the French copy under an English chrome) — mirrored exactly.
 */
export const PARCOURS_DE_SOINS_HUB = {
  heading: "Parcours de soins",
  supporting: "Ensemble, prenons en charge votre pathologie pour un mieux-être optimal",
  seo: {
    fr: { title: "Parcours de soins | Wenaya", description: "Ensemble, prenons en charge votre pathologie pour un mieux-être optimal" },
    en: { title: "Parcours de soins | Wenaya", description: "Ensemble, prenons en charge votre pathologie pour un mieux-être optimal" },
  } as Record<"fr" | "en", JourneySeoValue>,
};

/**
 * All 7 care journeys in live hub order (grossesse → apprentissage → vertige →
 * alzheimer → holistique → tecar → avc).
 */
export const CARE_JOURNEYS: CareJourney[] = [
  {
    slug: "grossesse-&-maternite",
    title: "Grossesse & Maternité",
    hubLabel: "Grossesse & Maternité",
    hubTeaser: "La grossesse et la maternité sont des périodes intenses dans la vie d'une femme, marquées par des bouleversements physiques, émotionnels et psychologiques. Une prise en charge pluridisciplinaire s'avère essentielle pour accompagner les femmes dans ces étapes de leur vie et pour prévenir ou traiter les pathologies associées.Voici un tour d'horizon des approches complémentaires qui peuvent être intégrées dans le cadre d'un accompagnement global...",
    intro: "",
    sections: [
      {
        heading: "L'importance d'une prise en charge pluridisciplinaire pendant la grossesse et la maternité",
        blocks: [
          { type: "p", text: "La grossesse et la maternité sont des périodes intenses dans la vie d'une femme, marquées par des bouleversements physiques, émotionnels et psychologiques. Une prise en charge pluridisciplinaire s'avère essentielle pour accompagner les femmes dans ces étapes de leur vie et pour prévenir ou traiter les pathologies associées." },
          { type: "p", text: "Voici un tour d'horizon des approches complémentaires qui peuvent être intégrées dans le cadre d'un accompagnement global :" },
          { type: "h3", text: "1. Le yoga prénatal et postnatal" },
          { type: "p", text: "Le yoga, et plus particulièrement la méthode du Dr Bernadette de Gasquet, propose des exercices adaptés aux besoins spécifiques des femmes enceintes et des jeunes mamans." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Yoga prénatal :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Amélioration de la posture pour prévenir les douleurs lombaires et pelviennes."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Réduction du stress et de l'anxiété grâce à des exercices de respiration."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Préparation musculaire et mentale pour l'accouchement."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "lombalgies, sciatiques, troubles circulatoires (œdèmes, jambes lourdes)."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Yoga postnatal :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Rééducation du périnée et renforcement de la sangle abdominale."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Amélioration du sommeil et réduction de la fatigue."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Soutien psychologique grâce à un moment de recentrage."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "diastasis, incontinence, douleurs post-partum."
  }
] },
          { type: "h3", text: "2. La massothérapie" },
          { type: "p", text: "Les massages spécifiques pour les femmes enceintes et post-partum jouent un rôle crucial pour favoriser la détente et le bien-être." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Massage prénatal :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Soulagement des tensions musculaires."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Amélioration de la circulation sanguine et lymphatique."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Diminution des douleurs articulaires."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "douleurs lombaires, tensions cervicales, insomnie."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Massage postnatal :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Favorise la récupération physique après l'accouchement."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Aide à évacuer le stress et les tensions accumulées."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "douleurs musculaires, fatigue intense."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Massage \"Closing of the Bones\" :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Favorise la réénergie du corps."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Apporte un soutien émotionnel."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "épuisement, baby blues."
  }
] },
          { type: "h3", text: "3. La nutrition" },
          { type: "p", text: "Une alimentation adaptée est cruciale pendant la grossesse et la maternité pour prévenir et traiter certaines pathologies." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pendant la grossesse :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Objectifs :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Équilibrer les apports nutritionnels pour le bon développement du fœtus."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Prévenir les complications comme le diabète gestationnel."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "diabète gestationnel, carences en fer ou en calcium."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pendant la maternité :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Objectifs :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Soutenir la lactation avec des aliments riches en nutriments clés (fenouil, amandes, avoine)."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Aider à la récupération énergétique."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "troubles de la lactation, fatigue post-partum."
  }
] },
          { type: "h3", text: "4. La psychologie" },
          { type: "p", text: "Le soutien psychologique est indispensable pour accompagner les femmes dans les bouleversements émotionnels liés à la grossesse et à la maternité." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pendant la grossesse :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Gestion du stress lié à l’arrivée du bébé."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Accompagnement dans les cas de troubles anxieux ou dépressifs."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pendant la maternité :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Soutien en cas de dépression post-partum."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Aide à retrouver confiance en soi dans le rôle de mère."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "stress post-traumatique après un accouchement difficile, baby blues, dépression post-partum."
  }
] },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "Une prise en charge pluridisciplinaire pendant la grossesse et la maternité offre aux femmes une palette d’outils pour vivre ces périodes de manière plus sereine et épanouie. En intégrant le yoga, la massothérapie, la nutrition et la psychologie, il est possible de répondre aux besoins spécifiques des femmes et de prévenir ou traiter efficacement les pathologies associées." },
        ],
      },
    ],
    seo: {
      fr: { title: "Grossesse & Maternité | Wenaya", description: "La grossesse et la maternité sont des périodes intenses dans la vie d'une femme, marquées par des bouleversements physiques, émotionnels et psychologiques. Une prise en..." },
      en: { title: "Grossesse & Maternité | Wenaya", description: "La grossesse et la maternité sont des périodes intenses dans la vie d'une femme, marquées par des bouleversements physiques, émotionnels et psychologiques. Une prise en..." },
    },
    ctaListing: true,
  },
  {
    slug: "les-troubles-de-l-apprentissage",
    title: "Les troubles de l'apprentissage chez l'enfant : comprendre et agir",
    hubLabel: "Troubles de l'apprentissage",
    hubTeaser: "Les troubles de l'apprentissage sont des dysfonctionnements neurologiques qui affectent la façon dont un enfant traite, comprend ou exprime les informations. Ces troubles, souvent détectés à l'école primaire, peuvent avoir un impact significatif sur les performances scolaires et la confiance en soi. Une prise en charge adaptée et précoce est essentielle pour permettre à l’enfant de développer son plein potentiel...",
    intro: "Les troubles de l'apprentissage sont des dysfonctionnements neurologiques qui affectent la façon dont un enfant traite, comprend ou exprime les informations. Ces troubles, souvent détectés à l'école primaire, peuvent avoir un impact significatif sur les performances scolaires et la confiance en soi. Une prise en charge adaptée et précoce est essentielle pour permettre à l’enfant de développer son plein potentiel.",
    sections: [
      {
        heading: "Types de troubles de l'apprentissage",
        blocks: [
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": true,
    "lead": "Dyslexie :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Trouble spécifique de la lecture affectant la reconnaissance des mots et la compréhension."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Symptômes : confusions entre certaines lettres (b/d, p/q), difficulté à décoder les mots."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Dysorthographie :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Difficultés dans l'acquisition et l'application des règles orthographiques."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Symptômes : erreurs répétées dans l'écriture de mots simples ou complexes."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Dyscalculie :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Trouble affectant les compétences mathématiques."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Symptômes : difficultés à comprendre les nombres, les opérations, ou à organiser des données numériques."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Dyspraxie (trouble d’acquisition de la coordination) :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Affecte la planification et l'exécution des mouvements coordonnés."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Symptômes : maladresse, difficultés dans les activités manuelles (écriture, dessin)."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Trouble du déficit de l'attention avec ou sans hyperactivité (TDAH) :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Trouble neurodéveloppemental affectant la concentration, l’impulsivité et parfois l’hyperactivité."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Symptômes : inattention, agitation, incapacité à rester concentré."
  }
] },
        ],
      },
      {
        heading: "Causes des troubles de l'apprentissage",
        blocks: [
          { type: "p", text: "Les causes des troubles de l’apprentissage sont multifactorielles et peuvent inclure :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Facteurs génétiques :",
    "text": "antécédents familiaux."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Déséquilibres neurologiques :",
    "text": "fonctionnement atypique de certaines zones du cerveau."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Facteurs environnementaux :",
    "text": "exposition précoce à des toxines, manque de stimulation cognitive."
  }
] },
        ],
      },
      {
        heading: "Prise en charge des troubles de l'apprentissage",
        blocks: [
          { type: "p", text: "Une prise en charge pluridisciplinaire est essentielle pour répondre aux besoins spécifiques de chaque enfant. Voici les principaux axes d’intervention :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": true,
    "lead": "Diagnostic précoce :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Réalisé par un professionnel de santé (orthophoniste, neuropsychologue, pédiatre)."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Tests standardisés pour évaluer les compétences affectées."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Interventions spécifiques :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Orthophonie :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Pour les troubles du langage écrit (dyslexie, dysorthographie)."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Objectif : améliorer la lecture, l’orthographe et la compréhension."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Ergothérapie :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Pour les troubles moteurs (dyspraxie)."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Objectif : développer les habiletés motrices et la coordination."
  },
  {
    "depth": 1,
    "ordered": false,
    "lead": "Soutien psychologique :",
    "text": ""
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Accompagner l'enfant dans la gestion de son estime de soi et des émotions liées à ses difficultés."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Aménagements scolaires :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Plan d’accompagnement personnalisé (PAP) ou projet personnalisé de scolarisation (PPS)."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Adaptations possibles : temps supplémentaire pour les évaluations, recours aux outils numériques (tablettes, logiciels)."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Participation des parents :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Formation et information pour comprendre les troubles de l'enfant."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Implication dans les activités à domicile : exercices de lecture, jeux mathématiques."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Suivi régulier :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Réévaluations périodiques pour ajuster les stratégies d’intervention."
  }
] },
        ],
      },
      {
        heading: "Perspectives d’évolution",
        blocks: [
          { type: "p", text: "Bien qu’il n’existe pas de \"guérison\" pour les troubles de l’apprentissage, une prise en charge adaptée peut transformer ces difficultés en opportunités d’apprentissage différencié. Beaucoup d’enfants atteints de troubles de l’apprentissage développent des compétences exceptionnelles dans d'autres domaines grâce à leur capacité à penser différemment." },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "Les troubles de l’apprentissage requièrent une compréhension approfondie et une approche globale pour permettre à chaque enfant de surmonter ses obstacles. L’engagement conjoint des professionnels de santé, des enseignants et des parents est crucial pour créer un environnement où l’enfant peut s’épanouir et réaliser son potentiel." },
        ],
      },
    ],
    seo: {
      fr: { title: "Les troubles de l'apprentissage chez l'enfant : comprendre et agir | Wenaya", description: "Les troubles de l'apprentissage sont des dysfonctionnements neurologiques qui affectent la façon dont un enfant traite, comprend ou exprime les informations. Ces troubles, souvent détectés..." },
      en: { title: "Les troubles de l'apprentissage chez l'enfant : comprendre et agir | Wenaya", description: "Les troubles de l'apprentissage sont des dysfonctionnements neurologiques qui affectent la façon dont un enfant traite, comprend ou exprime les informations. Ces troubles, souvent détectés..." },
    },
    relatedPracticeSlug: "orthophonie",
  },
  {
    slug: "le-vertige-positionnel",
    title: "Le Vertige Positionnel Paroxystique Bénin (VPPB)",
    hubLabel: "Vertiges",
    hubTeaser: "Le Vertige Positionnel Paroxystique Bénin (VPPB) est l’une des causes les plus fréquentes de vertiges. Bien qu’impressionnant et invalidant, il s’agit d’une pathologie bénigne et généralement facile à traiter. Voici une explication claire pour mieux comprendre ce trouble et les moyens de le prendre en charge...",
    intro: "Le Vertige Positionnel Paroxystique Bénin (VPPB) est l’une des causes les plus fréquentes de vertiges. Bien qu’impressionnant et invalidant, il s’agit d’une pathologie bénigne et généralement facile à traiter. Voici une explication claire pour mieux comprendre ce trouble et les moyens de le prendre en charge.",
    sections: [
      {
        heading: "Qu’est-ce que le VPPB ?",
        blocks: [
          { type: "p", text: "Le VPPB est un trouble de l’équilibre causé par un dysfonctionnement de l’oreille interne. Cette dernière contient des structures appelées canaux semi-circulaires, qui jouent un rôle essentiel dans le maintien de l’équilibre." },
          { type: "p", text: "Dans le cas du VPPB, de petits cristaux de carbonate de calcium, appelés \"otolithes\" ou \"cristaux\", se détachent et migrent dans l’un des canaux semi-circulaires. Leur présence anormale perturbe les signaux envoyés au cerveau lors des mouvements de la tête, provoquant une sensation de vertige." },
        ],
      },
      {
        heading: "Symptômes du VPPB",
        blocks: [
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Vertiges brefs et intenses :",
    "text": "survenant lors de certains mouvements de la tête (se coucher, se lever, tourner la tête rapidement)."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Instabilité :",
    "text": "sensation d’équilibre précaire."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Nausées ou vomissements :",
    "text": "dans certains cas."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Absence de douleur ou d’autres signes neurologiques :",
    "text": "le VPPB est un trouble isolé, sans autres symptômes comme des acouphènes ou une perte auditive."
  }
] },
        ],
      },
      {
        heading: "Causes et facteurs de risque",
        blocks: [
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Vieillissement :",
    "text": "Le risque de développer un VPPB augmente avec l’âge, car les otolithes deviennent plus fragiles et peuvent se déloger plus facilement."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Traumatismes crâniens :",
    "text": "Les chocs peuvent perturber l’oreille interne."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies associées :",
    "text": "Certaines maladies comme les migraines ou des infections de l’oreille interne peuvent prédisposer au VPPB."
  }
] },
        ],
      },
      {
        heading: "Comment diagnostiquer le VPPB ?",
        blocks: [
          { type: "p", text: "Le diagnostic du VPPB repose sur une évaluation clinique réalisée par un professionnel de santé, en particulier un kinésithérapeute spécialisé en rééducation vestibulaire. Voici les principales étapes :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Test de Dix-Hallpike :",
    "text": "Ce test consiste à déplacer la tête du patient dans une position spécifique pour observer l'apparition de vertiges et de mouvements oculaires anormaux (nystagmus)."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Bilan fonctionnel vestibulaire :",
    "text": "Le spécialiste peut évaluer l’impact des troubles sur l’équilibre et la posture afin de personnaliser le traitement."
  }
] },
        ],
      },
      {
        heading: "Prise en charge du VPPB",
        blocks: [
          { type: "p", text: "La prise en charge du VPPB repose sur des techniques spécifiques de kinésithérapie vestibulaire, qui sont non invasives et très efficaces. Voici les principales approches :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": true,
    "lead": "Manœuvres de repositionnement :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Réalisées par un kinésithérapeute spécialisé, ces manœuvres permettent de replacer les cristaux délogés dans une zone de l’oreille interne où ils ne perturbent plus l’équilibre."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Techniques les plus courantes :"
  },
  {
    "depth": 2,
    "ordered": false,
    "lead": "Manœuvre d’Epley :",
    "text": "Une série de mouvements guidés et précis pour repositionner les cristaux dans le canal semi-circulaire affecté."
  },
  {
    "depth": 2,
    "ordered": false,
    "lead": "Manœuvre de Semont :",
    "text": "Une autre technique adaptée à certains patients, basée sur des changements rapides de position."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Ces manœuvres offrent un soulagement immédiat dans la majorité des cas."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Rééducation vestibulaire :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "En cas de récidive ou si les symptômes persistent, le kinésithérapeute propose des exercices personnalisés pour :"
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Habituer le cerveau à mieux tolérer les signaux perturbés."
  },
  {
    "depth": 2,
    "ordered": false,
    "text": "Renforcer les mécanismes de compensation vestibulaire."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Exemples : mouvements répétitifs de la tête, travail sur l’équilibre dynamique et statique."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Suivi et prévention :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Le kinésithérapeute enseigne également des stratégies pour limiter les risques de récidive, comme éviter les mouvements brusques ou adapter certaines activités quotidiennes."
  }
] },
        ],
      },
      {
        heading: "Quand consulter un spécialiste en kinésithérapie vestibulaire ?",
        blocks: [
          { type: "p", text: "Bien que le VPPB soit bénin, il est essentiel de consulter un kinésithérapeute vestibulaire si :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "text": "Les vertiges deviennent fréquents ou invalidants."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "Les symptômes s’accompagnent d’autres signes (perte auditive, faiblesse musculaire, troubles de la vision)."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "Les manœuvres de repositionnement n’ont pas résolu les symptômes."
  }
] },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "Le Vertige Positionnel Paroxystique Bénin peut être impressionnant, mais grâce à la spécialité de la kinésithérapie vestibulaire, il se traite de manière rapide et efficace. Les techniques adaptées et le suivi personnalisé permettent de retrouver rapidement une qualité de vie optimale tout en minimisant les risques de récidive." },
        ],
      },
    ],
    seo: {
      fr: { title: "Le Vertige Positionnel Paroxystique Bénin (VPPB) | Wenaya", description: "Le Vertige Positionnel Paroxystique Bénin (VPPB) est l’une des causes les plus fréquentes de vertiges. Bien qu’impressionnant et invalidant, il s’agit d’une pathologie bénigne et..." },
      en: { title: "Le Vertige Positionnel Paroxystique Bénin (VPPB) | Wenaya", description: "Le Vertige Positionnel Paroxystique Bénin (VPPB) est l’une des causes les plus fréquentes de vertiges. Bien qu’impressionnant et invalidant, il s’agit d’une pathologie bénigne et..." },
    },
    relatedPracticeSlug: "kinesitherapie",
  },
  {
    slug: "la-maladie-d-alzheimer",
    title: "La maladie d’Alzheimer",
    hubLabel: "Maladie d’Alzheimer",
    hubTeaser: "La maladie d'Alzheimer est une pathologie neurodégénérative complexe, affectant non seulement les fonctions cognitives mais également la qualité de vie globale des patients et de leurs proches. Une approche pluridisciplinaire s'impose pour offrir un accompagnement optimal en combinant différentes expertises. Voici les principales composantes d'une telle prise en charge...",
    intro: "La maladie d'Alzheimer est une pathologie neurodégénérative complexe, affectant non seulement les fonctions cognitives mais également la qualité de vie globale des patients et de leurs proches. Une approche pluridisciplinaire s'impose pour offrir un accompagnement optimal en combinant différentes expertises. Voici les principales composantes d'une telle prise en charge :",
    sections: [
      {
        heading: "1. La stimulation cognitive et les activités adaptées",
        blocks: [
          { type: "p", text: "La stimulation cognitive aide à ralentir la progression des symptômes et à maintenir les fonctions résiduelles." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Objectifs :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Renforcer la mémoire à court et long terme."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Améliorer l’attention, le langage et la logique."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Exemples d’interventions :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Exercices de mémoire (jeux de mots, puzzles)."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Ateliers de réminiscence pour éveiller les souvenirs."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "troubles de la mémoire, désorientation, perte des capacités cognitives."
  }
] },
        ],
      },
      {
        heading: "2. La physiothérapie et l’activité physique",
        blocks: [
          { type: "p", text: "La prise en charge physique est essentielle pour maintenir l'autonomie et prévenir les complications liées à la maladie." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Bénéfices :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Amélioration de la coordination et de l'équilibre."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Prévention des chutes."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Réduction de l’agitation grâce à l’exercice."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "raideurs articulaires, troubles moteurs, risques de chutes."
  }
] },
        ],
      },
      {
        heading: "3. La nutrition adaptée",
        blocks: [
          { type: "p", text: "Une alimentation équilibrée contribue à ralentir la dégénérescence et à prévenir les complications." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Objectifs :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Favoriser les apports en antioxydants et oméga-3, essentiels pour le cerveau."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Prévenir la dénutrition et les troubles de la déglutition."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Recommandations :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Aliments riches en vitamines B, C, et E (fruits, légumes, poissons gras)."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Repas en petites portions pour limiter la fatigue."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "dénutrition, troubles de la déglutition, perte de poids."
  }
] },
        ],
      },
      {
        heading: "4. Le soutien psychologique et social",
        blocks: [
          { type: "p", text: "L’impact émotionnel de la maladie d’Alzheimer sur le patient et les aidants nécessite un accompagnement spécifique." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pour les patients :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Soutien face à l’anxiété et à la dépression."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Maintien de l’estime de soi grâce à des activités valorisantes."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pour les aidants :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Groupes de parole pour partager les expériences."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Formation sur les stratégies de gestion du comportement."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies ciblées :",
    "text": "dépression, épuisement des aidants, isolement social."
  }
] },
        ],
      },
      {
        heading: "5. L’accompagnement médical",
        blocks: [
          { type: "p", text: "Une prise en charge médicale coordonnée est indispensable pour gérer les symptômes et les complications." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Traitements pharmacologiques :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Médicaments pour ralentir le déclin cognitif (inhibiteurs de l’acétylcholinestérase)."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Gestion des troubles comportementaux (anxiolytiques, antidépresseurs)."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Suivi spécialisé :",
    "text": ""
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Neurologue pour évaluer l’évolution de la maladie."
  },
  {
    "depth": 1,
    "ordered": false,
    "text": "Gériatre pour coordonner les soins."
  }
] },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "La maladie d’Alzheimer nécessite une prise en charge globale, incluant la stimulation cognitive, l’activité physique, une nutrition adaptée, le soutien psychologique et un suivi médical rigoureux. Cette approche pluridisciplinaire permet de mieux répondre aux besoins des patients et de leurs proches, en améliorant leur qualité de vie et en préservant leur dignité aussi longtemps que possible." },
        ],
      },
    ],
    seo: {
      fr: { title: "La maladie d’Alzheimer | Wenaya", description: "La maladie d'Alzheimer est une pathologie neurodégénérative complexe, affectant non seulement les fonctions cognitives mais également la qualité de vie globale des patients et de..." },
      en: { title: "La maladie d’Alzheimer | Wenaya", description: "La maladie d'Alzheimer est une pathologie neurodégénérative complexe, affectant non seulement les fonctions cognitives mais également la qualité de vie globale des patients et de..." },
    },
    relatedPracticeSlug: "neuropsychologie",
  },
  {
    slug: "sante-holistique",
    title: "L’approche holistique en santé : qu’est-ce que cela signifie pour vous ?",
    hubLabel: "Santé holistique",
    hubTeaser: "Présentation des avantages d’une prise en charge globale, expliquant comment combiner différentes spécialités peut améliorer la qualité de vie des patients...",
    intro: "Présentation des avantages d’une prise en charge globale, expliquant comment combiner différentes spécialités peut améliorer la qualité de vie des patients.",
    sections: [
      {
        heading: "Vers une santé globale : les clés de l'approche holistique",
        blocks: [
          { type: "h3", text: "Introduction" },
          { type: "p", text: "L'approche holistique de la santé nous invite à considérer l'être humain dans sa globalité, en intégrant corps, esprit et émotions. Au-delà de la simple absence de maladie, cette approche vise à cultiver un bien-être profond et durable. Découvrons ensemble les fondements de la santé holistique et comment l'intégrer à notre quotidien." },
          { type: "h3", text: "Le corps, l'esprit et l'énergie : une trinité indissociable" },
          { type: "p", text: "La santé holistique repose sur le principe que notre corps, notre esprit et notre énergie sont étroitement liés. Un déséquilibre dans l'une de ces dimensions peut avoir des répercussions sur les autres. Par exemple, le stress chronique peut affecter notre système immunitaire et entraîner des troubles physiques." },
          { type: "h3", text: "Les piliers d'une vie équilibrée" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Nutrition :",
    "text": "Une alimentation variée et équilibrée est le carburant de notre organisme. Choisir des aliments naturels et de saison favorise un bon fonctionnement de tous nos organes et nous apporte l'énergie nécessaire à nos activités quotidiennes."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Activité physique :",
    "text": "Le mouvement est essentiel pour maintenir notre corps en forme et notre esprit clair. Que ce soit la marche, la danse, le yoga ou le sport, l'important est de trouver une activité qui nous plaît et de la pratiquer régulièrement."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Sommeil :",
    "text": "Un sommeil réparateur est indispensable pour permettre à notre corps et à notre esprit de se régénérer. Il est donc important de créer un environnement propice au sommeil et de respecter un rythme circadien régulier."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Gestion du stress :",
    "text": "Le stress fait partie intégrante de la vie, mais un excès de stress peut nuire à notre santé. Des techniques comme la méditation, la respiration profonde ou les exercices de relaxation peuvent nous aider à gérer le stress et à retrouver notre calme intérieur."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Relations sociales :",
    "text": "Les liens que nous tissons avec les autres sont sources de bien-être. Entretenir des relations positives et passer du temps avec nos proches sont essentiels pour notre santé mentale."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Spiritualité :",
    "text": "La spiritualité, au sens large, peut prendre différentes formes selon chacun. Elle peut passer par la pratique d'une religion, la méditation, la connexion avec la nature ou tout simplement un sentiment de gratitude."
  }
] },
          { type: "h3", text: "Les bienfaits de l'approche holistique" },
          { type: "p", text: "En adoptant une approche holistique de la santé, nous pouvons :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Améliorer notre qualité de vie :",
    "text": "En prenant soin de notre corps, de notre esprit et de notre énergie, nous nous sentons plus énergiques, plus résistants et plus heureux."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Prévenir les maladies :",
    "text": "Une approche préventive permet d'identifier et de corriger les déséquilibres avant qu'ils ne dégénèrent en maladies chroniques."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Renforcer notre système immunitaire :",
    "text": "En prenant soin de nous globalement, nous renforçons nos défenses naturelles et sommes mieux équipés pour faire face aux agressions extérieures."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Développer notre conscience de soi :",
    "text": "L'approche holistique nous invite à nous connaître nous-mêmes et à mieux comprendre nos besoins."
  }
] },
          { type: "h3", text: "Intégrer l'approche holistique à votre quotidien" },
          { type: "p", text: "Pour intégrer l'approche holistique à votre vie, vous pouvez :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Consulter un professionnel de santé :",
    "text": "Un naturopathe, un médecin généraliste formé aux médecines complémentaires ou un coach de santé peuvent vous accompagner dans votre démarche."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Vous informer :",
    "text": "Lisez des livres, assistez à des ateliers ou participez à des groupes de discussion sur la santé holistique."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Expérimenter :",
    "text": "Essayez différentes pratiques comme le yoga, la méditation, la réflexologie ou l'aromathérapie pour découvrir ce qui vous convient le mieux."
  }
] },
          { type: "h3", text: "Conclusion" },
          { type: "p", text: "L'approche holistique de la santé est une invitation à prendre conscience de notre corps, de notre esprit et de notre énergie et à les considérer comme un tout indissociable. En adoptant un mode de vie sain et équilibré, nous pouvons améliorer notre bien-être et vivre une vie plus épanouie." },
        ],
      },
    ],
    seo: {
      fr: { title: "L’approche holistique en santé : qu’est-ce que cela signifie pour vous ? | Wenaya", description: "Présentation des avantages d’une prise en charge globale, expliquant comment combiner différentes spécialités peut améliorer la qualité de vie des patients......" },
      en: { title: "L’approche holistique en santé : qu’est-ce que cela signifie pour vous ? | Wenaya", description: "Présentation des avantages d’une prise en charge globale, expliquant comment combiner différentes spécialités peut améliorer la qualité de vie des patients......" },
    },
    ctaListing: true,
  },
  {
    slug: "tecar-therapie",
    title: "La TECAR Thérapie : Une approche innovante en rééducation et physiothérapie",
    hubLabel: "TECAR Thérapie",
    hubTeaser: "La TECAR thérapie (Transfert Électrique Capacitif et Résistif) est une méthode thérapeutique non invasive qui utilise des courants électriques à haute fréquence pour stimuler les tissus. Elle est de plus en plus intégrée dans la prise en charge des blessures et des pathologies musculosquelettiques par les kinésithérapeutes et physiothérapeutes, grâce à ses nombreux bienfaits. Voici un éclairage sur son fonctionnement et ses applications...",
    intro: "La TECAR thérapie (Transfert Électrique Capacitif et Résistif) est une méthode thérapeutique non invasive qui utilise des courants électriques à haute fréquence pour stimuler les tissus. Elle est de plus en plus intégrée dans la prise en charge des blessures et des pathologies musculosquelettiques par les kinésithérapeutes et physiothérapeutes, grâce à ses nombreux bienfaits. Voici un éclairage sur son fonctionnement et ses applications.",
    sections: [
      {
        heading: "Comment fonctionne la TECAR thérapie ?",
        blocks: [
          { type: "p", text: "La TECAR thérapie repose sur le principe de la résonance électromagnétique pour générer de l’énergie au sein des tissus corporels." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Mode capacitif :",
    "text": "Ce mode agit principalement sur les tissus mous, tels que les muscles et les structures riches en eau. Il est idéal pour réduire les tensions musculaires et améliorer la circulation sanguine."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Mode résistif :",
    "text": "Ce mode cible les tissus plus profonds et denses, comme les articulations, les os, les tendons et les ligaments. Il favorise la régénération tissulaire et l’élimination des inflammations."
  }
] },
          { type: "p", text: "En combinant ces deux modes, la TECAR thérapie stimule les mécanismes naturels de réparation du corps et accélère la récupération." },
        ],
      },
      {
        heading: "Les bienfaits de la TECAR thérapie",
        blocks: [
          { type: "p", text: "La TECAR thérapie offre une large gamme de bénéfices, en particulier dans le cadre de la rééducation fonctionnelle et du traitement des blessures sportives. Voici ses principaux avantages :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": true,
    "lead": "Réduction rapide de la douleur :",
    "text": "La stimulation électromagnétique aide à soulager rapidement la douleur grâce à son effet anti-inflammatoire et analgésique."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Amélioration de la circulation sanguine et lymphatique :",
    "text": "En augmentant la température des tissus, la TECAR thérapie stimule le flux sanguin, favorisant ainsi l’oxygénation des tissus et l’élimination des toxines."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Réduction de l'inflammation :",
    "text": "Elle agit sur les zones inflammées, accélérant la résolution des épanchements ou des œdèmes."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Accélération de la régénération tissulaire :",
    "text": "La TECAR favorise le renouvellement cellulaire et aide à réparer les tissus endommagés."
  },
  {
    "depth": 0,
    "ordered": true,
    "lead": "Réduction des tensions musculaires :",
    "text": "Elle permet un relâchement musculaire profond, idéal pour les patients souffrant de contractures ou de spasmes."
  }
] },
        ],
      },
      {
        heading: "Pathologies prises en charge par la TECAR thérapie",
        blocks: [
          { type: "p", text: "La TECAR thérapie est particulièrement efficace pour traiter diverses pathologies, notamment :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "lead": "Blessures aiguës :",
    "text": "entorses, déchirures musculaires, contusions."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Pathologies chroniques :",
    "text": "tendinites, bursites, fasciite plantaire."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Troubles musculosquelettiques :",
    "text": "lombalgies, cervicalgies, sciatiques."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Récupération post-opératoire :",
    "text": "suites de chirurgie orthopédique (prothèse, reconstruction ligamentaire)."
  },
  {
    "depth": 0,
    "ordered": false,
    "lead": "Réadaptation sportive :",
    "text": "prise en charge des traumatismes liés à la pratique intensive d’un sport."
  }
] },
        ],
      },
      {
        heading: "Applications pratiques et séances",
        blocks: [
          { type: "p", text: "Les séances de TECAR thérapie sont personnalisées en fonction des besoins du patient. Elles peuvent être intégrées dans un programme de rééducation plus large, associant exercices physiques, manipulations ou massages. Une séance typique dure entre 20 et 30 minutes, et les effets sont souvent perceptibles dès les premières applications." },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "La TECAR thérapie s’impose comme une technique de choix en kinésithérapie et physiothérapie, grâce à son efficacité et à son caractère non invasif. En accélérant les processus naturels de réparation et en réduisant rapidement la douleur et l’inflammation, elle constitue une alliée précieuse dans le traitement des blessures et pathologies musculosquelettiques." },
        ],
      },
    ],
    seo: {
      fr: { title: "La TECAR Thérapie : Une approche innovante en rééducation et physiothérapie | Wenaya", description: "La TECAR thérapie (Transfert Électrique Capacitif et Résistif) est une méthode thérapeutique non invasive qui utilise des courants électriques à haute fréquence pour stimuler les..." },
      en: { title: "La TECAR Thérapie : Une approche innovante en rééducation et physiothérapie | Wenaya", description: "La TECAR thérapie (Transfert Électrique Capacitif et Résistif) est une méthode thérapeutique non invasive qui utilise des courants électriques à haute fréquence pour stimuler les..." },
    },
    relatedPracticeSlug: "kinesitherapie",
  },
  {
    slug: "kinesitherapie-&-avc",
    title: "Comment la kinésithérapie peut transformer la rééducation après un AVC",
    hubLabel: "Kinésithérapie & AVC",
    hubTeaser: "Un accident vasculaire cérébral (AVC) peut changer une vie en un instant, bouleversant des fonctions de base comme la marche ou la parole. La kinésithérapie neurologique se révèle alors comme un outil indispensable pour la récupération, offrant aux patients la possibilité de retrouver une meilleure qualité de vie.",
    intro: "Un accident vasculaire cérébral (AVC) peut changer une vie en un instant, bouleversant des fonctions de base comme la marche ou la parole. La kinésithérapie neurologique se révèle alors comme un outil indispensable pour la récupération, offrant aux patients la possibilité de retrouver une meilleure qualité de vie.",
    sections: [
      {
        heading: "Qu’est-ce qu’un AVC et pourquoi est-il si dévastateur ?",
        blocks: [
          { type: "p", text: "Un AVC, c'est comme un interrupteur qui s’éteint dans votre cerveau. En une seconde, une partie de celui-ci cesse de recevoir l’oxygène et les nutriments nécessaires, ce qui peut entraîner des dommages permanents." },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "text": "L’AVC ischémique : correspond à un blocage d’une artère, semblable à un embouteillage."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "L’AVC hémorragique : survient lorsqu’une artère cérébrale se rompt, provoquant une hémorragie, comme une rupture de canalisation."
  }
] },
          { type: "p", text: "Le coup porté par un AVC est à la fois émotionnel et physique : paralysie, difficulté à parler, perte d’équilibre ou encore dépendance dans les tâches quotidiennes (s’habiller, manger), affectant non seulement le patient, mais aussi sa famille." },
        ],
      },
      {
        heading: "Les six premiers mois : une fenêtre d’opportunité",
        blocks: [
          { type: "p", text: "Le temps est un facteur clé dans la récupération après un AVC. Les six premiers mois représentent une période critique en raison de la neuroplasticité. Durant cette phase, le cerveau a une capacité accrue de se réorganiser et de former de nouvelles connexions. C’est pourquoi un travail intensif et bien encadré pendant cette période est essentiel." },
        ],
      },
      {
        heading: "Choisir le bon kinésithérapeute : un investissement pour l’avenir",
        blocks: [
          { type: "p", text: "Tous les kinésithérapeutes ne se valent pas. Il est important de choisir un spécialiste expérimenté en kinésithérapie neurologique. Bien que le coût puisse varier, investir dans un professionnel compétent peut faire une énorme différence dans la qualité de la récupération. Une prise en charge de qualité dépasse largement les considérations financières : c’est un choix pour la santé et le bien-être futur du patient." },
        ],
      },
      {
        heading: "La kinésithérapie neurologique : un allié clé dans la rééducation",
        blocks: [
          { type: "p", text: "La kinésithérapie neurologique joue un rôle crucial pour aider les patients à reprendre leur vie en main. Son impact repose sur plusieurs aspects fondamentaux :" },
          { type: "list", items: [
  {
    "depth": 0,
    "ordered": false,
    "text": "Restaurer les fonctions motrices : Des exercices ciblés permettent de renforcer les muscles, améliorer la coordination et retrouver une certaine autonomie. Grâce à la neuroplasticité, le cerveau peut réapprendre à compenser les fonctions perdues."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "Réduire la spasticité et prévenir les complications : La kinésithérapie aide à limiter la raideur musculaire et à prévenir des complications comme les contractures ou les escarres dues à l’immobilité."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "Adapter le traitement aux besoins spécifiques : Chaque patient est unique. Une évaluation initiale précise permet de concevoir un plan de traitement personnalisé, prenant en compte les capacités physiques et cognitives de chacun."
  },
  {
    "depth": 0,
    "ordered": false,
    "text": "Réapprendre les gestes du quotidien : Les kinésithérapeutes travaillent sur des mouvements fonctionnels essentiels, comme marcher, se lever ou utiliser les mains, pour redonner au patient une certaine indépendance."
  }
] },
        ],
      },
      {
        heading: "L’implication de la famille : un soutien essentiel",
        blocks: [
          { type: "p", text: "La rééducation après un AVC n’est pas une tâche solitaire. La famille joue un rôle central dans le processus de récupération, qu’il s’agisse d’encourager le patient ou d’aider à réaliser les exercices quotidiens. Un bon kinésithérapeute intègre la famille dans le parcours de soins, créant un environnement de soutien et d’empathie, crucial pour maintenir la motivation du patient." },
        ],
      },
      {
        heading: "Conclusion",
        blocks: [
          { type: "p", text: "Conclusion" },
          { type: "p", text: "En conclusion, la kinésithérapie neurologique est bien plus qu’un simple traitement. Elle représente un chemin vers l’espoir et la résilience, offrant aux patients victimes d’un AVC la possibilité de retrouver leur autonomie et de reconstruire leur vie. Avec un suivi adéquat, une implication familiale et un travail intensif, les progrès peuvent être remarquables." },
        ],
      },
    ],
    seo: {
      fr: { title: "Comment la kinésithérapie peut transformer la rééducation après un AVC | Wenaya", description: "Un accident vasculaire cérébral (AVC) peut changer une vie en un instant, bouleversant des fonctions de base comme la marche ou la parole. La kinésithérapie..." },
      en: { title: "Comment la kinésithérapie peut transformer la rééducation après un AVC | Wenaya", description: "Un accident vasculaire cérébral (AVC) peut changer une vie en un instant, bouleversant des fonctions de base comme la marche ou la parole. La kinésithérapie..." },
    },
    relatedPracticeSlug: "kinesitherapie",
  },
];

/**
 * Look up a care journey by its canonical slug. Tolerates URL-encoded param
 * forms: Next.js may deliver a dynamic-segment param percent-encoded (e.g.
 * `grossesse-%26-maternite` for the `grossesse-&-maternite` slug on its
 * on-demand fallback render), so a routing param is decoded before matching.
 */
export function getCareJourneyBySlug(slug: string): CareJourney | undefined {
  const key = slug.includes("%") ? safeDecodeURI(slug) : slug;
  return CARE_JOURNEYS.find((j) => j.slug === key);
}

/** All canonical journey slugs (for generateStaticParams). */
export function getAllCareJourneySlugs(): string[] {
  return CARE_JOURNEYS.map((j) => j.slug);
}

/** Journey card data for the hub (title, label, teaser + locale-aware href). */
export function getCareJourneysForHub(locale: "fr" | "en") {
  return CARE_JOURNEYS.map(({ slug, title, hubLabel, hubTeaser }) => ({
    slug,
    title,
    hubLabel,
    hubTeaser,
    href: careerJourneyHref(locale, slug),
  }));
}

/** Locale-aware href to a journey detail page. */
export function careerJourneyHref(locale: "fr" | "en", slug: string): string {
  return locale === "en" ? `/en/parcours-de-soins/${slug}` : `/parcours-de-soins/${slug}`;
}

/** Locale-aware href to the hub. */
export function careerJourneyHubHref(locale: "fr" | "en"): string {
  return locale === "en" ? "/en/parcours-de-soins" : "/parcours-de-soins";
}

