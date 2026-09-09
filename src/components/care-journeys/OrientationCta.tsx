/**
 * Care journey closing ORIENTATION section — the navy band that closes every
 * detail page. It keeps the strong visual design of the previous closing band
 * but its purpose is NEXT STEP / ORIENTATION, never "book this journey".
 *
 * SINGLE recommended practice: editorial split (image + "Pratique recommandée" +
 * "Découvrez cette pratique et les professionnels qui peuvent vous accompagner.")
 * with two actions — "Découvrir la pratique" (practice page) and "Trouver un
 * spécialiste" (the specialist listing; the user picks a practitioner AFTER the
 * discovery step — no automatic practitioner routing) — plus a subtle
 * "Être orienté(e)" contact option.
 *
 * MULTI-practice journeys: centered "Plusieurs approches peuvent vous
 * accompagner" with "Voir les pratiques recommandées" (scrolls to the
 * #recommandations section above) and "Être orienté(e)" (contact flow).
 *
 * Booking remains exclusive to real practitioner / service contexts; a care
 * journey is informational guidance, not a bookable service.
 */
import Image from "next/image";
import type { Pratique } from "@/lib/pratiques";
import { h } from "@/lib/href";

export interface OrientationLabels {
  recPracticeEyebrow: string;
  recPracticeCopy: string;
  explorePractice: string;
  findSpecialist: string;
  getGuidance: string;
  recommendedEyebrow: string;
  multiCloseHeading: string;
  multiNote: string;
  viewRecommended: string;
}

interface Props {
  locale: "fr" | "en";
  practices: Pratique[];
  contactHref: string;
  labels: OrientationLabels;
}

export default function OrientationCta({
  locale,
  practices,
  contactHref,
  labels,
}: Props) {
  if (practices.length === 0) return null;

  const single = practices.length === 1;
  const p = practices[0];

  return (
    <section data-section-bg="dark" className="bg-[#0B1220] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        {single ? (
          /* ── SINGLE recommended practice: image left, orientation right ── */
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white/5 ring-1 ring-white/10">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <span className="block text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.2em]">
                {labels.recPracticeEyebrow}
              </span>
              <h2 className="heading-serif text-white leading-tight mt-4 text-[clamp(1.8rem,3vw,2.75rem)]">
                {p.title}
              </h2>
              <p className="mt-4 max-w-xl text-white/70 text-base sm:text-lg leading-relaxed">
                {labels.recPracticeCopy}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={h(locale, `/pratiques/${p.slug}`)}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                  }}
                >
                  {labels.explorePractice}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href={h(locale, "/professional")}
                  className="inline-flex h-13 items-center justify-center rounded-xl border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                >
                  {labels.findSpecialist}
                </a>
              </div>
              <a
                href={contactHref}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C99B68] underline decoration-[#C99B68]/40 underline-offset-4 transition-colors hover:decoration-[#C99B68] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C99B68]"
              >
                {labels.getGuidance}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          /* ── MULTI-practice: several approaches, orientation CTAs ── */
          <div className="mx-auto max-w-3xl text-center">
            <span className="block text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.2em]">
              {labels.recommendedEyebrow}
            </span>
            <h2 className="heading-serif text-white leading-tight mt-4 text-[clamp(1.8rem,3vw,2.75rem)]">
              {labels.multiCloseHeading}
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg leading-relaxed">
              {labels.multiNote}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#recommandations"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {labels.viewRecommended}
              </a>
              <a
                href={contactHref}
                className="inline-flex h-13 items-center justify-center rounded-xl border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                {labels.getGuidance}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}