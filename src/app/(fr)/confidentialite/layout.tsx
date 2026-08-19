/**
 * Confidentialité Layout — provides SEO metadata for the /confidentialite page.
 * Needed because the page is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Wenaya",
  description:
    "Politique de confidentialité de Wenaya Clinic Casablanca. Protection des données personnelles, cookies, droits des patients — conforme au RGPD et à la loi 09-08 marocaine.",
  alternates: {
    canonical: `${SITE_URL}/confidentialite`,
    languages: languageAlternates("/confidentialite"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Politique de Confidentialité — Wenaya",
    description:
      "Protection des données personnelles chez Wenaya. Politique de confidentialité conforme au RGPD et à la loi marocaine 09-08.",
    url: `${SITE_URL}/confidentialite`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Politique de Confidentialité — Wenaya",
    description:
      "Protection des données personnelles chez Wenaya. Politique de confidentialité conforme au RGPD et à la loi marocaine 09-08.",
  },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
