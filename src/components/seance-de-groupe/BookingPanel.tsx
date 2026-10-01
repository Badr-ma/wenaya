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
 * PAY-LATER is the supported, COMPLETED seam — a real authenticated booking
 * REQUEST, not a contact form and not a payment:
 *
 *   1. The visitor picks a real slot from the live feed.
 *   2. Pay-later checks the patient session (`GET /api/auth/me`).
 *      - Signed in  → submit directly.
 *      - Anonymous  → redirect to the localized login carrying the chosen slot in
 *                     `?returnTo=`. LoginClient returns the visitor to this exact
 *                     URL on success, the panel restores the slot and finishes
 *                     the request automatically.
 *   3. The submission goes to the same-origin `/api/group-sessions/booking` BFF,
 *      which requires a patient session, takes the customer identity from the
 *      AUTHENTICATED profile and re-validates the slot against the live feed
 *      before creating a `status: "pending"` request upstream.
 *   4. The panel shows submitting → confirmation (or a retryable error).
 *
 * The selection is mirrored into the URL query (`slot`/`date`/`time`) with
 * `history.replaceState` so the login round-trip can carry it, and those params
 * are stripped once the request is sent so a refresh can never resubmit. No
 * `useSearchParams` is used: the panel is server-prerendered, so reading the
 * query on mount keeps the route static instead of forcing a Suspense boundary.
 *
 * Pay-online stays a clearly-labelled preview (disabled, no navigation): the
 * payments backend is not wired, so no fake reservation/confirmation is shown.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  GroupSessionDetailLabels,
  GroupSessionLocale,
  LiveGroupSessionSlot,
} from "@/lib/group-sessions";
import { h } from "@/lib/href";
import { getCurrentPatient } from "@/lib/patient-auth-client";
import {
  submitGroupSessionBooking,
  type GroupSessionBookingResult,
} from "@/lib/group-session-booking-client";

const BRONZE = "#B88A5A";
const BRONZE_DARK = "#9A7242";
const VISIBLE_DATES = 5;

/** Query params carrying the selected slot through the login round-trip. */
const PARAM_SLOT = "slot";
const PARAM_DATE = "date";
const PARAM_TIME = "time";
/** Marker set when leaving for login, so the panel resumes exactly once. */
const PARAM_RESUME = "gs";

type PanelStatus = "idle" | "checking" | "submitting" | "done";
type FailureReason = NonNullable<GroupSessionBookingResult["reason"]>;

interface BookingPanelProps {
  slots: LiveGroupSessionSlot[];
  /** Locale used for date formatting and the login route; defaults to "fr". */
  locale?: GroupSessionLocale;
  /** Backend programme id (`session.live.programId`) — stable identity. */
  sessionId: number;
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
    | "bookingChecking"
    | "bookingSubmitting"
    | "bookingRetry"
    | "bookingErrorTitle"
    | "bookingErrorSession"
    | "bookingErrorSlot"
    | "bookingErrorFeed"
    | "bookingErrorGeneric"
    | "bookingDoneTitle"
    | "bookingDoneText"
  >;
}

export default function BookingPanel({
  slots,
  locale = "fr",
  sessionId,
  sessionTitle,
  facts,
  labels,
}: BookingPanelProps): React.JSX.Element {
  const router = useRouter();
  const dates = useMemo<string[]>(
    () => Array.from(new Set(slots.map((s) => s.date).filter((d): d is string => Boolean(d)))),
    [slots]
  );

  const [win, setWin] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(dates.length > 0 ? dates[0] : null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [status, setStatus] = useState<PanelStatus>("idle");
  const [errorReason, setErrorReason] = useState<FailureReason | null>(null);
  /** Single in-flight guard — a click (or a resumed mount) can submit only once. */
  const submittingRef = useRef(false);

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
  const busy = status === "checking" || status === "submitting";
  const busyLabel = status === "checking" ? labels.bookingChecking : labels.bookingSubmitting;
  const errorCopy =
    errorReason === "unauthenticated"
      ? labels.bookingErrorSession
      : errorReason === "validation"
        ? labels.bookingErrorSlot
        : errorReason === "feed-unavailable"
          ? labels.bookingErrorFeed
          : labels.bookingErrorGeneric;

  /** Create the booking request for a validated slot. */
  async function submitSlot(slot: LiveGroupSessionSlot): Promise<void> {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setErrorReason(null);
    setStatus("submitting");
    try {
      const result = await submitGroupSessionBooking({
        sessionId,
        slotId: slot.id,
        date: slot.date ?? "",
        time: (slot.time ?? "").slice(0, 5),
      });
      if (result.ok) {
        setSelectedDate(slot.date ?? null);
        setSelectedSlotId(slot.id);
        setStatus("done");
        clearSlotParams();
        return;
      }
      // A rejected slot must not stay selected: the visitor re-picks.
      if (result.reason === "validation") {
        setSelectedSlotId(null);
        clearSlotParams();
      }
      setStatus("idle");
      setErrorReason(result.reason ?? "api-error");
    } catch {
      setStatus("idle");
      setErrorReason("api-error");
    } finally {
      submittingRef.current = false;
    }
  }

  /** Pay-later: verify the patient session, then submit or send them to login. */
  async function handlePayLater(): Promise<void> {
    if (!selectedSlot || busy || submittingRef.current) return;
    setErrorReason(null);
    setStatus("checking");
    try {
      const me = await getCurrentPatient();
      if (!me.success) {
        // Hand the choice to login, then come back to this exact URL.
        const params = new URLSearchParams(window.location.search);
        writeSlotParams(params, selectedSlot);
        params.set(PARAM_RESUME, "1");
        replaceSearch(params);
        const returnTo = `${window.location.pathname}${window.location.search}`;
        setStatus("idle");
        router.push(`${h(locale, "/login")}?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }
      await submitSlot(selectedSlot);
    } catch {
      setStatus("idle");
      setErrorReason("api-error");
    }
  }

  /**
   * Restore a slot carried through the login round-trip and, when the `gs`
   * resume marker is present, finish the booking request exactly once.
   *
   * Mount-only by design: the URL is the login handoff channel, not a live
   * source. The state writes synchronise this component with an EXTERNAL system
   * (the query string), which is the documented reason to allow them here — the
   * panel is server-prerendered, so the URL cannot be read during render.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const resume = params.get(PARAM_RESUME) === "1";
    if (resume) {
      params.delete(PARAM_RESUME);
      replaceSearch(params);
    }
    const restored = readSlotFromUrl(slots, params);
    if (!restored) {
      if (params.get(PARAM_SLOT) !== null) clearSlotParams();
      return;
    }
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedDate(restored.date ?? null);
    setSelectedSlotId(restored.id);
    setWin(windowStartFor(dates, restored.date ?? ""));
    /* eslint-enable react-hooks/set-state-in-effect */
    if (resume) void submitSlot(restored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Step the visible date window; keep the selected date in view. */
  function stepDate(delta: -1 | 1): void {
    const nextWin = win + delta;
    if (nextWin < 0 || nextWin + VISIBLE_DATES > dates.length) return;
    setWin(nextWin);
    const inWindow = dates.slice(nextWin, nextWin + VISIBLE_DATES);
    if (!inWindow.includes(selectedDate ?? "")) {
      setSelectedDate(inWindow[0] ?? null);
      clearSelection();
    }
  }

  /** Apply a time choice and mirror it into the URL query. */
  function chooseSlot(slot: LiveGroupSessionSlot | null): void {
    setSelectedSlotId(slot?.id ?? null);
    if (slot === null) {
      clearSlotParams();
    } else {
      const params = new URLSearchParams(window.location.search);
      writeSlotParams(params, slot);
      replaceSearch(params);
    }
  }

  /** Clear the current choice and drop it from the URL. */
  function clearSelection(): void {
    setSelectedSlotId(null);
    clearSlotParams();
  }

  /** Rewrite the query without touching the Next.js router (no re-render round-trip). */
  function replaceSearch(params: URLSearchParams): void {
    const query = params.toString();
    const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", next);
  }

  /** Strip the transient booking params so a refresh can never resubmit. */
  function clearSlotParams(): void {
    const params = new URLSearchParams(window.location.search);
    params.delete(PARAM_SLOT);
    params.delete(PARAM_DATE);
    params.delete(PARAM_TIME);
    params.delete(PARAM_RESUME);
    replaceSearch(params);
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
                      clearSelection();
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
                    onClick={() => chooseSlot(slot)}
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

      {/* Pay-later (8) — authenticated booking request · or its confirmation */}
      {dates.length > 0 && (
        <div className="mt-4 border-t border-[#0B1220]/[0.08] px-5 sm:px-6 pt-4 pb-5 sm:pb-6">
          {status === "done" ? (
            <div
              role="status"
              className="gs-booking-done rounded-xl border border-[#B88A5A]/40 bg-[#B88A5A]/[0.07] px-4 py-4"
            >
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0B1220]">
                <svg
                  className="w-4 h-4 shrink-0 text-[#B88A5A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {labels.bookingDoneTitle}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#2B2F36]/70 text-center">
                {labels.bookingDoneText}
              </p>
              {selectedSlot && (
                <p className="mt-2 text-[12px] font-semibold text-[#0B1220] tabular-nums text-center">
                  {dateParts(selectedSlot.date ?? "", locale).full} ·{" "}
                  {selectedSlot.time ? selectedSlot.time.slice(0, 5) : ""}
                </p>
              )}
            </div>
          ) : (
            <>
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
                {errorReason && (
                  <div
                    role="alert"
                    className="gs-booking-error rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3 text-center"
                  >
                    <p className="text-[12.5px] font-semibold text-red-600/90">
                      {labels.bookingErrorTitle}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-red-500/80">{errorCopy}</p>
                  </div>
                )}
                {canContinue ? (
                  <button
                    type="button"
                    onClick={handlePayLater}
                    disabled={busy}
                    className="gs-paylater inline-flex items-center justify-center gap-3 h-12 w-full rounded-xl px-8 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0"
                    style={{
                      background: `linear-gradient(135deg, ${BRONZE} 0%, ${BRONZE_DARK} 100%)`,
                      boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                    }}
                  >
                    {busy ? busyLabel : errorReason ? labels.bookingRetry : labels.payLaterCta}
                    {!busy && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </button>
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
            </>
          )}
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

/** Serialize a chosen slot into the handoff query params. */
function writeSlotParams(params: URLSearchParams, slot: LiveGroupSessionSlot): void {
  params.set(PARAM_SLOT, String(slot.id));
  params.set(PARAM_DATE, slot.date ?? "");
  params.set(PARAM_TIME, (slot.time ?? "").slice(0, 5));
}

/**
 * Resolve the slot carried in the query against the LIVE slots.
 * A stale or tampered `slot`/`date`/`time` triple resolves to `null`, so nothing
 * is ever restored (or submitted) for a slot that is not actually available.
 */
function readSlotFromUrl(
  slots: LiveGroupSessionSlot[],
  params: URLSearchParams
): LiveGroupSessionSlot | null {
  const rawSlot = params.get("slot");
  const rawDate = params.get("date");
  const rawTime = params.get("time");
  if (!rawSlot || !rawDate || !rawTime) return null;
  const id = Number(rawSlot);
  if (!Number.isInteger(id)) return null;
  return (
    slots.find(
      (s) => s.id === id && s.date === rawDate && (s.time ?? "").slice(0, 5) === rawTime
    ) ?? null
  );
}

/** Window offset that brings `date` into the visible carousel. */
function windowStartFor(dates: string[], date: string): number {
  const index = dates.indexOf(date);
  if (index < 0) return 0;
  const start = Math.floor(index / VISIBLE_DATES) * VISIBLE_DATES;
  return Math.max(0, Math.min(start, Math.max(0, dates.length - VISIBLE_DATES)));
}
