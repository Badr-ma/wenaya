/**
 * Maux-Troubles detail EN — /en/health-needs/[slug]
 * Same API-backed single-trouble page as FR (correction-spec order: hero →
 * About/Details → Causes → Recommended practices + professional search links →
 * prev/next detail nav → back to all), with genuinely-English chrome (labels,
 * breadcrumbs, nav, en-MA SEO). Backend content is FR-only (no EN fields on the
 * Troubles API) → the name/paragraphs are served as-is in French, exactly like
 * the EN hub and the `/en/...` programme bodies; no invented medical
 * translations. Unknown slug → proper 404.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import TroubleDetail from "@/components/maux-troubles/TroubleDetail";
import { getTroubleDetail, getTroubleNeighbors } from "@/lib/troubles-hub";
import { getTroubles, getTroubleBySlug } from "@/lib/troubles";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  let slugs: string[] = [];
  try {
    slugs = (await getTroubles()).map((trouble) => trouble.slug);
  } catch (error) {
    console.error("[maux-troubles] EN generateStaticParams failed:", error);
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let trouble;
  try {
    trouble = await getTroubleBySlug(slug);
  } catch (error) {
    console.error(`[maux-troubles] EN metadata fetch failed for "${slug}":`, error);
  }
  if (!trouble) return {};

  const title = trouble.name;
  const url = `${SITE_URL}/en/health-needs/${slug}`;
  const imageUrl = trouble.image
    ? /^https?:\/\//.test(trouble.image)
      ? trouble.image
      : `${SITE_URL}${trouble.image}`
    : undefined;

  return {
    title,
    description: trouble.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(`/maux-troubles/${slug}`, `/en/health-needs/${slug}`),
    },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
      title: `${title} | Wenaya`,
      description: trouble.description,
      url,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${title} | Wenaya`,
      description: trouble.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function EnglishMauxTroubleDetailPage({ params }: Props) {
  const { slug } = await params;
  const trouble = await getTroubleDetail("en", slug);
  if (!trouble) notFound();

  const neighbors = await getTroubleNeighbors("en", slug);

  const { t } = getTranslations("en");
  const labels = {
    badge: t("mauxTroubles.badge"),
    back: t("mauxTroubles.back"),
    aboutLabel: t("mauxTroubles.aboutLabel"),
    causesLabel: t("mauxTroubles.causesLabel"),
    practicesLabel: t("mauxTroubles.practicesLabel"),
    prosLabel: t("mauxTroubles.prosLabel"),
    prevLabel: t("mauxTroubles.prevLabel"),
    nextLabel: t("mauxTroubles.nextLabel"),
    disclaimer: t("mauxTroubles.disclaimer"),
  };

  const pageUrl = `${SITE_URL}/en/health-needs/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: trouble.name,
      description: trouble.description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      name: trouble.name,
      description: trouble.description,
      url: pageUrl,
      ...(trouble.image ? { image: trouble.image } : {}),
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
          <Breadcrumbs labels={{ [slug]: trouble.name }} />
          <TroubleDetail
            trouble={trouble}
            listingHref="/en/health-needs"
            labels={labels}
            prev={neighbors.prev}
            next={neighbors.next}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}