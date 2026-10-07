/**
 * Locale-aware internal link helper.
 * English pages live under `/en/...`; French pages stay at the root.
 * `h("en", "/about-us")` → "/en/about-us"; `h("fr", "/about-us")` → "/about-us".
 * External/anchor paths are returned unchanged.
 */
export type HrefLocale = "fr" | "en";

export function h(locale: HrefLocale, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (locale !== "en") return path;
  if (path === "/") return "/en";
  if (path === "/en" || path.startsWith("/en/")) return path;
  return `/en${path}`;
}

/**
 * Locale-aware href for the group-sessions page.
 * The EN listing matches live wenaya.com and uses the same segment as French
 * (/en/seance-de-groupe), so the EN path simply adds the /en prefix.
 */
export function groupSessionsHref(locale: HrefLocale): string {
  return locale === "en" ? "/en/seance-de-groupe" : "/seance-de-groupe";
}

/**
 * Locale-aware href for the Clinic page.
 * The EN route uses the English segment ("/en/clinic/wenaya-casablanca") while
 * FR uses the French segment ("/clinique/wenaya-casablanca") — a strict locale
 * split, not just an /en prefix. (The generic `h()` would wrongly produce
 * "/en/clinique/..." for EN, so a dedicated helper is required.)
 */
export function clinicHref(locale: HrefLocale): string {
  return locale === "en" ? "/en/clinic/wenaya-casablanca" : "/clinique/wenaya-casablanca";
}

/**
 * Route of the Homecare page.
 * `/soins-a-domicile` exists in French only (no `/en/...` route is published),
 * so every locale points at the FR page rather than fabricating a 404 path —
 * the generic `h()` would wrongly produce "/en/soins-a-domicile". Imported as a
 * constant (not a locale helper) precisely because it is locale-independent.
 */
export const HOMECARE_HREF = "/soins-a-domicile";

/**
 * Locale-aware href for the Maux-Troubles orientation page.
 * The EN route uses the English segment ("/en/health-needs") while FR uses the
 * French segment ("/maux-troubles") — a strict locale split like the Clinic page.
 * (The generic `h()` would wrongly produce "/en/maux-troubles".)
 */
export function healthNeedsHref(locale: HrefLocale): string {
  return locale === "en" ? "/en/health-needs" : "/maux-troubles";
}

/**
 * Locale-aware href for a single Maux-Troubles detail page.
 * FR: /maux-troubles/{slug} · EN: /en/health-needs/{slug} — strict locale split
 * (the generic `h()` would wrongly produce "/en/maux-troubles/{slug}").
 */
export function troubleDetailHref(locale: HrefLocale, slug: string): string {
  return locale === "en" ? `/en/health-needs/${slug}` : `/maux-troubles/${slug}`;
}

/**
 * Locale-aware href for the configurator coming-soon page.
 * The EN route uses the English segment ("/en/configurator") while FR uses the
 * French segment ("/configurateur") — a strict locale split, not just an /en prefix.
 * (The homepage hero "Trouver mon parcours" CTA scrolls to an in-page #configurator
 * anchor; these are the standalone routes the Quick Access "Needs & goals" card links to.)
 */
export function configuratorHref(locale: HrefLocale): string {
  return locale === "en" ? "/en/configurator" : "/configurateur";
}

/**
 * Convert a pathname in the current locale to the equivalent pathname in the
 * other locale, for the language switcher. Routes whose slug differs between
 * locales are mapped explicitly BEFORE the generic /en prefix rule so the
 * switcher never fabricates a URL that 404s:
 *   /configurateur        → /en/configurator
 *   /en/configurator      → /configurateur
 *   /clinique/wenaya-casablanca → /en/clinic/wenaya-casablanca
 *   /en/clinic/wenaya-casablanca → /clinique/wenaya-casablanca
 * Every other route keeps the historical behavior (add/remove the /en prefix,
 * or return "/" when the path is "/en").
 */
export function switchLocalePathname(pathname: string, from: "fr" | "en"): string {
  if (from === "en") {
    if (pathname === "/en/clinic/wenaya-casablanca") return "/clinique/wenaya-casablanca";
    if (pathname === "/en/configurator") return "/configurateur";
    if (pathname === "/en/health-needs") return "/maux-troubles";
    if (pathname.startsWith("/en/health-needs/")) return pathname.replace(/^\/en\/health-needs/, "/maux-troubles");
    return pathname === "/en" ? "/" : pathname.replace(/^\/en/, "") || "/";
  }
  if (pathname === "/clinique/wenaya-casablanca") return "/en/clinic/wenaya-casablanca";
  if (pathname === "/configurateur") return "/en/configurator";
  if (pathname === "/maux-troubles") return "/en/health-needs";
  if (pathname.startsWith("/maux-troubles/")) return pathname.replace(/^\/maux-troubles/, "/en/health-needs");
  return `/en${pathname === "/" ? "" : pathname}`;
}

/**
 * Decode a percent-encoded URL segment; never throws (returns the input on
 * failure). Next.js may deliver a dynamic-segment param or the client router
 * pathname either raw (`grossesse-&-maternite`) or percent-encoded
 * (`grossesse-%26-maternite`) depending on render pass, so lookups and any
 * string derived from a segment must compare the decoded form.
 */
export function safeDecodeURI(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
