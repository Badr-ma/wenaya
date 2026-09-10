/**
 * Programme Detail Page EN — /en/corporate/programmes/[slug]
 * Static generation over the same 4 slugs. Live /en corporate programme pages serve
 * the SAME French content under lang="en" (no authoritative EN translation exists);
 * project-authored EN translations of the shared data source are used here, with
 * localised chrome (labels, breadcrumbs, site nav/footer) and English metadata.
 * Canonical/hreflang/route/slug unchanged from the FR page. Unknown slugs render a
 * proper 404 via notFound().
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

/** English meta descriptions (EN equivalents of the live FR descriptions). */
const SEOTitle = (name: string) => `${name} | Wenaya Corporate | Wenaya`;
const SEODescriptions: Record<string, string> = {
  "leadership-360":
    "A complete 5-pillar managerial development programme for your managers — self-awareness, relationships, mission, effectiveness and people management.",
  pcm: "PCM training in Morocco: a tool used by NASA to develop team communication, cohesion and performance.",
  "art-des-priorites":
    "Time and priority management training in Morocco. Practical tools to reduce overload, gain effectiveness and protect well-being.",
  "people-model-canvas":
    "A structured approach to HR management grounded in 20+ years of academic research. A common language to steer your strategic decisions.",
};

export function generateStaticParams() {
  return getAllProgrammeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgramme(slug, "en");
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
  const programme = getProgramme(slug, "en");
  if (!programme) notFound();

  const { t } = getTranslations("en");
  const labels = {
    back: t("entreprises.programmes.back"),
    backEnterprise: t("entreprises.programmes.backEnterprise"),
    practicalLabel: t("entreprises.programmes.practicalLabel"),
    practicalNote: t("entreprises.programmes.ctaNote"),
    newTab: t("entreprises.programmes.newTab"),
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