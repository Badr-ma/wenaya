/**
 * Checkout page (FR).
 *
 * SHOP LAUNCH FREEZE: Commerce is temporarily disabled — this route shows the
 * "coming soon" notice instead of a checkout flow. The CheckoutView implementation
 * stays on disk (src/components/cart/CheckoutView.tsx) for future activation.
 */
import ShopComingSoonNotice from "@/components/shop/ShopComingSoonNotice";

export default function CheckoutPage() {
  return <ShopComingSoonNotice />;
}