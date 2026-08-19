/**
 * 404 Not Found page (EN) — displayed when a route doesn't match any page.
 * Marked noindex so search engines don't index error pages.
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — 404 | Wenaya",
  description:
    "The page you're looking for doesn't exist or has been moved. Return to Wenaya's homepage to discover our integrated health services in Casablanca.",
  robots: { index: false, follow: true },
};

export default function NotFound(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#F2EFE9] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <span className="font-mono text-8xl sm:text-9xl font-bold text-[#0B1220]/5 select-none">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1220] -mt-6 mb-3 font-serif italic">
          Page not found
        </h1>
        <p className="text-[#0B1220]/60 text-sm sm:text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1220] text-[#F2EFE9] text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
