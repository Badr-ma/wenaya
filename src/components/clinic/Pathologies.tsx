/**
 * Clinic Pathologies — discovery explorer for the Clinic/B2C page.
 *
 * Editorial split explorer: a numbered pathology list (left) plus a large active
 * visual (right). Hovering or keyboard-focusing a topic swaps the active image +
 * one-line summary. Each topic keeps the exact data from `getPathologies`.
 *
 * Destination policy: a row becomes a real `<a>` link — to its first confirmed
 * `relatedPracticeSlug` practice detail page — **only when that destination
 * actually exists**. No invented /pathologies/[slug] routes, no fake `#`.
 * Desktop rows reuse the right-panel (or global) destination; the mobile
 * accordion surfaces the same link inside the opened panel so thumb-tapping can
 * expand first, then navigate.
 *
 * Desktop only the active (+ outgoing) image is mounted; mobile panels keep
 * content in the DOM for SSR/SEO but defer fetching until expanded (loading
 * lazy + zero-height collapsed track). Both breakpoint variants are
 * server-rendered; no JS viewport detection → no hydration mismatch.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { getPathologies, type PathologyTopic } from "@/lib/pathologies";
import { getAllPratiqueSlugs } from "@/lib/pratiques";
import { h } from "@/lib/href";

/** High-resolution visual fallbacks for topics whose own image is too small. */
const HIGH_RES_IMAGE: Record<string, string> = {
  "troubles-apprentissage": "/pratiques/sono-therapie.jpg",
  alzheimer: "/pratiques/massotherapie.jpg",
  "kinesitherapie-avc": "/pratiques/kinesitherapie.jpg",
};

interface PathologyItem extends PathologyTopic {
  /** Real practice-detail destination (canonical slug), or null when none exists. */
  href: string | null;
  /** Resolved display image (high-res fallback applied). */
  image: string;
}

const VALID_SLUGS = new Set(getAllPratiqueSlugs());

const PANEL_SIZES = "(min-width: 1024px) 46vw, 92vw";

export default function ClinicPathologies(): React.JSX.Element {
  const { t, locale } = useLocale();
  const pathologies: PathologyItem[] = getPathologies(locale as "fr" | "en").map((p) => {
    const dest = (p.relatedPracticeSlugs ?? []).find((s) => VALID_SLUGS.has(s));
    return {
      ...p,
      href: dest ? h(locale, `/pratiques/${dest}`) : null,
      image: HIGH_RES_IMAGE[p.slug] ?? p.image,
    };
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [prev, setPrev] = useState<PathologyItem | null>(null);
  const [openIdx, setOpenIdx] = useState(0);
  const activeRef = useRef(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>(() =>
    pathologies.length > 0 ? { [pathologies[0].image]: true } : {}
  );

  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 560);
    return () => clearTimeout(t);
  }, [prev]);

  if (pathologies.length === 0) return <></>;

  const active = pathologies[activeIdx];

  function activate(i: number): void {
    if (i === activeRef.current) return;
    setPrev(pathologies[activeRef.current]);
    activeRef.current = i;
    setActiveIdx(i);
  }

  function markLoaded(src: string): void {
    setLoaded((s) => (s[src] ? s : { ...s, [src]: true }));
  }

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

        {/* ── Desktop: numbered list + active panel ── */}
        <div className="mt-10 lg:mt-14 hidden lg:grid lg:grid-cols-[1fr_1.06fr] lg:gap-14 xl:gap-20 items-start">
          <ul className="divide-y divide-white/[0.08]">
            {pathologies.map((p, i) => {
              const isActive = i === activeIdx;
              const rowClass = `group relative flex items-center justify-between gap-6 py-5 outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70 ${
                isActive ? "text-white" : "text-white/45"
              }`;
              return (
                <li key={p.slug} className="relative">
                  {p.href ? (
                    <a
                      href={p.href}
                      aria-current={isActive ? "true" : undefined}
                      onMouseEnter={() => activate(i)}
                      onFocus={() => activate(i)}
                      className={rowClass}
                    >
                      {rowContent(p.title, i, isActive)}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onMouseEnter={() => activate(i)}
                      onFocus={() => activate(i)}
                      className={`${rowClass} w-full text-left`}
                    >
                      {rowContent(p.title, i, isActive)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Active pathology showcase */}
          <div className="lg:sticky lg:top-24 flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
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
              <span className="text-[#B88A5A] font-mono text-sm tabular-nums">
                {String(activeIdx + 1).padStart(2, "0")}
              </span>
              <h3 className="heading-serif text-white leading-tight" style={{ fontSize: "clamp(1.9rem, 2.6vw, 2.75rem)" }}>
                {active.title}
              </h3>
              <p className="text-white/60 text-base leading-relaxed max-w-md">{active.summary}</p>
              {active.href ? (
                <Link href={active.href} className="group/link inline-flex items-center gap-2 mt-1 text-sm font-semibold text-white self-start">
                  <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover/link:decoration-[#B88A5A] transition-colors">
                    {t("clinic.pathologies.ctaDetail")}
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
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Mobile: accordion (no hover required) ── */}
        <ul className="mt-10 lg:hidden divide-y divide-white/[0.08]">
          {pathologies.map((p, i) => {
            const isOpen = i === openIdx;
            const btnId = `clinic-path-btn-${p.slug}`;
            const panelId = `clinic-path-panel-${p.slug}`;
            return (
              <li key={p.slug}>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  className="group flex items-center justify-between gap-6 w-full py-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                >
                  <span className="flex items-baseline gap-5 flex-1 min-w-0">
                    <span className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                      isOpen ? "text-[#B88A5A]" : "text-white/30"
                    }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`heading-serif transition-all duration-300 ${
                      isOpen ? "text-white font-semibold" : "text-white/55"
                    }`} style={{ fontSize: "clamp(1.3rem, 5.6vw, 1.6rem)" }}>
                      {p.title}
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#B88A5A]" : "text-white/30"
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
                      <div className="relative aspect-[16/9] overflow-hidden bg-white/[0.04]">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          loading="lazy"
                          sizes={PANEL_SIZES}
                          className="object-cover"
                        />
                      </div>
                      <p className="text-white/60 text-[15px] leading-relaxed">{p.summary}</p>
                      {p.href ? (
                        <Link href={p.href} className="group/link inline-flex items-center gap-2 text-sm font-semibold text-white self-start">
                          <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover/link:decoration-[#B88A5A] transition-colors">
                            {t("clinic.pathologies.ctaDetail")}
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

function rowContent(title: string, i: number, isActive: boolean): React.JSX.Element {
  return (
    <>
      <span className="flex items-baseline gap-5 sm:gap-7">
        <span className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
          isActive ? "text-[#B88A5A]" : "text-white/30 group-hover:text-[#B88A5A]"
        }`}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className={`heading-serif transition-all duration-300 ${
          isActive ? "text-white font-semibold" : "text-white/45 group-hover:text-white/70"
        }`} style={{ fontSize: "clamp(1.4rem, 1.9vw, 2rem)" }}>
          {title}
        </span>
      </span>
      <svg
        aria-hidden="true"
        className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-all duration-300 ${
          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 -bottom-px h-px bg-[#B88A5A] origin-left transition-transform duration-500 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </>
  );
}