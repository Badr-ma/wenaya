import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SpecialistDetail from "@/components/specialistes/SpecialistDetail";
import { getLiveSpecialists } from "@/lib/professionals";
import { getLiveProfessionalBySlug, getSpecialistPractices } from "@/lib/professionals-detail";
import { SITE_URL, OG_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender exactly the slugs the LISTING can link to, i.e. the live API set —
 * the listing has no demo fallback, so pre-rendering the local/Redis set would
 * emit profile pages for practitioners that are not publicly listed (and would
 * 404 at request time anyway). Guarded: an unreachable API yields no params and
 * the route stays fully dynamic instead of failing the build. Slugs added to the
 * backend later are generated on first request and then ISR-cached.
 */
export async function generateStaticParams() {
  const specialists = await getLiveSpecialists();
  return specialists.map((s) => ({ slug: s.slug }));
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
    title: `${specialist.name} — ${specialist.role} — Casablanca`,
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

  // Live relationship: derived from the professional's own API specialities
  // (canonical practice slugs), never the legacy demo map — so a profile can
  // never surface a stale practice↔professional pairing.
  const practices = getSpecialistPractices(specialist, "fr");

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