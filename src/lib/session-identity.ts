/**
 * Session identity — shared helpers for the group-session booking handoff.
 *
 * A group-session "service" identity takes one of two forms:
 *   - an editorial slug (e.g. FR "yoga-prenatal" / EN "prenatal-yoga"),
 *     resolved from local data via `getGroupSessionForBooking`, or
 *   - an API program key of the form `api-{programId}` (e.g. "api-269") that
 *     uniquely identifies a live backend program. The exact key is preserved
 *     verbatim through navigation so the contact form can recognise the
 *     program the user came from without ever guessing a slug.
 *
 * This module is pure and CLIENT-SAFE — nothing here touches the network. The
 * server-only resolver that maps an identity to the display title the contact
 * form recognises lives in `group-sessions-active.ts`
 * (`resolveRequestedSession`).
 */

/** Prefix marking a group-session service identity as a live backend program. */
export const API_SERVICE_PREFIX = "api-";

/** True when `service` is a live-backend group-session key (`api-{programId}`). */
export function isApiSessionService(service?: string | null): boolean {
  return typeof service === "string" && service.startsWith(API_SERVICE_PREFIX);
}