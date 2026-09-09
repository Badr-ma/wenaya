/**
 * Care Journey detail — /parcours-de-soins/[slug] (+ /en/...).
 *
 * Editorial composition (presentation only — every word comes from the
 * verbatim content adapter `care-journeys.ts`):
 *
 *  1. Cinematic full-bleed hero (navy, image-led, GSAP reveal) with a
 *     "Découvrir les recommandations" scroll CTA
 *  2. Two-column article intro — lead statement left, ORIENTATION panel right
 *     (find the right support: view recommended practices / get guidance)
 *  3. "Sur cette page" sticky rail (xl+) + the editorial sections,
 *     each block carrying the visual treatment from care-journey-presentation
 *  4. "Pratiques recommandées" section — the journey's recommended disciplines,
 *     each linked to its canonical practice detail page (no booking)
 *  5. Navy closing ORIENTATION band — next step: explore a practice / find a
 *     specialist / get guided by the team (single vs multi)
 *  6. "Continuer à explorer" — two related journey cards
 *
 * Care journeys are informational guidance, NOT bookable services: no route on
 * this page books the journey itself. Practitioner selection belongs to the
 * practice / professional contexts (left untouched elsewhere).
 */
import {
  type CareJourney,
  careerJourneyHubHref,
  careerJourneyHref,
  getCareJourneyBySlug,
} from "@/lib/care-journeys";
import { getPratiqueBySlug, type Pratique } from "@/lib/pratiques";
import {
  getJourneyPresentation,
  getJourneyRecommendedSlugs,
} from "@/lib/care-journey-presentation";
import { h } from "@/lib/href";
import { getTranslations } from "@/i18n";
import CareJourneyHero from "./CareJourneyHero";
import CareJourneyIntro from "./CareJourneyIntro";
import CareJourneySection from "./CareJourneySection";
import CareJourneyNavRail from "./CareJourneyNavRail";
import RecommendedPractices from "./RecommendedPractices";
import OrientationCta from "./OrientationCta";
import RelatedJourneys from "./RelatedJourneys";

interface Props {
  journey: CareJourney;
  locale: "fr" | "en";
}

export default function CareJourneyDetail({ journey, locale }: Props) {
  const { t, tRaw } = getTranslations(locale);
  const presentation = getJourneyPresentation(journey.slug);

  // ── Recommended practices — derived from the journey's own content ──────
  const recommended: Pratique[] = getJourneyRecommendedSlugs(journey.slug)
    .map((slug) => getPratiqueBySlug(slug, locale))
    .filter((p): p is Pratique => Boolean(p));
  const isMulti = recommended.length > 1;
  const relatedPractice = recommended[0] ?? null;
  const relatedHref = relatedPractice
    ? h(locale, `/pratiques/${relatedPractice.slug}`)
    : undefined;

  // ── Orientation/contact route — informational context only, NOT a service ──
  const contactHref =
    `${h(locale, "/contact-us")}?source=care-journey&journey=${encodeURIComponent(journey.slug)}`;

  // ── "Sur cette page" nav items (all real H2 sections) ─────────────────
  const navItems = journey.sections
    .map((s, i) => (s.heading ? { label: s.heading, id: `section-${i}` } : null))
    .filter((x): x is { label: string; id: string } => Boolean(x));

  // ── Related journeys — resolved from presentation config ──────────────
  const relatedJourneys = presentation.relatedSlugs
    .map((slug) => {
      const j = getCareJourneyBySlug(slug);
      if (!j) return null;
      const p = getJourneyPresentation(slug);
      const title =
        locale === "en"
          ? (tRaw<string>(`clinic.careJourneys.titles.${slug}`) || j.hubLabel)
          : j.hubLabel;
      return {
        slug,
        title,
        teaser: j.hubTeaser,
        href: careerJourneyHref(locale, slug),
        heroImage: p.heroImage,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const relatedEyebrow = t("careJourneys.relatedEyebrow");

  const introLabels = {
    category: t("careJourneys.detail.category"),
    aboutPathway: t("careJourneys.detail.aboutPathway"),
    relatedLabel: relatedEyebrow,
    explorePractice: t("careJourneys.detail.explorePractice"),
    orientationTitle: t("careJourneys.detail.orientationTitle"),
    orientationText: t("careJourneys.detail.orientationText"),
    viewRecommended: t("careJourneys.detail.viewRecommended"),
    getGuidance: t("careJourneys.detail.getGuidance"),
  };

  const orientationLabels = {
    recPracticeEyebrow: t("careJourneys.detail.recPracticeEyebrow"),
    recPracticeCopy: t("careJourneys.detail.recPracticeCopy"),
    explorePractice: t("careJourneys.detail.explorePractice"),
    findSpecialist: t("careJourneys.detail.findSpecialist"),
    getGuidance: t("careJourneys.detail.getGuidance"),
    recommendedEyebrow: t("careJourneys.detail.recommendedEyebrow"),
    multiCloseHeading: t("careJourneys.detail.multiCloseHeading"),
    multiNote: t("careJourneys.detail.multiNote"),
    viewRecommended: t("careJourneys.detail.viewRecommended"),
  };

  return (
    <article className="bg-[#F2EFE9]">
      <CareJourneyHero
        title={journey.title}
        dekSource={journey.intro || journey.hubTeaser}
        eyebrow={t("careJourneys.detail.eyebrow")}
        heroImage={presentation.heroImage}
        backHref={careerJourneyHubHref(locale)}
        backLabel={t("careJourneys.detail.backToHub")}
        ctaHref="#recommandations"
        ctaLabel={t("careJourneys.detail.heroCta")}
        relatedLabel={isMulti ? undefined : relatedEyebrow}
        relatedPracticeTitle={isMulti ? undefined : relatedPractice?.title}
      />

      <CareJourneyIntro
        intro={journey.intro}
        hubLabel={journey.hubLabel}
        relatedPractice={relatedPractice}
        relatedHref={relatedHref}
        contactHref={contactHref}
        labels={introLabels}
      />

      {/* ── Article body: sticky rail + editorial sections ── */}
      <div
        data-section-bg="light"
        className="bg-[#F2EFE9] mx-auto max-w-[1280px] px-4 sm:px-10 pb-16 lg:pb-24 xl:grid xl:grid-cols-[230px_minmax(0,1fr)] xl:gap-12 xl:pt-10"
      >
        <CareJourneyNavRail
          title={t("careJourneys.detail.onThisPage")}
          items={navItems}
        />

        <div className="flex flex-col gap-12 lg:gap-16 xl:pt-2">
          {journey.sections.map((section, i) => (
            <CareJourneySection
              key={i}
              journey={journey}
              section={section}
              index={i}
              presentation={presentation}
            />
          ))}
        </div>
      </div>

      <RecommendedPractices
        locale={locale}
        practices={recommended}
        labels={{
          eyebrow: t("careJourneys.detail.recommendedEyebrow"),
          heading: t("careJourneys.detail.recommendedHeading"),
          explorePractice: t("careJourneys.detail.explorePractice"),
        }}
      />

      <OrientationCta
        locale={locale}
        practices={recommended}
        contactHref={contactHref}
        labels={orientationLabels}
      />

      <RelatedJourneys
        continueExploring={t("careJourneys.detail.continueExploring")}
        heading={t("careJourneys.detail.exploreHeading")}
        exploreLabel={t("careJourneys.detail.explore")}
        items={relatedJourneys}
      />
    </article>
  );
}