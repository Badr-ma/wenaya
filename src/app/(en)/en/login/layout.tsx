/**
 * English Login Layout — provides SEO metadata for the /en/login page.
 * Sets robots noindex to keep the login page out of search results.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Sign in — Wenaya Patient Space",
  description:
    "Log in to your Wenaya patient space to manage your appointments, review your health reports and follow your wellness journey.",
  alternates: {
    canonical: `${SITE_URL}/en/login`,
    languages: languageAlternates("/login"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Sign in — Wenaya Patient Space",
    description:
      "Access your Wenaya patient space.",
    url: `${SITE_URL}/en/login`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Sign in — Wenaya Patient Space",
    description:
      "Access your Wenaya patient space.",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}