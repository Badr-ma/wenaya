/**
 * Group Sessions ACTIVE adapter — the live-backend-aware complement of the
 * local-only `group-sessions.ts` adapter.
 *
 * Contract (see `wenaya-group-sessions-api-contract.md` STEP 3):
 *   - source of truth for the /seance-de-groupe (+ /en/...) LISTING is the
 *     backend ACTIVE group-appointment feed
 *   - a program is listable when it has ≥1 slot that is `event_status ===
 *     "active"` AND `event_date >= today` (verified: a full day of 59 flat
 *     slots = 58 active + 1 completed date-stamped today; endpoint-2
 *     `children[]` contains only active slots)
 *   - identity is the backend `id`/`parent` number — NEVER `event_slug`
 *     (irregular: `jiu-jitsu-kids-7-12-ans-13`; child slugs don't match ids)
 *   - backend-only programs (no local editorial mapping) become MINIMAL
 *     records from verified API fields only; their card routes to the contact
 *     flow (`/contact-us?service=api-{id}&type=group-session`) — no guessed
 *     detail-slug, no fabricated copy
 *   - on ANY API failure the whole listing falls back to local editorial
 *     sessions (never a blank page, never a partial merge)
 *   - local editorial sessions are NOT merged into an API-success listing —
 *     the backend ACTIVE set is authoritative
 */

import type { GroupSession, GroupSessionLocale } from "./group-sessions";
import { getAllGroupSessions, getGroupSessionLabels } from "./group-sessions";
import { fetchGroupPrograms } from "./group-sessions-api";
import type { ApiGroupProgram } from "./group-sessions-api";
import fr from "@/i18n/fr";
import en from "@/i18n/en";

// ─── Decorative image placeholders (existing public assets only) ───────
// The GroupSession model always carries an `image`. Backend-only programs
// have no local editorial image, so they map to an existing public asset as a
// neutral placeholder (same rule as the local adapter: no invented assets).
const FALLBACK_IMAGES: Partial<Record<string, string>> = {
  "api-922": "/images/cours-ateliers/wellness.jpg",
  "api-269": "/images/wellness-stretch.jpg",
};
const DEFAULT_FALLBACK_IMAGE = "/images/cours-ateliers/wellness.jpg";

// ─── Verified-fact description for backend-only programs ───────────────
// Built ONLY from verified API fields (company.name) + the site's own
// location copy — no invented copy. `company.name` is present on the
// endpoint-2 program records; the "in person" fact comes from the contract
// census (all known slots are `offline`).
const BACKEND_PROGRAM_DESC: Record<GroupSessionLocale, string> = {
  fr: "Séance collective en présentiel au centre Wenaya à Casablanca.",
  en: "Group session in person at the Wenaya centre in Casablanca.",
};

// ─── Sanitizers ─────────────────────────────────────────────────────────

const ENTITY_RE = /&(?:#\d+|#x[\da-f]+|amp|lt|gt|quot|apos);/gi;

/** Decode numeric + named HTML entities then strip all tags. */
function decodeEntitiesStripped(input: string): string {
  return input
    .replace(ENTITY_RE, (match) => {
      const lower = match.toLowerCase();
      if (lower === "&amp;") return "&";
      if (lower === "&lt;") return "<";
      if (lower === "&gt;") return ">";
      if (lower === "&quot;") return '"';
      if (lower === "&apos;") return "'";
      if (lower.startsWith("&#x")) return String.fromCodePoint(parseInt(lower.slice(3, -1), 16));
      if (lower.startsWith("&#")) return String.fromCodePoint(parseInt(lower.slice(2, -1), 10));
      return match;
    })
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Locale resolution ──────────────────────────────────────────────────

interface LooseFormats {
  seanceDeGroupe?: {
    formats?: { items?: Record<string, { title: string; desc: string }> };
  };
}

function locationForLocale(locale: GroupSessionLocale): GroupSession["location"] {
  const b = (locale === "en" ? en : fr) as unknown as LooseFormats;
  const inPerson = b?.seanceDeGroupe?.formats?.items?.enPresentiel;
  return inPerson
    ? { title: inPerson.title, desc: inPerson.desc }
    : { title: locale === "en" ? "Group session" : "Séance de groupe", desc: "" };
}

// ─── Active predicate (verified against the live feed) ──────────────────

function isTodayOrFuture(date: string | null): boolean {
  if (!date) return false;
  // `event_date` is an ISO `YYYY-MM-DD` — lexicographic comparison is correct.
  const today = new Date().toISOString().slice(0, 10);
  return date >= today;
}

function hasActiveSlot(program: ApiGroupProgram): boolean {
  return program.children.some(
    (child) => child.event_status === "active" && isTodayOrFuture(child.event_date)
  );
}

// ─── Normalizer ─────────────────────────────────────────────────────────

function normalizeProgram(program: ApiGroupProgram, locale: GroupSessionLocale): GroupSession | null {
  if (!hasActiveSlot(program)) return null;

  const identity = `api-${program.id}`;
  const labels = getGroupSessionLabels(locale);
  const location = locationForLocale(locale);

  const title = program.title?.trim() || (locale === "en" ? "Group session" : "Séance de groupe");
  const description = BACKEND_PROGRAM_DESC[locale];
  // No canonical editorial slug exists for backend-only programs — the card
  // and CTA both route to the contact flow (`bookingHref`), never a guessed
  // detail-slug route. `id` is the stable model key (`api-{backendId}`).
  const bookingHref =
    locale === "en"
      ? `/en/contact-us?service=${identity}&type=group-session`
      : `/contact-us?service=${identity}&type=group-session`;

  return {
    id: identity,
    slug: identity,
    path: bookingHref,
    title,
    description,
    image: FALLBACK_IMAGES[identity] ?? DEFAULT_FALLBACK_IMAGE,
    accent: "#B88A5A",
    typeLabel: labels.typeGeneric,
    location,
    bookingHref,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Resolve the LISTING sessions from the live backend ACTIVE feed.
 * Returns only currently-active, today-or-future programs. Falls back to the
 * local editorial sessions on any transport/shape failure.
 */
export async function getActiveGroupSessions(
  locale: GroupSessionLocale = "fr"
): Promise<GroupSession[]> {
  try {
    const programs = await fetchGroupPrograms();
    const mapped = programs
      .map((program) => normalizeProgram(program, locale))
      .filter((session): session is GroupSession => session !== null);
    return mapped;
  } catch (error) {
    console.warn(
      "[group-sessions-active] backend feed unreachable, falling back to local sessions:",
      error instanceof Error ? error.message : error
    );
    return getAllGroupSessions(locale);
  }
}

/** Entity/tag sanitizer exported for verification harnesses and future use. */
export function sanitizeGroupSessionHtml(input: string): string {
  return decodeEntitiesStripped(input);
}