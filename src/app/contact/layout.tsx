/**
 * Contact Layout — provides SEO metadata for the /contact page.
 * Needed because contact/page.tsx is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — Wenaya Clinic Casablanca | Prendre Rendez-vous",
  description:
    "Contactez Wenaya Clinic à Casablanca : kinésithérapie, psychologie, nutrition et bien-être. 88 Rue De Jabal Azourki. Prenez rendez-vous en ligne ou par téléphone.",
  keywords: [
    "contact Wenaya Casablanca",
    "rendez-vous kinésithérapie Casablanca",
    "prendre rendez-vous psychologue Casablanca",
    "contact clinique Casablanca",
    "Wenaya Clinic adresse",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Contact — Wenaya Clinic Casablanca",
    description:
      "Contactez Wenaya Clinic à Casablanca. Kinésithérapie, psychologie, nutrition et bien-être. Prenez rendez-vous en ligne.",
    url: `${SITE_URL}/contact`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Contact — Wenaya Clinic Casablanca",
    description:
      "Contactez Wenaya Clinic à Casablanca. Kinésithérapie, psychologie, nutrition et bien-être. Prenez rendez-vous en ligne.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
