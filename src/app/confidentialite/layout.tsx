/**
 * Confidentialité Layout — provides SEO metadata for the /confidentialite page.
 * Needed because the page is a client component and can't export Metadata.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Wenaya",
  description:
    "Politique de confidentialité de Wenaya Clinic Casablanca. Protection des données personnelles, cookies, droits des patients — conforme au RGPD et à la loi 09-08 marocaine.",
  alternates: {
    canonical: "https://www.wenaya.com/confidentialite",
  },
  openGraph: {
    title: "Politique de Confidentialité — Wenaya",
    description:
      "Protection des données personnelles chez Wenaya. Politique de confidentialité conforme au RGPD et à la loi marocaine 09-08.",
    url: "https://www.wenaya.com/confidentialite",
    type: "website",
  },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
