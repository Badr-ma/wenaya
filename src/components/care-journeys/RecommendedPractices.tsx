/**
 * "Pratiques recommandées / Recommended practices" — the care-journey detail
 * page section that makes the journey's recommended DISCIPLINES explicit.
 *
 * Care journeys are informational: this section explains which actual clinical
 * practices are relevant for the health situation (derived from the journey's
 * own content via `getJourneyRecommendedSlugs`) and links each one to its
 * canonical practice detail page. It deliberately carries NO booking affordance
 * — booking belongs to practitioner/service contexts, not to the journey.
 *
 * Rendered light (ivory) with `id="recommandations"`; the intro orientation
 * panel and hero CTA scroll here.
 */
import Image from "next/image";
import Link from "next/link";
import { h } from "@/lib/href";
import type { Pratique } from "@/lib/pratiques";

export interface RecommendedPracticesLabels {
  eyebrow: string;
  heading: string;
  explorePractice: string;
}

interface Props {
  locale: "fr" | "en";
  practices: Pratique[];
  labels: RecommendedPracticesLabels;
}

export default function RecommendedPractices({
  locale,
  practices,
  labels,
}: Props) {
  if (practices.length === 0) return null;

  const single = practices.length === 1;
  const p = practices[0];

  return (
    <section
      id="recommandations"
      data-section-bg="light"
      className="scroll-mt-28 bg-[#FAF8F4] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-10">
        <span className="block text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.2em]">
          {labels.eyebrow}
        </span>
        <h2 className="heading-serif text-[#0B1220] leading-[1.05] mt-4 text-[clamp(1.8rem,3vw,2.75rem)]">
          {labels.heading}
        </h2>

        {single ? (
          /* ── Single recommended practice: editorial split ── */
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] bg-[#0B1220] ring-1 ring-[#0B1220]/5">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <h3 className="heading-serif text-[#0B1220] leading-tight text-[clamp(1.5rem,2.4vw,2.25rem)]">
                {p.title}
              </h3>
              <p className="mt-4 max-w-xl text-[#0B1220]/65 text-[15px] sm:text-base leading-relaxed">
                {p.description}
              </p>
              <Link
                href={h(locale, `/pratiques/${p.slug}`)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B88A5A] underline decoration-[#B88A5A]/40 underline-offset-4 transition-colors hover:decoration-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
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
              </Link>
            </div>
          </div>
        ) : (
          /* ── Multiple recommended practices: card grid ── */
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map((practice) => (
              <Link
                key={practice.slug}
                href={h(locale, `/pratiques/${practice.slug}`)}
                className="group block rounded-[24px] bg-white ring-1 ring-[#0B1220]/[0.06] transition-all duration-300 hover:-translate-y-1 hover:ring-[#B88A5A]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-[24px] bg-[#0B1220]">
                  <Image
                    src={practice.image}
                    alt={practice.title}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="heading-serif text-[#0B1220] text-xl sm:text-2xl leading-snug">
                    {practice.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[#0B1220]/60">
                    {practice.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B88A5A] underline decoration-[#B88A5A]/40 underline-offset-4 transition-colors group-hover:decoration-[#B88A5A]">
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
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}