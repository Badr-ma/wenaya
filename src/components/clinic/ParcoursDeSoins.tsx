/**
 * Clinic Care Journeys (Parcours de Soins) — cinematic image-led swipe gallery.
 *
 * An editorial, story-driven swipe gallery of the care-journey pages, placed on
 * the Clinic page (FR + EN) between the Health Needs explorer and the Homecare
 * banner / Recruitment. It reuses the same rail interaction language as the
 * homepage practices + clinic sessions galleries (shared `useSnapGallery`), but
 * is visually distinct: here the imagery dominates — large portrait panels with
 * the title overlaid on the photo, a short supporting line, a bronze divider,
 * and a single bottom-anchored discovery CTA.
 *
 * Care journeys are INFORMATIONAL — they explain a health situation and point
 * toward recommended practices. They are NOT bookable services, so every panel
 * carries exactly ONE action ("Découvrir le parcours" / "Explore the journey")
 * that opens the canonical `/parcours-de-soins/[slug]` detail page. There is no
 * "Réserver / Book Now" button on any journey card.
 *
 * Panel content:
 *   - full-bleed `next/image` with a navy bottom gradient overlay,
 *   - journey title (FR from the data hub labels; EN via i18n — the journey
 *     article data is French/EN-mirror, so genuine EN panel titles come from
 *     the locale bundle),
 *   - one-line supporting teaser,
 *   - bronze rule above the single discovery CTA,
 *   - subtle image zoom on hover.
 *
 * Interactions: native swipe on touch; mouse drag with instant follow and
 * click-cancellation above a threshold; arrow buttons + progress dots glide
 * with a premium ~850ms ease. All 7 panels are server-rendered (SEO intact);
 * only the first image is eager, the rest lazy. No numbering, no cards.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { CARE_JOURNEYS, careerJourneyHref } from "@/lib/care-journeys";
import { useSnapGallery } from "@/hooks/useSnapGallery";

/** Responsive per-panel image `sizes` for the 1+peek / 2 / 3 pattern. */
const PANEL_SIZES =
  "(max-width: 767px) 90vw, (max-width: 1023px) 48vw, 33vw";
/** Slide width classes — 1+peek mobile, ~2 tablet, exactly 3 desktop. */
const PANEL_WIDTH =
  "w-[85vw] md:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_48px)/3)]";

/**
 * Wenaya-owned imagery for each care journey. The journey data carries no
 * image, so each panel reuses a relevant existing Wenaya visual that matches
 * the journey's dominant speciality (prenatal yoga for grossesse, orthophonie
 * for learning difficulties, kinésithérapie for vertige/TECAR/AVC-related
 * movement care, neuropsychologie for Alzheimer, méditation for holistique).
 */
const JOURNEY_IMAGE: Record<string, string> = {
  "grossesse-&-maternite": "/pratiques/yoga.jpg",
  "les-troubles-de-l-apprentissage": "/pratiques/orthophonie.jpg",
  "le-vertige-positionnel": "/pratiques/kinesitherapie.jpg",
  "la-maladie-d-alzheimer": "/pratiques/neuropsychologie.png",
  "sante-holistique": "/pratiques/meditation.png",
  "tecar-therapie": "/pratiques/sono-therapie.jpg",
  "kinesitherapie-&-avc": "/pratiques/massotherapie.jpg",
};

interface JourneySlide {
  slug: string;
  title: string;
  supporting: string;
  image: string;
  href: string;
}

export default function ClinicParcoursDeSoins(): React.JSX.Element {
  const { t, locale } = useLocale();

  const journeys = CARE_JOURNEYS;

  const slides: JourneySlide[] = journeys.map((j) => ({
    slug: j.slug,
    // FR titles come from the data hub labels; EN from the locale bundle.
    title:
      locale === "en" ? t(`clinic.careJourneys.titles.${j.slug}`) : j.hubLabel,
    supporting: t(`clinic.careJourneys.supporting.${j.slug}`),
    image: JOURNEY_IMAGE[j.slug] ?? "/pratiques/kinesitherapie.jpg",
    href: careerJourneyHref(locale as "fr" | "en", j.slug),
  }));

  const { activeIdx, trackRef, trackHandlers, goPrev, goNext } =
    useSnapGallery(slides.length);

  if (slides.length === 0) return <></>;
  const lastIndex = slides.length - 1;

  const explore = t("clinic.careJourneys.explore");
  const exploreAria = t("clinic.careJourneys.exploreAria");
  const galleryLabel = t("clinic.careJourneys.galleryLabel");
  const prevLabel = t("clinic.careJourneys.prev");
  const nextLabel = t("clinic.careJourneys.next");

  return (
    <section
      id="parcours-de-soins"
      aria-labelledby="care-journeys-heading"
      className="relative overflow-hidden bg-[#FAF8F4] px-4 sm:px-10 py-14 lg:py-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Editorial header: eyebrow + serif H2 left, one paragraph right ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10 mb-10 lg:mb-14">
          <div className="lg:max-w-xl">
            <span className="block text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase mb-5">
              {t("clinic.careJourneys.badge")}
            </span>
            <h2
              id="care-journeys-heading"
              className="heading-serif text-[#0B1220] leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {t("clinic.careJourneys.heading")}
            </h2>
          </div>
          <p className="hp-text lg:max-w-xs lg:text-right text-[#0B1220]/55 text-[15px] sm:text-base leading-relaxed">
            {t("clinic.careJourneys.sub")}
          </p>
        </div>

        {/* ── Cinematic journey swipe gallery ── */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={galleryLabel}
        >
          <div
            ref={trackRef}
            {...trackHandlers}
            className="hp-track flex gap-3 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain cursor-grab select-none"
          >
            {slides.map((s, i) => (
              <div
                key={s.slug}
                className={`hp-slide shrink-0 snap-start ${PANEL_WIDTH}`}
              >
                <div className="group relative overflow-hidden rounded-[24px] bg-[#0B1220] ring-1 ring-[#0B1220]/5">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      {...(i === 0 ? { priority: true } : { loading: "lazy" })}
                      sizes={PANEL_SIZES}
                      className="cj-img object-cover"
                    />
                  </div>
                  {/* Navy bottom gradient melts into the panel base for the
                      overlaid title + CTA; subtle zoom on hover. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,18,32,0.94)] via-[rgba(11,18,32,0.55)] via-40% to-[rgba(11,18,32,0.06)]" />

                  {/* Lower overlay: title over the image, then the CTA */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 pointer-events-none">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className="heading-serif text-white leading-tight line-clamp-2"
                        style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.85rem)" }}
                      >
                        {s.title}
                      </h3>
                      {/* editorial index, no visible numbering — decorative dot */}
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full bg-[#B88A5A]"
                      />
                    </div>
                    <p className="mt-2 text-white/75 text-[13px] sm:text-sm leading-snug sm:leading-relaxed line-clamp-2 max-w-[28ch]">
                      {s.supporting}
                    </p>

                    {/* bronze divider above the CTA */}
                    <span
                      aria-hidden="true"
                      className="mt-4 block h-px w-10 bg-gradient-to-r from-[#B88A5A] to-transparent"
                    />

                    {/* single discovery CTA — care journeys are informational,
                        never bookable */}
                    <Link
                      href={s.href}
                      aria-label={exploreAria.replace("{title}", s.title)}
                      className="pointer-events-auto mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg h-10 sm:h-11 px-4 text-xs sm:text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0 bg-gradient-to-b from-[#B88A5A] to-[#9A7242] shadow-[0_6px_24px_rgba(184,138,90,0.28)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFF7EB]"
                    >
                      {explore}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Progress dots + arrow controls (disabled at the ends) ── */}
          <div className="flex items-center justify-end gap-3 mt-8 lg:mt-10">
            <span className="mr-auto flex items-center gap-2" aria-hidden="true">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === activeIdx
                      ? "w-4 bg-[#B88A5A]"
                      : "w-1.5 bg-[#0B1220]/20"
                  }`}
                />
              ))}
            </span>
            <button
              type="button"
              aria-label={prevLabel}
              disabled={activeIdx === 0}
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#0B1220]/15 disabled:hover:text-[#0B1220]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              disabled={activeIdx === lastIndex}
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#0B1220]/15 disabled:hover:text-[#0B1220]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}