import { fetchPatientMe, fetchPatientBookings } from "./patient-auth/transport";
import { mapPatientOutcome } from "./patient-auth/response";
import { normalizePatientBookings, upcomingGroupBookings, type PatientBooking, type BookingKind, type BookingBucket } from "./patient-bookings";

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
  if (kind === "groups") {
    const setCookies = [...me.setCookies];
    const items: PatientBooking[] = [];
    let groupSession = session;
    // Filter across the whole feed before paginating: older backend pages may
    // contain future sessions even when the first page contains only history.
    for (let upstreamPage = 1; upstreamPage <= 100; upstreamPage++) {
      const result = await fetchPatientBookings(groupSession, kind, upstreamPage, "upcoming");
      setCookies.push(...result.setCookies);
      groupSession = applyReseedCookies(groupSession, result.setCookies).cookieHeader;
      const mapped = mapPatientOutcome(result.outcome);
      if (!mapped.body.success) return { ...mapped, setCookies };
      try {
        const data = normalizePatientBookings(result.outcome.json, kind, "upcoming");
        if (data.page !== upstreamPage) throw new Error("Unexpected group page");
        items.push(...data.items);
        if (upstreamPage < data.totalPages) continue;
        const upcoming = upcomingGroupBookings([...new Map(items.map(item => [item.id, item])).values()]);
        const totalPages = Math.max(1, Math.ceil(upcoming.length / 10));
        const currentPage = Math.min(page, totalPages);
        return { status: 200, body: { success: true, type: "success",
          items: upcoming.slice((currentPage - 1) * 10, currentPage * 10),
          page: currentPage, totalPages, total: upcoming.length }, setCookies };
      } catch {
        return { status: 502, body: { success: false, type: "backend-error" }, setCookies };
      }
    }
    return { status: 502, body: { success: false, type: "backend-error" }, setCookies };
  }
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
