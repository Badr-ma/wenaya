"use client";

import { httpRequest } from "@/lib/http-request";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import type { BookingKind, BookingBucket, PatientBookingsPage } from "@/lib/patient-bookings";

interface Labels {
  title: string; subtitle: string; appointments: string; groups: string;
  today: string; upcoming: string; past: string; allGroups: string;
  loading: string; error: string; empty: string; expired: string; login: string; retry: string;
  appointment: string; group: string; unknownDate: string; with: string; location: string;
  bookingStatus: string; eventStatus: string; reference: string; details: string;
  previous: string; next: string; page: string; of: string;
  statuses: Record<string, string>;
}
type State = { type: "loading" } | { type: "error"; expired: boolean } |
  { type: "success"; data: PatientBookingsPage };

function displayDate(date: string, locale: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-MA", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

export default function PatientBookings() {
  const { locale, tRaw } = useLocale();
  const labels = tRaw<Labels>("compte.bookings");
  const [query, setQuery] = useState<{ kind: BookingKind; bucket: BookingBucket; page: number }>({
    kind: "appointments", bucket: "upcoming", page: 1,
  });
  const [state, setState] = useState<State>({ type: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ kind: query.kind, bucket: query.bucket, page: String(query.page) });
    void (async () => {
      try {
        const response = await httpRequest(`/api/account/bookings?${params}`, {
          credentials: "same-origin", cache: "no-store", signal: controller.signal,
        });
        const body = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || body.success !== true || !Array.isArray(body.items)) {
          setState({ type: "error", expired: response.status === 401 });
          return;
        }
        setState({ type: "success", data: body });
      } catch {
        if (!controller.signal.aborted) setState({ type: "error", expired: false });
      }
    })();
    return () => controller.abort();
  }, [query.kind, query.bucket, query.page, attempt]);

  const change = (next: typeof query) => {
    setState({ type: "loading" });
    setQuery(next);
  };
  const button = "rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]";
  const chosen = "border-[#0B1220] bg-[#0B1220] text-white";
  const unchosen = "border-[#0B1220]/15 bg-white text-[#0B1220] hover:bg-[#FAF8F4]";

  return (
    <section aria-labelledby="patient-bookings-title" className="mt-8">
      <h2 id="patient-bookings-title" className="heading-serif text-2xl text-[#0B1220]">{labels.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-[#2B2F36]/80">{labels.subtitle}</p>
      <div className="mt-5 rounded-2xl border border-[#0B1220]/10 bg-white p-5 sm:p-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label={labels.title}>
          {(["appointments", "groups"] as const).map(kind => (
            <button key={kind} type="button" aria-pressed={query.kind === kind}
              className={`${button} ${query.kind === kind ? chosen : unchosen}`}
              onClick={() => { if (kind !== query.kind) change({ ...query, kind, page: 1 }); }}>
              {labels[kind]}
            </button>
          ))}
        </div>
        {query.kind === "appointments" ? (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={labels.appointments}>
            {(["upcoming", "today", "past"] as const).map(bucket => (
              <button key={bucket} type="button" aria-pressed={query.bucket === bucket}
                className={`${button} ${query.bucket === bucket ? chosen : unchosen}`}
                onClick={() => { if (bucket !== query.bucket) change({ ...query, bucket, page: 1 }); }}>{labels[bucket]}</button>
            ))}
          </div>
        ) : <p className="mt-4 text-sm text-[#2B2F36]/80">{labels.allGroups}</p>}

        <div className="mt-6" aria-busy={state.type === "loading"}>
          {state.type === "loading" && <p role="status" className="py-6 text-sm text-[#2B2F36]">{labels.loading}</p>}
          {state.type === "error" && (
            <div className="rounded-xl bg-[#FAF8F4] p-4">
              <p role="alert" className="text-sm text-[#0B1220]">{state.expired ? labels.expired : labels.error}</p>
              {state.expired ? <Link href={h(locale, "/login")} className="mt-3 inline-block underline">{labels.login}</Link> : (
                <button type="button" className={`${button} ${unchosen} mt-3`} onClick={() => {
                  setState({ type: "loading" }); setAttempt(value => value + 1);
                }}>{labels.retry}</button>
              )}
            </div>
          )}
          {state.type === "success" && (
            <>
              {state.data.items.length === 0 ? <p role="status" className="py-6 text-sm text-[#2B2F36]">{labels.empty}</p> : (
                <ul className="divide-y divide-[#0B1220]/10">
                  {state.data.items.map(booking => (
                    <li key={booking.id} className="py-5 first:pt-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#2B2F36]/80">{query.kind === "groups" ? labels.group : labels.appointment}</p>
                      <h3 className="mt-1 text-lg font-semibold text-[#0B1220]">{booking.title || booking.professional || (query.kind === "groups" ? labels.group : labels.appointment)}</h3>
                      <p className="mt-2 text-sm text-[#0B1220]">{displayDate(booking.date, locale) || labels.unknownDate}{booking.time ? ` · ${booking.time}` : ""}</p>
                      {booking.title && booking.professional && <p className="mt-1 break-words text-sm text-[#2B2F36]">{labels.with} {booking.professional}</p>}
                      {booking.location && <p className="mt-1 break-words text-sm text-[#2B2F36]">{labels.location}: {booking.location}</p>}
                      {booking.status && <p className="mt-2 text-sm text-[#0B1220]">{query.kind === "groups" ? labels.eventStatus : labels.bookingStatus}: {Object.hasOwn(labels.statuses, booking.status.toLowerCase()) ? labels.statuses[booking.status.toLowerCase()] : booking.status}</p>}
                      <details className="mt-3 text-sm text-[#2B2F36]">
                        <summary className="cursor-pointer font-medium underline underline-offset-4">{labels.details}</summary>
                        <p className="mt-2">{labels.reference}: {booking.id}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              )}
              {state.data.totalPages > 1 && (
                <nav className="mt-5 flex flex-wrap items-center justify-between gap-3" aria-label={labels.title}>
                  <button type="button" className={`${button} ${unchosen} disabled:opacity-40`} disabled={state.data.page <= 1}
                    onClick={() => change({ ...query, page: state.data.page - 1 })}>{labels.previous}</button>
                  <span className="text-sm text-[#2B2F36]">{labels.page} {state.data.page} {labels.of} {state.data.totalPages}</span>
                  <button type="button" className={`${button} ${unchosen} disabled:opacity-40`} disabled={state.data.page >= state.data.totalPages}
                    onClick={() => change({ ...query, page: state.data.page + 1 })}>{labels.next}</button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
