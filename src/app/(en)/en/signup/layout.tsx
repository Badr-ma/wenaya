/**
 * English Signup Layout — provides SEO metadata for the /en/signup page.
 * Sets robots noindex to keep the signup page out of search results.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Create an account — Wenaya Patient Space",
  description:
    "Create your Wenaya patient account to book your appointments and follow your wellness journey.",
  alternates: {
    canonical: `${SITE_URL}/en/signup`,
    languages: languageAlternates("/signup"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Create an account — Wenaya Patient Space",
    description: "Create your Wenaya patient account.",
    url: `${SITE_URL}/en/signup`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Create an account — Wenaya Patient Space",
    description: "Create your Wenaya patient account.",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}