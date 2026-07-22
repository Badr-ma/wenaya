/**
 * Contact Layout — provides SEO metadata for the /contact page.
 * Needed because contact/page.tsx is a client component and can't export Metadata.
 */
import type { Metadata } from "next";

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
    canonical: "https://www.wenaya.com/contact",
  },
  openGraph: {
    title: "Contact — Wenaya Clinic Casablanca",
    description:
      "Contactez Wenaya Clinic à Casablanca. Kinésithérapie, psychologie, nutrition et bien-être. Prenez rendez-vous en ligne.",
    url: "https://www.wenaya.com/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
