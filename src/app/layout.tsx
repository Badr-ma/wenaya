import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Nunito, Open_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import GsapInit from "@/components/GsapInit";
import LenisProvider from "@/components/LenisProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wenaya.com"),
  title: {
    default: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    template: "%s | Wenaya",
  },
  description:
    "Wenaya est la première plateforme de santé intégrée au Maroc. Kinésithérapie, psychologie clinique, nutrition et bien-être corporate — depuis Casablanca.",
  keywords: [
    "plateforme santé intégrée Maroc",
    "kinésithérapie Casablanca",
    "psychologie clinique Maroc",
    "nutrition préventive Casablanca",
    "bien-être entreprise Maroc",
    "wellness corporate Maroc",
    "santé mentale Casablanca",
    "prévention santé Maroc",

    "clinique multidisciplinaire Casablanca",
    "integrated health Morocco",
  ],
  authors: [{ name: "Wenaya", url: "https://www.wenaya.com" }],
  creator: "Wenaya",
  publisher: "Wenaya",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://www.wenaya.com",
    siteName: "Wenaya",
    title: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, clinical psychology, nutrition, and corporate wellness — from Casablanca.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wenaya — Plateforme de Santé Intégrée au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, psychology, nutrition, and corporate wellness — from Casablanca.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://www.wenaya.com",
    languages: {
      "fr-MA": "https://www.wenaya.com",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="fr" className={`${nunito.variable} ${openSans.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data: blob:; media-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.wenaya.com/#organization",
                  "name": "Wenaya",
                  "url": "https://www.wenaya.com",
                   "description": "Morocco's first integrated health and wellbeing platform combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness.",
                  "foundingLocation": { "@type": "Place", "name": "Casablanca, Maroc" },
                  "areaServed": ["Maroc", "MENA"],
                  "availableLanguage": ["French", "Arabic", "English"],
                },
                {
                  "@type": ["MedicalBusiness", "LocalBusiness"],
                  "@id": "https://www.wenaya.com/#clinic",
                  "name": "Wenaya Clinic",
                  "parentOrganization": { "@id": "https://www.wenaya.com/#organization" },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "88 Rue De Jabal Azourki",
                    "addressLocality": "Casablanca",
                    "addressCountry": "MA",
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                      "opens": "08:00",
                      "closes": "20:00",
                    },
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.7",
                    "bestRating": "5",
                    "ratingCount": "200",
                  },
                  "availableService": [
                    { "@type": "MedicalTherapy", "name": "Kinésithérapie & Rééducation" },
                    { "@type": "MedicalTherapy", "name": "Psychologie Clinique & Santé Mentale" },
                    { "@type": "MedicalTherapy", "name": "Nutrition & Soins Préventifs" },
                    { "@type": "MedicalTherapy", "name": "Bien-être Corporate" },
                    { "@type": "MedicalTherapy", "name": "Programmes Wellness Hôtellerie" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.wenaya.com/#website",
                  "url": "https://www.wenaya.com",
                  "name": "Wenaya",
                  "publisher": { "@id": "https://www.wenaya.com/#organization" },
                  "inLanguage": ["fr-MA", "ar-MA", "en"],
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <GsapInit />
          <LenisProvider>
            <Nav />
            {children}
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
