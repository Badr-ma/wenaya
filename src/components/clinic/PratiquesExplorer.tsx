/**
 * Clinic Practices Explorer — interactive service-exploration for the Clinic page.
 *
 * A server component resolves the curated practice list (locale-aware title,
 * one-sentence teaser, image, canonical-slug href) and hands it to this client
 * component for the interaction layer:
 *
 *   Desktop (lg+):  numbered editorial list on the left, large active-practice
 *                   panel on the right. Hovering or keyboard-focusing a row
 *                   activates it; clicking navigates to the practice detail page.
 *                   The right image crossfades (opacity + slight scale), only the
 *                   active (and outgoing) image is loaded — never all of them.
 *
 *   Mobile (<lg):   an accordion list where tapping a row expands its image +
 *                   one-line summary + detail link directly beneath it. No hover
 *                   required. Rows are buttons (aria-expanded / aria-controls,
 *                   labelled regions); collapsed panels keep their content in the
 *                   DOM for SSR/SEO but defer loading images (loading="lazy",
 *                   zero-height → no fetch until expanded).
 *
 * Practice links stay server-rendered (see stripped SSR output) — SEO unchanged.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface ExplorerItem {
  /** Zero-padded ordering label ("01") */
  number: string;
  /** Canonical ASCII slug; used for keys + aria ids */
  slug: string;
  /** Locale-resolved practice title */
  title: string;
  /** Single-sentence teaser derived from the source summary */
  teaser: string;
  /** Locale-neutral image URL */
  image: string;
  /** Locale-aware detail URL (/pratiques/<slug> or /en/pratiques/<slug>) */
  href: string;
}

interface Props {
  items: ExplorerItem[];
  /** Locale-neutral CTA label ("Découvrir cette pratique" / "Explore this practice") */
  ctaDetail: string;
}

const PANEL_SIZES = "(min-width: 1024px) 46vw, 92vw";

export default function PratiquesExplorer({ items, ctaDetail }: Props): React.JSX.Element | null {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prev, setPrev] = useState<ExplorerItem | null>(null);
  const [openIdx, setOpenIdx] = useState(0);
  const activeRef = useRef(0);
  // Only the first (default) active image starts "loaded"; later images fade in
  // when their onLoad fires, so we never fetch the whole set upfront.
  const [loaded, setLoaded] = useState<Record<string, boolean>>(() =>
    items.length > 0 ? { [items[0].image]: true } : {}
  );

  // Release the outgoing image layer once its fade-out completes.
  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 560);
    return () => clearTimeout(t);
  }, [prev]);

  if (items.length === 0) return null;

  const active = items[activeIdx];

  function activate(i: number): void {
    if (i === activeRef.current) return;
    setPrev(items[activeRef.current]);
    activeRef.current = i;
    setActiveIdx(i);
  }

  function markLoaded(src: string): void {
    setLoaded((s) => (s[src] ? s : { ...s, [src]: true }));
  }

  return (
    <div className="mt-10 lg:mt-14">
      {/* ── Desktop: numbered list + active panel ── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1.06fr] lg:gap-14 xl:gap-20 items-start">
        <ul className="divide-y divide-[#0B1220]/[0.08]">
          {items.map((it, i) => {
            const isActive = i === activeIdx;
            return (
              <li key={it.slug} className="relative">
                <a
                  href={it.href}
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => activate(i)}
                  onFocus={() => activate(i)}
                  className="group relative flex items-baseline gap-5 sm:gap-7 py-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                >
                  <span
                    className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                      isActive ? "text-[#B88A5A]" : "text-[#0B1220]/35 group-hover:text-[#B88A5A]"
                    }`}
                  >
                    {it.number}
                  </span>
                  <span
                    className={`heading-serif transition-all duration-300 ${
                      isActive
                        ? "text-[#0B1220] font-semibold"
                        : "text-[#0B1220]/60 group-hover:text-[#0B1220]/85"
                    }`}
                    style={{ fontSize: "clamp(1.4rem, 1.9vw, 2rem)" }}
                  >
                    {it.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-px h-px bg-[#B88A5A] origin-left transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Active-practice showcase */}
        <div className="lg:sticky lg:top-24 flex flex-col">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0B1220]/5">
            {prev ? (
              <Image
                key={`prev-${prev.slug}`}
                src={prev.image}
                alt=""
                fill
                sizes={PANEL_SIZES}
                aria-hidden="true"
                className="ch-img-fadeout absolute inset-0 object-cover"
              />
            ) : null}
            <Image
              key={`active-${active.slug}`}
              src={active.image}
              alt={active.title}
              fill
              sizes={PANEL_SIZES}
              onLoad={() => markLoaded(active.image)}
              className={`absolute inset-0 object-cover transition-all duration-500 ease-out ${
                loaded[active.image] ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
              }`}
            />
          </div>

          <div aria-live="polite" className="mt-6 sm:mt-7 flex flex-col gap-3">
            <span className="text-[#B88A5A] font-mono text-sm tabular-nums">{active.number}</span>
            <h3 className="heading-serif text-[#0B1220] leading-tight" style={{ fontSize: "clamp(1.9rem, 2.6vw, 2.75rem)" }}>
              {active.title}
            </h3>
            <p className="text-[#0B1220]/55 text-base leading-relaxed max-w-md">{active.teaser}</p>
            <Link
              href={active.href}
              className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-[#0B1220] self-start"
            >
              <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover/link:decoration-[#B88A5A] transition-colors">
                {ctaDetail}
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
          </div>
        </div>
      </div>

      {/* ── Mobile: accordion (no hover required) ── */}
      <ul className="lg:hidden divide-y divide-[#0B1220]/[0.08]">
        {items.map((it, i) => {
          const isOpen = i === openIdx;
          const btnId = `clinic-prac-btn-${it.slug}`;
          const panelId = `clinic-prac-panel-${it.slug}`;
          return (
            <li key={it.slug}>
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
                  {it.number}
                </span>
                <span
                  className={`heading-serif flex-1 transition-all duration-300 ${
                    isOpen ? "text-[#0B1220] font-semibold" : "text-[#0B1220]/70"
                  }`}
                  style={{ fontSize: "clamp(1.3rem, 5.6vw, 1.6rem)" }}
                >
                  {it.title}
                </span>
                <svg
                  aria-hidden="true"
                  className={`w-4 h-4 shrink-0 text-[#0B1220]/40 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-[#B88A5A]" : ""
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
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#0B1220]/5">
                      <Image
                        src={it.image}
                        alt={it.title}
                        fill
                        loading="lazy"
                        sizes={PANEL_SIZES}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-[#0B1220]/55 text-[15px] leading-relaxed">{it.teaser}</p>
                    <Link
                      href={it.href}
                      className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] self-start"
                    >
                      <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover/link:decoration-[#B88A5A] transition-colors">
                        {ctaDetail}
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
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}