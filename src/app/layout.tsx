/**
 * Root Layout — wraps every page in the app.
 * Provides: fonts, global CSS, language context, smooth scroll (Lenis),
 * GSAP init, navigation bar, and the corporate consultation floating widget.
 * Also injects the site-wide JSON-LD structured data and Content-Security-Policy.
 */
import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Nunito, Open_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import GsapInit from "@/components/GsapInit";
import LenisProvider from "@/components/LenisProvider";
import CorporateConsultationWidget from "@/components/CorporateConsultationWidget";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";

/** Nunito — used for headings and UI text via --font-heading CSS variable */
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-nunito",
  display: "swap",
});

/** Open Sans — primary body font via --font-open-sans CSS variable */
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

/** Cormorant Garamond — serif font for hero headlines and decorative text */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

/** JetBrains Mono — monospace font for code/data display */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Global SEO metadata — applied as defaults for all pages (individual pages can override title/description) */
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
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
};

/** Root layout — renders the <html> shell with all global providers */
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
        {/* JSON-LD structured data — Organization, MedicalBusiness/LocalBusiness, and WebSite schemas for Google rich results */}
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });`}
            </Script>
          </>
        )}
        {/* LanguageProvider — i18n context wrapping the entire app, enables useLocale() and t() */}
        <LanguageProvider>
          <GsapInit /> {/* Registers GSAP plugins globally (ScrollTrigger, etc.) */}
          <Nav /> {/* Global navigation bar — fixed position, outside Lenis so position:fixed works correctly */}
          <CookieConsent /> {/* Cookie consent banner — fixed position at bottom, outside Lenis */}
          <LenisProvider> {/* Enables Lenis smooth scrolling across the site */}
            <ScrollToTop />
            {children} {/* Page content rendered here */}
            <CorporateConsultationWidget /> {/* Floating consultation pill on /solutions/entreprises */}
          </LenisProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
