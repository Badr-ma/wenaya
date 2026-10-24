/**
 * Checkout page (FR).
 *
 * Real checkout flow: cash-on-delivery (COD) order with a customer
 * destination address, via the shared CheckoutView component.
 */
import CheckoutView from "@/components/cart/CheckoutView";

export default function CheckoutPage() {
  return <CheckoutView />;
}
