/**
 * Group Session Detail — editorial, image-led redesign for /seance-de-groupe/[slug] and
 * /en/group-sessions/[slug]. Server component; all copy arrives pre-resolved from the
 * pages via the group-sessions adapter (no client i18n).
 *
 * Structure (no cards, premium editorial rhythm):
 *   hero (Ivory)          → back link, eyebrow/type, H1, description, booking CTA + dominant image
 *   info band (Warm Sand) → FORMAT / PUBLIC / LIEU, horizontal columns + thin dividers
 *   about (Ivory)         → H2 + existing description, editorial prose
 *   visual band (Navy)    → full-width reuse of the session image (different composition)
 *   related (Ivory)       → numbered editorial list rows, thin separators
 *   booking CTA (Navy)    → final conversion band
 */
import Image from "next/image";
import Link from "next/link";
import type { GroupSession, GroupSessionDetailLabels } from "@/lib/group-sessions";

interface GroupSessionDetailProps {
  session: GroupSession;
  related: GroupSession[];
  labels: GroupSessionDetailLabels;
  listingHref: string;
}

const BRONZE = "#B88A5A";
const BRONZE_DARK = "#9A7242";

const arrowIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export default function GroupSessionDetail({
  session,
  related,
  labels,
  listingHref,
}: GroupSessionDetailProps): React.JSX.Element {
  const infoItems = [];
  if (session.format) {
    infoItems.push({ label: labels.formatTitle, value: session.format.title, sub: session.format.desc });
  }
  if (session.audience) {
    infoItems.push({ label: labels.audienceTitle, value: session.audience, sub: "" });
  }
  infoItems.push({ label: labels.locationTitle, value: session.location.title, sub: session.location.desc });

  return (
    <>
      {/* ── Hero · Ivory ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#FAF8F4] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto pt-8 sm:pt-12 pb-14 sm:pb-20">
          <Link
            href={listingHref}
            className="inline-flex items-center gap-2 text-xs text-[#2B2F36]/40 hover:text-[#2B2F36]/80 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            {labels.back}
          </Link>

          <div className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {session.typeLabel}
              </span>

              <h1 className="heading-serif text-[clamp(2.2rem,5vw,4rem)] text-[#0B1220] leading-[1.02] tracking-[-0.02em] mt-5">
                {session.title}
              </h1>

              <p className="mt-6 max-w-lg text-[#2B2F36]/60 text-base sm:text-lg leading-relaxed">
                {session.description}
              </p>

              <div className="mt-9">
                <Link
                  href={session.bookingHref}
                  className="inline-flex items-center gap-3 h-13 px-8 py-3.5 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                  style={{
                    background: `linear-gradient(135deg, ${BRONZE} 0%, ${BRONZE_DARK} 100%)`,
                    boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                  }}
                >
                  {labels.bookCta}
                  {arrowIcon}
                </Link>
              </div>
            </div>

            {/* Image — dominant editorial 4/5 */}
            <div className="relative">
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-[28px] overflow-hidden">
                <Image
                  src={session.image}
                  alt={session.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/15 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 w-28 h-28 rounded-full bg-[#B88A5A]/10 blur-2xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Info band · Warm Sand ───────────────────────────────── */}
      <section className="bg-[#F2EFE9] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-[#0B1220]/10">
            {infoItems.map((it, i) => (
              <div
                key={it.label}
                className={`lg:flex-1 py-6 lg:py-1 lg:px-10 ${i > 0 ? "border-t border-[#0B1220]/10 lg:border-t-0" : ""} ${i === 0 ? "lg:pl-0" : ""} lg:last:pr-0`}
              >
                <span className="block text-[#B88A5A] text-[10px] font-semibold tracking-[0.22em] uppercase">
                  {it.label}
                </span>
                <p className="mt-2.5 heading-serif text-[#0B1220] text-lg sm:text-xl leading-tight">{it.value}</p>
                {it.sub && <p className="mt-1.5 text-[#2B2F36]/55 text-sm leading-relaxed">{it.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About · Ivory ────────────────────────────────────────── */}
      <section className="bg-[#FAF8F4] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto py-14 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              {session.typeLabel}
            </span>
            <h2 className="heading-serif text-[clamp(1.6rem,3vw,2.4rem)] text-[#0B1220] leading-tight mt-4">
              {labels.whatTitle}
            </h2>
            <div className="h-px w-12 bg-[#B88A5A] mt-5" aria-hidden="true" />
            <p className="mt-6 text-[#2B2F36]/65 text-base sm:text-lg leading-relaxed">{session.description}</p>
          </div>
        </div>
      </section>

      {/* ── Visual band · Navy (full-width image, different crop) ── */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.4/1]">
          <Image
            src={session.image}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/30 to-[#0B1220]/10" />
          <div className="absolute inset-0 flex items-end px-6 sm:px-10 pb-10 sm:pb-14">
            <div className="max-w-7xl mx-auto w-full">
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                {session.typeLabel}
              </span>
              <p className="heading-serif text-white text-[clamp(1.4rem,3vw,2.2rem)] leading-snug max-w-2xl mt-3">
                {session.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related · Ivory ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-[#FAF8F4] px-6 sm:px-10">
          <div className="max-w-7xl mx-auto py-14 sm:py-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {session.typeLabel}
              </span>
              <Link
                href={listingHref}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1220] hover:text-[#B88A5A] transition-colors"
              >
                {labels.viewAll}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <h2 className="heading-serif text-[clamp(1.6rem,3.4vw,2.6rem)] text-[#0B1220] leading-tight mt-2">
              {labels.relatedTitle}
            </h2>
            {labels.relatedSub && <p className="text-[#2B2F36]/55 text-sm mt-3 max-w-xl">{labels.relatedSub}</p>}

            <div className="mt-10 border-t border-[#0B1220]/10 divide-y divide-[#0B1220]/10">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  href={r.path}
                  className="group flex items-center gap-4 sm:gap-8 py-6 sm:py-7"
                >
                  <span className="heading-serif text-[#B88A5A] text-lg sm:text-xl tabular-nums w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="hidden sm:block w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={r.image}
                      alt={r.title}
                      width={80}
                      height={80}
                      sizes="80px"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="heading-serif text-[#0B1220] text-lg sm:text-xl leading-tight group-hover:text-[#B88A5A] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-[#2B2F36]/55 text-[13.5px] mt-1 max-w-xl line-clamp-2">{r.description}</p>
                  </div>

                  <span className="text-[#0B1220] group-hover:text-[#B88A5A] group-hover:translate-x-1 transition-all shrink-0" aria-hidden="true">
                    {arrowIcon}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final booking CTA · Navy ────────────────────────────── */}
      <section className="bg-[#0B1220] px-6 sm:px-10">
        <div className="max-w-7xl mx-auto py-16 sm:py-24 text-center">
          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
            {labels.ctaEyebrow}
          </span>
          <h2 className="heading-serif text-white text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight mt-4">
            {labels.ctaHeading}
          </h2>
          {labels.bookingNote && (
            <p className="text-white/55 text-sm sm:text-[15px] max-w-xl mx-auto mt-4 leading-relaxed">
              {labels.bookingNote}
            </p>
          )}
          <div className="mt-9">
            <Link
              href={session.bookingHref}
              className="inline-flex items-center gap-3 h-13 px-8 py-3.5 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
              style={{
                background: `linear-gradient(135deg, ${BRONZE} 0%, ${BRONZE_DARK} 100%)`,
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
              }}
            >
              {labels.bookCta}
              {arrowIcon}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
