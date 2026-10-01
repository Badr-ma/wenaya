/**
 * Group Sessions Adapter — single entry point for normalized group-session data.
 *
 * Sources only REAL Wenaya information already present in the project:
 *   - the 6 session titles/descriptions from the shared `coursAteliers` i18n bundle
 *   - format/location copy from `seanceDeGroupe.formats` (weekly classes vs workshops,
 *     in-person at the Wenaya centre in Casablanca)
 *   - existing public images used by the homepage and listing
 *
 * No invented prices, teachers, dates, capacities, durations or schedules.
 *
 * Public API:
 *   getAllGroupSessions(locale)            → GroupSession[]
 *   getGroupSessionBySlug(slug, locale)    → GroupSession | undefined
 *   getAllGroupSessionSlugs(locale)        → string[]
 *   getRelatedGroupSessions(id, locale)    → GroupSession[]
 *   getGroupSessionLabels(locale)          → GroupSessionDetailLabels
 *   getCanonicalGroupSession(slug)         → CanonicalGroupSession | undefined (either locale slug)
 *   getGroupSessionAlternateUrls(canonical)→ hreflang map
 *
 * Public URLs (matching live wenaya.com):
 *   FR listing/detail  → /seance-de-groupe/{slugFr}
 *   EN listing/detail  → /en/seance-de-groupe/{slugFr}  (EN uses the same FR slug)
 */
import fr from "@/i18n/fr";
import en from "@/i18n/en";
import { SITE_URL } from "./site-config";

// ─── Domain Model ──────────────────────────────────────────────

export type GroupSessionLocale = "fr" | "en";

export type SessionFormat = "weekly" | "workshop";

export interface GroupSession {
  /** Stable identifier — equals the i18n key used by the shared `coursAteliers` bundle */
  id: string;
  /** Locale-resolved URL slug (e.g. fr: "yoga-prenatal", en: "prenatal-yoga") */
  slug: string;
  /** Full public path in the current locale */
  path: string;
  /** Locale-resolved title */
  title: string;
  /** Locale-resolved short description */
  description: string;
  /**
   * Short editorial one-line "dek" for hero / visual-band placements, derived
   * from the FIRST PARAGRAPH of the full body (live programs) — the complete
   * `description` is rendered ONCE in the "About this session" section so the
   * same generic copy is never repeated across sections. Falls back to
   * `description` when absent (editorial sessions).
   */
  dek?: string;
  /** Card / hero image */
  image: string;
  /** Bronze accent used in card visuals */
  accent: string;
  /** Broad activity type label (group course / group workshop / group session) */
  typeLabel: string;
  /** Format details (weekly course vs one-off workshop) — only when supported by real data */
  format?: { title: string; desc: string };
  /** Who the session is for — only when supported by real data */
  audience?: string;
  /** Where sessions take place */
  location: { title: string; desc: string };
  /** Contact-flow href that preserves which session was selected */
  bookingHref: string;
  /**
   * Verified backend facts (present ONLY on live-feed-normalized sessions —
   * `group-sessions-active.ts`). Local editorial sessions never carry this.
   * Each field comes from the endpoint-2 programme record (`children[]` for
   * the next-slot facts); see the adapter header for the verification notes.
   */
  live?: GroupSessionLiveFacts;
}

/**
 * Verified facts exposed from the ACTIVE group-appointment backend feed for a
 * programme with ≥1 active today-or-future slot. Deliberately minimal and
 * field-verified only — no room is exposed because endpoint-2 carries NO room
 * field (the flat feed does); no "available places" number is computed because
 * capacity semantics were never confirmed against the booking backend.
 */
export interface GroupSessionLiveFacts {
  /** Backend programme id (numeric) — stable identity, never `event_slug`. */
  programId: number;
  /** Backend programme title, verbatim (e.g. "Jiu Jitsu Kids (7-12 ans)"). */
  programTitle: string;
  /** Coach display name from `professional.first_name + last_name`, or null. */
  coach: string | null;
  /** Coach avatar URL from `professional.avatar`, or null. */
  coachAvatar: string | null;
  /** Cheapest active-child price (MAD, backend string format, e.g. "200"). */
  price: string | null;
  /** First-use price when the parent declares one > 0 (e.g. "150"), else null. */
  priceFirstUse: string | null;
  /** Session duration in minutes (verified "60"). */
  durationMinutes: number | null;
  /** Capacity of the NEXT upcoming active slot (per-slot, not programme-wide). */
  nextCapacity: number | null;
  /** Registered participants of the NEXT upcoming active slot (0 is valid). */
  nextParticipants: number | null;
  /** Next upcoming active slot date (ISO `YYYY-MM-DD`). */
  nextDate: string | null;
  /** Next upcoming active slot time (`HH:mm:ss`). */
  nextTime: string | null;
  /** Count of active, today-or-future slots in the programme. */
  slotCount: number;
  /** All active, today-or-future slots sorted by date then time (booking-panel source). */
  slots: LiveGroupSessionSlot[];
}

/**
 * One bookable slot of a live group programme — verified backend fields only.
 * `nbr_of_participants` is deliberately excluded (children serialize a `0`,
 * and no invented "available places" figure is exposed — capacity semantics
 * are unconfirmed against the booking backend).
 */
export interface LiveGroupSessionSlot {
  /** Backend child-slot id (numeric, stable) - submitted with the booking request. */
  id: number;
  /** ISO slot date (`YYYY-MM-DD`). */
  date: string | null;
  /** Slot time (`HH:mm:ss`; display slices to `HH:mm`). */
  time: string | null;
  /** Slot price (MAD, backend string format, e.g. "200"). */
  price: string | null;
  /** Verified per-slot capacity, or null when unknown. */
  capacity: number | null;
}

export interface GroupSessionDetailLabels {
  back: string;
  bookCta: string;
  bookingNote: string;
  typeWeekly: string;
  typeWorkshop: string;
  typeGeneric: string;
  whatTitle: string;
  audienceTitle: string;
  formatTitle: string;
  locationTitle: string;
  coachTitle: string;
  nextTitle: string;
  durationTitle: string;
  priceTitle: string;
  priceFirstUsePrefix: string;
  slotCountLabel: string;
  relatedTitle: string;
  relatedSub: string;
  /** Eyebrow label shown above the final booking heading */
  ctaEyebrow: string;
  /** Final conversion heading */
  ctaHeading: string;
  /** "View all sessions" link label */
  viewAll: string;
  /** Booking panel eyebrow label */
  panelEyebrow: string;
  /** Booking panel supporting copy */
  panelSub: string;
  /** Booking panel step-1 label (dates) */
  dateLabel: string;
  /** Booking panel step-2 label (times) */
  timeLabel: string;
  /** Hint shown before a time is chosen */
  timeHint: string;
  /** Booking panel date-carousel previous-dates button aria-label */
  datePrevAria: string;
  /** Booking panel date-carousel next-dates button aria-label */
  dateNextAria: string;
  /** Booking panel hint above the action buttons */
  selectionHint: string;
  /** Pay-later CTA (supported seam) - submits a real authenticated booking request */
  payLaterCta: string;
  /** Pay-later supporting hint */
  payLaterHint: string;
  /** Pay-online CTA (labelled preview — payments backend not wired) */
  payOnlineCta: string;
  /** Pay-online supporting note */
  payOnlineNote: string;
  /** Empty state when the programme has no selectable slots */
  noAvailability: string;
  /** Pay-later button label while the patient session is being verified */
  bookingChecking: string;
  /** Pay-later button label while the booking request is being submitted */
  bookingSubmitting: string;
  /** Retry CTA shown after a failed booking request */
  bookingRetry: string;
  /** Error block heading after a failed booking request */
  bookingErrorTitle: string;
  /** Error copy when the patient session is no longer valid */
  bookingErrorSession: string;
  /** Error copy when the chosen slot was rejected as unavailable */
  bookingErrorSlot: string;
  /** Error copy when the live slot feed could not be reached */
  bookingErrorFeed: string;
  /** Error copy for any other failure */
  bookingErrorGeneric: string;
  /** Confirmation block heading after a booking request was submitted */
  bookingDoneTitle: string;
  /** Confirmation block body after a booking request was submitted */
  bookingDoneText: string;
}

// ─── Canonical data (non-translatable) ─────────────────────────
// Slugs are stable and SEO-friendly. Live wenaya.com serves the ENGLISH detail
// pages under the FRENCH slug: /en/seance-de-groupe/{slugFr}. The translated
// slugEn is kept only for the booking `service` query value on the contact form.

export interface CanonicalGroupSession {
  /** i18n key into the shared `coursAteliers` bundle */
  key: string;
  slugFr: string;
  slugEn: string;
  image: string;
  accent: string;
  /** Only set where the real `seanceDeGroupe.formats` copy confirms a weekly course or workshop */
  format?: SessionFormat;
}

const canonicalSessions: CanonicalGroupSession[] = [
  {
    key: "yoga",
    slugFr: "yoga-prenatal",
    slugEn: "prenatal-yoga",
    image: "/images/cours-ateliers/yoga.jpg",
    accent: "#B88A5A",
    format: "weekly",
  },
  {
    key: "sophrologie",
    slugFr: "sophrologie",
    slugEn: "sophrology",
    image: "/images/cours-ateliers/nature.jpg",
    accent: "#C99B68",
    format: "workshop",
  },
  {
    key: "nutrition",
    slugFr: "nutrition",
    slugEn: "nutrition",
    image: "/images/cours-ateliers/nutrition.jpg",
    accent: "#D4A870",
    format: "workshop",
  },
  {
    key: "breathwork",
    slugFr: "breathwork",
    slugEn: "breathwork",
    image: "/images/cours-ateliers/wellness.jpg",
    accent: "#B88A5A",
    format: "workshop",
  },
  {
    key: "jjb",
    slugFr: "jiu-jitsu-bresilien",
    slugEn: "brazilian-jiu-jitsu",
    image: "/images/wellness-stretch.jpg",
    accent: "#C99B68",
    format: "weekly",
  },
  {
    key: "pilates",
    slugFr: "pilates-et-posture",
    slugEn: "pilates-and-posture",
    image: "/images/cours-ateliers/yoga.jpg",
    accent: "#D4A870",
  },
];

/** Audience is only declared where the real session description supports it (Prenatal Yoga). */
const audiences: Partial<Record<string, { fr: string; en: string }>> = {
  yoga: { fr: "Femmes enceintes", en: "Pregnant women" },
};

// ─── Locale resolution ─────────────────────────────────────────

interface LooseBundle {
  coursAteliers: Record<string, { title: string; desc: string }>;
  seanceDeGroupe: {
    detail: Record<string, string>;
    formats: { items: Record<string, { title: string; desc: string }> };
  };
}

function bundle(locale: GroupSessionLocale): LooseBundle {
  return (locale === "en" ? en : fr) as unknown as LooseBundle;
}

// ─── Normalizer ────────────────────────────────────────────────

function normalize(c: CanonicalGroupSession, locale: GroupSessionLocale): GroupSession {
  const b = bundle(locale);
  const item = b.coursAteliers?.[c.key];
  const formats = b.seanceDeGroupe?.formats?.items;
  const detail = b.seanceDeGroupe?.detail;

  const slug = c.slugFr;
  const path = locale === "en" ? `/en/seance-de-groupe/${c.slugFr}` : `/seance-de-groupe/${c.slugFr}`;

  const formatKey = c.format === "weekly" ? "semana" : c.format === "workshop" ? "ateliers" : undefined;
  const format = formatKey && formats?.[formatKey] ? { title: formats[formatKey].title, desc: formats[formatKey].desc } : undefined;
  const inPerson = formats?.enPresentiel;
  const audience = audiences[c.key]?.[locale];
  const typeLabel =
    c.format === "weekly" ? detail?.typeWeekly
    : c.format === "workshop" ? detail?.typeWorkshop
    : detail?.typeGeneric ?? slug;

  return {
    id: c.key,
    slug,
    path,
    title: item?.title ?? slug,
    description: item?.desc ?? "",
    image: c.image,
    accent: c.accent,
    typeLabel,
    format,
    audience,
    location: inPerson ? { title: inPerson.title, desc: inPerson.desc } : { title: slug, desc: "" },
    bookingHref:
      locale === "en"
        ? `/en/contact-us?service=${c.slugEn}&type=group-session`
        : `/contact-us?service=${c.slugFr}&type=group-session`,
  };
}

// ─── Public API ────────────────────────────────────────────────

/** Get all group sessions normalized to the GroupSession model */
export function getAllGroupSessions(locale: GroupSessionLocale = "fr"): GroupSession[] {
  return canonicalSessions.map((c) => normalize(c, locale));
}

/** Get a single group session by slug (FR or EN slug for the given locale), or undefined */
export function getGroupSessionBySlug(slug: string, locale: GroupSessionLocale = "fr"): GroupSession | undefined {
  const canonical = getCanonicalGroupSession(slug);
  if (!canonical) return undefined;
  return normalize(canonical, locale);
}

/** Get all group-session slugs (EN public route uses the same FR slugs as live) */
export function getAllGroupSessionSlugs(): string[] {
  return canonicalSessions.map((c) => c.slugFr);
}

/** Get the N related sessions for a given session id */
export function getRelatedGroupSessions(id: string, locale: GroupSessionLocale = "fr", count = 3): GroupSession[] {
  return canonicalSessions
    .filter((c) => c.key !== id)
    .slice(0, count)
    .map((c) => normalize(c, locale));
}

/** Match a slug against either the FR or EN slug — used by the booking/preselect flow */
export function getCanonicalGroupSession(slug: string): CanonicalGroupSession | undefined {
  return canonicalSessions.find((c) => c.slugFr === slug || c.slugEn === slug);
}

/** Detail-page UI labels for a locale */
export function getGroupSessionLabels(locale: GroupSessionLocale = "fr"): GroupSessionDetailLabels {
  const detail = bundle(locale).seanceDeGroupe?.detail ?? {};
  return {
    back: detail.back ?? "/seance-de-groupe",
    bookCta: detail.bookCta ?? "Book a spot",
    bookingNote: detail.bookingNote ?? "",
    typeWeekly: detail.typeWeekly ?? "",
    typeWorkshop: detail.typeWorkshop ?? "",
    typeGeneric: detail.typeGeneric ?? "",
    whatTitle: detail.whatTitle ?? "",
    audienceTitle: detail.audienceTitle ?? "",
    formatTitle: detail.formatTitle ?? "",
    locationTitle: detail.locationTitle ?? "",
    coachTitle: detail.coachTitle ?? "",
    nextTitle: detail.nextTitle ?? "",
    durationTitle: detail.durationTitle ?? "",
    priceTitle: detail.priceTitle ?? "",
    priceFirstUsePrefix: detail.priceFirstUsePrefix ?? "",
    slotCountLabel: detail.slotCountLabel ?? "",
    relatedTitle: detail.relatedTitle ?? "",
    relatedSub: detail.relatedSub ?? "",
    ctaEyebrow: detail.ctaEyebrow ?? "",
    ctaHeading: detail.ctaHeading ?? "",
    viewAll: detail.viewAll ?? "",
    panelEyebrow: detail.panelEyebrow ?? "",
    panelSub: detail.panelSub ?? "",
    dateLabel: detail.dateLabel ?? "",
    timeLabel: detail.timeLabel ?? "",
    timeHint: detail.timeHint ?? "",
    datePrevAria: detail.datePrevAria ?? "",
    dateNextAria: detail.dateNextAria ?? "",
    selectionHint: detail.selectionHint ?? "",
    payLaterCta: detail.payLaterCta ?? "",
    payLaterHint: detail.payLaterHint ?? "",
    payOnlineCta: detail.payOnlineCta ?? "",
    payOnlineNote: detail.payOnlineNote ?? "",
    noAvailability: detail.noAvailability ?? "",
    bookingChecking: detail.bookingChecking ?? "",
    bookingSubmitting: detail.bookingSubmitting ?? "",
    bookingRetry: detail.bookingRetry ?? "",
    bookingErrorTitle: detail.bookingErrorTitle ?? "",
    bookingErrorSession: detail.bookingErrorSession ?? "",
    bookingErrorSlot: detail.bookingErrorSlot ?? "",
    bookingErrorFeed: detail.bookingErrorFeed ?? "",
    bookingErrorGeneric: detail.bookingErrorGeneric ?? "",
    bookingDoneTitle: detail.bookingDoneTitle ?? "",
    bookingDoneText: detail.bookingDoneText ?? "",
  };
}

/** Hreflang alternates for a canonical session — English detail pages live at /en/seance-de-groupe/{slugFr}. */
export function getGroupSessionAlternateUrls(c: CanonicalGroupSession): Record<string, string> {
  return {
    "fr-MA": `${SITE_URL}/seance-de-groupe/${c.slugFr}`,
    "en-MA": `${SITE_URL}/en/seance-de-groupe/${c.slugFr}`,
    "x-default": `${SITE_URL}/seance-de-groupe/${c.slugFr}`,
  };
}

/** Booking-flow helper: resolve a `service` query value to a localized session for the contact form. */
export function getGroupSessionForBooking(service: string, locale: GroupSessionLocale = "fr"): GroupSession | undefined {
  return getGroupSessionBySlug(service, locale);
}