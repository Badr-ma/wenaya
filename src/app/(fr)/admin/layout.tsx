/**
 * Admin Layout — provides SEO metadata for the /admin page.
 * Sets robots noindex to keep the admin dashboard out of search results.
 * Needed because admin/page.tsx is a client component and can't export Metadata.
 */
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Admin — Wenaya",
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${SITE_URL}/admin`,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
