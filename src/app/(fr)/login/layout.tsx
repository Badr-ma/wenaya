/**
 * Login Layout — provides SEO metadata for the /login page.
 * Sets robots noindex to keep login page out of search results.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Connexion — Espace Patient Wenaya",
  description:
    "Connectez-vous à votre espace patient Wenaya pour gérer vos rendez-vous, consulter vos bilans de santé et suivre votre parcours bien-être.",
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  robots: { index: false, follow: false },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Connexion — Espace Patient Wenaya",
    description:
      "Accédez à votre espace patient Wenaya.",
    url: `${SITE_URL}/login`,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
