/**
 * English Compte Layout — SEO metadata for the /en/compte patient account page.
 * Seam mirror of the EN login layout: robots noindex (account seam stays out
 * of search), canonical `/en/compte`, language alternates. `dynamicParams =
 * false` — the account route is a single segment, no slug family.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "My account — Wenaya Patient Space | Wenaya",
  description:
    "Access your Wenaya patient space to manage your appointments, review your health reports and follow your wellness journey.",
  alternates: {
    canonical: `${SITE_URL}/en/compte`,
    languages: languageAlternates("/compte"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "My account — Wenaya Patient Space | Wenaya",
    description:
      "Access your Wenaya patient space to manage your appointments, review your health reports and follow your wellness journey.",
    url: `${SITE_URL}/en/compte`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "My account — Wenaya Patient Space | Wenaya",
    description:
      "Access your Wenaya patient space to manage your appointments, review your health reports and follow your wellness journey.",
  },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
