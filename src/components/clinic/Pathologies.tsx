/**
 * Clinic Pathologies — typography-led navy index for the Clinic/B2C page.
 *
 * An editorial, type-only index (no images, no active panel, no accordion):
 * the conditions are rendered as an asymmetric two-column editorial grid of
 * large index rows — serif title and one-line summary — separated
 * only by fine hairlines. Hovering / focusing a link warms the title towards
 * bronze and slides in an arrow. No selection state, no cards, distinct from
 * the numbered practice explorer and the session gallery above.
 *
 * Server component: data comes from `getPathologies`; each row links to the
 * verified care-journey page for that condition, or stays a plain text row if
 * that page is missing — no invented routes, no fake `#`. All titles and links
 * are present in the initial HTML.
 *
 * DESTINATION RULE: a row is a health SITUATION ("Vertiges", "Grossesse &
 * Maternité"), so it must point at the care journey that explains it, NOT at a
 * discipline page taken from the first entry of an arbitrary
 * `relatedPracticeSlugs` array. That sent 5 of 7 rows to
 * `/pratiques/kinesitherapie` — URLs that return HTTP 200 while being
 * semantically wrong, i.e. a silent, invisible bug.
 *
 * DELIBERATELY NO PRACTICE FALLBACK: a missing/invalid `careJourneySlug` yields
 * `href: null` (an honest, visibly unlinked row) rather than a plausible-looking
 * but unrelated practice page. Degrading to a practice link would reintroduce
 * exactly the failure mode documented above, so validation failure must fail
 * loudly in the markup instead. To add a condition, give it a `careJourneySlug`
 * that exists in `care-journeys.ts`.
 */
import Link from "next/link";
import { getPathologies, type PathologyTopic } from "@/lib/pathologies";
import { careerJourneyHref, getAllCareJourneySlugs } from "@/lib/care-journeys";
import type { HrefLocale } from "@/lib/href";
import { getTranslations } from "@/i18n";

interface PathologyItem extends PathologyTopic {
  /** Verified care-journey destination, or null when the slug is missing/invalid. */
  href: string | null;
}

const VALID_JOURNEY_SLUGS = new Set(getAllCareJourneySlugs());

export default function ClinicPathologies({
  locale,
  lang,
}: {
  locale: HrefLocale;
  lang: string;
}): React.JSX.Element {
  const { t } = getTranslations(lang);
  const pathologies: PathologyItem[] = getPathologies(locale as "fr" | "en").map((p) => {
    const journey = p.careJourneySlug;
    return {
      ...p,
      href: journey && VALID_JOURNEY_SLUGS.has(journey)
        ? careerJourneyHref(locale as "fr" | "en", journey)
        : null,
    };
  });

  return (
    <section id="pathologies" className="relative bg-[#0B1220] px-6 sm:px-10 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.pathologies.badge")}
            </span>
            <h2 className="heading-serif text-white leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.pathologies.heading1")}
              <br />
              {t("clinic.pathologies.heading2")}
            </h2>
          </div>
          <p className="text-white/45 text-base lg:text-lg leading-relaxed max-w-md">
            {t("clinic.pathologies.sub")}
          </p>
        </div>

        {/* ── Editorial typography index (asymmetric 2-column grid) ── */}
        <ol className="mt-10 lg:mt-14 border-t border-white/[0.08] lg:grid lg:grid-cols-2 lg:gap-x-14 xl:gap-x-20">
          {pathologies.map((p) => {
            const rowClass =
              "group flex items-start justify-between gap-6 py-6 sm:py-7 outline-none transition-colors " +
              "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70";
            const content = (
              <>
                <span className="flex flex-col gap-2 flex-1 min-w-0">
                  <h3
                      className="heading-serif text-white text-xl sm:text-2xl leading-snug transition-colors duration-300 group-hover:text-[#B88A5A]"
                    >
                      {p.title}
                    </h3>
                    <p className="text-white/50 text-[15px] leading-relaxed max-w-md transition-colors duration-300 group-hover:text-white/65">
                      {p.summary}
                    </p>
                  </span>
                {p.href ? (
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-[#B88A5A] opacity-0 -translate-x-2 mt-1.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                ) : null}
              </>
            );
            return (
              <li key={p.slug} className="border-b border-white/[0.08]">
                {p.href ? (
                  <Link href={p.href} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <div className={rowClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}