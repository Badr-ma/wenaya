/**
 * Practice Content — typed, API-ready editorial content for /pratiques/[slug].
 * Imported from the live wenaya.com practice pages (2026-09-01) and structured
 * into sections (heading / body / list). This layer is the single source of
 * truth for the article; swap-in from the backend later without component changes.
 *
 * - articleFr : real French article, preserved as-is (legacy HTML extracted to
 *               semantic blocks; only encoding/spacing cleaned).
 * - en        : EN titles/summaries are genuine where hasGenuineEn is true;
 *               otherwise the French summary is a visible placeholder AND the
 *               article is intentionally omitted until genuine EN editorial
 *               copy exists (see migration report).
 * - sourceUrl / liveId : dev-only traceability, never rendered.
 */

export interface PracticeSection {
  /** Section title (was an <h1>–<h4>/<strong> in the legacy source). Optional for lead sections. */
  heading?: string;
  /** Paragraphs belonging to this section. */
  body?: string[];
  /** Bullet list belonging to this section (e.g. "Verre, Bambou, Faïence, Silicone"). */
  list?: string[];
}

export interface PracticeContent {
  slug: string;
  titles: { fr: string; en: string };
  summaries: { fr: string; en: string };
  /** True when the EN summary is genuine English; false → placeholder pending EN editorial. */
  hasGenuineEn: boolean;
  image: string;
  category: string;
  /** Dev-only source traceability — never rendered. */
  sourceUrl: string;
  liveId: number;
  articleFr: PracticeSection[];
}

export const practicesContent: Record<string, PracticeContent> = {
"art-martial-therapie": {
  "slug": "art-martial-therapie",
  "titles": {
    "fr": "Art Martial Thérapie",
    "en": "Martial Arts Therapy"
  },
  "summaries": {
    "fr": "Le Jiu Jitsu est une discipline moderne d'arts martiaux aux racines très anciennes et aux grandes vertus thérapeutiques.",
    "en": "Jiu Jitsu is a modern martial arts discipline with very ancient roots and great therapeutic virtues."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/art-martial-therapie.jpg",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/art-martial-thérapie",
  "liveId": 18,
  "articleFr": [
    {
      "body": [
        "THÉRAPIE PAR LES ARTS MARTIAUX. La santé optimale se réfère à un équilibre entre les différentes composantes du système humain, allant du système de mouvement humain (impliquant tous les aspects physiques), au bien-être émotionnel et à la stabilité mentale. Il existe un certain nombre de facteurs sous-jacents qui peuvent entraîner des dysfonctionnements dans ces systèmes. La nature humaine montre qu'il n'existe pas de définition unique de la perfection, mais simplement la capacité de chaque personne à atteindre son propre potentiel. Lorsqu'un dysfonctionnement se produit dans l'une de ces trois plates-formes de santé optimales, il est essentiel de traiter et d'inverser les problèmes. Qu'il s'agisse d'un enfant, d'un adulte ou d'une personne âgée, la thérapie par les arts martiaux est un style alternatif de thérapie qui peut aider tout groupe d'âge à résoudre ses problèmes physiques, mentaux, spirituels ou émotionnels. L’Art Martial Thérapie utilise le Jiu Jitsu comme moyen d'augmenter les interactions positives avec les pairs et les relations sociales, de diminuer l'anxiété, d'augmenter l'estime de soi et de développer l'autodiscipline. Par ailleurs, le Jiu Jitsu s'est avéré être une méthode thérapeutique efficace pour les personnes âgées ou pour les personnes souffrant de déficiences qui souhaitent atteindre la stabilisation et l'équilibre. En outre, les personnes qui font preuve d'une grande agressivité, d'une faible estime de soi et d'une myriade d'autres problèmes ont grandement bénéficié de la thérapie martiale. Enfin un enfant ayant une faible estime de soi qui commence à suivre des cours d'arts martiaux ne fera pas qu'accroître sa confiance en lui, il se développera également dans un certain nombre d'autres domaines clés. Cet enfant développera ses compétences en matière d'autodéfense, ses réactions au stress dans des scénarios mentaux et physiques, et améliorera sa condition physique générale. Tous ces aspects contribuent à renforcer la confiance en soi de l'enfant."
      ]
    }
  ]
},
"coaching-sportif": {
  "slug": "coaching-sportif",
  "titles": {
    "fr": "Coaching Sportif",
    "en": "Sport Coaching"
  },
  "summaries": {
    "fr": "Programmes sportifs personnalisés, accompagnement sur mesure et suivi régulier pour transformer votre corps et votre bien‑être durablement.",
    "en": "Personalised sports programmes, tailor-made support and regular follow-up to transform your body and your well-being over time."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/coaching-sportif.jpg",
  "category": "nutrition",
  "sourceUrl": "https://wenaya.com/pratiques/coaching-sportif",
  "liveId": 24,
  "articleFr": [
    {
      "heading": "Un accompagnement sur mesure pour votre corps et votre bien‑être",
      "body": [
        "Chez Wenaya, nous croyons qu’un coaching physique efficace va bien au‑delà d’une simple séance de sport. C’est un véritable accompagnement global, pensé pour vous aider à retrouver énergie, confiance et confort dans votre corps, à votre rythme.",
        "Grâce à un coach sportif personnel, vous bénéficiez d’un suivi individualisé, adapté à votre niveau, vos contraintes et vos objectifs : perte de poids, remise en forme, prise de masse, préparation d’un événement sportif ou simplement envie de vous sentir mieux au quotidien."
      ]
    },
    {
      "heading": "Pourquoi choisir le coaching physique Wenaya ?",
      "body": [],
      "list": [
        "Programme 100 % personnalisé",
        "Chaque corps est unique. Votre coach Wenaya construit un programme d’entraînement sur mesure en fonction de votre condition physique, de votre historique sportif et de vos objectifs.",
        "Suivi régulier et motivation",
        "Le plus difficile n’est pas de commencer, mais de tenir dans la durée. Nos coachs vous accompagnent séance après séance pour maintenir votre motivation, ajuster les exercices et suivre vos progrès.",
        "Méthode douce mais efficace",
        "Le coaching physique Wenaya repose sur une progression intelligente : pas de séances « choc » inutiles, mais un travail régulier, adapté, pour des résultats durables et sans blessures.",
        "Approche globale : corps & mental",
        "Bouger, c’est aussi mieux dormir, mieux gérer le stress et renforcer la confiance en soi. Nos séances de coaching sportif sont pensées pour soutenir votre bien‑être global, pas seulement votre silhouette."
      ]
    },
    {
      "heading": "Comment se déroule un coaching physique Wenaya ?",
      "body": [],
      "list": [
        "Bilan initial complet",
        "Lors du premier rendez‑vous, votre coach réalise un bilan physique et fonctionnel : posture, mobilité, antécédents, objectifs, habitudes de vie. Cela permet de créer un plan d’action réaliste et motivant.",
        "Création de votre programme personnalisé",
        "En fonction de ce bilan, un programme d’entraînement personnalisé est élaboré : renforcement musculaire, cardio, mobilité, gainage, travail postural… Chaque séance a un objectif précis.",
        "Séances de coaching physique guidées",
        "Votre coach vous accompagne en temps réel : explication des mouvements, corrections, gestion des temps de récupération, adaptation en fonction de votre forme du jour. Vous n’êtes jamais seul(e).",
        "Suivi des progrès et ajustements",
        "Vos résultats sont suivis régulièrement : condition physique, ressenti, énergie, mesures si vous le souhaitez. Le programme évolue avec vous pour continuer à progresser sans stagnation."
      ]
    },
    {
      "heading": "À qui s’adresse le coaching physique Wenaya ?",
      "body": [
        "Le coaching physique Wenaya s’adresse à toutes les personnes qui souhaitent être accompagnées de manière professionnelle et bienveillante :"
      ],
      "list": [
        "Débutant(e)s qui veulent reprendre le sport en toute sécurité",
        "Personnes en remise en forme après une période d’arrêt",
        "Actifs débordés à la recherche de séances efficaces et ciblées",
        "Sportifs intermédiaires qui veulent franchir un cap",
        "Toute personne qui souhaite se sentir mieux dans son corps au quotidien"
      ]
    },
    {
      "body": [
        "Aucun niveau minimum n’est requis : votre coach s’adapte à vous, pas l’inverse."
      ]
    },
    {
      "heading": "Les bénéfices du coaching physique Wenaya",
      "body": [
        "En choisissant Wenaya, vous pouvez progressivement :"
      ],
      "list": [
        "Améliorer votre condition physique et votre endurance",
        "Renforcer vos muscles et protéger vos articulations",
        "Affiner votre silhouette et favoriser la perte de poids si c’est votre objectif",
        "Réduire les douleurs liées à la sédentarité (dos, nuque, épaules…)",
        "Retrouver de l’ énergie et une meilleure qualité de vie",
        "Gagner en confiance en vous et en estime de vous"
      ]
    },
    {
      "heading": "Passez à l’action avec Wenaya",
      "body": [
        "Votre corps mérite un accompagnement professionnel et personnalisé.",
        "Avec Wenaya, le coaching physique devient un rendez‑vous avec vous‑même : un moment pour progresser, vous dépasser et prendre soin de votre santé."
      ]
    }
  ]
},
"cupping-therapy-hijama": {
  "slug": "cupping-therapy-hijama",
  "titles": {
    "fr": "Cupping therapy-Hijama",
    "en": "Cupping Therapy – Hijama"
  },
  "summaries": {
    "fr": "La Hijama ou cupping thérapie soulage douleurs, inflammation et stress grâce à des ventouses pour améliorer circulation et bien-être général.",
    "en": "Hijama, or cupping therapy, uses cups to relieve pain, inflammation and stress, supporting circulation and general well-being."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/cupping-therapy-hijama.jpg",
  "category": "manualTherapies",
  "sourceUrl": "https://wenaya.com/pratiques/cupping-therapy-hijama",
  "liveId": 9,
  "articleFr": [
    {
      "body": [
        "Les ventouses peuvent être constituées de :"
      ],
      "list": [
        "Verre",
        "Bambou",
        "Faïence",
        "Silicone"
      ]
    },
    {
      "body": [
        "La thérapie par ventouses est peut-être à la mode actuellement, mais elle n’est pas nouvelle. Cela remonte aux anciennes cultures égyptiennes, chinoises et du Moyen-Orient. L'un des manuels médicaux les plus anciens au monde, le Papyrus Ebers, décrit comment les anciens Égyptiens utilisaient la thérapie par ventouses en 1 550 avant JC."
      ]
    },
    {
      "heading": "Les types",
      "body": [
        "Il existe différentes méthodes de ventouses, notamment :"
      ],
      "list": [
        "Sec",
        "Mouillé"
      ]
    },
    {
      "body": [
        "Lors des deux types de ventouses, votre thérapeute mettra une substance inflammable telle que de l'alcool, des herbes ou du papier dans une tasse et y mettra le feu. Lorsque le feu s'éteint, ils placent la coupe à l'envers sur votre peau.",
        "En refroidissant, l’air à l’intérieur de la tasse crée un vide. Cela provoque un gonflement et une rougeur de votre peau à mesure que vos vaisseaux sanguins se dilatent.",
        "Une version plus moderne des ventouses utilise une pompe en caoutchouc au lieu du feu pour créer le vide à l'intérieur de la tasse. Parfois, les thérapeutes utilisent des ventouses en silicone, qu'ils peuvent déplacer d'un endroit à l'autre sur votre peau pour un effet semblable à celui d'un massage.",
        "Les ventouses humides créent une légère aspiration en laissant une ventouse en place pendant environ 3 minutes. Le thérapeute retire ensuite la coupe et utilise un petit scalpel pour faire de légères et petites coupures sur votre peau. Ensuite, ils effectuent une deuxième aspiration pour extraire une petite quantité de sang."
      ]
    }
  ]
},
"infirmerie": {
  "slug": "infirmerie",
  "titles": {
    "fr": "Infirmerie",
    "en": "Nursing"
  },
  "summaries": {
    "fr": "L’infirmerie regroupe l’ensemble des soins infirmiers visant à assurer la prévention, le suivi et la prise en charge globale du patient",
    "en": "The infirmary brings together nursing care aimed at prevention, follow-up and the overall care of the patient."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/infirmerie.jpg",
  "category": "soins",
  "sourceUrl": "https://wenaya.com/pratiques/infirmerie",
  "liveId": 26,
  "articleFr": [
    {
      "body": [
        "L’infirmerie regroupe l’ensemble des soins infirmiers visant à assurer la prévention, le suivi et la prise en charge globale du patient, à tous les âges de la vie.",
        "L’infirmier(ère) joue un rôle central dans le parcours de soins :"
      ],
      "list": [
        "Réalisation des soins techniques (injections, perfusions, pansements, prélèvements, surveillance clinique…)",
        "Suivi des constantes et de l’évolution de l’état de santé",
        "Accompagnement thérapeutique et éducation du patient",
        "Coordination avec les autres professionnels de santé"
      ]
    },
    {
      "body": [
        "Au-delà des actes techniques, l’infirmerie repose sur une approche humaine, centrée sur l’écoute, le soutien et la relation de confiance. Elle contribue à garantir la sécurité, le confort et la continuité des soins, que ce soit en cabinet, à domicile ou en structure de santé."
      ]
    }
  ]
},
"kinesitherapie": {
  "slug": "kinesitherapie",
  "titles": {
    "fr": "Kinésithérapie",
    "en": "Physiotherapy"
  },
  "summaries": {
    "fr": "La kinésithérapie ou masso-kinésithérapie restaure mobilité et fonctions motrices grâce à massage, exercices et soins spécialisés.",
    "en": "Functional rehabilitation, manual therapy and post-operative care to restore mobility and relieve pain."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/kinesitherapie.jpg",
  "category": "manualTherapies",
  "sourceUrl": "https://wenaya.com/pratiques/kinésithérapie",
  "liveId": 4,
  "articleFr": [
    {
      "heading": "QUELS SONT LES BIENFAITS DE LA KINÉSITHÉRAPIE ?",
      "body": [
        "En plus d’être une discipline de soin à part entière, la kinésithérapie est maintenant utilisée dans de nombreux domaines de la santé. Elle est souvent indiquée pour accompagner les patients au cours de leur rééducation fonctionnelle ou leur réadaptation à la vie courante. Découvrez dans cet article en quoi elle consiste, sesbienfaits amis aussi lescaspour lesquelles elle estpréconisée."
      ]
    },
    {
      "heading": "La kinésithérapie: qu’est-ce que c’est ?",
      "body": [
        "La kinésithérapie ou masso-kinésithérapie est une technique de soin qui consiste à utiliser des techniques de massage, de manipulation et d’exercice spécifiques en vue de conserver ou de rétablir les fonctions motrices et aussi sensorielles d’un patient. Elle agit sur différentes zones et concerne aussi bien les os et les muscles que les articulations. On appelle le professionnel qui pratique la kinésithérapie: kinésithérapeute ou masseur kinésithérapeute.",
        "La kinésithérapie est réglementée depuis 1946. Elle tenait un rôle majeur dans la prise en charge des soldats blessée en guerre. Il s’agit en effet d’une technique très efficace pour soulager les douleurs physiques, rétablir les fonctions musculaires et apaiser les tensions psychiques.",
        "Depuis ces dernières années, la masso-kinésithérapie ne cesse d’évoluer. Elle est sollicitée dans des domaines encore plus larges. Le pratiquant ne se limite plus à des thérapies manuelles, mais fait intervenir des appareils plus avancés et à la pointe de la technologie. En effet, il n’est pas rare que le kinésithérapeute utilise des appareils de gymnastique, des matériels particuliers comme des attelles, un vélo, une bande électrique, une ceinture dorsale, etc.",
        "Les séances de kinésithérapie de rééducation peuvent bénéficier d’un remboursement à condition que celles-ci soient prescrites par un médecin. Il faudra que les soins soient également prodigués par un kinésithérapeute conventionné."
      ]
    },
    {
      "heading": "Kinésithérapie: pour quels cas ?",
      "body": [
        "Les indications de la kinésithérapie sont multiples. Elles varient selon les cas et couvrent un vaste champ d’action. Voici les cas pour lesquels on fait souvent appel à un masseur kinésithérapeute."
      ]
    },
    {
      "heading": "Dans le cas d’une rééducation respiratoire",
      "body": [
        "La kinésithérapie respiratoire est très recommandée dans le cadre des troubles respiratoires. Cette technique est particulièrement efficace pour aider le patient à évacuer les sécrétions pulmonaires afin de bénéficier d’une meilleure respiration. Cette technique est notamment indiquée chez les nourrissons qui ont encore du mal à tousser correctement pour libérer ses poumons."
      ]
    },
    {
      "heading": "Pour une rééducation orthopédique",
      "body": [
        "La kinésithérapie entre également en jeu pour accompagner les patients qui ont besoin d’une rééducation orthopédique. C’est le cas par exemple lors d’une perte d’un membre ou lors d’une malformation de l’appareil locomoteur."
      ]
    },
    {
      "heading": "Pour une rééducation posturale",
      "body": [
        "Les mauvaises postures sont source de nombreux problèmes de santé à savoir le mal de dos, les sciatiques, la cervicalgie… Savoir se tenir correctement demande par contre un travail soutenu et régulier d’autant plus qu’on a déjà adopté une mauvaise habitude posturale. C’est là qu’intervient la rééducation posturale par un kinésithérapeute."
      ]
    },
    {
      "heading": "Pour une rééducation cardiovasculaire et une rééducation post-traumatique",
      "body": [
        "La kinésithérapie a bien avancé dans l’accompagnement des patients qui souffrent de maladie cardiovasculaire. La thérapie favorise une meilleure circulation et distribution du sang par le biais de diverses techniques de massage et d’exercice spécifiques. Le kinésithérapeute aide également les patients à se remettre d’un traumatisme physique."
      ]
    },
    {
      "heading": "Pour la rééducation motrice et sensorielle ou rééducation fonctionnelle",
      "body": [
        "La rééducation fonctionnelle en kinésithérapie concerne notamment la récupération de l’usage des membres à la suite d’un traumatisme nerveux. C’est souvent le cas au cours d’une neuropathie périphérique ou d’un accident vasculaire cérébral."
      ]
    },
    {
      "heading": "La kinésithérapie vestibulaire",
      "body": [
        "C’est une thérapie sollicitée chez les individus qui souffrent fréquemment de vertiges ou encore de troubles de l’équilibre."
      ]
    },
    {
      "heading": "La kinésithérapie prénatale",
      "body": [
        "C’est une pratique destinée aux femmes enceintes afin de se préparer physiquement et mentalement à la grossesse."
      ]
    },
    {
      "heading": "La rééducation périnéale",
      "body": [
        "C’est une technique de la kinésithérapie qui permet de résoudre les problèmes de fuites urinaires notamment chez les femmes. Elle est surtout indiquée quelques mois après un accouchement par voie naturelle."
      ]
    },
    {
      "heading": "La rééducation abdominale",
      "body": [
        "Cette technique est surtout indiquée pour les personnes qui désirent avoir un ventre plat."
      ]
    },
    {
      "heading": "Les bienfaits de la kinésithérapie",
      "body": [
        "La kinésithérapie présente de nombreux bienfaits aussi bien sur la santé physique que mentale. Voici quelques raisons expliquant pourquoi elle est beaucoup recommandée dans diverses disciplines médicales:"
      ],
      "list": [
        "Efficace contre les spasmes et les tensions musculaires.",
        "Soulage les douleurs sans avoir recours aux médicaments antalgiques.",
        "Permets de retrouver la capacité à faire certains mouvements articulaires complexes.",
        "Traitement de divers troubles.",
        "Améliore la circulation sanguine et lymphatique.",
        "Excellent pour se détendre et évacuer le stress."
      ]
    },
    {
      "body": [
        "La kinésithérapie est aujourd’hui indispensable pour toute personne qui sort de l’hôpital à l’issue d’une maladie grave comme un accident vasculaire ou d’une opération chirurgicale lourde.",
        "En plus d’aider le patient dans le rétablissement de ses fonctions motrices, le masseur kinésithérapeute lui permet aussi de retrouver la confiance en ses capacités et de progresser."
      ]
    },
    {
      "heading": "Comment se déroule une séance de kinésithérapie ?",
      "body": [
        "Il faut rappeler que les séances de kinésithérapie se déroulent sous prescription d’un médecin. Elles se déroulent dans différents endroits: hôpital, cabinet privé, à la maison, dans un centre de soin, dans un centre sportif…",
        "Une séance de kinésithérapie commence par un examen clinique du patient. Le pratiquant pose une série de questions afin de voir tous les aspects utiles de la santé de celui-ci. Entre autres, il posera des questions sur le motif de la consultation. Il tentera aussi de savoir si la personne a des antécédents médicaux ou chirurgicaux particuliers, si le patient a déjà testé une autre thérapie pour soulager ses maux… Ensuite, le kinésithérapeute effectuera un examen physique composé de palpation, de tests et de mouvements spécifiques.",
        "Quand le diagnostic sera établi, le pratiquant définira un plan de traitement qu’il expliquera à son patient. Le nombre de séances nécessaires et la durée de chaque séance dépendent notamment du trouble à traiter.",
        "Si dans certaines situations, le résultat de la kinésithérapie est visible dès les premières séances, il faudra s’armer de patience au cours des pathologies plus complexes comme la rééducation motrice après un accident vasculaire cérébral."
      ]
    },
    {
      "heading": "Kinésithérapie: quelles sont les contre-indications ?",
      "body": [
        "La kinésithérapie n’est pas faite pour tout le monde. Il existe quelques contre-indications.",
        "Cette pratique n’est pas autorisée chez les personnes qui présentent un cancer. En effet, les techniques utilisées en kinésithérapie pourraient favoriser la dissémination des cellules cancéreuses rendant leur dépistage plus difficile.",
        "Les personnes âgées présentant un risque d’ostéoporose ne sont pas non plus autorisées à faire une séance de kinésithérapie. Le risque de fracture des os est élevé alors, il faudra s’en prémunir. Pareil pour les cas de fracture.",
        "La kiné respiratoire est déconseillée chez les personnes avec une fracture des côtes, un pneumothorax ou un spasme bronchique. Elle est également contre indiquée chez les patients qui portent un stimulateur cardiaque et ceux qui présentent une fièvre ou un état inflammatoire.",
        "Dans tous les cas, il convient de demander l’avis d’un professionnel de santé pour savoir si la pratique est autorisée ou pas pour vous.",
        "Pour finir, il faut rappeler que la kinésithérapie est une technique de soin très efficace contre les troubles mécaniques et fonctionnels du corps. Elle est notamment indiquée pour accompagner un patient, tout au long de sa maladie ou après sa guérison. Les bienfaits de la kinésithérapie sont nombreux. Il s’agit d’une thérapie complète qui couvre un large domaine d’action."
      ]
    }
  ]
},
"massotherapie": {
  "slug": "massotherapie",
  "titles": {
    "fr": "Massothérapie",
    "en": "Massotherapy"
  },
  "summaries": {
    "fr": "La massothérapie moderne utilise diverses techniques de toucher pour soulager, détendre et améliorer le bien-être de tous les âges.",
    "en": "Modern massotherapy uses various touch techniques to relieve, relax and improve well-being at all ages."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/massotherapie.jpg",
  "category": "manualTherapies",
  "sourceUrl": "https://wenaya.com/pratiques/massothérapie",
  "liveId": 16,
  "articleFr": [
    {
      "body": [
        "Le massage est l'une des premières pratiques thérapeutiques connues. Les traitements de divers troubles étaient basés sur la croyance que la thérapie par le massage avait des caractéristiques curatives partagées par de nombreuses cultures anciennes, y compris les Grecs, les Égyptiens, les Chinois et les Indiens.",
        "Il s'agit d'une technique qui consiste à pétrir ou à manipuler les muscles et autres tissus mous d'une personne afin de promouvoir sa santé et son bien-être. Dans le cadre de ce traitement manuel, les muscles, les tendons, les ligaments et les tendons, ainsi que les fascias sont saisis, manipulés et soumis à des pressions.",
        "Un nombre croissant de maladies et de circonstances médicales bénéficient du massage en plus de la thérapie habituelle."
      ]
    },
    {
      "heading": "Types de massage",
      "body": [
        "Le traitement par le massage offre différentes manières d'appliquer le toucher, la pression et l'intensité."
      ],
      "list": [
        "Le massage suédois est une technique douce qui utilise de longs mouvements, des pétrissages, des mouvements circulaires profonds, des vibrations et des tapotements. Il a un effet calmant et énergisant.",
        "Les techniques de massage qui se concentrent sur les niveaux les plus profonds des muscles et des tissus conjonctifs sont connues sous le nom de massage profond. Il est souvent utilisé pour traiter les lésions musculaires après une blessure.",
        "Contrairement au massage suédois traditionnel, qui s'adresse à tout le monde, le massage sportif cible les athlètes et leurs besoins spécifiques. Le massage des points de déclenchement permet de fixer les zones tendues des fibres musculaires, ce qui peut se produire après une blessure ou lorsque les muscles sont trop sollicités.",
        "Le liquide lymphatique assure le maintien des fluides corporels et l'élimination des déchets. Le massage lymphatique utilise un toucher doux pour améliorer le flux lymphatique. Le massage lymphatique est utile pour les personnes souffrant d'inflammation, en particulier celles qui souffrent d'arthrite et de mastectomie."
      ]
    },
    {
      "heading": "Les bienfaits de la massothérapie pour la santé",
      "body": [
        "Le massage est souvent considéré comme un élément de la médecine intégrative. Il est administré parallèlement à la thérapie conventionnelle pour de nombreuses maladies et circonstances médicales.",
        "Le massage thérapeutique augmente le flux sanguin et la chaleur des muscles, stimule les performances, réduit l'adhésion cellulaire, accroît la souplesse musculaire et réduit le risque de blessure.",
        "Le massage thérapeutique est pratiqué depuis des milliers d'années dans le monde entier. Des chercheurs britanniques ont présenté une étude dans le British Journal of Sports Medicine, qui montre que le massage thérapeutique représente environ 45 % du temps de traitement en physiothérapie. Le massage thérapeutique est utilisé de diverses manières, notamment pour la préparation aux compétitions, pendant les compétitions et pour la récupération après les compétitions.",
        "Le massage thérapeutique utilise la pression mécanique pour diminuer l'adhérence des tissus. La mobilisation et l'allongement des cellules conjonctives diminuées ou adhérentes peuvent augmenter la conformité muscle-tendon.",
        "D'un point de vue biomécanique, la rigidité passive dynamique, la rigidité active forte et l'amplitude de mouvement de l'articulation stationnaire sont utilisées pour déterminer la conformité de l'unité muscle-tendon.",
        "Le massage peut réduire le stress, augmenter la relaxation, réduire la douleur et la tension musculaire, améliorer la circulation, l'énergie et la vigilance, diminuer la pression artérielle et le rythme cardiaque et améliorer la fonction immunologique."
      ]
    }
  ]
},
"meditation": {
  "slug": "meditation",
  "titles": {
    "fr": "Méditation",
    "en": "Meditation"
  },
  "summaries": {
    "fr": "La pleine conscience est la capacité humaine fondamentale d’être pleinement présent, conscient de l’endroit où nous sommes et de ce que nous faisons, et de ne pas être trop réactif ou dépassé par ce qui se passe autour de nous.",
    "en": "Mindfulness is the fundamental human ability to be fully present, aware of where we are and what we are doing, and not to be overly reactive or overwhelmed by what is going on around us."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/meditation.png",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/méditation",
  "liveId": 13,
  "articleFr": [
    {
      "body": [
        "Pleine conscience. C'est un mot assez simple. Cela suggère que l’esprit est pleinement attentif à ce qui se passe, à ce que vous faites, à l’espace dans lequel vous vous déplacez. Cela peut paraître trivial, si ce n’est le fait ennuyeux que nous nous éloignons si souvent du sujet en question. Notre esprit prend son envol, nous perdons le contact avec notre corps et très vite nous sommes plongés dans des pensées obsessionnelles sur quelque chose qui vient de se produire ou nous nous inquiétons de l’avenir. Et cela nous rend anxieux.",
        "Pourtant, peu importe à quelle distance nous nous éloignons, la pleine conscience est là pour nous ramener là où nous sommes, à ce que nous faisons et ressentons. Si vous voulez savoir ce qu’est la pleine conscience, il est préférable de l’essayer pendant un moment. Comme il est difficile de le décrire avec des mots, vous trouverez de légères variations dans la signification dans les livres, les sites Web, les fichiers audio et vidéo."
      ]
    },
    {
      "heading": "La définition de la pleine conscience",
      "body": [
        "La pleine conscience est la capacité humaine fondamentale d’être pleinement présent, conscient de l’endroit où nous sommes et de ce que nous faisons, et de ne pas être trop réactif ou dépassé par ce qui se passe autour de nous.",
        "La pleine conscience est une qualité que tout être humain possède déjà, ce n’est pas quelque chose qu’il faut évoquer, il faut juste apprendre à y accéder."
      ]
    },
    {
      "heading": "Les types de pratique de la pleine conscience",
      "body": [
        "Bien que la pleine conscience soit innée, elle peut être cultivée grâce à des techniques éprouvées. Voici quelques exemples:"
      ],
      "list": [
        "Méditation assise, marchant, debout et en mouvement (elle est également possible allongée mais conduit souvent au sommeil) ;",
        "De courtes pauses que nous insérons dans la vie quotidienne ;",
        "Fusionner la pratique de la méditation avec d’autres activités, comme le yoga ou le sport."
      ]
    },
    {
      "body": [
        "Les avantages de la pratique de la pleine conscience :",
        "Lorsque nous méditons, cela ne nous aide pas de nous concentrer sur les bienfaits, mais plutôt de simplement pratiquer, et pourtant il y a des bienfaits, sinon personne ne le ferait.",
        "Lorsque nous sommes conscients, nous réduisons le stress, améliorons nos performances, acquérons une meilleure compréhension et une meilleure conscience en observant notre propre esprit et augmentons notre attention au bien-être des autres.",
        "La méditation de pleine conscience nous offre un moment dans notre vie où nous pouvons suspendre notre jugement et libérer notre curiosité naturelle pour le fonctionnement de l'esprit, en abordant notre expérience avec chaleur et gentillesse, envers nous-mêmes et envers les autres."
      ]
    }
  ]
},
"naturopathie": {
  "slug": "naturopathie",
  "titles": {
    "fr": "Naturopathie",
    "en": "Naturopathy"
  },
  "summaries": {
    "fr": "Un naturopathe est un praticien de santé qui applique des thérapies naturelles. La naturopathie est basée sur le pouvoir de guérison de la nature.",
    "en": "Holistic approach combining lifestyle, herbal medicine and micronutrition advice to strengthen self-healing abilities."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/naturopathie.jpg",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/naturopathie",
  "liveId": 6,
  "articleFr": [
    {
      "heading": "Qu'est-ce qu'un naturopathe ?",
      "body": [
        "Un naturopathe est un praticien de santé qui applique des thérapies naturelles.",
        "Son spectre va bien au-delà du jeûne, de la nutrition, de l'eau et de l'exercice ; il comprend des pratiques de guérison naturelle approuvées telles que l'homéopathie, l'acupuncture et la phytothérapie, ainsi que l'utilisation de méthodes modernes telles que la bio-résonance, l'ozonothérapie et l'hydrothérapie du côlon.",
        "À une époque où la technologie moderne, la pollution de l'environnement, une mauvaise alimentation et le stress jouent un rôle important dans la dégradation de la santé, la capacité d'un naturopathe à appliquer des méthodes naturelles de guérison revêt une importance considérable.",
        "Souvent, le naturopathe est le dernier recours dans la longue quête de santé d'un patient. Offrant des soins personnalisés à chaque patient, le naturopathe considère l'humanité comme une unité holistique composée du corps, de l'âme et de l'esprit.",
        "En utilisant une série de méthodes alternatives de diagnostic, un naturopathe peut souvent mettre le doigt sur une prédisposition du corps, avant l'apparition d'une maladie aiguë, et traiter le patient avec des thérapies spécifiques et des changements dans le mode de vie du patient."
      ]
    },
    {
      "heading": "Principes de la naturopathie",
      "body": [
        "La naturopathie se base sur une série de principes fondateurs :"
      ],
      "list": [
        "Le pouvoir de guérison de la nature - la nature a la capacité innée de guérir.",
        "Identifier et traiter la cause - il y a toujours une cause sous-jacente, qu'elle soit physique ou émotionnelle.",
        "Ne pas nuire - un naturopathe n'utilisera jamais de traitements susceptibles de créer d'autres conditions.",
        "Traiter la personne dans sa globalité - lors de la préparation d'un plan de traitement, tous les aspects de l'être humain sont pris en considération.",
        "Le naturopathe est un enseignant - le naturopathe permet au patient de prendre la responsabilité de sa propre santé en lui apprenant à prendre soin de lui-même.",
        "Mieux vaut prévenir que guérir - un naturopathe peut éliminer les substances et les situations toxiques du mode de vie d'un patient afin de prévenir l'apparition d'autres maladies."
      ]
    },
    {
      "heading": "Les avantages de la naturopathie",
      "body": [
        "Les naturopathes travaillent à un niveau plus personnel et consacrent plus de temps aux besoins individuels. Ils élaborent des plans de traitement qui tiennent compte de tous les aspects de la personne.",
        "La naturopathie peut être utile en complément de la médecine moderne, et nombreux sont ceux qui affirment que ces méthodes permettent au corps d'activer des mécanismes d'autoguérison."
      ]
    },
    {
      "heading": "En quoi consiste un traitement ?",
      "body": [
        "Une première consultation avec un naturopathe dure normalement environ une heure. Pendant ce temps, le naturopathe pose des questions sur l'état de santé de la personne, ses antécédents médicaux, son régime alimentaire et son mode de vie, ainsi que sur les traitements conventionnels qu'elle prend éventuellement.",
        "Le naturopathe consultant peut ensuite avoir recours à l'iridologie (examen de l'iris) ou à un diagnostic de la langue et des ongles afin d'obtenir une meilleure image de l'état de santé complet du client. Si nécessaire, des tests pathologiques tels que l'analyse des cheveux, des selles ou du sang peuvent être recommandés.",
        "Une fois toutes les informations recueillies, un plan de traitement est formulé, qui aborde tous les aspects de la vie de la personne, afin de donner à l'organisme les meilleures chances de se guérir. Le plan de traitement peut inclure des conseils sur le régime alimentaire, le mode de vie, l'exercice, la phytothérapie, les traitements homéopathiques ou d'autres remèdes appropriés. Le naturopathe peut également orienter le client vers d'autres praticiens dans le cadre d'une approche intégrée des soins de santé."
      ]
    }
  ]
},
"neuropsychologie": {
  "slug": "neuropsychologie",
  "titles": {
    "fr": "Neuropsychologie",
    "en": "Neuropsychology"
  },
  "summaries": {
    "fr": "La neuropsychologie est une discipline scientifique et une branche de la psychologie qui se concentre sur l'étude des relations cerveau-comportement, c'est-à-dire la façon dont le cerveau influence normalement ou anormalement, en raison d'une blessure ou d'une maladie, la cognition et le comportement.",
    "en": "Cognitive assessment and rehabilitation for memory, attention and executive function disorders."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/neuropsychologie.png",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/neuropsychologie",
  "liveId": 7,
  "articleFr": [
    {
      "body": [
        "Les neuropsychologues évaluent et traitent les personnes souffrant de divers types de troubles du système nerveux. Ils travaillent en étroite collaboration avec des médecins, notamment des neurologues.",
        "Les maladies, les blessures et les maladies du cerveau et du système nerveux peuvent affecter la façon dont une personne se sent, pense et se comporte. Les symptômes qui peuvent nécessiter un neuropsychologue comprennent :"
      ],
      "list": [
        "difficultés de mémoire",
        "troubles de l'humeur",
        "des difficultés d'apprentissage",
        "dysfonctionnement du système nerveux"
      ]
    },
    {
      "body": [
        "Si d’autres médecins ne parviennent pas à identifier la cause d’un symptôme, un neuropsychologue peut aider à établir un diagnostic. Si un diagnostic est déjà connu, une évaluation peut toujours être utile.",
        "Un neuropsychologue peut vous aider à déterminer les déficiences dont vous pourriez souffrir et leur gravité. Voici des exemples de conditions qu’ils évaluent et traitent :",
        "Un accident vasculaire cérébral peut affecter le comportement, la pensée, la mémoire et d’autres fonctions cérébrales de manière évidente ou subtile. Ils peuvent effectuer une évaluation pour aider à déterminer le degré de déficience liée à l’AVC.",
        "La maladie de Parkinson, une maladie évolutive, peut entraîner plusieurs problèmes neurologiques. L’examen d’un neuropsychologue peut fournir une base de référence pour l’aider à déterminer la progression de la maladie et la diminution de la fonction.",
        "La maladie d’Alzheimer et d’autres types de démence peuvent interférer avec la mémoire, la personnalité et les capacités cognitives. Un neuropsychologue peut effectuer un examen pour l’aider à l’identifier à un stade précoce.",
        "Les traumatismes crâniens peuvent provoquer une grande variété de symptômes. Un neuropsychologue peut aider à déterminer comment une blessure affecte des fonctions telles que le raisonnement ou la résolution de problèmes.",
        "Un neuropsychologue peut aider à déterminer lequel des nombreux types de troubles d'apprentissage présente une personne et à élaborer un plan de traitement."
      ]
    }
  ]
},
"nutrition": {
  "slug": "nutrition",
  "titles": {
    "fr": "Nutrition",
    "en": "Nutrition"
  },
  "summaries": {
    "fr": "La nutrition est la science qui étudie l’impact de l’alimentation sur la santé, le bien-être et le fonctionnement optimal du corps.",
    "en": "Dietary rebalancing, metabolic monitoring and precision nutrition for optimal, lasting health."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/nutrition.jpg",
  "category": "nutrition",
  "sourceUrl": "https://wenaya.com/pratiques/nutrition",
  "liveId": 5,
  "articleFr": [
    {
      "heading": "Qu'est-ce que la nutrition et pourquoi est-elle importante ?",
      "body": [
        "La nutrition se définit comme la science qui analyse les rapports entre la nourriture et la santé",
        "Elle étudie les aliments et leurs effets sur l’être humain ainsi que l’ensemble des processus par lesquels un organisme vivant utilise les aliments pour assurer le fonctionnement des fonctions vitales et la production d’énergie.",
        "Les substances nourrissantes se nomment les nutriments et comportent des produits chimiques utilisés par notre corps pour produire l’énergie et assurer le fonctionnement de l’organisme ainsi que sa croissance, ses mouvements, son immunité, sa réparation, la prévention des maladies et la reproduction.",
        "la nutrition revêt également une dimension psycho-émotionnels car l'individu a besoin d'être nourri physiologiquement, certes, mais aussi émotionnellement, intellectuellement et spirituellement. Les conseils nutritionnels doivent donc prendre en compte tous ces aspects.",
        "Enfin, la nutrition tente d’offrir des réponses adaptées aux personnes souffrant de maladies nécessitant des régimes particuliers : diabète, anémie ou de reformuler des réponses efficaces et adaptées à certaines situations : obésité, grossesse et maladies chroniques."
      ]
    },
    {
      "heading": "Objectif de la Nutrition :",
      "body": [
        "La nutrition est une discipline clé pour la Santé. Les recherches scientifiques ont démontré qu’un certain nombre de maladies sont directement impactées par notre alimentation et pourraient être déclenchées par un mode alimentaire inadapté (par exemple : carences en nutriments ou micronutriments ou excès alimentaires ciblés...).",
        "Pour être en bonne santé, nous avons besoin des différents nutriments en quantité variable et selon divers facteurs : âge, sexe, niveau d’activité physique, pathologie ou régimes particuliers…",
        "Ces nutriments (protéines, glucides, lipides, vitamines, les sels minéraux, oligo-éléments, fibres) sont généralement disponibles dans le cadre d’une alimentation saine et variée."
      ]
    },
    {
      "heading": "Les bienfaits de la nutrition",
      "body": [
        "De nombreuses études ont prouvés qu’une alimentation équilibrée peut améliorer de nombreux troubles. On peut notamment citer la perte ou la prise de poids, les troubles digestifs, les troubles du sommeil ou du comportement alimentaire.",
        "Une amélioration de l’alimentation est aussi efficace pour le vieillissement. La nutrition permet de prévenir certains troubles parfois liés à une mauvaise alimentation : maladies cardiovasculaires, diabètes, cancers…",
        "La nutrition est aussi importante pour les sportifs de haut niveau également, pour améliorer leur performance."
      ]
    },
    {
      "heading": "Comment se déroule une séance avec un spécialiste ?",
      "body": [
        "Pour une première consultation, il faut compter une heure avec le spécialiste pour qu'il détermine votre profil et vos objectifs.",
        "Ensuite, 2 ou 3 consultations de suivi s'imposent pour mettre en place de nouvelles habitudes et vérifier qu’elles sont efficaces."
      ]
    },
    {
      "heading": "Quand faut-il consulter un nutritionniste ?",
      "body": [
        "Il est conseillé de consulter un nutritionniste pour perdre ou gagner du poids, mais aussi pour adapter son régime alimentaire en fonction d’une condition particulière ou d’une maladie. Ainsi, il existe de nombreux motifs de consultation. Citons notamment :"
      ],
      "list": [
        "l’obésité ou le surpoids ;",
        "le diabète de type 2 ;",
        "l’hypercholestérolémie ;",
        "certains cancers nécessitant un régime alimentaire spécifique ;",
        "les intolérances ou allergies alimentaires ;",
        "l’anorexie ou la boulimie ;",
        "ou encore les maladies cardiovasculaires."
      ]
    },
    {
      "heading": "Les rôles du nutritionniste pour les sportifs",
      "body": [
        "Quand on pratique un sport, une alimentation équilibrée et une bonne hydratation sont des éléments primordiaux.",
        "Mais quand l’activité physique est intense, un régime spécialisé est requis. En tant que spécialiste de l’alimentation, le nutritionniste propose un régime adapté aux besoins et aux contraintes d’un sportif. Notons que le nutritionniste adapte les menus qu’il propose lors de périodes d’entrainement ou de compétition."
      ]
    }
  ]
},
"orthophonie": {
  "slug": "orthophonie",
  "titles": {
    "fr": "Orthophonie",
    "en": "Speech Therapy"
  },
  "summaries": {
    "fr": "L’orthophonie est une profession de santé relevant de la famille des métiers de soins.",
    "en": "Management of communication disorders, oral and written language, and swallowing difficulties."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/orthophonie.jpg",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/orthophonie",
  "liveId": 3,
  "articleFr": [
    {
      "heading": "QU’EST-CE QUE L’ORTHOPHONIE ?",
      "body": []
    },
    {
      "heading": "Définition de l’orthophonie",
      "body": [
        "L’orthophonie est une profession de santé relevant de la famille des métiers de soins.",
        "Elle consiste à prévenir, à évaluer et à traiter les difficultés ou troubles :"
      ],
      "list": [
        "du langage oral et écrit et de la communication,",
        "des fonctions oro-myo-faciales,",
        "des autres activités cognitives dont celles liés à la phonation, à la parole, au langage oral et écrit, à la cognition mathématique."
      ]
    },
    {
      "body": [
        "Elle consiste également à :"
      ],
      "list": [
        "à maintenir les fonctions de communication et de l’oralité dans les pathologies dégénératives et neuro-dégénératives,",
        "et à dispenser l’apprentissage d’autres formes de communication non verbale permettant de compléter ou de suppléer les fonctions verbales."
      ]
    },
    {
      "body": [
        "L’orthophonie s’attache aux dimensions plurielles du concept de langage, comme moyen d’expression, d’interaction et d’accès à la symbolisation dans toutes ses dimensions, notamment :"
      ],
      "list": [
        "dimensions linguistiques : préverbales, articulatoires, phonologiques, prosodiques, lexico-sémantiques, morphosyntaxiques, mais aussi habiletés discursives et pragmatiques, notamment dans la distinction énoncé/énonciation, …",
        "dimensions cognitives dépendantes des fonctions mnésiques, des fonctions exécutives, du raisonnement, des ressources attentionnelles et des cognitions sociales,",
        "dimensions psycho-affectives : le langage comme organisateur de la pensée et du psychisme,",
        "dimensions sociales : le langage comme vecteur de la socialisation et repère d’identité culturelle."
      ]
    },
    {
      "body": [
        "L’orthophonie s’intéresse également à toutes les altérations de la sphère oro-faciale sur les plans moteur, sensitif et physiologique, ce qui recouvre les altérations de phonèmes, les dysfonctions linguales, les troubles des modes respiratoires, la dysphagie, les troubles observés dans les paralysies faciales et les dysfonctionnements de l’appareil manducateur."
      ]
    }
  ]
},
"osteopathie": {
  "slug": "osteopathie",
  "titles": {
    "fr": "Ostéopathie",
    "en": "Osteopathy"
  },
  "summaries": {
    "fr": "L'ostéopathie est une thérapeutique manuelle fondée sur des manipulations osseuses et musculaires.",
    "en": "Global manual approach to treat musculoskeletal dysfunctions and restore the body's balance."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/osteopathie.jpg",
  "category": "manualTherapies",
  "sourceUrl": "https://wenaya.com/pratiques/osteopathie",
  "liveId": 22,
  "articleFr": [
    {
      "body": [
        "Envie de retrouver de la mobilité et de soulager des tensions musculaires ou articulaires ? L'ostéopathie peut être une solution naturelle et globale. Cette approche manuelle est reconnue pour son action sur les douleurs lombaires, les cervicales, le lumbago ou encore les contractures musculaires. En rétablissant l'équilibre du corps, elle aide à améliorer le bien-être général. Découvrez comment cette pratique peut accompagner votre quotidien."
      ]
    },
    {
      "heading": "Qu'est-ce que l'ostéopathie ?",
      "body": [
        "L’ostéopathie est une pratique exclusivement manuelle. Elle vise à redonner de la mobilité aux structures du corps : os, muscles, articulations, ligaments, fascias, organes. Elle repose sur des principes simples : le corps forme un tout, sa structure et sa fonction sont liées, et il possède une capacité naturelle d’autorégulation. L’objectif est de lever les blocages pour favoriser un retour à l’équilibre.",
        "Selon l’Organisation Mondiale de la Santé (OMS), l’ostéopathie repose sur l’utilisation du contact manuel pour l’évaluation fonctionnelle et le soutien du corps. Elle prend en compte les relations entre le corps, l’esprit, la santé et les habitudes de vie. Elle vise à optimiser la fonction corporelle et favorise l’homéostasie.",
        "En France, l’ostéopathie est reconnue comme une approche systémique qui agit sur des troubles fonctionnels. Le praticien effectue un bilan de vitalité puis mobilise manuellement les structures corporelles.",
        "Cette approche globale peut intégrer des techniques variées, comme l’ostéopathie crânienne ou viscérale. Elle agit sur le système musculo-squelettique, mais aussi sur les systèmes nerveux, circulatoire, digestif et lymphatique."
      ]
    },
    {
      "heading": "Histoire et origines de l’ostéopathie",
      "body": [
        "L’ostéopathie est née aux États-Unis en 1874 sous l’impulsion d’Andrew Taylor Still, médecin et chirurgien. Il développe une méthode centrée sur la mobilité corporelle et la capacité d’autorégulation du corps, insatisfait des limites de la médecine de son époque. En 1892, il fonde l’American School of Osteopathy à Kirksville.",
        "La discipline s’exporte rapidement en Europe, notamment au Royaume-Uni avec la création en 1917 de la British School of Osteopathy par John Martin Littlejohn, un élève de Still. En France, elle s’implante dans les années 1950 avec Paul Gény, fondateur de la première école française, et la création du Syndicat de Médecine Manuelle Ostéopathie de France (SMMOF).",
        "Longtemps réservée aux médecins, la pratique est ouverte aux non-médecins en 2002. Des décrets publiés en 2007, puis en 2014, encadrent les actes autorisés et les conditions de formation. Aujourd’hui, l’ostéopathie est l’une des trois approches complémentaires officiellement reconnues par l’État français."
      ]
    },
    {
      "heading": "Les différentes techniques ostéopathiques",
      "body": [
        "L’ostéopathie se décline en plusieurs approches complémentaires, chacune répondant à des besoins spécifiques. Selon les zones concernées et les objectifs de l’accompagnement, l’ostéopathe peut recourir à l’une ou plusieurs de ces méthodes :"
      ],
      "list": [
        "Ostéopathie structurelle : elle agit sur les articulations, les muscles, les ligaments. Elle est souvent proposée pour soulager les douleurs lombaires, les tensions dorsales ou les blocages articulaires. Cette forme est très répandue dans l'accompagnement des sportifs ou des personnes exerçant des professions physiques.",
        "Ostéopathie viscérale : elle cible les organes internes, notamment le système digestif. Elle accompagne les troubles fonctionnels digestifs comme les ballonnements ou la lourdeur abdominale. Certaines personnes ressentent aussi des améliorations sur leur posture et leur confort articulaire grâce à ce travail interne.",
        "Ostéopathie crânienne : elle s'adresse aux structures du crâne et du système nerveux central. Elle est fréquemment utilisée pour les maux de tête, les troubles du sommeil ou les cervicales et vertiges. Très douce, elle est adaptée aux personnes sensibles ou stressées."
      ]
    }
  ]
},
"psychologie": {
  "slug": "psychologie",
  "titles": {
    "fr": "Psychologie",
    "en": "Psychology"
  },
  "summaries": {
    "fr": "L'exercice de la psychologie consiste à évaluer le fonctionnement psychologique et mental ainsi que déterminer, recommander et effectuer des interventions et des traitements dans le but de favoriser la santé psychologique et de rétablir la santé mentale de l'être humain en interaction avec son environnement.",
    "en": "Cognitive-behavioral therapy (CBT), stress management, anxiety and personalized emotional support."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/psychologie.png",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/psychologie",
  "liveId": 11,
  "articleFr": [
    {
      "heading": "Le travail du psychologue consiste à :",
      "body": [],
      "list": [
        "évaluer le fonctionnement psychologique et la santé mentale de la personne;",
        "déterminer les interventions ou les traitements qui pourraient l’aider;",
        "procéder aux interventions ou aux traitements qu’il est habilité à faire, par exemple la psychothérapie;",
        "s’il estime que la personne a besoin de médicaments, lui recommander de consulter un médecin à ce sujet."
      ]
    }
  ]
},
"psychomotricite": {
  "slug": "psychomotricite",
  "titles": {
    "fr": "Psychomotricité",
    "en": "Psychomotricity"
  },
  "summaries": {
    "fr": "La psychomotricité est une méthode thérapeutique destinée aux enfants, adolescents et adultes présentant des difficultés motrices, comportementales, relationnelles ou émotionnelles.",
    "en": "Support for motor and psychomotor development disorders in children, adolescents and adults."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/psychomotricite.png",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/psychomotricité",
  "liveId": 2,
  "articleFr": [
    {
      "body": [
        "La psychomotricité est une méthode thérapeutique destinée aux enfants, adolescents et adultes présentant des difficultés motrices, comportementales, relationnelles ou émotionnelles. Elle étudie les interactions entre la perception, les sentiments, la pensée, le mouvement et le comportement. Elle observe comment ces interactions se manifestent au niveau corporel et influencent le mouvement. Le corps en mouvement constitue donc la base du travail en psychomotricité. Au-delà du corps, les compétences psychomotrices considèrent la personne dans sa globalité, c'est-à-dire qu'elles prennent également en compte sa vie psychologique ainsi que son environnement physique, social et culturel."
      ]
    },
    {
      "heading": "La psychomotricité permet de développer",
      "body": [],
      "list": [
        "les habiletés motrices,",
        "l’autonomie,",
        "les compétences sociales,",
        "la confiance en soi et envers les autres,",
        "la capacité à gérer ses émotions,",
        "et tout simplement le plaisir d’être en mouvement."
      ]
    },
    {
      "body": [
        "La psychomotricité stimule les ressources de la personne, l’amenant à mieux se connaître et à trouver en elle-même la clé de son développement. Elle améliore l’équilibre entre corps et esprit et contribue ainsi au bien-être physique, psychique et social de l’individu.",
        "Mise en œuvre à titre préventif, la psychomotricité permet également d’améliorer la qualité de vie des individus et d’éviter des retards de développement dès le plus jeune âge."
      ]
    }
  ]
},
"psychotherapie": {
  "slug": "psychotherapie",
  "titles": {
    "fr": "Psychothérapie",
    "en": "Psychotherapy"
  },
  "summaries": {
    "fr": "La psychothérapie est un accompagnement professionnel visant à comprendre ses émotions, gérer stress et anxiété, et retrouver équilibre.",
    "en": "Psychotherapy is professional support aimed at understanding your emotions, managing stress and anxiety, and restoring balance."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/psychotherapie.jpg",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/psychothérapie",
  "liveId": 14,
  "articleFr": [
    {
      "body": [
        "La psychothérapie est un accompagnement professionnel qui vise à soutenir et guider les individus dans la compréhension et la gestion de leurs émotions, pensées et comportements. Chez Wenaya Clinic, nos psychothérapeutes proposent un suivi adapté à chaque besoin, qu’il s’agisse de stress, anxiété, dépression, troubles du sommeil, difficultés relationnelles ou traumatismes passés.",
        "Nos séances offrent un espace sécurisé et confidentiel pour :",
        "Explorer vos émotions et identifier leurs impacts sur votre vie quotidienne.",
        "Développer des stratégies pour mieux gérer le stress et l’anxiété.",
        "Comprendre et transformer les schémas de pensée négatifs ou limitants.",
        "Renforcer la confiance en soi et la résilience face aux défis personnels ou professionnels.",
        "La psychothérapie peut être individuelle, en couple ou en famille, selon le besoin, et constitue un outil puissant pour favoriser un mieux-être durable et l’épanouissement personnel."
      ]
    }
  ]
},
"sexologie": {
  "slug": "sexologie",
  "titles": {
    "fr": "Sexologie",
    "en": "Sexology"
  },
  "summaries": {
    "fr": "La sexologie s’intéresse aux problèmes relatifs à la sexualité et à ses troubles dans leurs différentes formes, à savoir, organique, intrapsychique, relationnel et socioculturel.",
    "en": "Sexology focuses on problems relating to sexuality and its disorders in their various forms — organic, intrapsychic, relational and sociocultural."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/sexologie.png",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/sexologie",
  "liveId": 8,
  "articleFr": [
    {
      "body": [
        "La sexualité constitue une des expressions fondamentales de l’être humain. Elle consiste à connaître et à comprendre la sexualité humaine qui va au-delà de la reproduction. Son étude approfondie est cependant encore très récente. En plus de ses aspects multidimensionnels, la sexologie implique une variété d’aspects de la sexualité humaine :"
      ],
      "list": [
        "affectifs (attitudes, valeurs, sentiments à l’égard de soi et d’autrui, émotions, affirmation de soi, plaisir éprouvé, détermination, motivation, etc.)",
        "cognitifs (concepts, mentalité, préconceptions et conceptions, connaissances, façons de penser, etc.)",
        "physiques (biologie, morphologie, physiologie sexuelle, etc.)",
        "sociaux et interpersonnels (culture, rapport entre groupes, entre individus, etc.)",
        "comportementaux (exercice de la sexualité, comportements risqués, conduites sexuelles, discours produits sur la sexualité, etc.)."
      ]
    },
    {
      "body": [
        "La sexologie se démarque par son caractère pluridisciplinaire qui permet d’expliquer de façon globale les phénomènes sexuels.",
        "La santé sexuelle[2] est un état de bien-être physique, mental et social de la sexualité. Elle requiert une approche positive et respectueuse de la sexualité et des relations sexuelles, ainsi que la possibilité d’avoir des expériences sexuelles qui soient sources de plaisir et sans risque, libres de toute coercition, discrimination ou violence.",
        "Parmi les nombreux facteurs constituant un obstacle à la santé sexuelle, il y a :"
      ],
      "list": [
        "les infections sexuellement transmissibles;",
        "les grossesses non prévues et les avortements à risque;",
        "l’infertilité;",
        "l’impact des maladies chroniques sur le bien-être sexuel;",
        "les violences liées au sexe et à la sexualité;",
        "les mutilations génitales féminines;",
        "l’adaptation du couple à la naissance des enfants;",
        "et, certains aspects de la santé mentale."
      ]
    }
  ]
},
"sono-therapie": {
  "slug": "sono-therapie",
  "titles": {
    "fr": "Sono-thérapie",
    "en": "Sound Healing"
  },
  "summaries": {
    "fr": "La sono-thérapie (ou thérapie sono-sensorielle), est une méthode thérapeutique qui utilise les sons et les vibrations ayant un effet direct sur le système nerveux autonome.",
    "en": "Sono-therapy (or sono-sensory therapy) is a therapeutic method that uses sounds and vibrations acting directly on the autonomic nervous system."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/sono-therapie.jpg",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/sono-therapie",
  "liveId": 23,
  "articleFr": [
    {
      "body": [
        "La sono-thérapie (ou thérapie sono-sensorielle), est une méthode thérapeutique qui utilise les sons et les vibrations ayant un effet direct sur le système nerveux autonome. Les instruments utilisés sont les bols tibétains reconnus pour leurs effets relaxants sur le cerveau et le corps, ainsi que les diapasons aux fréquences elles-aussi thérapeutiques.",
        "La sono-thérapie est recommandée pour les personnes souffrant de:"
      ],
      "list": [
        "symptômes liés au stress aigü",
        "douleurs chroniques (maladie ou suite à un traumatisme)",
        "fatigue ou troubles du sommeil",
        "anxiété",
        "tensions nerveuses, migraines",
        "ou toute personne cherchant à équilibrer son système avec un moment de bien-être."
      ]
    },
    {
      "body": [
        "Le thérapeute travaille avec des instruments qui permettent de faire ralentir les ondes cérébrales pour activer le système nerveux parasympathique. Grâce à l'état de relaxation intense induit par les sons et les vibrations, le corps peut alors se régénérer plus efficacement au niveau cellulaire, relâcher les tensions, libérer des hormones bénéfiques pour le système immunitaire (sérotonine, dopamine) et retrouver un cycle repos/activité plus sain.",
        "Les bienfaits sont immédiatement ressentis et des conseils de santé pour faire perdurer les effets sont donnés par le thérapeute.",
        "En plus des séances individuelles, la sono-thérapie à Wenaya c'est également des bains sonores en groupes restreints (moins de 10 personnes) alliant le son des bols chantants, des techniques de respiration et des méditations guidées.",
        "Un programme complet afin de permettre au corps de retrouver un équilibre ortho/parasympathique essentiel pour un système immunitaire renforcé, la prévention des maladies et/ou en soutien à la guérison."
      ]
    }
  ]
},
"sophrologie": {
  "slug": "sophrologie",
  "titles": {
    "fr": "Sophrologie",
    "en": "Sophrology"
  },
  "summaries": {
    "fr": "La sophrologie utilise respiration, relaxation dynamique et visualisation pour apaiser le stress, les émotions et le corps.",
    "en": "Sophrology uses breathing, dynamic relaxation and visualisation to calm stress, emotions and the body."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/sophrologie.jpg",
  "category": "mentalHealth",
  "sourceUrl": "https://wenaya.com/pratiques/sophrologie",
  "liveId": 25,
  "articleFr": [
    {
      "body": [
        "La sophrologie est une méthode d’accompagnement globale qui combine des techniques de respiration contrôlée, de relaxation dynamique et de visualisation positive. Inspirée de pratiques occidentales et orientales (relaxation, méditation, conscience corporelle), elle permet de développer une meilleure connaissance de soi et d’activer ses capacités naturelles d’adaptation.",
        "Cette discipline s’adresse aux adultes, adolescents et enfants, et s’intègre facilement dans un parcours de soins pluridisciplinaire. Elle est particulièrement indiquée pour :"
      ],
      "list": [
        "la gestion du stress, de l’anxiété et des émotions",
        "les troubles du sommeil et la fatigue chronique",
        "l’accompagnement des périodes de transition (changements professionnels, examens, maternité, périménopause, maladie)",
        "l’amélioration de la concentration, de la confiance en soi et de la performance (scolaire, professionnelle ou sportive)",
        "l’accompagnement des douleurs chroniques et des troubles psychosomatiques"
      ]
    },
    {
      "body": [
        "Les séances de sophrologie se déroulent dans un cadre sécurisant et bienveillant, en individuel ou en groupe. Elles sont personnalisées en fonction des besoins, des objectifs et du rythme de chaque personne.",
        "Au fil des séances, la sophrologie permet de retrouver un état de calme durable, de renforcer l’autonomie et d’installer des outils simples et efficaces, facilement réutilisables dans la vie quotidienne."
      ]
    }
  ]
},
"yoga": {
  "slug": "yoga",
  "titles": {
    "fr": "Yoga",
    "en": "Yoga"
  },
  "summaries": {
    "fr": "Le yoga, pratique millénaire indienne, harmonise corps, esprit et âme grâce à postures, respiration, méditation et bien-être global.",
    "en": "Yoga, an ancient Indian practice, harmonises body, mind and soul through postures, breathing, meditation and overall well-being."
  },
  "hasGenuineEn": true,
  "image": "/pratiques/yoga.jpg",
  "category": "holisticWellness",
  "sourceUrl": "https://wenaya.com/pratiques/yoga",
  "liveId": 12,
  "articleFr": [
    {
      "heading": "Les bienfaits du yoga sur le corps :",
      "body": [],
      "list": [
        "Assouplissement . Par le biais de postures corporelles, les muscles du corps vont peu à peu s’étirer et acquérir une meilleure souplesse.",
        "Renforcement musculaire . Le yoga renforce tous les muscles du corps en douceur, même ceux qui sont habituellement peu sollicités.",
        "Libérer les tensions . Grâce aux étirements et à la relaxation, le yoga permet de se détendre.",
        "Meilleure posture générale . De manière globale, le yoga favorise une meilleure posture du corps, par le renforcement des muscles et l’apprentissage des postures d’alignement.",
        "Mieux respirer . Le yoga nous apprend à respirer en pleine conscience, ce qui permet de mieux oxygéner le sang et de gagner en vitalité. On note aussi une baisse de la tension artérielle et une capacité pulmonaire augmentée.",
        "Soulager le dos . Par la libération des tensions musculaires et l’assouplissement de la colonne, le yoga renforce le dos et aide à prévenir ou guérir le mal de dos. A pratiquer sous surveillance médicale si vous souffrez de maux de dos chroniques ou de blessures dorsales plus profondes.",
        "Stabilisation ou perte de poids . L’apprentissage de la pleine conscience et la musculation inhérents à la pratique du yoga apportent une aide précieuse pour toute personne désireuse de contrôler son poids."
      ]
    },
    {
      "heading": "Les bienfaits du yoga sur l’esprit :",
      "body": [],
      "list": [
        "Réduire le stress et l’anxiété . Apaiser le mental en se centrant sur l’instant présent et en apprenant à ne pas laisser les éléments extérieurs altérer nos pensées et modifier notre comportement.",
        "Améliorer sa concentration et sa mémoire . L’apprentissage des enchaînements de postures et la pleine conscience permettent d’augmenter sa capacité à se concentrer.",
        "Augmenter la confiance en soi . Avec le temps et la pratique du yoga, vous améliorez votre souplesse et vos connaissances pour arriver à des résultats non espérés auparavant. Une posture difficile réussie, cela booste la confiance !",
        "Une vie sexuelle épanouie . Par la meilleure connaissance de son corps et un esprit plus détendu, on remarque une augmentation de la libido et une amélioration de la vie sexuelle (excitation, désir, orgasme…).",
        "Regain de vitalité , grâce à une meilleure circulation de notre énergie au niveau des chakras.",
        "Amélioration du sommeil . Lorsqu’on est bien dans son corps et dans sa tête, le sommeil s’en retrouve plus réparateur.",
        "Un quotidien plus zen . La pratique régulière du yoga permet une meilleure présence au monde et à soi, une ouverture d’esprit et une approche plus détendue du quotidien."
      ]
    }
  ]
}
};
