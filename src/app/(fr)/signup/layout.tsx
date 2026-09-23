/**
 * Signup Layout — provides SEO metadata for the /signup page.
 * Sets robots noindex to keep the signup page out of search results.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Créer un compte — Espace Patient Wenaya",
  description:
    "Créez votre compte patient Wenaya pour réserver vos rendez-vous et suivre votre parcours bien-être.",
  alternates: {
    canonical: `${SITE_URL}/signup`,
    languages: languageAlternates("/signup"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Créer un compte — Espace Patient Wenaya",
    description: "Créez votre compte patient Wenaya.",
    url: `${SITE_URL}/signup`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Créer un compte — Espace Patient Wenaya",
    description: "Créez votre compte patient Wenaya.",
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}