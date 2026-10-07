/**
 * Clinic Maux-troubles — editorial symptom map -> active trouble detail.
 *
 * "I know what I feel, but not who to see": a calm editorial statement plus a
 * single-select symptom map. No accordion, no dropdown rows, no chevrons, no
 * numbering — the 8 nodes read as large textual nodes (desktop: a stacked
 * editorial list with a bronze active rail; mobile: a horizontal text rail).
 *
 * Selecting a symptom swaps ONE dedicated detail panel (title, one-line
 * summary, "PRATIQUES RECOMMANDÉES" label, recommended practice LABELS) that
 * animates in with a lightweight CSS rise. The selected node itself never
 * expands — only the shared detail panel changes.
 *
 * DATA — LIVE ONLY. The 8 nodes are the SAME live Trouble records that drive
 * the Maux-troubles hub (`GET /api/v1/getAllPublicTroubles`), projected
 * server-side by `getClinicTroubleCards(locale)` in `@/lib/troubles-hub` and
 * passed in as `troubleCards`. There is NO static/demonstration dataset, NO
 * candidate-slug verification pass and NO local fallback anywhere in this
 * section: what the hub shows is what the Clinic shows, in the same order.
 * Because the records have no locale field, the EN Clinic renders the backend
 * `name` / `description` verbatim (same policy as the EN hub and EN details).
 *
 * NAVIGATION — one destination per node, no fallbacks. Each node is a real
 * `next/link` anchor to its OWN localized trouble detail route, produced by
 * `troubleDetailHref()` on the server (`/maux-troubles/{slug}` FR,
 * `/en/health-needs/{slug}` EN — strict segment split). Hover/focus previews
 * the shared panel WITHOUT navigating (`onMouseEnter`/`onFocus`); activating
 * the node navigates. Because the nodes navigate they are links, NOT toggles,
 * so `aria-pressed` is gone in favour of `aria-current` (marking the previewed
 * node) — `aria-pressed` on a link is invalid.
 *
 * SPECIALTIES — TEXT ONLY, NEVER LINKS. The associated-discipline panel is
 * preserved (label + list), but each entry is a plain non-linked label resolved
 * from `Trouble.specialtySlugs` against the canonical practice dataset
 * (`getAllPratiques(locale)`), so a discipline is never advertised as a page
 * here. This section therefore contains ZERO `/pratiques/` hrefs: the only
 * practice surfaces are the Trouble detail pages themselves. (A discipline link
 * does exist there, gated on the live specialist option set.)
 *
 * The one CTA at the bottom still goes to the full Maux-Troubles catalogue
 * (`healthNeedsHref(locale)`).
 *
 * Typography-first, one interaction set for all breakpoints.
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { healthNeedsHref } from "@/lib/href";
import type { ClinicTroubleCard } from "@/lib/troubles-hub";

interface Props {
  /**
   * Live Trouble-derived cards, resolved on the server by
   * `getClinicTroubleCards(locale)`. Required so a node can never render
   * without a real, backend-derived destination and real copy.
   */
  troubleCards: ClinicTroubleCard[];
}

export default function ClinicHealthNeeds({ troubleCards }: Props): React.JSX.Element {
  const { t, locale } = useLocale();

  const [activeIdx, setActiveIdx] = useState(0);

  if (troubleCards.length === 0) return <></>;
  const active = troubleCards[Math.min(activeIdx, troubleCards.length - 1)];
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
              {troubleCards.map((trouble, i) => {
                const isActive = i === activeIdx;
                return (
                  <li key={trouble.id} className="border-b border-[#0B1220]/[0.08]">
                    <Link
                      href={trouble.href}
                      aria-current={isActive ? "true" : undefined}
                      onMouseEnter={() => setActiveIdx(i)}
                      onFocus={() => setActiveIdx(i)}
                      className={`group flex w-full cursor-pointer items-center justify-between gap-4 border-l-2 py-4 pl-4 text-left outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70 ${
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
                        {trouble.name}
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
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile: horizontal text rail */}
            <div className="lg:hidden mt-9 -mx-6 sm:-mx-10 overflow-x-auto overscroll-x-contain px-6 sm:px-10 border-b border-[#0B1220]/[0.08]">
              <div className="flex min-w-max items-center gap-7">
                {troubleCards.map((trouble, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <Link
                      key={trouble.id}
                      href={trouble.href}
                      aria-current={isActive ? "true" : undefined}
                      onFocus={() => setActiveIdx(i)}
                      className={`whitespace-nowrap py-4 text-sm font-semibold border-b-2 outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70 ${
                        isActive
                          ? "text-[#B88A5A] border-[#B88A5A]"
                          : "text-[#0B1220]/40 border-transparent hover:text-[#0B1220]/70"
                      }`}
                    >
                      {trouble.name}
                    </Link>
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
                    {active.name}
                  </h3>
                  <p className="mt-3 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-xl">
                    {active.description}
                  </p>
                  {active.specialties.length > 0 ? (
                    <div className="mt-7">
                      <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                        {practicesLabel}
                      </span>
                      {/* Plain labels — intentionally NOT anchors (see file header). */}
                      <ul className="mt-4 space-y-2.5">
                        {active.specialties.map((specialty) => (
                          <li key={specialty.slug} className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B88A5A]"
                            />
                            <span className="text-base font-semibold text-[#0B1220]">
                              {specialty.title}
                            </span>
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

        {/* ── Global CTA → the full Maux-Troubles catalogue page ── */}
        <div className="mt-12 lg:mt-14">
          <Link
            href={healthNeedsHref(locale)}
            className="group/cta inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220]"
          >
            <span className="underline underline-offset-8 decoration-[#B88A5A]/40 transition-colors group-hover/cta:decoration-[#B88A5A]">
              {t("clinic.healthNeeds.viewAll")}
            </span>
            <svg
              className="w-4 h-4 text-[#B88A5A] transition-transform group-hover/cta:translate-x-1"
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
    </section>
  );
}