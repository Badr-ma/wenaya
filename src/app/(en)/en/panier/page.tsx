/**
 * Basket page (EN).
 *
 * SHOP LAUNCH FREEZE: Commerce is temporarily disabled — this route shows the
 * "coming soon" notice instead of a working basket. The PanierView implementation
 * stays on disk (src/components/cart/PanierView.tsx) for future activation.
 */
import ShopComingSoonNotice from "@/components/shop/ShopComingSoonNotice";

export default function BasketPage() {
  return <ShopComingSoonNotice />;
}