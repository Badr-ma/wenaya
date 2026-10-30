/**
 * Pratique Detail Page FR — /pratiques/[slug]
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
import { getLivePratiquesStrict } from "@/lib/pratiques";
import { cache } from "react";
import { getPracticeSpecialists } from "@/lib/professionals";
import { resolvePracticeProfessionalsHref } from "@/lib/practice-professionals-link";
import { getTranslations } from "@/i18n";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
const getPractices = cache(() => getLivePratiquesStrict("fr"));

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  // On-demand ISR accepts practices added after deployment and uses runtime API configuration.
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pratique = (await getPractices()).find((practice) => practice.slug === slug);
  if (!pratique) return {};

  const title = pratique.title;
  const url = `${SITE_URL}/pratiques/${slug}`;
  const image = pratique.image;
  const imageUrl = image
    ? /^https?:\/\//.test(image)
      ? image
      : `${SITE_URL}${image}`
    : "";

  return {
    title,
    description: pratique.description,
    alternates: { canonical: url, languages: languageAlternates(`/pratiques/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${title} | Wenaya`,
      description: pratique.description,
      url,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: pratique.title }] } : {}),
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${title} | Wenaya`,
      description: pratique.description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function PratiquePage({ params }: Props) {
  const { slug } = await params;
  const practices = await getPractices();
  const pratique = practices.find((practice) => practice.slug === slug);
  if (!pratique) notFound();

  const { t } = getTranslations("fr");
  const related = practices.filter((practice) => practice.slug !== slug).slice(0, 6);
  const specialtySlug = pratique.specialtySlug || slug;
  const specialists = await getPracticeSpecialists(specialtySlug);
  const professionalHref = resolvePracticeProfessionalsHref("fr", specialtySlug, specialists);
  const labels = {
    eyebrow: t("pratiques.detail.eyebrow"),
    back: t("pratiques.detail.back"),
    specialistsOverline: t("pratiques.detail.specialistsOverline"),
    specialistsTitle: t("pratiques.detail.specialistsTitle"),
    professionalsLabel: t("pratiques.detail.professionalsLabel"),
    professionalsAnchor: t("pratiques.detail.professionalsAnchor"),
    bookingTitle: t("pratiques.detail.bookingTitle"),
    bookingSub: t("pratiques.detail.bookingSub"),
    bookingCta: t("pratiques.detail.bookingCta"),
    bookingCtaBook: t("pratiques.detail.bookingCtaBook"),
    bookingCtaChoose: t("pratiques.detail.bookingCtaChoose"),
    relatedOverline: t("pratiques.detail.relatedOverline"),
    relatedTitle: t("pratiques.detail.relatedTitle"),
    crossToSeance: t("seanceDeGroupe.crossFromPratiques"),
  };

  const pageUrl = `${SITE_URL}/pratiques/${slug}`;
  const absoluteImage = pratique.image
    ? /^https?:\/\//.test(pratique.image)
      ? pratique.image
      : `${SITE_URL}${pratique.image}`
    : "";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: pratique.title,
      description: pratique.description,
      inLanguage: "fr",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "MedicalTherapy",
      name: pratique.title,
      description: pratique.description,
      ...(absoluteImage ? { image: absoluteImage } : {}),
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
            professionalHref={professionalHref}
            locale="fr"
            listingHref="/pratiques"
            labels={labels}
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
