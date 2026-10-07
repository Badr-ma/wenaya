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
 *     records from verified API fields only; their card routes to a dedicated
 *     DETAIL page (`/seance-de-groupe/{live-slug}`), and the booking CTAs on
 *     that page route to the contact flow
 *     (`/contact-us?service=api-{id}&type=group-session`)
 *
 * STEP 3 (2026-09-24) — stable detail slugs for backend programs:
 *   Each active program receives a canonical SEO slug via `LIVE_PROGRAM_SLUGS`
 *   (explicit id → slug map for the current sellable set: 269 →
 *   `jiu-jitsu-kids`, 922 → `group-training`); unknown programs derive a
 *   stable slug `${slugified-title}-{id}` (reverse-parseable via the trailing
 *   `-{id}`). `path` becomes the detail route so listing cards reach a real
 *   page; `bookingHref` stays the contact flow for the CTAs.
 *   - on ANY API failure the whole listing falls back to local editorial
 *     sessions (never a blank page, never a partial merge)
 *   - local editorial sessions are NOT merged into an API-success listing —
 *     the backend ACTIVE set is authoritative
 *
 * STEP 1 (2026-09-24) — verified-fields enrichment:
 *   The normalized `GroupSession.live` facts carry ONLY field-verified values
 *   from the endpoint-2 programme record (re-probed live today):
 *     - coach        `professional.first_name` + `last_name` (e.g. Amer Hdidou
 *                     for 269, Thomas Sabrou for 922) + `professional.avatar`
 *     - price        active-child `price` strings (all children uniform today:
 *                     "200" / "300"); uses the cheapest, preserving raw format
 *     - priceFirstUse parent `firstUseprice` when > 0 ("150" for 269; "0" and
 *                     child "0"s are treated as "none") — child `firstUseprice`
 *                     values are NOT used (they serialize as "0")
 *     - duration     parent `duration` minutes (verified "60")
 *     - next slot    nearest active child with `event_date >= today` sorted by
 *                     date then time → `nextDate`/`nextTime`/`nextCapacity`/
 *                     `nextParticipants` (per-slot, NOT programme-wide)
 *     - slotCount    number of active today-or-future children
 *   NOT exposed (would be invented): `room` — endpoint-2 programmes/children
 *   have NO room field (the flat getAppointmentsGroup feed does); and no
 *   "available places" figure — capacity semantics unconfirmed against the
 *   booking backend.
 */

import type { GroupSession, GroupSessionLocale, GroupSessionLiveFacts, LiveGroupSessionSlot } from "./group-sessions";
import { getGroupSessionBySlug, getGroupSessionForBooking, getGroupSessionLabels } from "./group-sessions";
import { fetchGroupPrograms } from "./group-sessions-api";
import type { ApiGroupProgram, ApiGroupProgramChild } from "./group-sessions-api";
import { isApiSessionService } from "./session-identity";
import { SITE_URL } from "./site-config";
import fr from "@/i18n/fr";
import en from "@/i18n/en";

// ─── Decorative image placeholders (existing public assets only) ───────
// The GroupSession model always carries an `image`. Live programs use the real
// backend event `logo` (parent, else the first relevant active child); these
// placeholders are the last resort when the backend provides none — an
// existing public asset as a neutral fallback (same rule as the local
// adapter: no invented assets).
const FALLBACK_IMAGES: Partial<Record<string, string>> = {
  "api-922": "/images/cours-ateliers/wellness.jpg",
  "api-269": "/images/wellness-stretch.jpg",
};
const DEFAULT_FALLBACK_IMAGE = "/images/cours-ateliers/wellness.jpg";

// ─── Fallback description / EN one-liner for backend-only programs ─────
// Built ONLY from verified facts (the endpoint carries no locale field and its
// `description` is French-only): `company.name` + the site's own location
// copy — no invented copy. Used as the FR fallback when the backend description
// is missing/blank, and ALWAYS for EN (never French-as-English).
const BACKEND_PROGRAM_DESC: Record<GroupSessionLocale, string> = {
  fr: "Séance collective en présentiel au centre Wenaya à Casablanca.",
  en: "Group session in person at the Wenaya centre in Casablanca.",
};

// ─── Sanitizers ─────────────────────────────────────────────────────────

const ENTITY_RE = /&(?:#\d+|#x[\da-f]+|amp|lt|gt|quot|apos|nbsp|rsquo|lsquo|ldquo|rdquo|hellip);/gi;

const BLOCK_CLOSE_RE =
  /<\/(?:p|div|li|ul|ol|h[1-6]|blockquote|section|article|header|footer|tr)>/gi;
const LINE_BREAK_RE = /<br\s*\/?>/gi;

/**
 * Decode numeric + named HTML entities, then strip tags while PRESERVING
 * paragraph breaks: block-element closing tags become `\n\n`, `<br>` becomes
 * `\n`, other tags become a space (so inline text never glues). Horizontal
 * whitespace is collapsed, newline runs are capped at `\n\n`, and the result
 * is trimmed — safe to render with `whitespace-pre-line`.
 */
function decodeEntitiesStripped(input: string): string {
  return input
    .replace(ENTITY_RE, (match) => {
      const lower = match.toLowerCase();
      if (lower === "&amp;") return "&";
      if (lower === "&lt;") return "<";
      if (lower === "&gt;") return ">";
      if (lower === "&quot;") return '"';
      if (lower === "&apos;") return "'";
      if (lower === "&nbsp;") return " ";
      if (lower === "&rsquo;") return "'";
      if (lower === "&lsquo;") return "'";
      if (lower === "&ldquo;") return '"';
      if (lower === "&rdquo;") return '"';
      if (lower === "&hellip;") return "…";
      if (lower.startsWith("&#x")) return String.fromCodePoint(parseInt(lower.slice(3, -1), 16));
      if (lower.startsWith("&#")) return String.fromCodePoint(parseInt(lower.slice(2, -1), 10));
      return match;
    })
    .replace(BLOCK_CLOSE_RE, "\n\n")
    .replace(LINE_BREAK_RE, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Short editorial one-line "dek" for the hero / visual-band, derived from the
 * decoded body's FIRST PARAGRAPH (the full body renders ONCE in the About
 * section — the same generic description must not repeat across sections).
 * Truncated at ~170 chars on a word boundary with an ellipsis when needed.
 */
function buildDek(decodedBody: string): string {
  const firstPara = decodedBody.split(/\n{2,}/)[0] ?? "";
  const clean = firstPara.replace(/\s+/g, " ").trim();
  if (!clean) return clean;
  const MAX = 170;
  if (clean.length <= MAX) return clean;
  const cut = clean.slice(0, MAX);
  const at = cut.lastIndexOf(" ");
  return `${(at > 80 ? cut.slice(0, at) : cut).replace(/[.,;:]+$/, "")}…`;
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

// ─── Verified live-facts derivation ──────────────────────────────────────

/**
 * Active, today-or-future children sorted by date then time (single source of truth).
 */
function activeChildren(program: ApiGroupProgram): ApiGroupProgramChild[] {
  return program.children
    .filter((child) => child.event_status === "active" && isTodayOrFuture(child.event_date))
    .sort((a, b) =>
      `${a.event_date ?? ""} ${a.event_time ?? ""}`.localeCompare(
        `${b.event_date ?? ""} ${b.event_time ?? ""}`
      )
    );
}

/**
 * Nearest active, today-or-future dated slot (date asc, then time asc).
 * `null` when the programme has none (callers guard via `hasActiveSlot`).
 */
function findNextSlot(program: ApiGroupProgram): ApiGroupProgramChild | null {
  return activeChildren(program)[0] ?? null;
}

/**
 * Cheapest active-child price as a RAW backend string (preserves format).
 * Falls back to the parent `price` when no child carries a parseable price.
 */
function minPriceString(program: ApiGroupProgram): string | null {
  let best: string | null = null;
  let bestValue = Infinity;
  for (const child of program.children) {
    const n = Number.parseFloat(child.price ?? "");
    if (!Number.isFinite(n) || n <= 0 || n >= bestValue) continue;
    bestValue = n;
    best = child.price;
  }
  return best ?? program.price;
}

/**
 * First-use price from the PARENT record when it is a real positive number.
 * `"0"` (the child serialization) is treated as "no first-use price".
 */
function firstUsePrice(program: ApiGroupProgram): string | null {
  const n = Number.parseFloat(program.firstUseprice ?? "");
  return Number.isFinite(n) && n > 0 ? program.firstUseprice : null;
}

/** Parent `duration` (minutes) when parseable to a positive integer. */
function durationMinutes(program: ApiGroupProgram): number | null {
  const n = Number.parseFloat(program.duration ?? "");
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

/** Coach display identity from the embedded professional record. */
function coachDisplay(
  program: ApiGroupProgram
): { name: string | null; avatar: string | null } {
  const professional = program.professional;
  if (!professional) return { name: null, avatar: null };
  const first = typeof professional.first_name === "string" ? professional.first_name.trim() : "";
  const last = typeof professional.last_name === "string" ? professional.last_name.trim() : "";
  const name = [first, last].filter(Boolean).join(" ").trim() || null;
  const avatar =
    typeof professional.avatar === "string" && professional.avatar.trim() !== ""
      ? professional.avatar
      : null;
  return { name, avatar };
}

/** Assemble the verified `GroupSessionLiveFacts` block for a programme. */
function computeLiveFacts(program: ApiGroupProgram): GroupSessionLiveFacts {
  const next = findNextSlot(program);
  const coach = coachDisplay(program);
  return {
    programId: program.id,
    programTitle: program.title ?? "",
    coach: coach.name,
    coachAvatar: coach.avatar,
    price: minPriceString(program),
    priceFirstUse: firstUsePrice(program),
    durationMinutes: durationMinutes(program),
    nextCapacity: next?.capacity ?? null,
    nextParticipants: next?.nbr_of_participants ?? null,
    nextDate: next?.event_date ?? null,
    nextTime: next?.event_time ?? null,
    slotCount: activeChildren(program).length,
    slots: activeChildren(program).map((child): LiveGroupSessionSlot => ({
      id: child.id,
      date: child.event_date ?? null,
      time: child.event_time ?? null,
      price: child.price ?? null,
      capacity: child.capacity ?? null,
    })),
  };
}

// ─── Normalizer ─────────────────────────────────────────────────────────

/**
 * Explicit id → canonical slug map for the CURRENT sellable backend programs.
 * Slugs must NOT collide with local editorial slugs and must be stable,
 * SEO-friendly ASCII. Unknown programs (backend adds new parents) derive a
 * slug via `{slugify(title)}-{id}`.
 */
const LIVE_PROGRAM_SLUGS: Readonly<Record<number, string>> = {
  269: "jiu-jitsu-kids",
  922: "group-training",
};

function slugifyToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Canonical (detail-page) slug for a program, current map or derived. */
function programSlug(program: ApiGroupProgram): string {
  const explicit = LIVE_PROGRAM_SLUGS[program.id];
  if (explicit) return explicit;
  const titlePart = slugifyToken(program.title ?? "");
  return titlePart ? `${titlePart}-${program.id}` : `program-${program.id}`;
}

/** Reverse of `programSlug` — explicit map first, then trailing `-{id}`. */
export function liveProgramIdBySlug(slug: string): number | null {
  if (!slug) return null;
  const entry = Object.entries(LIVE_PROGRAM_SLUGS).find(([, value]) => value === slug);
  if (entry) return Number(entry[0]);
  const match = /-(\d+)$/.exec(slug);
  return match ? Number(match[1]) : null;
}

function normalizeProgram(program: ApiGroupProgram, locale: GroupSessionLocale): GroupSession | null {
  if (!hasActiveSlot(program)) return null;

  const identity = `api-${program.id}`;
  const labels = getGroupSessionLabels(locale);
  const location = locationForLocale(locale);

  const title = program.title?.trim() || (locale === "en" ? "Group session" : "Séance de groupe");
  // Real backend copy + media: parent description/logo first, then the first
  // relevant active child's. The endpoint carries no locale field (FR content
  // only), so EN keeps the approved verified one-liner — never French-as-English.
  const firstActiveChild = activeChildren(program)[0] ?? null;
  const rawDescription =
    program.description?.trim() || firstActiveChild?.description?.trim() || "";
  const decodedBody = rawDescription ? decodeEntitiesStripped(rawDescription) : "";
  const description =
    locale === "en"
      ? BACKEND_PROGRAM_DESC.en
      : decodedBody || BACKEND_PROGRAM_DESC.fr;
  // Hero / visual-band one-liner — the full body lives in the About section only.
  const dek =
    locale === "en"
      ? BACKEND_PROGRAM_DESC.en
      : decodedBody
        ? buildDek(decodedBody)
        : BACKEND_PROGRAM_DESC.fr;
  // STEP 3: dedicated detail page. `slug`/`path` target the canonical detail
  // route per locale; `bookingHref` is the contact-flow handoff used by the
  // detail page CTAs. `id` stays the stable model key (`api-{backendId}`).
  const slug = programSlug(program);
  const path =
    locale === "en" ? `/en/seance-de-groupe/${slug}` : `/seance-de-groupe/${slug}`;
  const bookingHref =
    locale === "en"
      ? `/en/contact-us?service=${identity}&type=group-session`
      : `/contact-us?service=${identity}&type=group-session`;

  return {
    id: identity,
    slug,
    path,
    title,
    description,
    dek,
    image:
      program.logo?.trim() ||
      firstActiveChild?.logo?.trim() ||
      (FALLBACK_IMAGES[identity] ?? DEFAULT_FALLBACK_IMAGE),
    accent: "#B88A5A",
    typeLabel: labels.typeGeneric,
    location,
    bookingHref,
    live: computeLiveFacts(program),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Resolve the LISTING sessions from the live backend ACTIVE feed.
 * Returns only currently-active, today-or-future programs.
 *
 * API-ONLY: any transport/shape failure returns `[]`. The local editorial
 * sessions are deliberately NOT substituted here — a program the backend
 * cannot confirm must not be presented to a visitor as bookable. Callers
 * render their own empty/unavailable state instead of a stale set.
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
      "[group-sessions-active] backend feed unreachable, returning empty:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Resolve a group-session `service` query value to the session title the
 * contact form should recognise. Editorial slugs resolve from local data (no
 * network); `api-{programId}` keys resolve against the live backend feed
 * (Data-Cache cached, 600s). Returns undefined when nothing matches so the
 * contact page stays a plain contact page.
 *
 * SERVER-ONLY — fetches the live feed for `api-*` keys; the editorial set
 * carries no `api-*` ids, so an API outage degrades to "no session
 * recognised" rather than inventing one.
 */
export async function resolveRequestedSession(
  service: string | undefined,
  locale: GroupSessionLocale = "fr"
): Promise<{ title: string } | undefined> {
  if (!service) return undefined;
  const editorial = getGroupSessionForBooking(service, locale);
  if (editorial) return { title: editorial.title };
  if (!isApiSessionService(service)) return undefined;
  const sessions = await getActiveGroupSessions(locale);
  const matched = sessions.find((s) => s.id === service);
  return matched ? { title: matched.title } : undefined;
}

/**
 * STEP 3 — resolve ONE canonical detail-page session, editorial first.
 *
 * Priority: a local editorial slug wins (deterministic, static, canonical via
 * `getCanonicalGroupSession`); otherwise the slug is interpreted as a LIVE
 * program slug (`jiu-jitsu-kids`, `group-training`, or derived `{title}-{id}`)
 * and resolved against the live backend feed. Returns undefined on ANY miss or
 * feed failure so the page can `notFound()` — never an invented detail page.
 */
export async function resolveDetailSession(
  slug: string,
  locale: GroupSessionLocale = "fr"
): Promise<GroupSession | undefined> {
  const editorial = getGroupSessionBySlug(slug, locale);
  if (editorial) return editorial;

  const programId = liveProgramIdBySlug(slug);
  if (programId === null) return undefined;

  try {
    const programs = await fetchGroupPrograms();
    const program = programs.find((p) => p.id === programId);
    return program ? normalizeProgram(program, locale) ?? undefined : undefined;
  } catch (error) {
    console.warn(
      "[group-sessions-active] detail feed unreachable for live slug:",
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

/**
 * STEP 3 — hreflang alternates for a LIVE program slug (EN reuses the FR slug
 * on its /en/... route). Editorial slugs keep `getGroupSessionAlternateUrls`.
 */
export function getLiveGroupSessionAlternateUrls(slug: string): Record<string, string> {
  return {
    "fr-MA": `${SITE_URL}/seance-de-groupe/${slug}`,
    "en-MA": `${SITE_URL}/en/seance-de-groupe/${slug}`,
    "x-default": `${SITE_URL}/seance-de-groupe/${slug}`,
  };
}

/**
 * STEP 3 — "related sessions" for a LIVE detail page: other currently-active
 * live programs, same locale, no padding. Empty on feed failure (the detail
 * page must not show fabricated neighbors).
 */
export async function getLiveRelatedSessions(
  currentId: string,
  locale: GroupSessionLocale = "fr",
  count = 3
): Promise<GroupSession[]> {
  try {
    const sessions = await getActiveGroupSessions(locale);
    return sessions.filter((s) => s.id !== currentId).slice(0, count);
  } catch (error) {
    console.warn(
      "[group-sessions-active] related feed unreachable, returning empty:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}