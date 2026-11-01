import { fetchPatientMe, fetchPatientBookings } from "./patient-auth/transport";
import { mapPatientOutcome } from "./patient-auth/response";
import { normalizePatientBookings, type BookingKind, type BookingBucket } from "./patient-bookings";

export async function readPatientBookings(
  cookie: string | undefined, kind: BookingKind, page: number, bucket: BookingBucket,
) {
  const me = await fetchPatientMe(cookie);
  const auth = mapPatientOutcome(me.outcome);
  if (!auth.body.success) return { ...auth, setCookies: me.setCookies };
  if (!auth.body.user?.id) return {
    status: 502, body: { success: false, type: "backend-error" }, setCookies: me.setCookies,
  };
  // Carry any session rotation into the next authenticated read.
  const { applyReseedCookies } = await import("./patient-auth/cookies");
  const session = applyReseedCookies(cookie, me.setCookies).cookieHeader;
  const result = await fetchPatientBookings(session, kind, page, bucket);
  const mapped = mapPatientOutcome(result.outcome);
  const setCookies = [...me.setCookies, ...result.setCookies];
  if (!mapped.body.success) return { ...mapped, setCookies };
  try {
    return { status: 200, body: { success: true, type: "success", ...normalizePatientBookings(result.outcome.json, kind, bucket) }, setCookies };
  } catch {
    return { status: 502, body: { success: false, type: "backend-error" }, setCookies };
  }
}
