/**
 * Clinic Page — server component assembling all Clinic/B2C page sections.
 * Rebuilt to an editorial, no-card design using live wenaya.com content.
 * Sections: Hero, Trust, Intro, Practices, Courses, Pathologies, Team,
 * HealthNeeds, Recruitment, Practical, and Footer.
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
/* HIDDEN — temporarily disabled; re-enable by uncommenting import + render below */
// import ClinicHomecareBanner from "@/components/clinic/HomecareBanner";
import ClinicRecruitment from "@/components/clinic/Recruitment";
import ClinicPractical from "@/components/clinic/Practical";
import ClinicStructuredData from "@/components/clinic/StructuredData";
import { getHomepageSpecialists } from "@/lib/professionals";
import { getClinicTroubleCards } from "@/lib/troubles-hub";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const CLINIC_PATH = "/clinique/wenaya-casablanca";

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
    canonical: `${SITE_URL}${CLINIC_PATH}`,
    languages: languageAlternates(CLINIC_PATH, "/en/clinic/wenaya-casablanca"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
    description:
      "Un écosystème de santé intégrée réunissant des spécialistes pluridisciplinaires à Casablanca pour un accompagnement global et personnalisé.",
    url: `${SITE_URL}${CLINIC_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
    description:
      "Un écosystème de santé intégrée réunissant des spécialistes pluridisciplinaires à Casablanca pour un accompagnement global et personnalisé.",
  },
};

export default async function ClinicPage() {
  const lang = "fr";
  const locale = lang;
  const experts = (await getHomepageSpecialists(8)).slice(0, 8);
  // Live Maux-troubles catalogue — the SAME records + order as the hub page,
  // each with its own localized detail route. Resolved server-side so the
  // client component never fetches and can never invent a destination.
  const { items: troubleCards } = await getClinicTroubleCards(locale);
  return (
    <>
      <ErrorBoundary>
        <main>
          <ClinicStructuredData lang="fr" canonicalPath={CLINIC_PATH} />
          <Breadcrumbs />
          <div className="flex flex-col">
            <ClinicHero />
            <ClinicTrust />
            <ClinicIntro />
            <ClinicPractices locale={locale} lang={lang} />
            <ClinicCourses locale={locale} lang={lang} />
            <ClinicPathologies locale={locale} lang={lang} />
            <ClinicTeam specialists={experts} />
            <ClinicHealthNeeds troubleCards={troubleCards} />
            {/* <ClinicHomecareBanner /> — HIDDEN temporarily */}
            <ClinicRecruitment />
            <ClinicPractical />
          </div>
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}