/**
 * Care Journey editorial header — compact, image-free opener for the detail
 * pages (FR + EN). Replaces the former cinematic navy hero with a clean
 * Wenaya-style header: back link, bronze eyebrow, a single `<h1>` (the journey
 * title), and a derived dek (first sentence of the existing intro, or the hub
 * teaser). The full intro still appears in the two-column article intro below,
 * so no content is duplicated or lost.
 *
 * Server-rendered (no JS, no GSAP, no image) — content is always visible.
 */
interface Props {
  title: string;
  dekSource: string;
  eyebrow: string;
  /** Optional "back to the hub" link (shown above the eyebrow). */
  backHref?: string;
  backLabel?: string;
  /** Optional scroll CTA (e.g. "Découvrir les recommandations" → #recommandations). */
  ctaHref?: string;
  ctaLabel?: string;
  /** Optional editorial "associated practice" chip. */
  relatedLabel?: string;
  relatedPracticeTitle?: string;
}

/** First sentence of existing copy, capped at a comfort word-boundary (~170c). */
function deriveDek(source: string): string {
  const cleaned = source.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const cut = cleaned.length > 170 ? cleaned.slice(0, 170).split(" ").slice(0, -1).join(" ") + "…" : cleaned;
  return cut;
}

export default function CareJourneyHero({
  title,
  dekSource,
  eyebrow,
  backHref,
  backLabel,
  ctaHref,
  ctaLabel,
  relatedLabel,
  relatedPracticeTitle,
}: Props) {
  const dek = deriveDek(dekSource);

  return (
    <section data-section-bg="light" aria-label={eyebrow} className="relative overflow-hidden bg-[#F2EFE9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 pt-12 sm:pt-14 lg:pt-20 pb-10 sm:pb-12 lg:pb-14">
        <div className="max-w-3xl">
          {backHref && backLabel ? (
            <a
              href={backHref}
              className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#0B1220]/60 transition-colors hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              {backLabel}
            </a>
          ) : null}

          <div className="flex items-center gap-3 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
              {eyebrow}
            </span>
          </div>

          <h1
            className="heading-serif text-[#0B1220] leading-[1.08] tracking-[-0.01em] text-balance"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)" }}
          >
            {title}
          </h1>

          {dek ? (
            <p className="mt-5 sm:mt-6 max-w-[660px] text-[#0B1220]/70 text-base sm:text-lg leading-relaxed">
              {dek}
            </p>
          ) : null}

          {ctaHref && ctaLabel ? (
            <a
              href={ctaHref}
              className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
              }}
            >
              {ctaLabel}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          ) : null}

          {relatedLabel && relatedPracticeTitle ? (
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#0B1220]/[0.1] bg-white/70 px-4 py-2">
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B88A5A]">
                {relatedLabel}
              </span>
              <span className="h-3 w-px bg-[#0B1220]/15" aria-hidden="true" />
              <span className="heading-serif text-[#0B1220]/90 text-sm sm:text-base">
                {relatedPracticeTitle}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}