import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Wenaya",
  description:
    "Conditions générales d'utilisation de la plateforme Wenaya Clinic Casablanca. Droits, obligations, propriété intellectuelle et modalités de service.",
  alternates: {
    canonical: "https://www.wenaya.com/conditions",
    languages: {
      "fr-MA": "https://www.wenaya.com/conditions",
      "en": "https://www.wenaya.com/conditions",
    },
  },
  openGraph: {
    title: "Conditions Générales — Wenaya",
    description:
      "Conditions générales d'utilisation de la plateforme Wenaya Clinic.",
    url: "https://www.wenaya.com/conditions",
    type: "website",
  },
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
