import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SpecialistDetail from "@/components/specialistes/SpecialistDetail";
import { getSpecialistBySlugAsync, getAllSpecialists } from "@/lib/specialistes";
import { getPracticesForSpecialist } from "@/lib/pratique-specialists";
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
  const specialist = await getSpecialistBySlugAsync(slug);
  if (!specialist) return {};

  const role = specialist.roleEn ?? specialist.role;
  const description = `${specialist.name}, ${role} in Casablanca. ${specialist.yearsExperience} years of experience. ${specialist.specialtyTags.slice(0, 3).join(", ")}. Rating ${specialist.rating}/5 (${specialist.reviewCount} reviews).`;

  return {
    title: `${specialist.name} — ${role} | Wenaya Casablanca`,
    description,
    keywords: [specialist.name, role, specialist.specialty, "Casablanca", "Wenaya", ...specialist.specialtyTags],
    alternates: { canonical: `${SITE_URL}/en/professional/${slug}`, languages: languageAlternates(`/professional/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
      title: `${specialist.name} — ${role}`,
      description,
      url: `${SITE_URL}/en/professional/${slug}`,
      type: "profile",
      images: [{ url: specialist.image, width: 400, height: 400, alt: specialist.name }],
    },
    twitter: {
      card: "summary",
      title: `${specialist.name} — ${role}`,
      description,
      images: [specialist.image],
    },
  };
}

export default async function EnglishSpecialistPage({ params }: Props) {
  const { slug } = await params;
  const specialist = await getSpecialistBySlugAsync(slug);
  if (!specialist) notFound();

  const practices = getPracticesForSpecialist(slug, "en");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/en/professional/${slug}`,
    name: specialist.name,
    description: specialist.bio,
    image: specialist.image,
    url: `${SITE_URL}/en/professional/${slug}`,
    medicalSpecialty: specialist.specialty,
    worksFor: { "@id": `${SITE_URL}/#clinic` },
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <Breadcrumbs labels={{ [slug]: specialist.name }} />
        <SpecialistDetail specialist={specialist} practices={practices} />
      </main>
    </>
  );
}
