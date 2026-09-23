import { NextResponse } from "next/server";
import {
  getProfessionalUnavailableDates,
  getProfessionalAvailableTimes,
  isIsoDate,
  type ProfessionalDayAvailability,
} from "@/lib/professional-availability";

/**
 * BFF proxy for the professional availability read APIs.
 *
 * Two operations behind one route, selected by `type`:
 *   GET /api/professionals/availability?type=unavailable-dates&userName={slug or username}&date=YYYY-MM-DD
 *   GET /api/professionals/availability?type=available-times&professionalId={integer}&date=YYYY-MM-DD
 *
 * Deliberately a server-side proxy (route handlers never ship to the client):
 * the browser only ever talks to this route, never to dev-api.wenaya.com.
 * Raw Laravel payloads/errors are NEVER exposed — client-state reasons map to
 * a stable envelope; unexpected upstream failures become a plain `api-error`.
 *
 * Envelopes:
 *   - open day:     { error:false, data:{ available:true,  slots:[{start,end,isReserved}] } }
 *   - closed day:   { error:false, data:{ available:false, slots:[], nextDay:"YYYY-MM-DD", reason:"unavailable" } }
 *   - other reason: { error:false, data:{ available:false, slots:[], nextDay:null,   reason:"no-work-hours"|"ghost-mode"|"home-care-restricted" } }
 *   - api-error:    502 { error:true, reason:"api-error" }   (upstream/network/validation failure)
 *   - bad params:   400 { error:true, reason:"bad-request" }
 *
 * `force-dynamic` by design: availability is perishable (slots revalidate
 * ≤60s, unavailable-dates 1h at the fetch layer), and `next: { revalidate }`
 * cannot be set from a standalone route handler without static rendering.
 */
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const USERNAME_RE = /^[a-zA-Z0-9-]+$/;

function badRequest(reason: string): NextResponse {
  return NextResponse.json({ error: true, reason }, { status: 400 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "unavailable-dates") {
    const userName = searchParams.get("userName") ?? "";
    const date = searchParams.get("date") ?? "";
    if (!USERNAME_RE.test(userName)) {
      return badRequest("bad-request");
    }
    if (!isIsoDate(date)) {
      return badRequest("bad-request");
    }

    const unavailable = await getProfessionalUnavailableDates(userName, date);
    return NextResponse.json({ error: false, data: unavailable });
  }

  if (type === "available-times") {
    const rawId = searchParams.get("professionalId") ?? "";
    const date = searchParams.get("date") ?? "";
    const professionalId = Number(rawId);
    if (!Number.isInteger(professionalId) || professionalId <= 0) {
      return badRequest("bad-request");
    }
    if (!DATE_RE.test(date)) {
      return badRequest("bad-request");
    }

    const day = await getProfessionalAvailableTimes(professionalId, date);
    if ((day.reason ?? null) === "api-error") {
      return NextResponse.json({ error: true, reason: "api-error" }, { status: 502 });
    }
    return NextResponse.json({ error: false, data: toApiDay(day) });
  }

  return badRequest("bad-request");
}

function toApiDay(day: ProfessionalDayAvailability) {
  return {
    available: day.available,
    slots: day.slots,
    nextDay: day.nextDay,
    reason: day.reason,
  };
}