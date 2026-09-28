/**
 * Hreflang helper — generates the `alternates.languages` object for Next.js metadata.
 * Ensures every indexable page emits correct <link rel="alternate" hreflang="..."> tags.
 *
 * Usage in page metadata:
 *   alternates: { canonical: `${SITE_URL}/about-us`, languages: languageAlternates("/about-us") }
 *
 * Both FR and EN pages call this with the FR path — the helper generates both locale URLs.
 */
import { SITE_URL } from "./site-config";

/**
 * Returns the `alternates.languages` map for a page that exists in both FR and EN.
 * @param frPath — the FR-path of the page (e.g. "/" or "/about-us" or "/professional/ghita")
 * @param enPath — optional explicit EN path (defaults to the historical `/en` prefix
 * rule). Used for routes whose EN segment differs from the FR one, e.g. the Clinic
 * page: frPath="/clinique/wenaya-casablanca", enPath="/en/clinic/wenaya-casablanca".
 */
export function languageAlternates(frPath: string, enPath?: string): Record<string, string> {
  const resolvedEn = enPath ?? `/en${frPath === "/" ? "" : frPath}`;
  return {
    "fr-MA": `${SITE_URL}${frPath}`,
    "en-MA": `${SITE_URL}${resolvedEn}`,
    "x-default": `${SITE_URL}${frPath}`,
  };
}
