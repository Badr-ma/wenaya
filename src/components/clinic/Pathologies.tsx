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
 * Server component: data comes from `getPathologies`; each row resolves its
 * first confirmed `relatedPracticeSlug` into a real practice-detail link (or
 * stays a plain text row when no destination exists) — no invented routes,
 * no fake `#`. All titles and links are present in the initial HTML.
 */
import Link from "next/link";
import { getPathologies, type PathologyTopic } from "@/lib/pathologies";
import { getAllPratiqueSlugs } from "@/lib/pratiques";
import { h, type HrefLocale } from "@/lib/href";
import { getTranslations } from "@/i18n";

interface PathologyItem extends PathologyTopic {
  /** Real practice-detail destination (canonical slug), or null when none exists. */
  href: string | null;
}

const VALID_SLUGS = new Set(getAllPratiqueSlugs());

export default function ClinicPathologies({
  locale,
  lang,
}: {
  locale: HrefLocale;
  lang: string;
}): React.JSX.Element {
  const { t } = getTranslations(lang);
  const pathologies: PathologyItem[] = getPathologies(locale as "fr" | "en").map((p) => {
    const dest = (p.relatedPracticeSlugs ?? []).find((s) => VALID_SLUGS.has(s));
    return {
      ...p,
      href: dest ? h(locale, `/pratiques/${dest}`) : null,
    };
  });

  return (
    <section className="relative bg-[#0B1220] px-6 sm:px-10 overflow-hidden">
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