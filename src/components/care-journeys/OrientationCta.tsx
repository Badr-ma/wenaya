/**
 * Care journey closing ORIENTATION band -- the navy band that closes every
 * detail page. Its purpose is NEXT STEP / ORIENTATION, never "book this journey".
 *
 * DE-DUPLICATION CONTRACT: the recommended practice(s) are presented EXACTLY
 * ONCE per page, by `RecommendedPractices` (the `#recommandations` section
 * directly above, which is also the scroll target of the hero CTA and of the
 * intro orientation panel). This band therefore must never restate them: no
 * second practice image, no repeated practice title, no duplicate
 * "Decouvrir la pratique" link, and no "Voir les pratiques recommandees"
 * up-scroll that pointed back at the section immediately above it.
 *
 * What legitimately remains is what that section cannot offer: the two
 * ORIENTATION actions -- "Trouver un specialiste" (the specialist listing;
 * the user picks a practitioner AFTER the discovery step, so there is no
 * automatic practitioner routing) and "Etre oriente(e)" (contact flow). Only
 * the heading varies by variant, so the band never reads as a second
 * recommendation block.
 *
 * Booking remains exclusive to real practitioner / service contexts; a care
 * journey is informational guidance, not a bookable service.
 */
import { h } from "@/lib/href";
import type { Pratique } from "@/lib/pratiques";

export interface OrientationLabels {
  nextStepEyebrow: string;
  nextStepHeading: string;
  multiCloseHeading: string;
  findSpecialist: string;
  getGuidance: string;
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
  // The practice list only decides the VARIANT (one vs several) and whether a
  // band is shown at all. The practices themselves are rendered by
  // `RecommendedPractices` above and are never repeated here.
  if (practices.length === 0) return null;

  const heading =
    practices.length === 1 ? labels.nextStepHeading : labels.multiCloseHeading;

  return (
    <section data-section-bg="dark" className="bg-[#0B1220] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="block text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.2em]">
            {labels.nextStepEyebrow}
          </span>
          <h2 className="heading-serif text-white leading-[1.05] mt-4 text-[clamp(1.8rem,3vw,2.75rem)]">
            {heading}
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={h(locale, "/search/all")}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
              }}
            >
              {labels.findSpecialist}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href={contactHref}
              className="inline-flex h-13 items-center justify-center rounded-xl border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
            >
              {labels.getGuidance}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
