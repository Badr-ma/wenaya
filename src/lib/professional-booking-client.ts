/**
 * Client-side fetcher for the professional booking submission BFF
 * `/api/professionals/waiting-list` (see
 * `src/app/api/professionals/waiting-list/route.ts`).
 *
 * The browser never talks to the upstream professional API directly — the
 * same-origin route owns the upstream call, the `company: 1` header and the
 * `status: "pending"` envelope, mirroring the legacy wenaya-front
 * `joinWaitingList` (`POST api/v1/waiting-lists`) contract.
 *
 * Never rejects: `{ ok:false }` maps to the panel's retry UX state.
 */

export interface WaitingListPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id: number;
  booking_date: string;
  booking_time: string;
  notes?: string;
}

const ENDPOINT = "/api/professionals/waiting-list";

export async function submitWaitingListRequest(
  payload: WaitingListPayload
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false };
    const json = await res.json();
    return { ok: json?.success === true };
  } catch {
    return { ok: false };
  }
}
