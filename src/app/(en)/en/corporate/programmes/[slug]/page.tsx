/**
 * Programme Detail Page EN — /en/corporate/programmes/[slug]
 * Static generation over the same 4 slugs. Live /en corporate programme pages serve
 * the SAME French content under lang="en" (no authoritative EN translation exists),
 * so the shared data source is used for both locales; only the chrome (labels,
 * breadcrumbs, site nav/footer) is localised. Metadata mirrors live EN pages.
 * Unknown slugs render a proper 404 via notFound().
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

/** Live meta descriptions (verbatim from live FR pages; live EN echoes them). */
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
  const url = `${SITE_URL}/en/corporate/programmes/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/corporate/programmes/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
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

export default async function EnglishProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = getProgramme(slug);
  if (!programme) notFound();

  const { t } = getTranslations("en");
  const labels = {
    back: t("entreprises.programmes.back"),
    backEnterprise: t("entreprises.programmes.backEnterprise"),
    practicalLabel: t("entreprises.programmes.practicalLabel"),
    practicalNote: t("entreprises.programmes.ctaNote"),
    othersLabel: t("entreprises.programmes.othersLabel"),
    othersCta: t("entreprises.programmes.othersCta"),
  };

  const pageUrl = `${SITE_URL}/en/corporate/programmes/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: programme.name,
      description: SEODescriptions[slug] ?? programme.pitch,
      inLanguage: "en",
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
          <ProgrammeDetail programme={programme} locale="en" labels={labels} />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}