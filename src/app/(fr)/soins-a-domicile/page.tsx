/**
 * Soins à domicile Page — FR /soins-a-domicile
 * FULL page for Wenaya Homecare Services (garde malade & infirmier à domicile).
 *
 * CONTENT: exact live `https://wenaya.com/soins-a-domicile` copy, preserved
 * verbatim (presentation-only redesign — no rewriting, no summarising, no
 * invented facts). FR only: the live EN route serves the same French content
 * under lang="en", so no authoritative EN translation exists — no EN route is
 * created and no hreflang to an invented EN page is emitted.
 *
 * DESIGN: current Wenaya system — navy #0B1220, bronze #B88A5A, sand #F2EFE9,
 * ivory #FAF8F4. Varied editorial composition, no generic card grids.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import HomecareHero from "@/components/domicile/Hero";
import HomecareIntro from "@/components/domicile/Intro";
import HomecareWhy from "@/components/domicile/Why";
import HomecareServices from "@/components/domicile/Services";
import HomecareNursingLevels from "@/components/domicile/NursingLevels";
import HomecareEvaluation from "@/components/domicile/Evaluation";
import HomecareMultidisciplinary from "@/components/domicile/Multidisciplinary";
import HomecareMaterial from "@/components/domicile/Material";
import HomecareSupport from "@/components/domicile/Support";
import HomecareCoordination from "@/components/domicile/Coordination";
import HomecareEngagements from "@/components/domicile/Engagements";
import HomecareFaq from "@/components/domicile/Faq";
import HomecareContact from "@/components/domicile/Contact";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Soins à domicile — Garde malade & infirmier à domicile à Casablanca",
  description:
    "Wenaya Homecare Services à Casablanca propose des services professionnels de garde malade, infirmiers à domicile, hospitalisation à domicile et prise en charge pluridisciplinaire avec kinésithérapeutes, médecins et orthophonistes.",
  alternates: {
    canonical: `${SITE_URL}/soins-a-domicile`,
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Garde malade & infirmier à domicile à Casablanca – 24h/24 | Wenaya",
    description:
      "Prise en charge coordonnée, humaine et sécurisée pour vos proches au domicile à Casablanca.",
    url: `${SITE_URL}/soins-a-domicile`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Garde malade & infirmier à domicile à Casablanca – 24h/24 | Wenaya",
    description:
      "Prise en charge coordonnée, humaine et sécurisée pour vos proches au domicile à Casablanca.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "@id": `${SITE_URL}/soins-a-domicile/#service`,
      "name": "Wenaya Homecare Services",
      "description":
        "Services de garde malade et de soins infirmiers à domicile à Casablanca, avec prise en charge pluridisciplinaire (kinésithérapeutes, médecins, orthophonistes, psychologues).",
      "parentOrganization": { "@id": `${SITE_URL}/#organization` },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "88 Rue De Jabal Azourki",
        "addressLocality": "Casablanca",
        "addressCountry": "MA",
      },
      "telephone": "+212666124035",
      "areaServed": "Casablanca, Maroc",
    },
  ],
};

export default function SoinsADomicilePage() {
  /* HIDDEN — temporarily disabled; re-enable by removing the next line */
  notFound();
  return (
    <ErrorBoundary>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <Breadcrumbs labels={{ "soins-a-domicile": "Soins à domicile" }} />
        <div className="flex flex-col">
          <HomecareHero />
          <HomecareIntro />
          <HomecareWhy />
          <HomecareServices />
          <HomecareNursingLevels />
          <HomecareEvaluation />
          <HomecareMultidisciplinary />
          <HomecareMaterial />
          <HomecareSupport />
          <HomecareCoordination />
          <HomecareEngagements />
          <HomecareFaq />
          <HomecareContact />
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
