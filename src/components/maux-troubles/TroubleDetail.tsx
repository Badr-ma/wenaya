/**
 * Trouble Detail — shared server renderer for `/maux-troubles/[slug]` (FR) and
 * `/en/health-needs/[slug]` (EN).
 *
 * Correction-spec layout order (breadcrumb lives on the page):
 *   1. Hero — name, short description, full-width API hero image (editorial
 *      asymmetric grid + 21/9 priority image, same visual logic as practice
 *      detail pages).
 *   2. About / Details — `aboutLabel` overline + sanitized detail HTML
 *      (p/ul/ol/li/strong/em/br preserved — section headings stay <strong>).
 *   3. Causes — `causesLabel` overline + sanitized causes HTML; the whole
 *      section is suppressed when `causesHtml` is empty (e.g. it merely
 *      repeated the intro, so it is dropped by the adapter).
 *   4. Recommended practices — practice rows (canonical `/pratiques/{slug}`),
 *      each with its professional-search link (`/search/{slug}`) when the live
 *      specialist set resolves one.
 *   5. Prev / next trouble — detail-route nav `getTroubleNeighbors` (names only).
 *   6. Back to all — closing link to the listing.
 *
 * Every paragraph and link is server-rendered; nothing sits behind JS. Link
 * policy decided upstream by `getTroubleDetail`. No `href="#"`, no invented
 * routes.
 */
import Image from "next/image";
import Link from "next/link";
import type { TroubleHubItem, TroubleNavLink } from "@/lib/troubles-hub";

export interface TroubleDetailLabels {
  badge: string;
  back: string;
  aboutLabel: string;
  causesLabel: string;
  practicesLabel: string;
  prosLabel: string;
  prevLabel: string;
  nextLabel: string;
  disclaimer: string;
}

interface Props {
  trouble: TroubleHubItem;
  listingHref: string;
  labels: TroubleDetailLabels;
  prev: TroubleNavLink | null;
  next: TroubleNavLink | null;
}

export default function TroubleDetail({
  trouble,
  listingHref,
  labels,
  prev,
  next,
}: Props): React.JSX.Element {
  const image = trouble.image;
  const hasPrevNext = Boolean(prev || next);

  return (
    <article data-section-bg="light" className="bg-[#F2EFE9] px-6 sm:px-10">
      <div className="mx-auto max-w-7xl pt-32 sm:pt-40 pb-24 sm:pb-36">
        {/* ── Hero: overline + asymmetric 8/4 title/desc grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {labels.badge}
            </span>
            <h1 className="heading-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.015em] text-[#0B1220]">
              {trouble.name}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pt-3">
            <div className="lg:border-l lg:border-[#0B1220]/10 lg:pl-8">
              {trouble.description ? (
                <p className="text-[#2B2F36]/60 text-lg leading-[1.8]">{trouble.description}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Hero image ── */}
        {image ? (
          <div className="mt-14 sm:mt-20">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-[#0B1220]">
              <Image src={image} alt={trouble.name} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
        ) : null}

        {/* ── About / Details ── */}
        {trouble.detailHtml.length > 0 ? (
          <section className="max-w-[820px] mx-auto mt-20 sm:mt-28">
            <div className="border-t border-[#0B1220]/10 pt-10 sm:pt-14">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {labels.aboutLabel}
              </span>
              <div
                className="bio-content mt-6"
                dangerouslySetInnerHTML={{ __html: trouble.detailHtml }}
              />
            </div>
          </section>
        ) : null}

        {/* ── Causes ── */}
        {trouble.causesHtml.length > 0 ? (
          <section className="max-w-[820px] mx-auto mt-14 sm:mt-24">
            <div className="border-t border-[#0B1220]/10 pt-10 sm:pt-14">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {labels.causesLabel}
              </span>
              <div
                className="bio-content mt-6"
                dangerouslySetInnerHTML={{ __html: trouble.causesHtml }}
              />
            </div>
          </section>
        ) : null}

        {/* ── Recommended practices (+ professional search links) ── */}
        {trouble.practices.length > 0 ? (
          <section className="max-w-[820px] mx-auto mt-14 sm:mt-24">
            <div className="border-t border-[#0B1220]/10 pt-10 sm:pt-14">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {labels.practicesLabel}
              </span>
              <ul className="mt-4 space-y-3">
                {trouble.practices.map((practice) => (
                  <li
                    key={practice.slug}
                    className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 border-b border-[#0B1220]/[0.08] py-4"
                  >
                    <Link
                      href={practice.href}
                      className="group/link inline-flex items-center gap-2 text-[16px] font-semibold text-[#0B1220]"
                    >
                      <span className="underline underline-offset-8 decoration-[#B88A5A]/40 transition-colors group-hover/link:decoration-[#B88A5A]">
                        {practice.title}
                      </span>
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-[#B88A5A] transition-transform group-hover/link:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    {practice.prosHref ? (
                      <Link
                        href={practice.prosHref}
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B88A5A] sm:ml-2"
                      >
                        {labels.prosLabel}
                        <svg
                          aria-hidden="true"
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ── Prev / next trouble ── */}
        {hasPrevNext ? (
          <nav
            aria-label={labels.prevLabel.length ? `${labels.prevLabel} · ${labels.nextLabel}` : undefined}
            className="max-w-[820px] mx-auto mt-20 sm:mt-28 border-t border-[#0B1220]/[0.08] pt-10 sm:pt-14"
          >
            <div className="flex items-stretch justify-between gap-6">
              {prev ? (
                <Link
                  href={prev.href}
                  className="group/prev inline-flex items-center gap-3 text-left group"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-[#B88A5A] transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 7H4" />
                  </svg>
                  <span className="flex flex-col">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0B1220]/40">
                      {labels.prevLabel}
                    </span>
                    <span className="mt-1 text-[15px] font-semibold text-[#0B1220] group-hover:text-[#B88A5A] transition-colors">
                      {prev.name}
                    </span>
                  </span>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}

              {next ? (
                <Link
                  href={next.href}
                  className="group/next inline-flex items-center gap-3 text-right group justify-end"
                >
                  <span className="flex flex-col">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#0B1220]/40">
                      {labels.nextLabel}
                    </span>
                    <span className="mt-1 text-[15px] font-semibold text-[#0B1220] group-hover:text-[#B88A5A] transition-colors">
                      {next.name}
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-[#B88A5A] transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
          </nav>
        ) : null}

        {/* ── Back to all ── */}
        <div className="max-w-[820px] mx-auto mt-12 sm:mt-16 text-center">
          <Link
            href={listingHref}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0B1220]/60 hover:text-[#B88A5A] transition-colors"
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 7H4" />
            </svg>
            {labels.back}
          </Link>
        </div>

        {/* ── Disclaimer ── */}
        <p className="max-w-[820px] mx-auto mt-10 text-[13px] text-[#0B1220]/40 text-center">
          {labels.disclaimer}
        </p>
      </div>
    </article>
  );
}