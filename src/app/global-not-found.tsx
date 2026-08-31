/**
 * Global 404 page — rendered when a requested URL doesn't match any route.
 * Required because the site uses multiple root layouts (route groups), so
 * there is no single layout to compose the global 404 with.
 *
 * NOTE: In Next.js 16, global-not-found.tsx renders outside normal route context —
 * request headers do not contain the URL path. Locale detection is not possible
 * server-side. Since 404 pages are noindex and bilingual content is shown,
 * lang="fr" (default locale) is acceptable for all 404s.
 */
import Link from "next/link";
import "./globals.css";
import { JetBrains_Mono, Manrope, Inter } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function GlobalNotFound(): React.JSX.Element {
  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <title>Page Introuvable — 404 | Wenaya</title>
        <meta name="robots" content="noindex, follow" />
      </head>
      <body>
        <main className="min-h-screen bg-[#F2EFE9] flex flex-col items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <span className="font-mono text-8xl sm:text-9xl font-bold text-[#0B1220]/5 select-none">
              404
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1220] -mt-6 mb-3 font-serif italic">
              Page introuvable
            </h1>
            <p className="text-[#0B1220]/60 text-sm sm:text-base mb-8 leading-relaxed">
              La page que vous cherchez n&apos;existe pas ou a été déplacée.
              <br />
              <span className="font-medium text-[#0B1220]/40">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </span>
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1220] text-[#F2EFE9] text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
