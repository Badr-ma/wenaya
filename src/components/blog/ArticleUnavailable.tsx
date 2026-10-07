/**
 * Article "temporarily unavailable" state — server component rendered by the
 * FR/EN article detail routes when the blog backend cannot answer the lookup
 * (transport failure, timeout, 5xx, non-JSON or malformed payload).
 *
 * WHY A COMPONENT AND NOT `notFound()`: a 404 tells crawlers and users the
 * article does not exist. During an outage the article very likely does — so the
 * route renders this state with a normal HTTP 200 instead of a hard 404. Only
 * an EXPLICIT backend 404 still reaches `notFound()`.
 *
 * Layout tokens mirror `BlogPostClientEditorial` (ivory `#FAF8F4`, `max-w-4xl`
 * editorial column, bronze mono badge, `heading-serif` h1) so the failure state
 * looks like the article page with its body missing rather than a foreign
 * template. Chrome is localized via `getTranslations(locale)` (cf.
 * `MauxTroublesHub`); no article content is ever rendered here, and there is no
 * local/mock article fallback by design.
 */
import Link from "next/link";
import { getTranslations } from "@/i18n";
import { h } from "@/lib/href";

interface Props {
  locale: "fr" | "en";
}

export default function ArticleUnavailable({ locale }: Props): React.JSX.Element {
  const { t } = getTranslations(locale);

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Back link — same chrome as a rendered article */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14">
        <Link
          href={h(locale, "/articles")}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#2B2F36]/60 hover:text-[#B88A5A] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("blog.retourArticles")}
        </Link>
      </div>

      <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-24">
        {/* Bronze mono badge — identical to the article header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
          <span className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.22em]">
            {t("blog.badge")}
          </span>
        </div>

        <h1 className="heading-serif text-[#0B1220] leading-[1.08] tracking-[-0.01em] text-[clamp(1.9rem,4.2vw,3.1rem)] max-w-[720px]">
          {t("blog.unavailableTitle")}
        </h1>

        {/* role="alert": announced to assistive tech when the state renders */}
        <div
          role="alert"
          className="mt-8 flex gap-4 rounded-2xl border border-[#0B1220]/[0.08] bg-white px-6 py-7 sm:px-8 sm:py-9 max-w-[640px]"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 shrink-0 mt-0.5 text-[#B88A5A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
          <p className="text-[#2B2F36]/70 leading-[1.7] text-base sm:text-lg">
            {t("blog.unavailableText")}
          </p>
        </div>
      </section>
    </div>
  );
}
