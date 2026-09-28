/**
 * Group Session Detail — editorial, image-led design for /seance-de-groupe/[slug] and
 * /en/seance-de-groupe/[slug]. Server component; all copy arrives pre-resolved from the
 * pages via the group-sessions adapter (no client i18n).
 *
 * Structure (no cards, premium editorial rhythm):
 *   live-with-panel (has selectable slots) → hero holds the <BookingPanel> in its
 *     right column (sticky on lg; mobile: intro → image → panel):
 *       hero (Ivory) → back link, eyebrow/type, H1, short dek, image below the text
 *                      + interactive slot-selection panel (title → coach → duration →
 *                      price → location → compact date carousel → time → pay-later →
 *                      pay-online). No info band, no separate booking section, no final
 *                      navy CTA band (the panel is the page's single conversion surface).
 *   editorial / live-without-slots (kept exactly as approved):
 *       hero (Ivory)    → back link, eyebrow/type, H1, description, booking CTA + dominant image
 *       info band (Sand)→ FORMAT / PUBLIC / LIEU (editorial) or COACH / NEXT / DURÉE / PRIX / LIEU (live)
 *       about (Ivory)   → H2 + the FULL description (the single home of the complete copy)
 *       visual band (Navy) → full-width reuse of the session image (different composition)
 *       related (Ivory) → numbered editorial list rows, thin separators
 *       booking CTA (Navy) → final conversion band
 *   Description split: `session.dek` (short one-line excerpt) renders in the hero and
 *   the visual band; the full `session.description` renders ONCE in the About section —
 *   the same generic description must never repeat across sections.
 */
import Image from "next/image";
import Link from "next/link";
import BookingPanel from "@/components/seance-de-groupe/BookingPanel";
import type { GroupSession, GroupSessionDetailLabels, GroupSessionLocale } from "@/lib/group-sessions";

interface GroupSessionDetailProps {
  session: GroupSession;
  related: GroupSession[];
  labels: GroupSessionDetailLabels;
  listingHref: string;
  /** Locale used for date formatting; defaults to "fr". */
  locale?: GroupSessionLocale;
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
  locale = "fr",
}: GroupSessionDetailProps): React.JSX.Element {
  /** Live programme with selectable slots → panel-in-hero variant (no info band / navy CTA). */
  const liveWithPanel = Boolean(session.live && session.live.slots.length > 0);
  const infoItems: { label: string; value: string; sub: string }[] =
    session.live
      ? buildLiveInfoItems(session.live, session.location, labels, locale)
      : buildEditorialInfoItems(session, labels);

  return (
    <>
      {/* ── Hero · Ivory ─────────────────────────────────────────── */}
      <section
        className={`relative bg-[#FAF8F4] px-6 sm:px-10 ${liveWithPanel ? "" : "overflow-hidden"}`}
      >
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

          <div
            className={`mt-10 lg:mt-14 grid grid-cols-1 gap-12 lg:gap-20 ${
              liveWithPanel ? "lg:grid-cols-[1fr_430px] lg:items-start" : "lg:grid-cols-2 lg:items-center"
            }`}
          >
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                {session.typeLabel}
              </span>

              <h1 className="heading-serif text-[clamp(2.2rem,5vw,4rem)] text-[#0B1220] leading-[1.02] tracking-[-0.02em] mt-5">
                {session.title}
              </h1>

              <p className="mt-6 max-w-lg text-[#2B2F36]/60 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {session.dek ?? session.description}
              </p>

              {liveWithPanel ? (
                /* Dominant editorial 4/5 image below the intro (panel variant) */
                <div className="relative mt-10 sm:mt-12">
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
                </div>
              ) : (
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
              )}
            </div>

            {/* Right · booking panel (live-with-panel) or dominant image (editorial) */}
            {liveWithPanel && session.live ? (
              <div className="mt-2 lg:sticky lg:top-9">
                <BookingPanel
                  slots={session.live.slots}
                  locale={locale}
                  bookingHref={session.bookingHref}
                  sessionTitle={session.title}
                  facts={{
                    coach: session.live.coach,
                    durationMinutes: session.live.durationMinutes,
                    price: session.live.price,
                    priceFirstUse: session.live.priceFirstUse,
                    locationTitle: session.location.title,
                    locationDesc: session.location.desc,
                  }}
                  labels={{
                    panelEyebrow: labels.panelEyebrow,
                    panelSub: labels.panelSub,
                    coachTitle: labels.coachTitle,
                    durationTitle: labels.durationTitle,
                    priceTitle: labels.priceTitle,
                    priceFirstUsePrefix: labels.priceFirstUsePrefix,
                    locationTitle: labels.locationTitle,
                    dateLabel: labels.dateLabel,
                    timeLabel: labels.timeLabel,
                    timeHint: labels.timeHint,
                    datePrevAria: labels.datePrevAria,
                    dateNextAria: labels.dateNextAria,
                    selectionHint: labels.selectionHint,
                    payLaterCta: labels.payLaterCta,
                    payLaterHint: labels.payLaterHint,
                    payOnlineCta: labels.payOnlineCta,
                    payOnlineNote: labels.payOnlineNote,
                    noAvailability: labels.noAvailability,
                  }}
                />
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      {/* ── Info band · Warm Sand (editorial, or live-without-slots) ── */}
      {!liveWithPanel && (
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
      )}

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
            <p className="mt-6 text-[#2B2F36]/65 text-base sm:text-lg leading-relaxed whitespace-pre-line">{session.description}</p>
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
              <p className="heading-serif text-white text-[clamp(1.4rem,3vw,2.2rem)] leading-snug max-w-2xl mt-3 line-clamp-2 whitespace-pre-line">
                {session.dek ?? session.description}
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
                    <p className="text-[#2B2F36]/55 text-[13.5px] mt-1 max-w-xl line-clamp-2">{r.dek ?? r.description}</p>
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

      {/* ── Final booking CTA · Navy (editorial, or live-without-slots) ── */}
      {!liveWithPanel && (
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
      )}
    </>
  );
}

/**
 * Editorial info band: FORMAT / PUBLIC / LIEU (unchanged from the approved
 * layout — used when no `live` facts exist, i.e. every local session).
 */
function buildEditorialInfoItems(
  session: GroupSession,
  labels: GroupSessionDetailLabels
): { label: string; value: string; sub: string }[] {
  const items: { label: string; value: string; sub: string }[] = [];
  if (session.format) {
    items.push({ label: labels.formatTitle, value: session.format.title, sub: session.format.desc });
  }
  if (session.audience) {
    items.push({ label: labels.audienceTitle, value: session.audience, sub: "" });
  }
  items.push({ label: labels.locationTitle, value: session.location.title, sub: session.location.desc });
  return items;
}

/**
 * Live facts band: COACH / PROCHAINE SÉANCE / DURÉE / PRIX / LIEU.
 * Columns without a verified fact are omitted (coach/duration/price are null
 * on sparse records) — never a placeholder, per the "field-verified only"
 * contract of GroupSessionLiveFacts. Date formatting is server-side and
 * locale-aware; the time sub-line carries the slot-count context.
 */
function buildLiveInfoItems(
  live: NonNullable<GroupSession["live"]>,
  location: GroupSession["location"],
  labels: GroupSessionDetailLabels,
  locale: GroupSessionLocale
): { label: string; value: string; sub: string }[] {
  const items: { label: string; value: string; sub: string }[] = [];

  if (live.coach) {
    items.push({ label: labels.coachTitle, value: live.coach, sub: "" });
  }

  if (live.nextDate) {
    const dateLabel = formatNextDate(live.nextDate, locale);
    const timePart = live.nextTime ? live.nextTime.slice(0, 5) : "";
    const sub = [timePart, `${live.slotCount} ${labels.slotCountLabel}`]
      .filter(Boolean)
      .join(" · ");
    items.push({ label: labels.nextTitle, value: dateLabel, sub });
  }

  if (live.durationMinutes) {
    items.push({
      label: labels.durationTitle,
      value: `${live.durationMinutes} min`,
      sub: "",
    });
  }

  if (live.price) {
    const sub = live.priceFirstUse
      ? `${labels.priceFirstUsePrefix} ${live.priceFirstUse} MAD`
      : "";
    items.push({ label: labels.priceTitle, value: `${live.price} MAD`, sub });
  }

  items.push({ label: labels.locationTitle, value: location.title, sub: location.desc });
  return items;
}

/** ISO date (YYYY-MM-DD) → long-form weekday+date in the page locale. */
function formatNextDate(isoDate: string, locale: GroupSessionLocale): string {
  try {
    const date = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return isoDate;
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return isoDate;
  }
}
