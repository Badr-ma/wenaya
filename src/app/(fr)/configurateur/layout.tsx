/**
 * Configurateur Layout — provides SEO metadata for /configurateur.
 * noindex (follow preserved) so the coming-soon placeholder stays out of search
 * results; the real configurator will own indexing once launched.
 * Alternates are an inline map because the EN segment differs (/en/configurator),
 * so the derived languageAlternates() helper cannot be used here.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Configurateur santé Wenaya — Bientôt disponible",
  description:
    "Découvrez bientôt le configurateur santé Wenaya : un parcours personnalisé pour comprendre vos besoins et trouver les parcours, bilans et pratiques les plus adaptés.",
  alternates: {
    canonical: `${SITE_URL}/configurateur`,
    languages: {
      "fr-MA": `${SITE_URL}/configurateur`,
      "en-MA": `${SITE_URL}/en/configurator`,
      "x-default": `${SITE_URL}/configurateur`,
    },
  },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Configurateur santé Wenaya — Bientôt disponible",
    description:
      "Votre parcours santé personnalisé arrive bientôt. Comprenez vos besoins et trouvez les parcours, bilans et pratiques Wenaya les plus adaptés.",
    url: `${SITE_URL}/configurateur`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Configurateur santé Wenaya — Bientôt disponible",
    description:
      "Votre parcours santé personnalisé arrive bientôt. Comprenez vos besoins et trouvez les parcours, bilans et pratiques Wenaya les plus adaptés.",
  },
};

export default function ConfigurateurLayout({ children }: { children: React.ReactNode }) {
  return children;
}