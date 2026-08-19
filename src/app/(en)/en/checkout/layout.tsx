/**
 * Checkout layout (EN) — adds noindex robots directive for checkout pages.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
