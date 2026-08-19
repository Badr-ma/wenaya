/**
 * Programmes Layout — provides metadata for the /en/solutions/entreprises/programmes page.
 * Client component pages can't export Metadata directly, so layout handles it.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Certified Corporate Wellness Programs | Wenaya Corporate",
  description:
    "Discover our 4 certified programs for companies: PCM (Process Communication Model), Leadership 360°, The Art of Priorities and the People Model Canvas. Proven methods to improve communication, leadership, stress management and HR strategy in your teams.",
  keywords: [
    "corporate wellness program",
    "PCM Morocco",
    "Process Communication Model enterprise",
    "leadership 360 program",
    "priority management training",
    "People Model Canvas HR",
    "communication training company Casablanca",
    "corporate mental health program Morocco",
    "employee wellbeing Morocco",
    "leadership training Casablanca",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/solutions/entreprises/programmes`,
    languages: languageAlternates("/solutions/entreprises/programmes"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Certified Corporate Wellness Programs | Wenaya",
    description:
      "4 certified programs to transform your teams' health, communication and performance. PCM, Leadership 360°, Art of Priorities, People Model Canvas.",
    url: `${SITE_URL}/en/solutions/entreprises/programmes`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Certified Corporate Wellness Programs | Wenaya",
    description:
      "4 certified programs to transform your teams' health, communication and performance. PCM, Leadership 360°, Art of Priorities, People Model Canvas.",
  },
};

export default function ProgrammesLayout({ children }: { children: ReactNode }) {
  return children;
}
