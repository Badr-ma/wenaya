/**
 * Conditions Layout — provides SEO metadata for the /en/conditions page.
 * Needed because the page is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Terms & Conditions — Wenaya",
  description:
    "Terms and conditions of use of the Wenaya Clinic Casablanca platform. Rights, obligations, intellectual property and service terms.",
  alternates: {
    canonical: `${SITE_URL}/en/conditions`,
    languages: languageAlternates("/conditions"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Terms & Conditions — Wenaya",
    description:
      "Terms and conditions of use of the Wenaya Clinic platform.",
    url: `${SITE_URL}/en/conditions`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Terms & Conditions — Wenaya",
    description:
      "Terms and conditions of use of the Wenaya Clinic platform.",
  },
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
