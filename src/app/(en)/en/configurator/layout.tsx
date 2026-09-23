/**
 * English Configurator Layout — provides SEO metadata for /en/configurator.
 * noindex (follow preserved). EN route segment differs from FR (/configurateur),
 * so alternates are an explicit map rather than the derived languageAlternates().
 */
import type { Metadata } from "next";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Wenaya Health Configurator — Coming Soon",
  description:
    "Discover the Wenaya health configurator soon: a personalized journey to understand your needs and find the most relevant Wenaya journeys, assessments and practices.",
  alternates: {
    canonical: `${SITE_URL}/en/configurator`,
    languages: {
      "fr-MA": `${SITE_URL}/configurateur`,
      "en-MA": `${SITE_URL}/en/configurator`,
      "x-default": `${SITE_URL}/configurateur`,
    },
  },
  robots: { index: false, follow: true },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Wenaya Health Configurator — Coming Soon",
    description:
      "Your personalized health journey is coming soon. Understand your needs and find the most relevant Wenaya journeys, assessments and practices.",
    url: `${SITE_URL}/en/configurator`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Health Configurator — Coming Soon",
    description:
      "Your personalized health journey is coming soon. Understand your needs and find the most relevant Wenaya journeys, assessments and practices.",
  },
};

export default function ConfiguratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}