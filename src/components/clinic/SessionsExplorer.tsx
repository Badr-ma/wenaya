/**
 * Clinic Group Sessions Explorer — visual discovery for the Clinic/B2C page.
 *
 * Editorial split: a large active-session image (left) + numbered session list
 * (right). Hovering or keyboard-focusing a row activates it (image swap, type,
 * one-line summary, location, CTA destination). Rows are real `<a>` links to
 * the session detail page — no fake selectors.
 *
 * Mobile: single-open accordion (image + summary + location + detail CTA on
 * tap), no hover, no carousel. All 6 session names + links are server-rendered
 * (accordion panels keep content in the DOM); only the active/outgoing desktop
 * images mount, and collapsed mobile images stay `loading="lazy"` at zero
 * height (no fetch until expanded).
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface SessionItem {
  number: string;
  slug: string;
  title: string;
  type: string;
  summary: string;
  location?: string;
  image: string;
  href: string;
}

interface Props {
  sessions: SessionItem[];
  ctaDetail: string;
}

const PANEL_SIZES = "(min-width: 1024px) 44vw, 92vw";

export default function SessionsExplorer({ sessions, ctaDetail }: Props): React.JSX.Element | null {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prev, setPrev] = useState<SessionItem | null>(null);
  const [openIdx, setOpenIdx] = useState(0);
  const activeRef = useRef(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>(() =>
    sessions.length > 0 ? { [sessions[0].image]: true } : {}
  );

  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 560);
    return () => clearTimeout(t);
  }, [prev]);

  if (sessions.length === 0) return null;

  const active = sessions[activeIdx];

  function activate(i: number): void {
    if (i === activeRef.current) return;
    setPrev(sessions[activeRef.current]);
    activeRef.current = i;
    setActiveIdx(i);
  }

  function markLoaded(src: string): void {
    setLoaded((s) => (s[src] ? s : { ...s, [src]: true }));
  }

  return (
    <div className="mt-10 lg:mt-14">
      {/* ── Desktop: active image + numbered list ── */}
      <div className="hidden lg:grid lg:grid-cols-[1.06fr_1fr] lg:gap-14 xl:gap-20 items-start">
        {/* Active session showcase */}
        <div className="flex flex-col">
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
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">
              {active.type}
            </span>
            <h3 className="heading-serif text-[#0B1220] leading-tight" style={{ fontSize: "clamp(1.9rem, 2.6vw, 2.75rem)" }}>
              {active.title}
            </h3>
            <p className="text-[#0B1220]/55 text-base leading-relaxed max-w-md">{active.summary}</p>
            {active.location ? (
              <p className="mt-1 text-[#0B1220]/45 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {active.location}
              </p>
            ) : null}
            <Link
              href={active.href}
              className="group/link inline-flex items-center gap-2 mt-2 text-sm font-semibold text-[#0B1220] self-start"
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

        {/* Numbered session list */}
        <ul className="divide-y divide-[#0B1220]/[0.08]">
          {sessions.map((s, i) => {
            const isActive = i === activeIdx;
            return (
              <li key={s.slug} className="relative">
                <a
                  href={s.href}
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
                    {s.number}
                  </span>
                  <span
                    className={`heading-serif transition-all duration-300 ${
                      isActive ? "text-[#0B1220] font-semibold" : "text-[#0B1220]/60 group-hover:text-[#0B1220]/85"
                    }`}
                    style={{ fontSize: "clamp(1.4rem, 1.9vw, 2rem)" }}
                  >
                    {s.title}
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
      </div>

      {/* ── Mobile: accordion (no hover required) ── */}
      <ul className="lg:hidden divide-y divide-[#0B1220]/[0.08]">
        {sessions.map((s, i) => {
          const isOpen = i === openIdx;
          const btnId = `clinic-session-btn-${s.slug}`;
          const panelId = `clinic-session-panel-${s.slug}`;
          return (
            <li key={s.slug}>
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
                  {s.number}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    className={`heading-serif block transition-all duration-300 ${
                      isOpen ? "text-[#0B1220] font-semibold" : "text-[#0B1220]/70"
                    }`}
                    style={{ fontSize: "clamp(1.3rem, 5.6vw, 1.6rem)" }}
                  >
                    {s.title}
                  </span>
                  <span className="block text-[#B88A5A] text-[11px] font-semibold tracking-[0.18em] uppercase mt-0.5">
                    {s.type}
                  </span>
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
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#0B1220]/5">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        loading="lazy"
                        sizes={PANEL_SIZES}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-[#0B1220]/55 text-[15px] leading-relaxed">{s.summary}</p>
                    {s.location ? (
                      <p className="text-[#0B1220]/45 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {s.location}
                      </p>
                    ) : null}
                    <Link
                      href={s.href}
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