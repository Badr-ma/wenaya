/**
 * ClinicStructuredData — page-level JSON-LD for the Clinic/B2C (/about) page.
 *
 * Adds WebPage + MedicalClinic schema. Relies on the site-wide @graph already
 * emitted in the root layout (Organization #organization, WebSite #website,
 * MedicalBusiness/LocalBusiness #clinic) and MERGES against those ids by
 * reference — it does NOT re-declare an Organization node or reuse the global
 * #clinic id, so no conflicting/duplicate types are introduced.
 *
 * Only uses verified clinic data: name, Casablanca address, phone, opening hours.
 *
 * @param lang — "fr" | "en" for `inLanguage` on the WebPage node.
 * @param canonicalPath — e.g. "/about" (FR) or "/en/about" (EN).
 */
import { SITE_URL } from "@/lib/site-config";

export default function ClinicStructuredData({
  lang,
  canonicalPath,
}: {
  lang: "fr" | "en";
  canonicalPath: string;
}): React.JSX.Element {
  const langCode = lang === "en" ? "en-MA" : "fr-MA";
  const medicalClinicId = `${SITE_URL}/#medicalclinic-${lang === "en" ? "en" : "fr"}`;

  const services = (lang === "en"
    ? [
        { "@type": "MedicalTherapy", name: "Physiotherapy" },
        { "@type": "MedicalTherapy", name: "Osteopathy" },
        { "@type": "MedicalTherapy", name: "Psychology" },
        { "@type": "MedicalTherapy", name: "Nutrition" },
        { "@type": "MedicalTherapy", name: "Speech Therapy" },
        { "@type": "MedicalTherapy", name: "Sophrology" },
      ]
    : [
        { "@type": "MedicalTherapy", name: "Kinésithérapie" },
        { "@type": "MedicalTherapy", name: "Ostéopathie" },
        { "@type": "MedicalTherapy", name: "Psychologie" },
        { "@type": "MedicalTherapy", name: "Nutrition" },
        { "@type": "MedicalTherapy", name: "Orthophonie" },
        { "@type": "MedicalTherapy", name: "Sophrologie" },
      ]) satisfies { "@type": string; name: string }[];

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}${canonicalPath}#webpage`,
      "url": `${SITE_URL}${canonicalPath}`,
      "name": lang === "en" ? "Wenaya Clinic — Integrated Health Center in Casablanca" : "Wenaya Clinic — Centre de Santé Intégrée à Casablanca",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": medicalClinicId },
      "inLanguage": langCode,
      "description": lang === "en"
        ? "Wenaya Clinic, an integrated health ecosystem in Casablanca: physiotherapy, osteopathy, psychology, nutrition and complementary therapies."
        : "Wenaya Clinic, un écosystème de santé intégrée à Casablanca : kinésithérapie, ostéopathie, psychologie, nutrition et thérapies complémentaires.",
    },
    {
      "@type": "MedicalClinic",
      "@id": medicalClinicId,
      "name": "Wenaya Clinic",
      "url": `${SITE_URL}/about`,
      "parentOrganization": { "@id": `${SITE_URL}/#organization` },
      "brand": { "@id": `${SITE_URL}/#organization` },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "88 Rue De Jabal Azourki",
        "addressLocality": "Casablanca",
        "postalCode": "20930",
        "addressCountry": "MA",
      },
      "telephone": "+212666124035",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "08:00",
          "closes": "20:00",
        },
      ],
      "availableService": services,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}