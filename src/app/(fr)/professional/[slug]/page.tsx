import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SpecialistDetail from "@/components/specialistes/SpecialistDetail";
import { getAllSpecialists } from "@/lib/specialistes";
import { getPracticesForSpecialist } from "@/lib/pratique-specialists";
import { getLiveProfessionalBySlug } from "@/lib/professionals-detail";
import { SITE_URL, OG_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSpecialists().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const specialist = await getLiveProfessionalBySlug(slug, "fr");
  if (!specialist) return {};

  const description = [
    `${specialist.name}, ${specialist.role} à Casablanca.`,
    ...(specialist.yearsExperience > 0 ? [`${specialist.yearsExperience} ans d'expérience.`] : []),
    ...(specialist.specialtyTags.length > 0 ? [`${specialist.specialtyTags.slice(0, 3).join(", ")}.`] : []),
    ...(specialist.rating > 0 ? [`Note ${specialist.rating}/5 (${specialist.reviewCount} avis).`] : []),
  ].join(" ");

  return {
    title: `${specialist.name} — ${specialist.role} | Wenaya Casablanca`,
    description,
    keywords: [specialist.name, specialist.role, specialist.specialty, "Casablanca", "Wenaya", ...specialist.specialtyTags],
    alternates: { canonical: `${SITE_URL}/professional/${slug}`, languages: languageAlternates(`/professional/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${specialist.name} — ${specialist.role}`,
      description,
      url: `${SITE_URL}/professional/${slug}`,
      type: "profile",
      images: [{ url: specialist.image, width: 400, height: 400, alt: specialist.name }],
    },
    twitter: {
      card: "summary",
      title: `${specialist.name} — ${specialist.role}`,
      description,
      images: [specialist.image],
    },
  };
}

export default async function SpecialistPage({ params }: Props) {
  const { slug } = await params;
  const specialist = await getLiveProfessionalBySlug(slug, "fr");
  if (!specialist) notFound();

  const practices = getPracticesForSpecialist(slug, "fr");

  // Guarded JSON-LD — absent data is never emitted (no empty reviews,
  // no empty offer catalog, no zero-rating aggregates, no empty languages).
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/professional/${slug}`,
    name: specialist.name,
    description: specialist.bio,
    image: specialist.image,
    url: `${SITE_URL}/professional/${slug}`,
    medicalSpecialty: specialist.specialty,
    worksFor: { "@id": `${SITE_URL}/#clinic` },
    address: {
      "@type": "PostalAddress",
      streetAddress: specialist.location.address,
      addressLocality: specialist.location.city,
      addressCountry: "MA",
    },
    areaServed: "Casablanca",
  };

  if (specialist.rating > 0 && specialist.reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: specialist.rating,
      reviewCount: specialist.reviewCount,
      bestRating: 5,
    };
  }

  if (specialist.reviews.length > 0) {
    jsonLd.review = specialist.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    }));
  }

  if (specialist.services.length > 0) {
    jsonLd.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: specialist.services.map((s) => s.title).join(", "),
      itemListElement: specialist.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "MedicalProcedure",
          name: s.title,
          description: s.description,
        },
        price: s.price,
        priceCurrency: "MAD",
      })),
    };
  }

  if (specialist.languages.length > 0) {
    jsonLd.availableLanguage = specialist.languages;
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <Breadcrumbs labels={{ [slug]: specialist.name }} />
        <SpecialistDetail specialist={specialist} practices={practices} />
      </main>
    </>
  );
}