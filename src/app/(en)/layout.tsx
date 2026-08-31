/**
 * English Root Layout — wraps every page under the `(en)` route group (URL-invisible),
 * exposing the literal `/en` URL. Mirrors the French root layout but server-renders
 * the English locale (initialLocale="en") and emits English metadata + language-aware
 * JSON-LD (WebSite.inLanguage = "en").
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
import { languageAlternates } from "@/lib/hreflang";

const ENGLISH_HOME_URL = `${SITE_URL}/en`;

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

/** English SEO metadata — defaults for English pages (individual pages can override title/description) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wenaya — Integrated Health Platform | Casablanca, Morocco",
    template: "%s | Wenaya",
  },
  applicationName: SITE_NAME,
  description:
    "Wenaya is Morocco's first integrated health platform. Physiotherapy, clinical psychology, nutrition, and corporate wellness — from Casablanca.",
  keywords: [
    "integrated health platform Morocco",
    "physiotherapy Casablanca",
    "clinical psychology Morocco",
    "preventive nutrition Casablanca",
    "corporate wellness Morocco",
    "mental health Casablanca",
    "health prevention Morocco",
    "multidisciplinary clinic Casablanca",
  ],
  authors: [{ name: "Wenaya", url: SITE_URL }],
  creator: "Wenaya",
  publisher: "Wenaya",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_MA",
    url: ENGLISH_HOME_URL,
    siteName: "Wenaya",
    title: "Wenaya — Integrated Health Platform | Casablanca, Morocco",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, clinical psychology, nutrition, and corporate wellness — from Casablanca.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wenaya — Integrated Health Platform | Casablanca, Morocco",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, psychology, nutrition, and corporate wellness — from Casablanca.",
    images: ["/opengraph-image"],
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
    canonical: ENGLISH_HOME_URL,
    languages: languageAlternates("/"),
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
};

/** English root layout — renders the <html lang="en"> shell with all global providers */
export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data: blob:; media-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'"
        />
        {/* JSON-LD structured data — Organization, MedicalBusiness/LocalBusiness, and WebSite schemas.
            Language-aware: the WebSite node points at /en and declares English as its language. */}
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
                  "foundingLocation": { "@type": "Place", "name": "Casablanca, Morocco" },
                  "areaServed": ["Morocco", "MENA"],
                  "availableLanguage": ["English", "French", "Arabic"],
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
                    { "@type": "MedicalTherapy", "name": "Physiotherapy & Rehabilitation" },
                    { "@type": "MedicalTherapy", "name": "Clinical Psychology & Mental Health" },
                    { "@type": "MedicalTherapy", "name": "Nutrition & Preventive Care" },
                    { "@type": "MedicalTherapy", "name": "Corporate Wellness" },
                    { "@type": "MedicalTherapy", "name": "Wellness Programs for Hospitality" },
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": ENGLISH_HOME_URL,
                  "name": "Wenaya",
                  "publisher": { "@id": `${SITE_URL}/#organization` },
                  "inLanguage": "en",
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
        {/* LanguageProvider initialized to English — enables SSR'd English content via t() */}
        <LanguageProvider initialLocale="en">
          <CartProvider>
            <GsapInit />
            <Nav />
            <CookieConsent />
            <LenisProvider>
              <ScrollToTop />
              {children}
              <CorporateConsultationWidget />
            </LenisProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
