/**
 * Pratique Detail Page EN — /en/pratiques/[slug]
 * Static generation via generateStaticParams; dynamic SEO metadata, WebPage +
 * MedicalTherapy structured data, breadcrumbs, and the editorial PratiqueDetail.
 * Unknown slugs render a proper 404 via notFound().
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import PratiqueDetail from "@/components/pratiques/PratiqueDetail";
import Footer from "@/components/Footer";
import { getPratiqueBySlug, getAllPratiqueSlugs, getRelatedPratiques } from "@/lib/pratiques";
import { getSpecialistsForPractice } from "@/lib/pratique-specialists";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPratiqueSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pratique = getPratiqueBySlug(slug, "en");
  if (!pratique) return {};

  const title = pratique.title;
  const url = `${SITE_URL}/en/pratiques/${slug}`;
  const imageUrl = `${SITE_URL}${pratique.image}`;

  return {
    title,
    description: pratique.description,
    alternates: { canonical: url, languages: languageAlternates(`/pratiques/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
      title: `${title} | Wenaya`,
      description: pratique.description,
      url,
      images: [{ url: imageUrl, alt: pratique.title }],
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${title} | Wenaya`,
      description: pratique.description,
      images: [imageUrl],
    },
  };
}

export default async function EnglishPratiquePage({ params }: Props) {
  const { slug } = await params;
  const pratique = getPratiqueBySlug(slug, "en");
  if (!pratique) notFound();

  const { t } = getTranslations("en");
  const related = getRelatedPratiques(slug, "en", 6);
  const specialists = getSpecialistsForPractice(slug);
  const labels = {
    eyebrow: t("pratiques.detail.eyebrow"),
    back: t("pratiques.detail.back"),
    specialistsOverline: t("pratiques.detail.specialistsOverline"),
    specialistsTitle: t("pratiques.detail.specialistsTitle"),
    bookingTitle: t("pratiques.detail.bookingTitle"),
    bookingSub: t("pratiques.detail.bookingSub"),
    bookingCta: t("pratiques.detail.bookingCta"),
    bookingCtaBook: t("pratiques.detail.bookingCtaBook"),
    bookingCtaChoose: t("pratiques.detail.bookingCtaChoose"),
    relatedOverline: t("pratiques.detail.relatedOverline"),
    relatedTitle: t("pratiques.detail.relatedTitle"),
    crossToSeance: t("seanceDeGroupe.crossFromPratiques"),
  };

  const pageUrl = `${SITE_URL}/en/pratiques/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: pratique.title,
      description: pratique.description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: pratique.title,
      description: pratique.description,
      image: pratique.image,
      url: pageUrl,
      provider: { "@id": `${SITE_URL}/#clinic` },
      areaServed: { "@type": "City", name: "Casablanca" },
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
          <Breadcrumbs labels={{ [slug]: pratique.title }} />
          <PratiqueDetail
            pratique={pratique}
            related={related}
            specialists={specialists}
            locale="en"
            listingHref="/en/pratiques"
            labels={labels}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}