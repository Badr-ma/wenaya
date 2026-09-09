/**
 * Programme Detail Page FR — /corporate/programmes/[slug]
 * Static generation over the 4 labelled corporate programmes (live-verbatim content
 * from src/lib/corporate-programmes.ts). Dynamic SEO metadata mirrors the live pages
 * (title "{name} | Wenaya Corporate | Wenaya", live description, self canonical,
 * fr-MA/en-MA/x-default hreflang). Unknown slugs render a proper 404 via notFound().
 * Live pages carry no JSON-LD (and no hreflang) — this page adds a single light
 * WebPage node for sitewide schema consistency, alongside the visible Breadcrumbs.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProgrammeDetail from "@/components/entreprises/ProgrammeDetail";
import Footer from "@/components/Footer";
import { getProgramme, getAllProgrammeSlugs } from "@/lib/corporate-programmes";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Live meta descriptions (verbatim, captured 2026-09-09). */
const SEOTitle = (name: string) => `${name} | Wenaya Corporate | Wenaya`;
const SEODescriptions: Record<string, string> = {
  "leadership-360":
    "Cursus de développement managérial complet en 5 axes pour vos managers — connaissance de soi, relations, mission, efficacité et people management.",
  pcm: "Formation PCM au Maroc : un outil utilisé par la NASA pour développer la communication, la cohésion et la performance d'équipe.",
  "art-des-priorites":
    "Formation gestion du temps et des priorités au Maroc. Outils concrets pour réduire la surcharge, gagner en efficacité et préserver le bien-être.",
  "people-model-canvas":
    "Approche structurée de la gestion RH fondée sur 20+ ans de recherche universitaire. Un langage commun pour piloter vos décisions stratégiques.",
};

export function generateStaticParams() {
  return getAllProgrammeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) return {};

  const title = SEOTitle(programme.name);
  const description = SEODescriptions[slug] ?? programme.pitch;
  const url = `${SITE_URL}/corporate/programmes/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/corporate/programmes/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${programme.name} | Wenaya Corporate`,
      description,
      url,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${programme.name} | Wenaya Corporate`,
      description,
    },
  };
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  const { t } = getTranslations("fr");
  const labels = {
    back: t("entreprises.programmes.back"),
    backEnterprise: t("entreprises.programmes.backEnterprise"),
    practicalLabel: t("entreprises.programmes.practicalLabel"),
    practicalNote: t("entreprises.programmes.ctaNote"),
    othersLabel: t("entreprises.programmes.othersLabel"),
    othersCta: t("entreprises.programmes.othersCta"),
  };

  const pageUrl = `${SITE_URL}/corporate/programmes/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: programme.name,
      description: SEODescriptions[slug] ?? programme.pitch,
      inLanguage: "fr",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
  ];

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        {jsonLd.map((block, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
          />
        ))}
        <main>
          <Breadcrumbs labels={{ [slug]: programme.name }} />
          <ProgrammeDetail programme={programme} locale="fr" labels={labels} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}