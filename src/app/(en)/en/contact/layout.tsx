/**
 * Contact Layout — provides SEO metadata for the /en/contact page.
 * Needed because contact/page.tsx is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Contact — Wenaya Clinic Casablanca | Book an Appointment",
  description:
    "Contact Wenaya Clinic in Casablanca: physiotherapy, psychology, nutrition and wellness. 88 Rue De Jabal Azourki. Book online or by phone.",
  keywords: [
    "contact Wenaya Casablanca",
    "book physiotherapy appointment Casablanca",
    "book psychologist appointment Casablanca",
    "contact clinic Casablanca",
    "Wenaya Clinic address",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/contact`,
    languages: languageAlternates("/contact"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Contact — Wenaya Clinic Casablanca",
    description:
      "Contact Wenaya Clinic in Casablanca. Physiotherapy, psychology, nutrition and wellness. Book an appointment online.",
    url: `${SITE_URL}/en/contact`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Contact — Wenaya Clinic Casablanca",
    description:
      "Contact Wenaya Clinic in Casablanca. Physiotherapy, psychology, nutrition and wellness. Book an appointment online.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
