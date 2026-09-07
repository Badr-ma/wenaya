/**
 * Clinic Health Needs (Maux-troubles) — editorial symptom map -> active detail.
 *
 * "I know what I feel, but not who to see": a calm editorial statement plus a
 * single-select symptom map. No accordion, no dropdown rows, no chevrons, no
 * numbering — the 8 needs read as large textual nodes (desktop: a stacked
 * editorial list with a bronze active rail; mobile: a horizontal text rail).
 *
 * Selecting a symptom swaps ONE dedicated detail panel (title, one-line
 * summary, "PRATIQUES RECOMMANDÉES" label, recommended practice links) that
 * animates in with a lightweight CSS rise. The selected node itself never
 * expands — only the shared detail panel changes.
 *
 * Link policy: every relatedPracticeSlug is resolved against the canonical
 * practice dataset (`getAllPratiques`). Only existing practices are rendered
 * as real `<a>` links (FR `/pratiques/{slug}`, EN `/en/pratiques/{slug}`);
 * no invented routes, no `href="#"`. Max 3 recommendations per need.
 *
 * Typography-first, one interaction set for all breakpoints: hover opens on
 * desktop (mouse enter selects), tap/click toggles selection everywhere.
 * Selectors are real buttons with `aria-pressed`; the detail carries
 * `aria-live="polite"`. All need names, summaries and practice links are
 * server-rendered (SEO intact).
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { getHealthNeeds } from "@/lib/health-needs";
import { getAllPratiques } from "@/lib/pratiques";
import { h } from "@/lib/href";

interface RecommendedPractice {
  slug: string;
  title: string;
  href: string;
}

interface NeedItem {
  slug: string;
  title: string;
  summary: string;
  practices: RecommendedPractice[];
}

export default function ClinicHealthNeeds(): React.JSX.Element {
  const { t, locale } = useLocale();
  const practiceBySlug = new Map(
    getAllPratiques(locale as "fr" | "en").map((p) => [p.slug, p.title])
  );

  const needs: NeedItem[] = getHealthNeeds(locale as "fr" | "en").map((n) => ({
    slug: n.slug,
    title: n.title,
    summary: n.summary,
    practices: n.relatedPracticeSlugs
      .filter((s) => practiceBySlug.has(s))
      .slice(0, 3)
      .map((s) => ({
        slug: s,
        title: practiceBySlug.get(s) as string,
        href: h(locale, `/pratiques/${s}`),
      })),
  }));

  const [activeIdx, setActiveIdx] = useState(0);

  if (needs.length === 0) return <></>;
  const active = needs[activeIdx];
  const practicesLabel = t("clinic.healthNeeds.practicesLabel");

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24 items-start">
          {/* ── Left: statement + symptom selectors ── */}
          <div className="lg:col-span-5">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.healthNeeds.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.healthNeeds.heading1")}
              <br />
              {t("clinic.healthNeeds.heading2")}
            </h2>
            <p className="mt-6 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md">
              {t("clinic.healthNeeds.sub")}
            </p>

            {/* Desktop: editorial symptom list */}
            <ul className="mt-10 lg:mt-12 hidden lg:block border-t border-[#0B1220]/[0.08]">
              {needs.map((n, i) => {
                const isActive = i === activeIdx;
                return (
                  <li key={n.slug} className="border-b border-[#0B1220]/[0.08]">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => setActiveIdx(i)}
                      className={`group flex w-full items-center justify-between gap-4 border-l-2 py-4 pl-4 text-left outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70 ${
                        isActive ? "border-[#B88A5A]" : "border-transparent"
                      }`}
                    >
                      <span
                        className={`heading-serif text-xl sm:text-2xl leading-snug transition-colors duration-300 ${
                          isActive
                            ? "text-[#B88A5A] font-semibold"
                            : "text-[#0B1220]/40 group-hover:text-[#0B1220]/70"
                        }`}
                      >
                        {n.title}
                      </span>
                      <svg
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                          isActive
                            ? "text-[#B88A5A] opacity-100 translate-x-0"
                            : "text-[#0B1220]/25 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile: horizontal text rail */}
            <div className="lg:hidden mt-9 -mx-6 sm:-mx-10 overflow-x-auto overscroll-x-contain px-6 sm:px-10 border-b border-[#0B1220]/[0.08]">
              <div className="flex min-w-max items-center gap-7">
                {needs.map((n, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={n.slug}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveIdx(i)}
                      className={`whitespace-nowrap py-4 text-sm font-semibold border-b-2 outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70 ${
                        isActive
                          ? "text-[#B88A5A] border-[#B88A5A]"
                          : "text-[#0B1220]/40 border-transparent hover:text-[#0B1220]/70"
                      }`}
                    >
                      {n.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: one shared active-detail panel ── */}
          <div className="lg:col-span-7">
            <div aria-live="polite" className="lg:sticky lg:top-24">
              {active ? (
                <div key={active.slug} className="hn-fade border-l-2 border-[#B88A5A] pl-6 sm:pl-8">
                  <h3
                    className="heading-serif text-[#0B1220] leading-tight"
                    style={{ fontSize: "clamp(1.9rem, 2.8vw, 2.9rem)" }}
                  >
                    {active.title}
                  </h3>
                  <p className="mt-3 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-xl">
                    {active.summary}
                  </p>
                  {active.practices.length > 0 ? (
                    <div className="mt-7">
                      <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                        {practicesLabel}
                      </span>
                      <ul className="mt-4 space-y-3">
                        {active.practices.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={p.href}
                              className="group/link inline-flex items-center gap-2 text-base font-semibold text-[#0B1220]"
                            >
                              <span className="underline underline-offset-8 decoration-[#B88A5A]/40 transition-colors group-hover/link:decoration-[#B88A5A]">
                                {p.title}
                              </span>
                              <svg
                                className="w-4 h-4 text-[#B88A5A] transition-transform group-hover/link:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}