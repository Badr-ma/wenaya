/**
 * Clinic Health Needs (Maux-troubles) — need-based discovery explorer.
 *
 * "I know what I feel, but not who to see": a numbered need list on the left
 * that reveals, on the right, one concise sentence + recommended practices.
 * Desktop rows are pure *selectors* (buttons); navigation happens through the
 * recommended-practice links. Mobile uses a single-open accordion — no hover.
 *
 * Link policy: every relatedPracticeSlug is resolved against the canonical
 * practice dataset (`getAllPratiques`). Only existing practices are rendered
 * as real `<a>` links (FR `/pratiques/{slug}`, EN `/en/pratiques/{slug}`);
 * no invented routes, no `href="#"`. Max 3 recommendations per need.
 *
 * Typography-first (no images). All 8 need names + their practice links are
 * server-rendered — the mobile accordion keeps panel content in the DOM for
 * SSR/SEO (collapsed via CSS, so no layout/flash change).
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
  number: string;
  title: string;
  summary: string;
  practices: RecommendedPractice[];
}

export default function ClinicHealthNeeds(): React.JSX.Element {
  const { t, locale } = useLocale();
  const practiceBySlug = new Map(
    getAllPratiques(locale as "fr" | "en").map((p) => [p.slug, p.title])
  );

  const needs: NeedItem[] = getHealthNeeds(locale as "fr" | "en").map((n, i) => ({
    slug: n.slug,
    number: String(i + 1).padStart(2, "0"),
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
  const [openIdx, setOpenIdx] = useState(0);
  const active = needs[activeIdx];

  if (needs.length === 0) return <></>;

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.healthNeeds.badge")}
            </span>
            <h2 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}>
              {t("clinic.healthNeeds.heading1")}
              <br />
              {t("clinic.healthNeeds.heading2")}
            </h2>
          </div>
          <p className="text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md">
            {t("clinic.healthNeeds.sub")}
          </p>
        </div>

        {/* ── Desktop: numbered need list + active panel ── */}
        <div className="mt-10 lg:mt-14 hidden lg:grid lg:grid-cols-[1fr_1.06fr] lg:gap-14 xl:gap-20 items-start">
          <ul className="divide-y divide-[#0B1220]/[0.08]">
            {needs.map((n, i) => {
              const isActive = i === activeIdx;
              return (
                <li key={n.slug} className="relative">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onMouseEnter={() => setActiveIdx(i)}
                    onFocus={() => setActiveIdx(i)}
                    onClick={() => setActiveIdx(i)}
                    className="group relative flex items-baseline gap-5 sm:gap-7 py-5 w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                  >
                    <span
                      className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                        isActive ? "text-[#B88A5A]" : "text-[#0B1220]/35 group-hover:text-[#B88A5A]"
                      }`}
                    >
                      {n.number}
                    </span>
                    <span
                      className={`heading-serif transition-all duration-300 ${
                        isActive ? "text-[#0B1220] font-semibold" : "text-[#0B1220]/60 group-hover:text-[#0B1220]/85"
                      }`}
                      style={{ fontSize: "clamp(1.4rem, 1.9vw, 2rem)" }}
                    >
                      {n.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px h-px bg-[#B88A5A] origin-left transition-transform duration-500 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Active need panel */}
          <div className="lg:sticky lg:top-24 flex flex-col" aria-live="polite">
            <span className="text-[#B88A5A] font-mono text-sm tabular-nums">{active.number}</span>
            <h3
              className="heading-serif text-[#0B1220] leading-tight mt-3"
              style={{ fontSize: "clamp(1.9rem, 2.6vw, 2.75rem)" }}
            >
              {active.title}
            </h3>
            <p className="text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-md mt-3">
              {active.summary}
            </p>

            {active.practices.length > 0 ? (
              <div className="mt-8 lg:mt-10">
                <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
                  {t("clinic.healthNeeds.practicesLabel")}
                </span>
                <ul className="mt-4 divide-y divide-[#0B1220]/[0.08] max-w-md">
                  {active.practices.map((p) => (
                    <li key={p.slug} className="flex items-center justify-between gap-6 py-3">
                      <Link
                        href={p.href}
                        className="group/link inline-flex items-baseline gap-3 text-[#0B1220]"
                      >
                        <span className="heading-serif text-lg xl:text-xl transition-colors group-hover/link:text-[#B88A5A]">
                          {p.title}
                        </span>
                        <svg
                          className="w-4 h-4 text-[#B88A5A] self-center transition-transform group-hover/link:translate-x-1"
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
        </div>

        {/* ── Mobile: accordion (no hover required) ── */}
        <ul className="mt-10 lg:hidden divide-y divide-[#0B1220]/[0.08]">
          {needs.map((n, i) => {
            const isOpen = i === openIdx;
            const btnId = `clinic-need-btn-${n.slug}`;
            const panelId = `clinic-need-panel-${n.slug}`;
            return (
              <li key={n.slug}>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="group flex items-center gap-5 w-full py-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                >
                  <span
                    className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                      isOpen ? "text-[#B88A5A]" : "text-[#0B1220]/35"
                    }`}
                  >
                    {n.number}
                  </span>
                  <span
                    className={`heading-serif flex-1 transition-all duration-300 ${
                      isOpen ? "text-[#0B1220] font-semibold" : "text-[#0B1220]/70"
                    }`}
                    style={{ fontSize: "clamp(1.3rem, 5.6vw, 1.6rem)" }}
                  >
                    {n.title}
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#B88A5A]" : "text-[#0B1220]/40"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="pt-1 pb-7 flex flex-col gap-4">
                      <p className="text-[#0B1220]/55 text-[15px] leading-relaxed">{n.summary}</p>
                      {n.practices.length > 0 ? (
                        <div>
                          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
                            {t("clinic.healthNeeds.practicesLabel")}
                          </span>
                          <ul className="mt-2 divide-y divide-[#0B1220]/[0.08]">
                            {n.practices.map((p) => (
                              <li key={p.slug} className="flex items-center justify-between gap-6 py-3">
                                <Link
                                  href={p.href}
                                  className="group/link inline-flex items-baseline gap-3 text-[#0B1220]"
                                >
                                  <span className="heading-serif text-lg transition-colors group-hover/link:text-[#B88A5A]">
                                    {p.title}
                                  </span>
                                  <svg
                                    className="w-4 h-4 text-[#B88A5A] self-center transition-transform group-hover/link:translate-x-1"
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
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}