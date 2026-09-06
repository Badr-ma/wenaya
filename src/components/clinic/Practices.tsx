/**
 * Clinic Practices — interactive service-exploration section for the Clinic/B2C
 * page. Replaces the previous static preview trio with an editorial numbered
 * explorer (desktop: list + active panel; mobile: accordion) that answers
 * "what kinds of care can I explore at Wenaya?" without duplicating the
 * detail-page content.
 *
 * This server component stays the single data entry point: it derives a curated
 * cross-section of disciplines from the existing canonical data source
 * (`getAllPratiques`), collapses each summary to a one-sentence teaser, resolves
 * locale-aware detail links (canonical ASCII slugs), and passes a serializable
 * list to the `PratiquesExplorer` client interaction layer.
 *
 * The section header + global "all practices" CTA remain server-rendered;
 * practice names and their links are present in the initial HTML (SEO intact).
 */
import Link from "next/link";
import { getAllPratiques } from "@/lib/pratiques";
import { h, type HrefLocale } from "@/lib/href";
import { useTranslations } from "@/i18n";
import PratiquesExplorer, { type ExplorerItem } from "./PratiquesExplorer";

/** Curated cross-section of Wenaya disciplines — all must already exist in the
 *  canonical `getAllPratiques` list (filtered below; never invented). */
const EXPLORER_SLUGS = [
  "kinesitherapie",
  "osteopathie",
  "psychologie",
  "nutrition",
  "naturopathie",
  "sophrologie",
  "orthophonie",
  "yoga",
];

/** High-resolution visual fallback for practices whose own image is too small. */
const HIGH_RES_IMAGE: Record<string, string> = {
  psychologie: "/pratiques/psychotherapie.jpg",
};

/** Collapse a practice description to a single sentence for the Clinic explorer
 *  — derived from the current source, no new medical claims. */
function explorerTeaser(desc: string): string {
  if (!desc) return desc;
  const trimmed = desc.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^(.*?[.!?])(\s|$)/);
  let one = (match ? match[1] : trimmed).trim();
  if (one.length > 120) one = one.slice(0, 120).trim().replace(/[.,;:]+$/, "") + "…";
  return one;
}

export default function ClinicPractices({
  locale,
  lang,
}: {
  locale: HrefLocale;
  lang: string;
}): React.JSX.Element {
  const { t } = useTranslations(lang);
  const all = getAllPratiques(locale);

  const items: ExplorerItem[] = EXPLORER_SLUGS.map((slug, i) => {
    const p = all.find((candidate) => candidate.slug === slug);
    if (!p) return null;
    return {
      number: String(i + 1).padStart(2, "0"),
      slug,
      title: p.title,
      teaser: explorerTeaser(p.description),
      image: HIGH_RES_IMAGE[p.slug] ?? p.image,
      href: h(locale, `/pratiques/${p.slug}`),
    } satisfies ExplorerItem;
  }).filter((p): p is ExplorerItem => p !== null);

  if (items.length === 0) return <></>;

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.practices.badge")}
            </span>
            <h2
              className="heading-serif text-[#0B1220] leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {t("clinic.practices.heading1")}
              <br />
              {t("clinic.practices.heading2")}
            </h2>
          </div>
          <Link
            href={h(locale, "/pratiques")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
              {t("clinic.practices.cta")}
            </span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]"
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

        <PratiquesExplorer items={items} ctaDetail={t("clinic.practices.ctaDetail")} />
      </div>
    </section>
  );
}