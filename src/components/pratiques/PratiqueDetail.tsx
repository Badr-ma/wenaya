/**
 * Pratique Detail — editorial practice page.
 * Server component. No card UI: typography, whitespace, dividers, rows and large
 * imagery carry the layout instead of boxed panels.
 *
 * Structure: back link + eyebrow, intro (title + lede over an asymmetric grid)
 * with a primary booking CTA, large image, optional long-form article (typed
 * `article` sections), specialists (editorial rows) with an id for in-page
 * scrolling, one final editorial booking CTA, related practices (text links).
 */
import Image from "next/image";
import Link from "next/link";
import type { Pratique } from "@/lib/pratiques";
import type { Specialist } from "@/lib/specialistes";
import { groupSessionsHref, type HrefLocale } from "@/lib/href";
import { getPratiqueBookingCta, type PratiqueCtaLabel } from "@/lib/pratique-cta";
import PratiqueSpecialists from "./PratiqueSpecialists";
import RelatedPratiques from "./RelatedPratiques";
import StructuredArticle from "./StructuredArticle";

export interface PratiqueDetailLabels {
  eyebrow: string;
  back: string;
  specialistsOverline: string;
  specialistsTitle: string;
  bookingTitle: string;
  bookingSub: string;
  bookingCta: string;
  bookingCtaBook: string;
  bookingCtaChoose: string;
  relatedOverline: string;
  relatedTitle: string;
  crossToSeance: string;
}

interface PratiqueDetailProps {
  pratique: Pratique;
  related: Pratique[];
  specialists: Specialist[];
  locale: HrefLocale;
  listingHref: string;
  labels: PratiqueDetailLabels;
}

export default function PratiqueDetail({
  pratique,
  related,
  specialists,
  locale,
  listingHref,
  labels,
}: PratiqueDetailProps): React.JSX.Element {
  const seanceHref = groupSessionsHref(locale);

  const singleSlug = specialists.length === 1 ? specialists[0].slug : undefined;
  const primaryCta = getPratiqueBookingCta(locale, specialists.length, singleSlug);

  const ctaLabel = (label: PratiqueCtaLabel): string => {
    if (label === "book") return labels.bookingCtaBook;
    if (label === "choose") return labels.bookingCtaChoose;
    return labels.bookingCta;
  };

  const ctaLinkClass =
    "inline-flex items-center gap-3 h-12 px-8 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0";

  return (
    <section className="bg-[#F2EFE9] pt-32 sm:pt-40 pb-24 sm:pb-36 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Back link */}
        <div className="flex items-center justify-between mb-14 sm:mb-20">
          <Link
            href={listingHref}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[#2B2F36]/40 hover:text-[#B88A5A] transition-colors"
          >
            <span aria-hidden="true">←</span>
            {labels.back}
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] uppercase text-[#B88A5A]/70">
            <span className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            {labels.eyebrow}
          </span>
        </div>

        {/* Intro — asymmetric editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <h1 className="heading-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.015em] text-[#0B1220]">
              {pratique.title}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-3">
            <div className="lg:border-l lg:border-[#0B1220]/10 lg:pl-8">
              <p className="text-[#2B2F36]/60 text-lg leading-[1.8]">{pratique.description}</p>
              {/* Primary booking CTA — right under the lede */}
              <div className="mt-7">
                <Link
                  href={primaryCta.href}
                  aria-label={ctaLabel(primaryCta.label)}
                  className={ctaLinkClass}
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.28)",
                  }}
                >
                  {ctaLabel(primaryCta.label)}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large image */}
        <div className="mt-14 sm:mt-20">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl">
            <Image
              src={pratique.image}
              alt={pratique.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Editorial content — typed `article` sections (FR real content; EN pending) */}
        {pratique.article && pratique.article.length > 0 && (
          <article className="max-w-[820px] mx-auto mt-20 sm:mt-28">
            <div className="border-t border-[#0B1220]/10 pt-10 sm:pt-14">
              <StructuredArticle sections={pratique.article} />
            </div>
          </article>
        )}

        {/* Specialists */}
        {specialists.length > 0 && (
          <div
            id="specialists"
            className="mt-20 sm:mt-32 scroll-mt-28 sm:scroll-mt-32"
          >
            <PratiqueSpecialists
              specialists={specialists}
              overline={labels.specialistsOverline}
              title={labels.specialistsTitle.replace("{title}", pratique.title)}
              locale={locale}
            />
          </div>
        )}

        {/* Booking CTA — one strong editorial invitation */}
        <div className="mt-20 sm:mt-32 border-y border-[#0B1220]/[0.08] py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#0B1220] leading-tight">
              {labels.bookingTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[#2B2F36]/55 text-base sm:text-lg leading-relaxed">
              {labels.bookingSub}
            </p>
            <div className="mt-9">
              <Link
                href={primaryCta.href}
                aria-label={ctaLabel(primaryCta.label)}
                className="inline-flex items-center gap-3 h-12 px-8 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.28)",
                }}
              >
                {ctaLabel(primaryCta.label)}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="mt-9">
              <Link
                href={seanceHref}
                className="inline-flex items-center gap-2 text-[13px] text-[#159AA9] hover:text-[#1AB0C0] transition-colors"
              >
                {labels.crossToSeance}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related practices */}
        <div className="mt-20 sm:mt-32">
          <RelatedPratiques
            related={related}
            overline={labels.relatedOverline}
            title={labels.relatedTitle}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}