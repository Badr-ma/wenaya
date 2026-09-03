/**
 * Group Session Detail Page (EN) — /en/group-sessions/[slug]
 * Static generation via generateStaticParams; dynamic SEO metadata, WebPage +
 * Service structured data, breadcrumbs, and the GroupSessionDetail component.
 * Unknown slugs render proper 404 via notFound().
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import GroupSessionDetail from "@/components/seance-de-groupe/GroupSessionDetail";
import Footer from "@/components/Footer";
import {
  getAllGroupSessionSlugs,
  getGroupSessionBySlug,
  getCanonicalGroupSession,
  getRelatedGroupSessions,
  getGroupSessionLabels,
  getGroupSessionAlternateUrls,
} from "@/lib/group-sessions";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllGroupSessionSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const session = getGroupSessionBySlug(slug, "en");
  if (!session) return {};

  const canonical = getCanonicalGroupSession(slug);
  if (!canonical) return {};

  const url = `${SITE_URL}${session.path}`;
  const title = `${session.title} in Casablanca`;

  return {
    title,
    description: session.description,
    alternates: { canonical: url, languages: getGroupSessionAlternateUrls(canonical) },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
      title: `${title} | Wenaya`,
      description: session.description,
      url,
      images: [{ url: session.image, alt: session.title }],
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title: `${title} | Wenaya`,
      description: session.description,
      images: [session.image],
    },
  };
}

export default async function GroupSessionDetailEnPage({ params }: Props) {
  const { slug } = await params;
  const session = getGroupSessionBySlug(slug, "en");
  if (!session) notFound();

  const canonical = getCanonicalGroupSession(slug)!;
  const related = getRelatedGroupSessions(session.id, "en", 3);
  const labels = getGroupSessionLabels("en");

  const pageUrl = `${SITE_URL}${session.path}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: session.title,
      description: session.description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: session.title,
      serviceType: session.typeLabel,
      description: session.description,
      image: session.image,
      url: pageUrl,
      provider: { "@type": "Organization", name: "Wenaya", url: SITE_URL },
      areaServed: { "@type": "City", name: "Casablanca" },
      availableLanguage: ["fr", "en"],
      location: {
        "@type": "Place",
        name: "Wenaya Clinic",
        address: {
          "@type": "PostalAddress",
          streetAddress: "88 Rue De Jabal Azourki",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
      },
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
          <Breadcrumbs labels={{ [slug]: session.title }} />
          <GroupSessionDetail
            session={session}
            related={related}
            labels={labels}
            listingHref="/en/group-sessions"
          />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}