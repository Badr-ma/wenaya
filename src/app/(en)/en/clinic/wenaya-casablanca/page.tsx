/**
 * English Clinic Page — assembles the same Clinic/B2C sections as the French page.
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
import ClinicRecruitment from "@/components/clinic/Recruitment";
import ClinicPractical from "@/components/clinic/Practical";
import ClinicStructuredData from "@/components/clinic/StructuredData";
import { getHomepageSpecialists } from "@/lib/professionals";
import { getClinicTroubleCards } from "@/lib/troubles-hub";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

const CLINIC_PATH = "/en/clinic/wenaya-casablanca";

export const metadata: Metadata = {
  title: "Wenaya Clinic — Integrated Health Center in Casablanca",
  description:
    "Wenaya Clinic, an integrated health ecosystem in Casablanca: physiotherapy, osteopathy, psychology, neuropsychology, nutrition, speech therapy and complementary therapies — for comprehensive and personalized care.",
  keywords: [
    "Wenaya Clinic Casablanca",
    "integrated health center Casablanca",
    "multidisciplinary clinic Casablanca",
    "physiotherapy Casablanca",
    "osteopathy Casablanca",
    "integrated health Morocco",
  ],
  alternates: {
    canonical: `${SITE_URL}${CLINIC_PATH}`,
    languages: languageAlternates("/clinique/wenaya-casablanca", CLINIC_PATH),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Wenaya Clinic — Integrated Health Center in Casablanca",
    description:
      "An integrated health ecosystem bringing together multidisciplinary specialists in Casablanca for comprehensive and personalized care.",
    url: `${SITE_URL}${CLINIC_PATH}`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Clinic — Integrated Health Center in Casablanca",
    description:
      "An integrated health ecosystem bringing together multidisciplinary specialists in Casablanca for comprehensive and personalized care.",
  },
};

export default async function EnglishClinicPage() {
  const lang = "en";
  const locale = lang;
  const experts = (await getHomepageSpecialists(8)).slice(0, 8);
  // Live "Aches & conditions" catalogue — the SAME backend records + order as
  // the EN hub (the API has no locale field, so names/descriptions render
  // verbatim), each with its own EN detail route. Resolved server-side.
  const { items: troubleCards } = await getClinicTroubleCards(locale);
  return (
    <>
      <ErrorBoundary>
        <main>
          <ClinicStructuredData lang="en" canonicalPath={CLINIC_PATH} />
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
            <ClinicRecruitment />
            <ClinicPractical />
          </div>
        </main>
        <Footer />
      </ErrorBoundary>
    </>
  );
}