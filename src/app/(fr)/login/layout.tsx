/**
 * Login Layout — provides SEO metadata for the /login page.
 * Sets robots noindex to keep the login page out of search results.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Connexion — Espace Patient Wenaya",
  description:
    "Connectez-vous à votre espace patient Wenaya pour gérer vos rendez-vous, consulter vos bilans de santé et suivre votre parcours bien-être.",
  alternates: {
    canonical: `${SITE_URL}/login`,
    languages: languageAlternates("/login"),
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Connexion — Espace Patient Wenaya",
    description:
      "Accédez à votre espace patient Wenaya.",
    url: `${SITE_URL}/login`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Connexion — Espace Patient Wenaya",
    description:
      "Accédez à votre espace patient Wenaya.",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}