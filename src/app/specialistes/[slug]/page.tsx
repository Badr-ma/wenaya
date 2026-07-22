import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SpecialistDetail from "@/components/specialistes/SpecialistDetail";
import { getSpecialistBySlug, getAllSpecialists } from "@/lib/specialistes";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSpecialists().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const specialist = getSpecialistBySlug(slug);
  if (!specialist) return {};

  const description = `${specialist.name}, ${specialist.role} à Casablanca. ${specialist.yearsExperience} ans d'expérience. ${specialist.specialtyTags.slice(0, 3).join(", ")}. Note ${specialist.rating}/5 (${specialist.reviewCount} avis).`;

  return {
    title: `${specialist.name} — ${specialist.role} | Wenaya Casablanca`,
    description,
    keywords: [specialist.name, specialist.role, specialist.specialty, "Casablanca", "Wenaya", ...specialist.specialtyTags],
    alternates: { canonical: `https://www.wenaya.com/specialistes/${slug}` },
    openGraph: {
      title: `${specialist.name} — ${specialist.role}`,
      description,
      url: `https://www.wenaya.com/specialistes/${slug}`,
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
  const specialist = getSpecialistBySlug(slug);
  if (!specialist) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: specialist.name,
    description: specialist.bio,
    image: specialist.image,
    url: `https://www.wenaya.com/specialistes/${slug}`,
    medicalSpecialty: specialist.specialty,
    address: {
      "@type": "PostalAddress",
      streetAddress: specialist.location.address,
      addressLocality: specialist.location.city,
      addressCountry: "MA",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: specialist.rating,
      reviewCount: specialist.reviewCount,
      bestRating: 5,
    },
    review: specialist.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    })),
    hasOfferCatalog: {
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
    },
    areaServed: "Casablanca",
    availableLanguage: specialist.languages,
  };

  return (
    <ErrorBoundary>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SpecialistDetail specialist={specialist} />
    </ErrorBoundary>
  );
}
