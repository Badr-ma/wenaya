/**
 * Conditions Layout — provides SEO metadata for the /conditions page.
 * Needed because the page is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Wenaya",
  description:
    "Conditions générales d'utilisation de la plateforme Wenaya Clinic Casablanca. Droits, obligations, propriété intellectuelle et modalités de service.",
  alternates: {
    canonical: `${SITE_URL}/conditions`,
    languages: languageAlternates("/conditions"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Conditions Générales — Wenaya",
    description:
      "Conditions générales d'utilisation de la plateforme Wenaya Clinic.",
    url: `${SITE_URL}/conditions`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Conditions Générales — Wenaya",
    description:
      "Conditions générales d'utilisation de la plateforme Wenaya Clinic.",
  },
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
