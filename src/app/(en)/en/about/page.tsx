/**
 * English About Page — assembles the same Clinic/B2C sections as the French page.
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
    canonical: `${SITE_URL}/en/about`,
    languages: languageAlternates("/about"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Wenaya Clinic — Integrated Health Center in Casablanca",
    description:
      "An integrated health ecosystem bringing together multidisciplinary specialists in Casablanca for comprehensive and personalized care.",
    url: `${SITE_URL}/en/about`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Wenaya Clinic — Integrated Health Center in Casablanca",
    description:
      "An integrated health ecosystem bringing together multidisciplinary specialists in Casablanca for comprehensive and personalized care.",
  },
};

export default function EnglishAboutPage() {
  const lang = "en";
  const locale = lang;
  return (
    <>
      <ErrorBoundary>
        <main>
          <ClinicStructuredData lang="en" canonicalPath="/en/about" />
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