/**
 * Live group-session booking panel — the interactive slot-selection card embedded
 * in the hero of /seance-de-groupe/[slug] and /en/seance-de-groupe/[slug] for the
 * live backend programmes (Group Training, Jiu Jitsu Kids).
 *
 * Client component. Renders ONLY for live sessions whose facts expose selectable
 * `slots` (backend-verified: id, date, time, price — never invented availability).
 *
 * Panel order (approved brief): 1 Session title · 2 Coach · 3 Duration ·
 * 4 Verified price · 5 Location · 6 Compact date carousel (≈5 visible dates,
 * NOT all at once) · 7 Time selection (no capacity) · 8 Pay-later button ·
 * 9 Pay-online button.
 *
 * Pay-later is the supported seam: a real <Link> to the participation-request
 * contact flow carrying the chosen slot — {bookingHref}&slot=..&date=..&time=..
 * Until a time is picked it stays a disabled span (aria-disabled) — no dead nav.
 * Pay-online is a clearly-labelled preview (disabled, no navigation): the
 * payments backend is not wired, so no fake reservation/confirmation is shown.
 */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  GroupSessionDetailLabels,
  GroupSessionLocale,
  LiveGroupSessionSlot,
} from "@/lib/group-sessions";

const BRONZE = "#B88A5A";
const BRONZE_DARK = "#9A7242";
const VISIBLE_DATES = 5;

interface BookingPanelProps {
  slots: LiveGroupSessionSlot[];
  /** Locale used for date formatting; defaults to "fr". */
  locale?: GroupSessionLocale;
  /** Base participation-request href (already carries service=&type=). */
  bookingHref: string;
  /** Session title (panel heading, item 1). */
  sessionTitle: string;
  /** Verified live facts shown in order coach → duration → price → location. */
  facts: {
    coach: string | null;
    durationMinutes: number | null;
    price: string | null;
    priceFirstUse: string | null;
    locationTitle: string;
    locationDesc: string;
  };
  labels: Pick<
    GroupSessionDetailLabels,
    | "panelEyebrow"
    | "panelSub"
    | "coachTitle"
    | "durationTitle"
    | "priceTitle"
    | "priceFirstUsePrefix"
    | "locationTitle"
    | "dateLabel"
    | "timeLabel"
    | "timeHint"
    | "datePrevAria"
    | "dateNextAria"
    | "selectionHint"
    | "payLaterCta"
    | "payLaterHint"
    | "payOnlineCta"
    | "payOnlineNote"
    | "noAvailability"
  >;
}

export default function BookingPanel({
  slots,
  locale = "fr",
  bookingHref,
  sessionTitle,
  facts,
  labels,
}: BookingPanelProps): React.JSX.Element {
  const dates = useMemo<string[]>(
    () => Array.from(new Set(slots.map((s) => s.date).filter((d): d is string => Boolean(d)))),
    [slots]
  );

  const [win, setWin] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(dates.length > 0 ? dates[0] : null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const windowedDates = dates.slice(win, win + VISIBLE_DATES);
  const canPrevious = win > 0;
  const canNext = win + VISIBLE_DATES < dates.length;

  const timesForDate = useMemo(
    () => slots.filter((s) => s.date === selectedDate && Boolean(s.time)),
    [slots, selectedDate]
  );

  const selectedSlot = useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [slots, selectedSlotId]
  );

  const canContinue = selectedSlot !== null;
  const continueHref = canContinue
    ? `${bookingHref}&slot=${encodeURIComponent(String(selectedSlot.id))}&date=${encodeURIComponent(selectedSlot.date ?? "")}&time=${encodeURIComponent(selectedSlot.time?.slice(0, 5) ?? "")}`
    : bookingHref;

  /** Step the visible date window; keep the selected date in view. */
  function stepDate(delta: -1 | 1): void {
    const nextWin = win + delta;
    if (nextWin < 0 || nextWin + VISIBLE_DATES > dates.length) return;
    setWin(nextWin);
    const inWindow = dates.slice(nextWin, nextWin + VISIBLE_DATES);
    if (!inWindow.includes(selectedDate ?? "")) {
      setSelectedDate(inWindow[0] ?? null);
      setSelectedSlotId(null);
    }
  }

  return (
    <div
      id="booking"
      aria-labelledby="booking-panel-title"
      className="gs-panel rounded-2xl border border-[#0B1220]/10 bg-white shadow-[0_18px_40px_rgba(11,18,32,0.08)] overflow-hidden"
    >
      {/* Header · eyebrow — session title (1) — sub */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6">
        <span className="block text-[#B88A5A] text-[10px] font-semibold tracking-[0.22em] uppercase">
          {labels.panelEyebrow}
        </span>
        <h3
          id="booking-panel-title"
          className="gs-panel-title heading-serif text-[#0B1220] text-xl sm:text-2xl leading-tight mt-2"
        >
          {sessionTitle}
        </h3>
        <p className="mt-1.5 text-[#2B2F36]/60 text-[13px] leading-relaxed">{labels.panelSub}</p>
      </div>

      {/* Facts · coach (2) — duration (3) — price (4) — location (5) */}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#0B1220]/[0.08] px-5 sm:px-6 pt-4">
        {Boolean(facts.coach?.trim()) && (
          <div className="gs-fact">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#2B2F36]/45">
              {labels.coachTitle}
            </dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B1220]">{facts.coach}</dd>
          </div>
        )}
        {facts.durationMinutes != null && (
          <div className="gs-fact">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#2B2F36]/45">
              {labels.durationTitle}
            </dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B1220] tabular-nums">
              {facts.durationMinutes} min
            </dd>
          </div>
        )}
        {Boolean(facts.price?.trim()) && (
          <div className="gs-fact">
            <dt className="text-[10px] uppercase tracking-[0.18em] text-[#2B2F36]/45">
              {labels.priceTitle}
            </dt>
            <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B1220] tabular-nums">
              {facts.price} MAD
              {Boolean(facts.priceFirstUse?.trim()) && (
                <span className="block text-[11px] font-normal text-[#B88A5A] mt-0.5">
                  {labels.priceFirstUsePrefix} {facts.priceFirstUse} MAD
                </span>
              )}
            </dd>
          </div>
        )}
        <div className="gs-fact">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-[#2B2F36]/45">
            {labels.locationTitle}
          </dt>
          <dd className="mt-0.5 text-[13.5px] font-semibold text-[#0B1220]">{facts.locationTitle}</dd>
          {Boolean(facts.locationDesc.trim()) && (
            <dd className="mt-0.5 text-[11px] leading-snug text-[#2B2F36]/50">{facts.locationDesc}</dd>
          )}
        </div>
      </dl>

      {/* Date carousel (6) · windowed ≈5 visible dates */}
      <div className="mt-4 border-t border-[#0B1220]/[0.08] px-5 sm:px-6 pt-4">
        <span className="block text-[#B88A5A] text-[10px] font-semibold tracking-[0.22em] uppercase">
          {labels.dateLabel}
        </span>
        {dates.length > 0 ? (
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              aria-label={labels.datePrevAria}
              disabled={!canPrevious}
              onClick={() => stepDate(-1)}
              className={`gs-date-nav gs-date-prev shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 ${
                canPrevious
                  ? "border-[#0B1220]/15 text-[#0B1220] hover:border-[#0B1220]/35"
                  : "border-[#0B1220]/[0.08] text-[#2B2F36]/25 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div
              role="group"
              aria-label={`${sessionTitle} — ${labels.dateLabel}`}
              className="flex flex-1 min-w-0 gap-2 overflow-hidden"
            >
              {windowedDates.map((date) => {
                const active = date === selectedDate;
                const p = dateParts(date, locale);
                return (
                  <button
                    key={date}
                    type="button"
                    aria-pressed={active}
                    aria-label={p.full}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlotId(null);
                    }}
                    className={`gs-date-chip flex flex-col items-center justify-center flex-1 min-w-0 h-[64px] rounded-xl border px-1 transition-all duration-200 ${
                      active
                        ? "bg-[#0B1220] text-white border-[#0B1220]"
                        : "bg-[#FAF8F4] text-[#0B1220] border-[#0B1220]/[0.12] hover:border-[#0B1220]/30"
                    }`}
                  >
                    <span
                      className={`text-[9.5px] uppercase tracking-[0.08em] font-semibold ${
                        active ? "text-[#E9C9A4]" : "text-[#B88A5A]"
                      }`}
                    >
                      {p.weekday}
                    </span>
                    <span className="heading-serif text-[17px] leading-none mt-0.5">{p.day}</span>
                    <span
                      className={`text-[9.5px] uppercase tracking-[0.08em] mt-0.5 ${
                        active ? "text-white/70" : "text-[#2B2F36]/50"
                      }`}
                    >
                      {p.month}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label={labels.dateNextAria}
              disabled={!canNext}
              onClick={() => stepDate(1)}
              className={`gs-date-nav gs-date-next shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 ${
                canNext
                  ? "border-[#0B1220]/15 text-[#0B1220] hover:border-[#0B1220]/35"
                  : "border-[#0B1220]/[0.08] text-[#2B2F36]/25 cursor-not-allowed"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <p className="mt-3 text-[#2B2F36]/55 text-sm">{labels.noAvailability}</p>
        )}
      </div>

      {/* Time selection (7) · no capacity */}
      {dates.length > 0 && (
        <div className="mt-4 border-t border-[#0B1220]/[0.08] px-5 sm:px-6 pt-4">
          <span className="block text-[#B88A5A] text-[10px] font-semibold tracking-[0.22em] uppercase">
            {labels.timeLabel}
          </span>
          {timesForDate.length > 0 ? (
            <div
              role="group"
              aria-label={`${sessionTitle} — ${labels.timeLabel} · ${dateParts(selectedDate ?? "", locale).full}`}
              className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {timesForDate.map((slot) => {
                const active = slot.id === selectedSlotId;
                const timeLabel = slot.time ? slot.time.slice(0, 5) : "";
                const priceLabel = slot.price ? `${slot.price} MAD` : "";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${timeLabel}${priceLabel ? ` · ${priceLabel}` : ""}`}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`gs-time-chip flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                      active
                        ? "border-[#B88A5A] bg-[#B88A5A]/[0.06]"
                        : "border-[#0B1220]/[0.12] bg-[#FAF8F4] hover:border-[#0B1220]/30"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        active ? "text-[#0B1220]" : "text-[#0B1220]/80"
                      }`}
                    >
                      {timeLabel}
                    </span>
                    <span className="text-right text-[11px] text-[#2B2F36]/55">{priceLabel}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-[#2B2F36]/55 text-sm">{labels.timeHint}</p>
          )}
        </div>
      )}

      {/* Pay-later (8) + Pay-online (9) */}
      {dates.length > 0 && (
        <div className="mt-4 border-t border-[#0B1220]/[0.08] px-5 sm:px-6 pt-4 pb-5 sm:pb-6">
          <div aria-live="polite" className="gs-selection min-h-[16px]">
            {selectedSlot ? (
              <p className="text-[12.5px] font-semibold text-[#0B1220] tabular-nums">
                {dateParts(selectedSlot.date ?? "", locale).full} ·{" "}
                {selectedSlot.time ? selectedSlot.time.slice(0, 5) : ""}
              </p>
            ) : (
              <p className="text-[11.5px] text-[#2B2F36]/45">{labels.selectionHint}</p>
            )}
          </div>

          <div className="mt-2.5 space-y-2.5">
            {canContinue ? (
              <Link
                href={continueHref}
                className="gs-paylater inline-flex items-center justify-center gap-3 h-12 w-full rounded-xl px-8 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                style={{
                  background: `linear-gradient(135deg, ${BRONZE} 0%, ${BRONZE_DARK} 100%)`,
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                {labels.payLaterCta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <span
                className="gs-paylater inline-flex items-center justify-center gap-3 h-12 w-full rounded-xl px-8 text-white/70 text-sm font-semibold select-none cursor-not-allowed"
                aria-disabled="true"
              >
                {labels.payLaterCta}
              </span>
            )}
            <p className="text-[11px] leading-relaxed text-[#2B2F36]/45 text-center">
              {labels.payLaterHint}
            </p>
            <span
              className="gs-payonline inline-flex items-center justify-center gap-2.5 h-10 w-full rounded-xl border border-[#0B1220]/[0.12] bg-[#F2EFE9]/70 px-6 text-[12.5px] font-semibold text-[#2B2F36]/45 select-none"
              aria-disabled="true"
            >
              {labels.payOnlineCta}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <p className="text-[11px] text-[#2B2F36]/40 text-center">{labels.payOnlineNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface DateParts {
  weekday: string;
  day: string;
  month: string;
  full: string;
}

/** ISO date (YYYY-MM-DD) → per-tile weekday/day/month parts + full aria label (UTC-safe). */
function dateParts(isoDate: string, locale: GroupSessionLocale): DateParts {
  try {
    const date = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return { weekday: "", day: isoDate, month: "", full: isoDate };
    const here = locale === "fr" ? "fr-FR" : "en-GB";
    const weekday = new Intl.DateTimeFormat(here, { weekday: "short", timeZone: "UTC" }).format(date);
    const day = new Intl.DateTimeFormat(here, { day: "numeric", timeZone: "UTC" }).format(date);
    const month = new Intl.DateTimeFormat(here, { month: "short", timeZone: "UTC" }).format(date);
    const full = new Intl.DateTimeFormat(here, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
    return { weekday, day, month, full };
  } catch {
    return { weekday: "", day: isoDate, month: "", full: isoDate };
  }
}