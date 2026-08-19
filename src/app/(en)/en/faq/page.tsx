/**
 * English FAQ Page — frequently asked questions with JSON-LD FAQPage schema.
 * The visible FAQ section is i18n-driven (en.ts); the FAQPage JSON-LD mirrors
 * the first six English questions and answers.
 * Includes breadcrumbs and SEO metadata.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/faq/FaqSection";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions about Wenaya",
  description:
    "Everything you need to know about Wenaya: physiotherapy, psychology, nutrition and corporate wellness in Casablanca, Morocco.",
  keywords: [
    "Wenaya FAQ Casablanca",
    "physiotherapy frequently asked questions",
    "psychologist consultation Morocco",
    "clinic prices Casablanca",
    "nutrition appointment Morocco",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/faq`,
    languages: languageAlternates("/faq"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "FAQ — Frequently Asked Questions about Wenaya",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform and corporate wellness programs in Morocco.",
    url: `${SITE_URL}/en/faq`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "FAQ — Frequently Asked Questions about Wenaya",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform and corporate wellness programs in Morocco.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of care are offered at the clinic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wenaya Clinic offers a wide range of multidisciplinary care: physiotherapy, osteopathy, clinical psychology, neuropsychology, nutrition, speech therapy, naturopathy, psychomotricity and complementary therapies. Each patient receives a complete assessment to direct their care to the specialist(s) best suited to their needs.",
      },
    },
    {
      "@type": "Question",
      name: "How is the collected data protected?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wenaya strictly complies with applicable regulations (GDPR, Moroccan Law 09-08). All health data is encrypted, stored on secure servers in Morocco and accessible only to authorized practitioners. You may consult our privacy policy for more details.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a prescription to consult?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, a prescription is not required to consult our specialists. However, for certain specific treatments or reimbursement by your insurance, a medical prescription may be required. Our team assists you with administrative procedures.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to get an appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wait times vary by specialty and urgency. On average, an appointment is available within 24 to 72 hours for a first consultation. Urgent cases are prioritized. You can book online, by phone or directly at the clinic reception.",
      },
    },
    {
      "@type": "Question",
      name: "Are consultations reimbursed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many mutual insurance companies and health insurers cover all or part of our consultations. We recommend checking with your insurer. Wenaya provides all necessary supporting documents (treatment sheet, invoice, report) to facilitate your reimbursement.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer online consultations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Wenaya offers teleconsultations in psychology, nutrition and wellness follow-up. These consultations take place on a secure platform, accessible from your patient portal. Physiotherapy and osteopathy consultations require physical presence.",
      },
    },
  ],
};

export default function EnglishFaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ErrorBoundary>
        <main>
          <Breadcrumbs />
          <div className="flex flex-col min-h-screen">
            <FaqSection />
          </div>
        </main>
        <div data-section-bg="dark"><Footer /></div>
      </ErrorBoundary>
    </>
  );
}
