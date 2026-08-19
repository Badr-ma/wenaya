/**
 * Confidentialité Layout — provides SEO metadata for the /en/confidentialite page.
 * Needed because the page is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Privacy Policy — Wenaya",
  description:
    "Privacy policy of Wenaya Clinic Casablanca. Personal data protection, cookies, patient rights — compliant with GDPR and Moroccan Law 09-08.",
  alternates: {
    canonical: `${SITE_URL}/en/confidentialite`,
    languages: languageAlternates("/confidentialite"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Privacy Policy — Wenaya",
    description:
      "Personal data protection at Wenaya. Privacy policy compliant with GDPR and Moroccan Law 09-08.",
    url: `${SITE_URL}/en/confidentialite`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Privacy Policy — Wenaya",
    description:
      "Personal data protection at Wenaya. Privacy policy compliant with GDPR and Moroccan Law 09-08.",
  },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
