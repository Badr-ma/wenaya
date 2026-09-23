/**
 * Compte Layout (FR) — SEO metadata for the /compte patient-account page.
 * Mirrors the login layout seam: canonical `/compte`, noindex/noFollow,
 * FR og:locale og:url, canonical is NOT the URL (uses `/compte`), alternates
 * languages via languageAlternates. Robots + index:false keep the seam page
 * out of search. dynamicParams=false (no slug family on this route).
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Mon compte — Espace Patient Wenaya | Wenaya",
  description:
    "Accédez à votre espace patient Wenaya : gérez vos rendez-vous, suivez vos séances et consultez votre historique.",
  alternates: {
    canonical: `${SITE_URL}/compte`,
    languages: languageAlternates("/compte"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Mon compte — Espace Patient Wenaya | Wenaya",
    description:
      "Accédez à votre espace patient Wenaya : gérez vos rendez-vous, suivez vos séances et consultez votre historique.",
    url: `${SITE_URL}/compte`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Mon compte — Espace Patient Wenaya | Wenaya",
    description:
      "Accédez à votre espace patient Wenaya : gérez vos rendez-vous, suivez vos séances et consultez votre historique.",
  },
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
