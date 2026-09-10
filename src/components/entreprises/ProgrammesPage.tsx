/**
 * Programmes Page — listing of Wenaya's 4 labelled corporate programmes
 * (Leadership 360°, PCM, L'Art des Priorités, People Model Canvas).
 *
 * Server component (no "use client"): the "details" of each programme live on their
 * own static detail routes (/corporate/programmes/[slug]) driven by the shared
 * src/lib/corporate-programmes.ts source — this listing only projects card data and
 * links to the details, so there is no listing/detail data duplication.
 *
 * Shared by FR (/corporate/programmes) and EN (/en/corporate/programmes) routes.
 */
import Link from "next/link";
import { getAllProgrammes, getProgrammeHref, PROGRAMME_AUDIT_CALENDAR_URL } from "@/lib/corporate-programmes";
import type { HrefLocale } from "@/lib/href";
import { h } from "@/lib/href";
import { getTranslations } from "@/i18n";

interface ProgrammeListingLabels {
  backEnterprise: string;
  subtitle: string;
  practicalLabel: string;
  discoverLabel: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaPrimary: string;
  requestQuote: string;
  ctaNote: string;
  newTab: string;
}

function ProgrammeCardLink({
  locale,
  labels,
}: {
  locale: HrefLocale;
  labels: ProgrammeListingLabels;
}) {
  const programmes = getAllProgrammes(locale);

  return (
    <>
      {programmes.map((programme) => (
        <Link
          key={programme.slug}
          href={getProgrammeHref(locale, programme.slug)}
          className="group flex flex-col h-full bg-[#FAF8F4] rounded-2xl border border-[#0B1220]/[0.06] p-6 sm:p-8 hover:border-[#B88A5A]/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
        >
          <span className="text-[#B88A5A] text-[10px] font-semibold tracking-[0.18em] uppercase leading-relaxed">
            {programme.badge}
          </span>
          <h2
            className="heading-serif text-[#0B1220] font-medium mt-4 leading-[1.1]"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
          >
            {programme.name}
          </h2>
          <p className="mt-2 font-serif text-[#B88A5A] text-base leading-snug">{programme.pitch}</p>
          <p className="mt-3 text-[#0B1220]/65 text-sm leading-relaxed flex-1">{programme.intro[0]}</p>

          <div className="mt-6 pt-5 border-t border-[#0B1220]/[0.08] space-y-1.5">
            {programme.practical.slice(0, 2).map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-[12px] text-[#0B1220]/45">
                <svg className="w-3.5 h-3.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="min-w-0">
                  <span className="uppercase text-[10px] tracking-[0.12em]">{row.label}</span>
                  {" · "}
                  <span className="truncate">{row.value}</span>
                </span>
              </div>
            ))}
          </div>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group-hover:text-[#B88A5A] transition-colors">
            {labels.discoverLabel}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </>
  );
}

export default function ProgrammesPage({ locale = "fr" }: { locale?: HrefLocale }) {
  const { t, tRaw } = getTranslations(locale);
  const labels: ProgrammeListingLabels = {
    backEnterprise: t("entreprises.programmes.backEnterprise"),
    subtitle: t("entreprises.programmes.subtitle"),
    practicalLabel: t("entreprises.programmes.practicalLabel"),
    discoverLabel: t("entreprises.programmes.discoverLabel"),
    ctaTitle: t("entreprises.programmes.ctaTitle"),
    ctaDesc: t("entreprises.programmes.ctaDesc"),
    ctaPrimary: t("entreprises.programmes.ctaPrimary"),
    requestQuote: t("entreprises.programmes.requestQuote"),
    ctaNote: t("entreprises.programmes.ctaNote"),
    newTab: t("entreprises.programmes.newTab"),
  };
  const title = tRaw<string>("entreprises.programmes.title");

  return (
    <div className="bg-[#F2EFE9]">
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pt-32">
        <Link
          href={h(locale, "/corporate")}
          className="inline-flex items-center gap-2 text-sm text-[#0B1220]/45 hover:text-[#B88A5A] transition-colors mb-12"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {labels.backEnterprise}
        </Link>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            <span className="w-8 h-px bg-[#B88A5A]/50" />
            {title}
          </span>
          <h1
            className="heading-serif text-[#0B1220] font-medium leading-[1.06]"
            style={{ fontSize: "clamp(2.2rem, 4.4vw, 4rem)" }}
          >
            {labels.subtitle}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 sm:pb-20">
        <div className="grid gap-5 sm:grid-cols-2">
          <ProgrammeCardLink locale={locale} labels={labels} />
        </div>
      </div>

      <div className="bg-[#0B1220]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#B88A5A]/60" />
              {labels.practicalLabel}
            </span>
            <h2
              className="heading-serif text-white font-medium leading-[1.08]"
              style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.6rem)" }}
            >
              {labels.ctaTitle}
            </h2>
            <p className="mt-4 text-white/60 text-base leading-relaxed max-w-xl">{labels.ctaDesc}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={PROGRAMME_AUDIT_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.ctaPrimary} (${labels.newTab})`}
                className="inline-flex items-center justify-center h-13 px-8 rounded-full bg-gradient-to-r from-[#B88A5A] to-[#9A7242] text-white text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                {labels.ctaPrimary}
              </Link>
              <Link
                href={h(locale, "/corporate#contact")}
                className="inline-flex items-center justify-center h-13 px-7 rounded-full border border-white/25 text-white text-sm font-semibold tracking-wide hover:border-[#B88A5A] hover:text-[#B88A5A] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                {labels.requestQuote}
              </Link>
            </div>
            <p className="mt-4 text-white/40 text-xs">{labels.ctaNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}