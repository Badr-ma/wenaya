/**
 * À propos page content — server component, bilingual (fr | en).
 *
 * Renders the CEO-approved editorial "À propos" content (Wenaya Clinics,
 * Wenaya Corporate, Wenaya Technology · YOLO) verbatim in French, plus a
 * faithful English translation for the EN About page. Every string is kept in
 * the data constants below (fr / en) so the source apostrophes stay intact and
 * the copy is never rewritten. The `lang` prop ("fr" default | "en") selects
 * the constant set; JSX reads them via shadow locals (hero, vision, …) so the
 * markup stays identical per locale.
 *
 * Composition (editorial healthcare brand, not a template):
 *   Héros      → asymmetric two-column hero: editorial content left (eyebrow +
 *                hairline, headline, bronze statement, CTA and positioning row, beside
 *                the Wenaya ecosystem illustration with a restrained bronze accent.
 *   Vision     → split editorial column; the mission becomes a leaded pull-quote,
 *                not a rounded panel.
 *   Approche   → three columns with large 01/02/03 numerals and hairline dividers;
 *                no card backgrounds.
 *   Écosystème → asymmetric pillar layouts that alternate alignment (image left /
 *                image right); YOLO rendered as a deliberate image-free navy band.
 *   Engagements→ clean editorial grid with fine top rules, no cards.
 * The YOLO link stays hidden until an official URL is validated.
 */
import Image from "next/image";
import Link from "next/link";
import { clinicHref, h } from "@/lib/href";
import { existsSync } from "node:fs";
import path from "node:path";

const yoloImageExists = existsSync(
  path.join(process.cwd(), "public", "images", "about", "yolo-dashboard-lifestyle.jpg"),
);

const H2 =
  "heading-serif text-[#0B1220] text-[clamp(1.75rem,2.8vw,2.4rem)] leading-[1.08] tracking-[-0.015em]";
const H3_PILLAR =
  "heading-serif text-[#0B1220] text-[clamp(1.5rem,2.1vw,1.85rem)] leading-[1.25] tracking-[-0.01em]";
const BODY =
  "text-[#2B2F36]/75 text-[0.9375rem] sm:text-base leading-[1.7]";
const LEAD =
  "text-[#2B2F36]/60 text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.6]";
const LINK =
  "inline-flex items-center gap-1.5 text-[#B88A5A] font-semibold text-sm transition-all hover:gap-2.5 hover:text-[#9A7242] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]";
const CTA =
  "inline-flex items-center gap-2.5 mt-8 h-12 sm:h-[52px] px-7 sm:px-8 rounded-full bg-[#0B1220] text-[#F2EFE9] text-sm font-semibold transition-all duration-300 hover:bg-[#B88A5A] hover:text-[#0B1220] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3.5">
      <span
        className="inline-block h-px w-7 bg-[#B88A5A] shrink-0"
        aria-hidden="true"
      />
      <span className="text-[#B88A5A] font-semibold uppercase tracking-[0.22em] text-[11px] sm:text-xs">
        {children}
      </span>
    </p>
  );
}

const frHero = {
  imageAlt:
    "Illustration de l’écosystème Wenaya reliant Clinics, Corporate et YOLO AI",
  eyebrow: "À propos de Wenaya",
  title: "Réinventer la manière de prendre soin de sa santé.",
  lead: "Parce que la santé est à la base de tout.",
  paragraphs: [
    "Elle influence notre énergie, notre équilibre, notre capacité à apprendre, à travailler, à créer, à nous dépasser et à profiter pleinement de la vie.",
    "Chez Wenaya, nous voulons dépasser les interventions isolées pour construire une approche plus proactive, plus humaine, plus personnalisée et plus continue.",
  ],
  cta: "Découvrir notre écosystème",
  positions: [
    { index: "01", label: "Prévention" },
    { index: "02", label: "Longévité" },
    { index: "03", label: "Performance" },
  ],
};

const frVision = {
  eyebrow: "Notre vision",
  title: "La santé rend tout le reste possible.",
  paragraphs: [
    "Nous croyons que chacun devrait pouvoir prendre soin de sa santé avec un temps d'avance : dès l'enfance, à chaque étape de la vie et dans son environnement personnel comme professionnel.",
    "La santé ne se résume pas à l'absence de maladie. Elle concerne aussi les capacités physiques, mentales et cognitives, le bien-être et la possibilité de préserver ces ressources dans le temps.",
    "Notre ambition est de relier les besoins, les objectifs, les connaissances, les professionnels et les données utiles pour accompagner chaque personne de manière plus cohérente.",
  ],
  missionTitle: "Notre mission",
  missionText:
    "Rendre la santé plus proactive, personnalisée et continue, en associant expertise humaine, connaissances scientifiques et intelligence artificielle spécialisée.",
};

const frApproach = {
  eyebrow: "Notre approche",
  title: "Comprendre. Agir. Progresser.",
  intro:
    "Trois principes guident notre manière d'accompagner les personnes et les organisations.",
  panels: [
    {
      index: "01",
      title: "Comprendre",
      body: "Chaque personne possède une histoire, un environnement et des objectifs différents. Nous cherchons à comprendre sa situation dans sa globalité, avec des évaluations biologiques, physiques et cognitives lorsque cela est pertinent.",
    },
    {
      index: "02",
      title: "Agir",
      body: "Les informations doivent se transformer en actions concrètes. Nous mobilisons les professionnels, les soins, les interventions et les outils adaptés pour construire des accompagnements cohérents.",
    },
    {
      index: "03",
      title: "Progresser",
      body: "La santé évolue. Nous privilégions le suivi, la mesure des progrès et l'adaptation des parcours dans le temps, plutôt qu'une succession d'interventions sans lien entre elles.",
    },
  ],
};

const frEcosystem = {
  eyebrow: "Notre écosystème",
  title: "Une seule conviction. Trois manières d'agir.",
  intro:
    "La santé accompagne l'humain partout où il vit, travaille et évolue. Wenaya relie l'accompagnement clinique, la santé en entreprise et la technologie spécialisée autour de cette même vision.",
  clinics: {
    eyebrow: "Wenaya Clinics",
    title: "La santé à chaque étape de la vie.",
    subtitle: "Prévention · Longévité · Performance",
    body: "Prendre soin de sa santé ne devrait pas commencer lorsqu'un problème apparaît. À travers nos centres, nos professionnels et nos parcours pluridisciplinaires, nous accompagnons les personnes dès le plus jeune âge.",
    details: [
      {
        lead: "Prévention.",
        text: " Anticiper les risques, accompagner le développement et favoriser de bonnes habitudes de santé.",
      },
      {
        lead: "Longévité.",
        text: " Préserver la santé, l'autonomie, la mobilité et les capacités physiques et cognitives au fil des années.",
      },
      {
        lead: "Performance.",
        text: " Développer ses capacités, améliorer sa condition physique et sa récupération, et progresser vers ses objectifs.",
      },
    ],
    closing:
      "Selon les besoins, nos bilans biologiques, physiques et cognitifs aident à définir les priorités d'un parcours adapté, avec l'appui de professionnels qualifiés.",
    cta: "Découvrir Wenaya Clinics",
    image: "/images/Cabinet%20de%20kin%C3%A9sith%C3%A9rapie%20lumineux%20et%20moderne.png",
    imageAlt:
      "Professionnels et patients Wenaya lors d'un accompagnement pluridisciplinaire au centre de Casablanca",
  },
  corporate: {
    eyebrow: "Wenaya Corporate",
    title: "Avant d'être collaborateurs, nous sommes des êtres humains.",
    paragraphs: [
      "Au travail, chacun conserve sa santé, ses préoccupations, ses besoins et ses aspirations. La santé physique, mentale et cognitive participe à notre expérience quotidienne et à notre capacité à apprendre, collaborer et nous épanouir.",
      "Nos programmes associent prévention, wellness, sensibilisation, formation et accompagnement, en tenant compte des réalités humaines et organisationnelles.",
      "Bilans, ateliers, événements, formations, accompagnements individuels ou collectifs et solutions digitales : nous cherchons à construire des démarches utiles, cohérentes et respectueuses de la confidentialité des personnes.",
    ],
    highlight:
      "Prendre soin des collaborateurs, c'est d'abord prendre soin des personnes.",
    cta: "Découvrir Wenaya Corporate",
    image:
      "/images/Espace%20de%20travail%20chaleureux%20et%20collaboratif%20(1).png",
    imageAlt:
      "Atelier bien-être en entreprise conduit par les équipes Wenaya Corporate",
  },
  technology: {
    eyebrow: "Wenaya Technology · YOLO",
    title:
      "L'intelligence artificielle doit comprendre le contexte, pas seulement répondre à des questions.",
    paragraphs: [
      "Les applications, les informations et les solutions d'intelligence artificielle se multiplient. Mais leur abondance ne garantit ni des recommandations adaptées, ni la coordination des professionnels, ni la continuité de l'accompagnement.",
      "Avec YOLO, nous développons une intelligence spécialisée, pensée pour les besoins spécifiques de notre modèle de santé : relier connaissances scientifiques, données pertinentes, objectifs individuels, professionnels et étapes du parcours.",
      "Notre ambition est de soutenir la personnalisation, la coordination et le suivi dans le temps, avec des exigences de fiabilité, de protection des données, de transparence et de supervision humaine.",
    ],
    highlight:
      "La technologie n'a pas vocation à remplacer l'humain, mais à mieux l'accompagner.",
    labels: ["Comprendre", "Anticiper", "Accompagner"],
    image: "/images/about/yolo-dashboard-lifestyle.jpg",
    imageAlt:
      "Personne se relaxant à la maison en consultant le tableau de bord YOLO sur son smartphone (illustration conceptuelle)",
  },
};

const frValues = {
  eyebrow: "Ce qui nous guide",
  title: "Une vision ambitieuse. Des principes essentiels.",
  items: [
    {
      title: "L'humain avant tout",
      body: "Respecter les besoins, le contexte et les aspirations de chaque personne.",
    },
    {
      title: "La prévention",
      body: "Agir plus tôt, lorsque cela est possible, pour mieux préserver la santé.",
    },
    {
      title: "La science",
      body: "Nous appuyer sur les connaissances disponibles et l'expertise des professionnels.",
    },
    {
      title: "La personnalisation",
      body: "Éviter les réponses universelles et adapter les parcours aux besoins réels.",
    },
    {
      title: "La continuité",
      body: "Favoriser le suivi, l'évaluation et l'ajustement dans le temps.",
    },
    {
      title: "L'innovation responsable",
      body: "Développer des technologies utiles, fiables et respectueuses de la confidentialité.",
    },
  ],
};

const frAmbition = {
  eyebrow: "Notre ambition pour demain",
  title: "Faire de la santé une démarche naturelle, continue et accessible.",
  paragraphs: [
    "Nous imaginons un avenir où chacun peut mieux comprendre sa santé, identifier ses priorités, accéder aux bonnes expertises et suivre ses progrès dans le temps.",
    "Un avenir où les entreprises considèrent la santé de leurs collaborateurs comme une dimension essentielle de leur responsabilité humaine.",
    "Un avenir où la technologie relie les connaissances, les professionnels et les personnes, au lieu de multiplier les outils sans continuité.",
    "C'est cette vision que nous construisons à travers Wenaya, ses centres, ses programmes en entreprise et ses technologies.",
  ],
  signature: "Wenaya. Votre santé, avec un temps d'avance.",
};

const enHero = {
  imageAlt: "Illustration of the Wenaya ecosystem connecting Clinics, Corporate and YOLO AI",
  eyebrow: "About Wenaya",
  title: "Reinventing the way we care for our health.",
  lead: "Because health is the foundation of everything.",
  paragraphs: [
    "It shapes our energy, our balance, our ability to learn, to work, to create, to push further and to fully enjoy life.",
    "At Wenaya, we want to go beyond isolated interventions to build a more proactive, more human, more personalised and more continuous approach.",
  ],
  cta: "Discover our ecosystem",
  positions: [
    { index: "01", label: "Prevention" },
    { index: "02", label: "Longevity" },
    { index: "03", label: "Performance" },
  ],
};

const enVision = {
  eyebrow: "Our vision",
  title: "Health makes everything else possible.",
  paragraphs: [
    "We believe that everyone should be able to care for their health with a head start: from childhood, at every stage of life and in both their personal and professional environments.",
    "Health is not just the absence of disease. It also covers physical, mental and cognitive abilities, wellbeing and the ability to preserve these resources over time.",
    "Our ambition is to connect needs, goals, knowledge, professionals and relevant data to support each person more consistently.",
  ],
  missionTitle: "Our mission",
  missionText:
    "Make health more proactive, personalised and continuous, combining human expertise, scientific knowledge and specialised artificial intelligence.",
};

const enApproach = {
  eyebrow: "Our approach",
  title: "Understand · Act · Progress",
  intro: "Three principles guide how we support individuals and organisations.",
  panels: [
    {
      index: "01",
      title: "Understand",
      body: "Each person has their own story, environment and goals. We seek to understand every situation in its entirety, with biological, physical and cognitive assessments when relevant.",
    },
    {
      index: "02",
      title: "Act",
      body: "Information must turn into concrete action. We bring together the right professionals, care, interventions and tools to build coherent programmes of support.",
    },
    {
      index: "03",
      title: "Progress",
      body: "Health evolves. We favour follow-up, measuring progress and adjusting programmes over time, rather than a series of disconnected interventions.",
    },
  ],
};

const enEcosystem = {
  eyebrow: "Our ecosystem",
  title: "One conviction. Three ways to act.",
  intro:
    "Health accompanies people wherever they live, work and evolve. Wenaya connects clinical care, workplace health and specialised technology around the same vision.",
  clinics: {
    eyebrow: "Wenaya Clinics",
    title: "Health at every stage of life.",
    subtitle: "Prevention · Longevity · Performance",
    body: "Caring for your health should not begin when a problem appears. Through our centres, our professionals and our multidisciplinary programmes, we support people from the very earliest age.",
    details: [
      {
        lead: "Prevention.",
        text: " Anticipating risks, supporting development and fostering good health habits.",
      },
      {
        lead: "Longevity.",
        text: " Preserving health, independence, mobility and physical and cognitive abilities over the years.",
      },
      {
        lead: "Performance.",
        text: " Developing abilities, improving physical condition and recovery, and progressing towards goals.",
      },
    ],
    closing:
      "Depending on needs, our biological, physical and cognitive assessments help define the priorities of a tailored programme, with the support of qualified professionals.",
    cta: "Discover Wenaya Clinics",
    image: "/images/Cabinet%20de%20kin%C3%A9sith%C3%A9rapie%20lumineux%20et%20moderne.png",
    imageAlt:
      "Wenaya professionals and patients during a multidisciplinary appointment at the Casablanca centre",
  },
  corporate: {
    eyebrow: "Wenaya Corporate",
    title: "Before being employees, we are human beings.",
    paragraphs: [
      "At work, everyone keeps their health, their concerns, their needs and their aspirations. Physical, mental and cognitive health shapes our daily experience and our ability to learn, collaborate and thrive.",
      "Our programmes combine prevention, wellness, awareness, training and support, taking into account human and organisational realities.",
      "Assessments, workshops, events, training, individual or collective support and digital solutions: we aim to build useful, coherent approaches that respect confidentiality.",
    ],
    highlight: "Taking care of employees starts with taking care of people.",
    cta: "Discover Wenaya Corporate",
    image:
      "/images/Espace%20de%20travail%20chaleureux%20et%20collaboratif%20(1).png",
    imageAlt: "Workplace wellness workshop led by the Wenaya Corporate teams",
  },
  technology: {
    eyebrow: "Wenaya Technology · YOLO",
    title:
      "Artificial intelligence must understand context, not just answer questions.",
    paragraphs: [
      "Applications, information and artificial intelligence solutions are multiplying. But their abundance guarantees neither tailored recommendations, nor coordination between professionals, nor continuity of care.",
      "With YOLO, we are developing specialised intelligence designed for the specific needs of our healthcare model: connecting scientific knowledge, relevant data, individual goals, professionals and the steps of each journey.",
      "Our ambition is to support personalisation, coordination and follow-up over time, with requirements of reliability, data protection, transparency and human supervision.",
    ],
    highlight:
      "Technology is not meant to replace humans, but to support them better.",
    labels: ["Understand", "Anticipate", "Support"],
    image: "/images/about/yolo-dashboard-lifestyle.jpg",
    imageAlt:
      "Person relaxing at home while consulting the YOLO dashboard on their smartphone (conceptual illustration)",
  },
};

const enValues = {
  eyebrow: "What guides us",
  title: "An ambitious vision. Essential principles.",
  items: [
    {
      title: "People first",
      body: "Respecting the needs, context and aspirations of each person.",
    },
    {
      title: "Prevention",
      body: "Acting earlier, whenever possible, to better preserve health.",
    },
    {
      title: "Science",
      body: "Relying on available knowledge and the expertise of professionals.",
    },
    {
      title: "Personalisation",
      body: "Avoiding one-size-fits-all answers and adapting programmes to real needs.",
    },
    {
      title: "Continuity",
      body: "Encouraging follow-up, evaluation and adjustment over time.",
    },
    {
      title: "Responsible innovation",
      body: "Developing useful, reliable technologies that respect confidentiality.",
    },
  ],
};

const enAmbition = {
  eyebrow: "Our ambition for tomorrow",
  title: "Make health a natural, continuous and accessible part of daily life.",
  paragraphs: [
    "We imagine a future where everyone can better understand their health, identify their priorities, access the right expertise and track their progress over time.",
    "A future where companies consider their employees' health an essential dimension of their human responsibility.",
    "A future where technology connects knowledge, professionals and individuals, instead of multiplying disconnected tools.",
    "This is the vision we are building through Wenaya, its centres, its workplace programmes and its technologies.",
  ],
  signature: "Wenaya. Your health, with a head start.",
};

export default function APropos({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const hero = lang === "en" ? enHero : frHero;
  const vision = lang === "en" ? enVision : frVision;
  const approach = lang === "en" ? enApproach : frApproach;
  const ecosystem = lang === "en" ? enEcosystem : frEcosystem;
  const values = lang === "en" ? enValues : frValues;
  const ambition = lang === "en" ? enAmbition : frAmbition;

  return (
    <div className="wenaya-about bg-[#FAF8F4] text-[#0B1220]" data-section-bg="light">
      {/* Héros */}
      <section
        aria-labelledby="wa-title"
        className="pt-14 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 scroll-mt-24"
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-14 lg:gap-y-0">
            {/* Editorial content */}
            <div className="lg:col-span-5 lg:max-w-[500px]">
              <div className="flex items-center gap-4">
                <p className="text-[#B88A5A] font-semibold uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                  {hero.eyebrow}
                </p>
                <span
                  className="h-px w-8 sm:w-14 bg-[#B88A5A]/60"
                  aria-hidden="true"
                />
              </div>

              <h1
                id="wa-title"
                className="heading-serif text-[#0B1220] mt-7 sm:mt-8 text-[clamp(2.25rem,3.5vw,3.5rem)] leading-[1.08] tracking-[-0.02em] text-balance"
              >
                {hero.title}
              </h1>

              <p className="heading-serif text-[#B88A5A] mt-6 text-[clamp(1.125rem,1.3vw,1.3125rem)] leading-[1.4]">
                {hero.lead}
              </p>

              <div className="mt-8 space-y-4 max-w-xl">
                {hero.paragraphs.map((p, i) => (
                  <p key={i} className={BODY}>
                    {p}
                  </p>
                ))}
              </div>

              <a href="#notre-ecosysteme" className={CTA}>
                {hero.cta}
                <span aria-hidden="true">→</span>
              </a>

              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-8">
                {hero.positions.map((pos, i) => (
                  <li key={pos.index} className="flex items-center gap-x-4">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-px bg-[#0B1220]/20"
                      />
                    )}
                    <span
                      aria-hidden="true"
                      className="font-mono text-[#B88A5A] text-xs sm:text-sm tabular-nums"
                    >
                      {pos.index}
                    </span>
                    <span className="text-[#2B2F36]/70 text-[13px] sm:text-sm uppercase tracking-[0.12em] font-medium">
                      {pos.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ecosystem illustration */}
            <div className="flex items-center justify-center lg:col-span-7 lg:col-start-6">
              <div className="relative w-full">
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -left-5 -bottom-5 w-32 h-32 border border-[#B88A5A]/35"
                />
                <div className="relative mx-auto aspect-[60/53] w-full max-w-[850px] bg-transparent">
                  <Image
                    src="/images/wenaya-ecosystem-anime.svg"
                    alt={hero.imageAlt}
                    fill
                    priority
                    sizes="(max-width:1023px) 90vw, (max-width:1600px) 55vw, 850px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre vision */}
      <section
        id="notre-vision"
        aria-labelledby="vision-title"
        className="max-w-5xl mx-auto px-6 py-10 sm:py-14 lg:py-20 scroll-mt-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          <div className="lg:col-span-5">
            <SectionLabel>{vision.eyebrow}</SectionLabel>
            <h2 id="vision-title" className={`${H2} mt-7`}>
              {vision.title}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-2">
            <div className="space-y-6">
              {vision.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? `${LEAD} text-[#2B2F36]/70` : BODY}>
                  {p}
                </p>
              ))}
            </div>
            <blockquote className="mt-12 border-l-2 border-[#B88A5A] pl-6 sm:pl-8">
              <p className="text-[#0B1220]/60 font-semibold uppercase tracking-[0.2em] text-[11px] sm:text-xs">
                {vision.missionTitle}
              </p>
              <p className="heading-serif text-[#0B1220] text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.4] mt-4 max-w-2xl">
                {vision.missionText}
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Notre approche */}
      <section id="notre-methode" aria-labelledby="method-title" className="bg-[#F2EFE9] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end">
            <div className="lg:col-span-7">
              <SectionLabel>{approach.eyebrow}</SectionLabel>
              <h2 id="method-title" className={`${H2} mt-7`}>
                {approach.title}
              </h2>
            </div>
            <p className="lg:col-span-5 text-[#2B2F36]/60 text-base sm:text-lg leading-[1.7] pb-2">
              {approach.intro}
            </p>
          </div>

          <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#0B1220]/[0.12]">
            {approach.panels.map((panel) => (
              <article
                key={panel.index}
                className="py-10 lg:py-0 lg:px-10 lg:first:pl-0 lg:last:pr-0"
              >
                <span
                  className="font-mono text-[#B88A5A] text-3xl sm:text-4xl font-semibold tabular-nums"
                  aria-hidden="true"
                >
                  {panel.index}
                </span>
                <h3 className="heading-serif text-[#0B1220] text-lg sm:text-xl leading-[1.2] mt-5">
                  {panel.title}
                </h3>
                <p className="text-[#2B2F36]/70 text-[0.9375rem] sm:text-base leading-[1.7] mt-3 max-w-sm">
                  {panel.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Notre écosystème */}
      <section
        id="notre-ecosysteme"
        aria-labelledby="ecosystem-title"
        className="scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-6 pt-10 sm:pt-14 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end">
            <div className="lg:col-span-7">
              <SectionLabel>{ecosystem.eyebrow}</SectionLabel>
              <h2 id="ecosystem-title" className={`${H2} mt-7`}>
                {ecosystem.title}
              </h2>
            </div>
            <p className="lg:col-span-5 text-[#2B2F36]/60 text-base sm:text-lg leading-[1.7] pb-2 border-l border-[#0B1220]/[0.14] pl-6">
              {ecosystem.intro}
            </p>
          </div>
        </div>

        {/* Wenaya Clinics — image left */}
        <article
          id="clinics"
          className="max-w-5xl mx-auto px-6 py-10 sm:py-14 lg:py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-6">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -right-4 -bottom-4 w-32 h-32 border border-[#B88A5A]/35"
                />
                <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden bg-[#0B1220]">
                  <Image
                    src={ecosystem.clinics.image}
                    alt={ecosystem.clinics.imageAlt}
                    fill
                    sizes="(max-width:1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-4">
              <SectionLabel>{ecosystem.clinics.eyebrow}</SectionLabel>
              <h3 className={`${H3_PILLAR} mt-6`}>{ecosystem.clinics.title}</h3>
              <p className="text-[#B88A5A] font-medium text-sm mt-4 tracking-[0.12em] uppercase">
                {ecosystem.clinics.subtitle}
              </p>
              <p className={`${BODY} mt-6 max-w-xl`}>{ecosystem.clinics.body}</p>
              <ul className="mt-6 space-y-4 max-w-xl">
                {ecosystem.clinics.details.map((d, i) => (
                  <li key={i} className="flex gap-4 border-t border-[#0B1220]/[0.1] pt-4">
                    <span
                      className="font-mono text-[#B88A5A] text-xs pt-1 tabular-nums"
                      aria-hidden="true"
                    >
                      {`0${i + 1}`}
                    </span>
                    <p className="text-[#2B2F36]/75 text-[0.9375rem] sm:text-base leading-[1.7]">
                      <strong className="text-[#0B1220] font-semibold">
                        {d.lead}
                      </strong>
                      {d.text}
                    </p>
                  </li>
                ))}
              </ul>
              <p className={`${BODY} mt-6 max-w-xl`}>{ecosystem.clinics.closing}</p>
              <Link href={clinicHref(lang)} className={`${LINK} mt-7`}>
                {ecosystem.clinics.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Wenaya Corporate — image right */}
        <article
          id="corporate"
          className="max-w-5xl mx-auto px-6 py-10 sm:py-14 lg:py-20 border-t border-[#0B1220]/[0.1]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-6 lg:col-start-1">
              <SectionLabel>{ecosystem.corporate.eyebrow}</SectionLabel>
              <h3 className={`${H3_PILLAR} mt-6 max-w-lg`}>
                {ecosystem.corporate.title}
              </h3>
              <div className="mt-6 space-y-4 max-w-xl">
                {ecosystem.corporate.paragraphs.map((p, i) => (
                  <p key={i} className={BODY}>
                    {p}
                  </p>
                ))}
              </div>
              <p className="heading-serif text-[#0B1220] text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.4] mt-7 max-w-lg">
                {ecosystem.corporate.highlight}
              </p>
              <Link href={h(lang, "/corporate")} className={`${LINK} mt-7`}>
                {ecosystem.corporate.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -left-4 -top-4 w-32 h-32 border border-[#0B1220]/15"
                />
                <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden bg-[#0B1220]">
                  <Image
                    src={ecosystem.corporate.image}
                    alt={ecosystem.corporate.imageAlt}
                    fill
                    sizes="(max-width:1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Wenaya Technology · YOLO — editorial navy band: approved copy left,
            lifestyle photograph right (person relaxing at home with the YOLO
            dashboard on a smartphone). Until the approved photograph exists at
            /images/about/yolo-dashboard-lifestyle.jpg the decorative panel
            renders instead (the band never shows a broken image); drop the
            file and rebuild to swap it in. */}
        <article
          id="technology"
          className="bg-[#0B1220] text-[#F2EFE9] mt-10 lg:mt-14 scroll-mt-24"
        >
          <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start lg:items-center">
              <div className="lg:col-span-5 xl:col-span-5">
                <SectionLabel>{ecosystem.technology.eyebrow}</SectionLabel>
                <h3 className="heading-serif text-[#FAF8F4] text-[clamp(2rem,3.4vw,3.25rem)] leading-[1] tracking-[-0.02em] mt-6">
                  YOLO
                </h3>
                <p className="heading-serif text-[#B88A5A] text-[clamp(1.125rem,1.7vw,1.5rem)] leading-[1.35] mt-5 max-w-xl">
                  {ecosystem.technology.title}
                </p>

                <div className="mt-12 space-y-7 border-t border-white/10 pt-11">
                  {ecosystem.technology.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="flex items-start gap-4 text-[#FAF8F4]/75 text-[0.9375rem] sm:text-base leading-[1.8]"
                    >
                      <span
                        className="shrink-0 font-mono text-[#B88A5A] text-[13px] pt-[3px] tabular-nums"
                        aria-hidden="true"
                      >
                        {`0${i + 1}`}
                      </span>
                      <span>{p}</span>
                    </p>
                  ))}
                </div>

                <p className="heading-serif text-[#FAF8F4] text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.4] mt-12 max-w-3xl">
                  {ecosystem.technology.highlight}
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3">
                  {ecosystem.technology.labels.map((label, i) => (
                    <span key={label} className="flex items-center gap-x-4">
                      {i > 0 && (
                        <span
                          className="h-3.5 w-px bg-[#B88A5A]"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-mono text-[#B88A5A] text-[13px] uppercase tracking-[0.18em]">
                        {label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ASSET SWAP POINT — the approved Wenaya lifestyle photograph
                  (person relaxing at home with the YOLO dashboard on a
                  smartphone). It renders from
                  /images/about/yolo-dashboard-lifestyle.jpg; until that file
                  exists the decorative panel below shows instead (the band
                  never renders a broken image). Drop the file into
                  public/images/about/ and rebuild to swap it in. */}
              {yoloImageExists ? (
                <div className="relative lg:col-span-7 xl:col-span-7">
                  <div
                    aria-hidden="true"
                    className="hidden lg:block absolute -left-4 -top-4 w-32 h-32 border border-[#B88A5A]/30"
                  />
                  <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden bg-[#0B1220]">
                    <Image
                      src={ecosystem.technology.image}
                      alt={ecosystem.technology.imageAlt}
                      fill
                      sizes="(max-width:1023px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
              <div
                className="relative lg:col-span-7 xl:col-span-7 aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] bg-[#FAF8F4] overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute inset-0">
                  <span className="absolute left-1/2 top-1/2 aspect-square w-[min(82%,400px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B88A5A]/[0.28]">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#B88A5A]/90" />
                  </span>
                  <span className="absolute left-1/2 top-1/2 aspect-square w-[min(58%,284px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B88A5A]/[0.2]">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#B88A5A]/80" />
                  </span>
                  <span className="absolute left-1/2 top-1/2 aspect-square w-[min(34%,166px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B88A5A]/[0.14]">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#B88A5A]/70" />
                  </span>
                  <span className="absolute left-1/2 top-1/2 flex aspect-square w-[min(26%,128px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0B1220]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-auto w-[38%] text-[#B88A5A]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 5L15 17L12 5L9 17L5 5" />
                    </svg>
                  </span>
                  <span className="absolute left-5 top-5 sm:left-7 sm:top-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0B1220]/45">
                    Wenaya
                  </span>
                  <span className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0B1220]/45">
                    YOLO
                  </span>
                </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </section>

      {/* Ce qui nous guide */}
      <section
        id="nos-engagements"
        aria-labelledby="values-title"
        className="bg-[#F2EFE9] scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="inline-flex items-center gap-3.5">
              <span
                className="hidden sm:inline-block h-px w-7 bg-[#B88A5A]"
                aria-hidden="true"
              />
              <span className="text-[#B88A5A] font-semibold uppercase tracking-[0.22em] text-[11px] sm:text-xs">
                {values.eyebrow}
              </span>
              <span
                className="hidden sm:inline-block h-px w-7 bg-[#B88A5A]"
                aria-hidden="true"
              />
            </p>
            <h2 id="values-title" className={`${H2} mt-7`}>
              {values.title}
            </h2>
          </div>

          <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {values.items.map((item) => (
              <article key={item.title} className="border-t border-[#0B1220]/[0.14] pt-6">
                <h3 className="font-heading font-semibold text-[#0B1220] text-lg tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[#2B2F36]/70 text-[0.9375rem] sm:text-base leading-[1.7]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Notre ambition pour demain */}
      <section
        id="notre-ambition"
        aria-labelledby="future-title"
        className="max-w-5xl mx-auto px-6 py-12 sm:py-16 lg:py-20 scroll-mt-24"
      >
        <div className="max-w-2xl">
          <SectionLabel>{ambition.eyebrow}</SectionLabel>
          <h2 id="future-title" className={`${H2} mt-7`}>
            {ambition.title}
          </h2>
          <div className="mt-9 space-y-5">
            {ambition.paragraphs.map((p, i) => (
              <p key={i} className={BODY}>
                {p}
              </p>
            ))}
          </div>
          <p className="heading-serif text-[#B88A5A] text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.3] mt-12 pt-8 border-t border-[#0B1220]/[0.12]">
            {ambition.signature}
          </p>
        </div>
      </section>
    </div>
  );
}
