/**
 * Care Journey article intro — an editorial two-column opener immediately
 * after the hero. LEFT: the leading statement (the journey's real intro, pulled
 * verbatim — journeys without an intro simply skip the empty column). RIGHT: an
 * ORIENTATION panel — the journey is informational, so the panel tells the
 * visitor what to do next: explore the recommended practices (scroll to
 * #recommandations) or get guided by the team (contact flow). Category context
 * and the associated practice (when single) are kept as real data. There is no
 * bookable-service CTA here.
 */
import type { Pratique } from "@/lib/pratiques";

export interface IntroLabels {
  category: string;
  aboutPathway: string;
  relatedLabel: string;
  explorePractice: string;
  orientationTitle: string;
  orientationText: string;
  viewRecommended: string;
  getGuidance: string;
}

interface Props {
  intro: string;
  hubLabel: string;
  /** Locale-aware practice href when a single associated practice exists. */
  relatedPractice?: Pratique | null;
  relatedHref?: string;
  /** Orientation/contact route (informational `journey=` context only). */
  contactHref: string;
  labels: IntroLabels;
}

export default function CareJourneyIntro({
  intro,
  hubLabel,
  relatedPractice,
  relatedHref,
  contactHref,
  labels,
}: Props) {
  const hasLead = Boolean(intro && intro.trim());

  return (
    <section data-section-bg="light" className="bg-[#F2EFE9] pt-8 sm:pt-10 lg:pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
          {/* ── LEFT: leading statement (skipped when the journey opens at an H2) ── */}
          {hasLead ? (
            <div className="lg:col-span-7">
              <p className="font-serif font-normal text-[#0B1220] text-lg leading-[1.5] sm:text-xl lg:text-2xl max-w-[700px]">
                {intro}
              </p>
            </div>
          ) : null}

          {/* ── RIGHT: orientation panel ── */}
          <div className={hasLead ? "lg:col-span-5" : "lg:col-span-12 lg:max-w-2xl"}>
            <div className="lg:sticky lg:top-24 border-l-2 border-[#B88A5A] bg-[#FAF8F4] p-6 sm:p-8">
              <span className="block text-[#B88A5A] text-[11px] font-semibold tracking-[0.2em] uppercase">
                {labels.aboutPathway}
              </span>

              <h2 className="mt-4 heading-serif text-[#0B1220] leading-snug text-xl sm:text-2xl">
                {labels.orientationTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#0B1220]/70">
                {labels.orientationText}
              </p>

              <dl className="mt-6 space-y-4 border-t border-[#0B1220]/[0.08] pt-5">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0B1220]/45">
                    {labels.category}
                  </dt>
                  <dd className="mt-1 heading-serif text-[#0B1220] text-lg">
                    {hubLabel}
                  </dd>
                </div>

                {relatedPractice ? (
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0B1220]/45">
                      {labels.relatedLabel}
                    </dt>
                    <dd className="mt-1">
                      <span className="heading-serif text-[#0B1220] text-lg">
                        {relatedPractice.title}
                      </span>
                      {relatedHref ? (
                        <a
                          href={relatedHref}
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#B88A5A] hover:text-[#9A7242] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                        >
                          {labels.explorePractice}
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </a>
                      ) : null}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {/* Orientation CTAs — no bookable-service action */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="#recommandations"
                  className="inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-xl px-8 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                  }}
                >
                  {labels.viewRecommended}
                </a>
                <a
                  href={contactHref}
                  className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-[#0B1220]/15 px-8 text-sm font-medium text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                >
                  {labels.getGuidance}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}