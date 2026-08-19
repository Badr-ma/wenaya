/**
 * Basket layout — adds noindex robots directive for basket pages.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BasketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
