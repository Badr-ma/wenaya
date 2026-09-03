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
  relatedTitle: string;
  relatedSub: string;
  /** Eyebrow label shown above the final booking heading */
  ctaEyebrow: string;
  /** Final conversion heading */
  ctaHeading: string;
  /** "View all sessions" link label */
  viewAll: string;
}

// ─── Canonical data (non-translatable) ─────────────────────────
// Slugs are stable, SEO-friendly and locale-specific (the EN route uses a
// different path name, so EN slugs are fully translated).

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

  const slug = locale === "en" ? c.slugEn : c.slugFr;
  const path = locale === "en" ? `/en/group-sessions/${c.slugEn}` : `/seance-de-groupe/${c.slugFr}`;

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
        ? `/en/contact?service=${c.slugEn}&type=group-session`
        : `/contact?service=${c.slugFr}&type=group-session`,
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

/** Get all group-session slugs for a locale (for generateStaticParams) */
export function getAllGroupSessionSlugs(locale: GroupSessionLocale = "fr"): string[] {
  return canonicalSessions.map((c) => (locale === "en" ? c.slugEn : c.slugFr));
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
    relatedTitle: detail.relatedTitle ?? "",
    relatedSub: detail.relatedSub ?? "",
    ctaEyebrow: detail.ctaEyebrow ?? "",
    ctaHeading: detail.ctaHeading ?? "",
    viewAll: detail.viewAll ?? "",
  };
}

/** Hreflang alternates for a canonical session — FR and EN URLs differ beyond the /en prefix. */
export function getGroupSessionAlternateUrls(c: CanonicalGroupSession): Record<string, string> {
  return {
    "fr-MA": `${SITE_URL}/seance-de-groupe/${c.slugFr}`,
    "en-MA": `${SITE_URL}/en/group-sessions/${c.slugEn}`,
    "x-default": `${SITE_URL}/seance-de-groupe/${c.slugFr}`,
  };
}

/** Booking-flow helper: resolve a `service` query value to a localized session for the contact form. */
export function getGroupSessionForBooking(service: string, locale: GroupSessionLocale = "fr"): GroupSession | undefined {
  return getGroupSessionBySlug(service, locale);
}