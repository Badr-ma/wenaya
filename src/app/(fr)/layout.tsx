/**
 * Root Layout — wraps every page in the app.
 * Provides: fonts, global CSS, language context, smooth scroll (Lenis),
 * GSAP init, navigation bar, and the corporate consultation floating widget.
 * Also injects the site-wide JSON-LD structured data and Content-Security-Policy.
 */
import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import Nav from "@/components/Nav";
import GsapInit from "@/components/GsapInit";
import LenisProvider from "@/components/LenisProvider";
import CorporateConsultationWidget from "@/components/CorporateConsultationWidget";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

/** Manrope — Wenaya heading/display font via --font-heading & --font-serif */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** Inter — Wenaya body/UI font via --font-sans */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    template: "%s | Wenaya",
  },
  applicationName: SITE_NAME,
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
  authors: [{ name: "Wenaya", url: SITE_URL }],
  creator: "Wenaya",
  publisher: "Wenaya",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE_URL,
    siteName: "Wenaya",
    title: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    description:
      "Wenaya est la première plateforme de santé intégrée au Maroc. Kinésithérapie, psychologie clinique, nutrition et bien-être corporate — depuis Casablanca.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wenaya — Plateforme de Santé Intégrée | Casablanca, Maroc",
    description:
      "Wenaya est la première plateforme de santé intégrée au Maroc. Kinésithérapie, psychologie clinique, nutrition et bien-être corporate — depuis Casablanca.",
    images: ["/og-image.png"],
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
    canonical: SITE_URL,
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
    <html lang="fr" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
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
                  "@id": `${SITE_URL}/#organization`,
                  "name": "Wenaya",
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/images/logo-full.png`,
                  },
                   "description": "Morocco's first integrated health and wellbeing platform combining physiotherapy, clinical psychology, nutrition, prevention, and corporate wellness.",
                  "foundingLocation": { "@type": "Place", "name": "Casablanca, Maroc" },
                  "areaServed": ["Maroc", "MENA"],
                  "availableLanguage": ["French", "Arabic", "English"],
                },
                {
                  "@type": ["MedicalBusiness", "LocalBusiness"],
                  "@id": `${SITE_URL}/#clinic`,
                  "name": "Wenaya Clinic",
                  "parentOrganization": { "@id": `${SITE_URL}/#organization` },
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
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "Wenaya",
                  "publisher": { "@id": `${SITE_URL}/#organization` },
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
        {/* LanguageProvider — i18n context wrapping the entire app, enables useLocale() and t().
            Pinned to French so the FR route group server-renders French and does not re-detect
            English from localStorage/browser on the client (mirrors the EN layout). */}
        <LanguageProvider initialLocale="fr">
          <CartProvider>
            <GsapInit /> {/* Registers GSAP plugins globally (ScrollTrigger, etc.) */}
            <Nav /> {/* Global navigation bar — fixed position, outside Lenis so position:fixed works correctly */}
            <CookieConsent /> {/* Cookie consent banner — fixed position at bottom, outside Lenis */}
            <LenisProvider> {/* Enables Lenis smooth scrolling across the site */}
              <ScrollToTop />
              {children} {/* Page content rendered here */}
              <CorporateConsultationWidget /> {/* Floating consultation pill on /solutions/entreprises */}
            </LenisProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
