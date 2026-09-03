/**
 * About Page — server component assembling all Clinic/B2C page sections.
 * Rebuilt to an editorial, no-card design using live wenaya.com content.
 * Sections: Hero, Trust, Intro, Practices, Courses, Pathologies, Team,
 * HealthNeeds, Recruitment, Practical, News, and Footer.
 * Includes MedicalClinic structured data for SEO.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClinicHero from "@/components/clinic/Hero";
import ClinicTrust from "@/components/clinic/Trust";
import ClinicIntro from "@/components/clinic/Intro";
import ClinicPractices from "@/components/clinic/Practices";
import ClinicCourses from "@/components/clinic/Courses";
import ClinicPathologies from "@/components/clinic/Pathologies";
import ClinicTeam from "@/components/clinic/Team";
import ClinicHealthNeeds from "@/components/clinic/HealthNeeds";
import ClinicRecruitment from "@/components/clinic/Recruitment";
import ClinicPractical from "@/components/clinic/Practical";
import ClinicNews from "@/components/clinic/News";
import ClinicStructuredData from "@/components/clinic/StructuredData";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
  description:
    "Wenaya Clinic, un écosystème de santé intégrée à Casablanca : kinésithérapie, ostéopathie, psychologie, neuropsychologie, nutrition, orthophonie et thérapies complémentaires — pour un accompagnement global et personnalisé.",
  keywords: [
    "Wenaya Clinic Casablanca",
    "centre santé intégrée Casablanca",
    "clinique pluridisciplinaire Casablanca",
    "kinésithérapie Casablanca",
    "ostéopathie Casablanca",
    "santé intégrée Maroc",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: languageAlternates("/about"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
    description:
      "Un écosystème de santé intégrée réunissant des spécialistes pluridisciplinaires à Casablanca pour un accompagnement global et personnalisé.",
    url: `${SITE_URL}/about`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
    description:
      "Un écosystème de santé intégrée réunissant des spécialistes pluridisciplinaires à Casablanca pour un accompagnement global et personnalisé.",
  },
};

export default function AboutPage() {
  const lang = "fr";
  const locale = lang;
  return (
    <>
      <ErrorBoundary>
        <main>
          <ClinicStructuredData lang="fr" canonicalPath="/about" />
          <Breadcrumbs />
          <div className="flex flex-col">
            <ClinicHero />
            <ClinicTrust />
            <ClinicIntro />
            <ClinicPractices locale={locale} lang={lang} />
            <ClinicCourses locale={locale} lang={lang} />
            <ClinicPathologies />
            <ClinicTeam />
            <ClinicHealthNeeds />
            <ClinicRecruitment />
            <ClinicPractical />
            <ClinicNews locale={locale} lang={lang} />
          </div>
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}