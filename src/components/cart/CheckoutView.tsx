/**
 * CheckoutView — shared checkout content for the FR and EN /checkout routes.
 * Real cash-on-delivery (COD) checkout:
 *   1. Destination address — pick one of the patient addresses (or add one inline).
 *   2. Place the order through the BFF purchase seam with `address_id`.
 *   3. Success panel with the sequential invoice number + basket clear.
 * Locale-aware via useLocale; basket from CartContext; hydration SSR-safe.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { getCurrentPatient } from "@/lib/patient-auth-client";
import { h } from "@/lib/href";
import { formatNumber } from "@/lib/format";

type PatientAddress = {
  id: number | string;
  name?: string | null;
  address_street_1?: string | null;
  address_street_2?: string | null;
  city?: string | null;
  zip?: string | null;
  phone?: string | null;
  type?: string | null;
};

type AddressFormState = "hidden" | "open" | "saving";

const EMPTY_ADDRESS_FORM = {
  name: "",
  address_line_1: "",
  address_line_2: "",
  zip_code: "",
  city: "",
  phone: "",
};

export default function CheckoutView() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { items, totalItems, subtotal, clearCart, isEmpty, hydrated } = useCart();
  const itemWord = locale === "fr" ? "article" : "item";
  const itemWords = locale === "fr" ? "articles" : "items";

  const [authState, setAuthState] = useState<"checking" | "ready" | "unauthenticated">("checking");
  const [addresses, setAddresses] = useState<PatientAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | null>(null);
  const [addressFormState, setAddressFormState] = useState<AddressFormState>("hidden");
  const [addressForm, setAddressForm] = useState({ ...EMPTY_ADDRESS_FORM });
  const [addressError, setAddressError] = useState<string | null>(null);

  const [orderState, setOrderState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  // ── Load the session then the saved addresses ──
  const loadSessionAndAddresses = useCallback(async () => {
    const session = await getCurrentPatient();

    if (!session.success || session.type !== "success") {
      router.replace(`${h(locale, "/login")}?returnTo=${encodeURIComponent("/checkout")}`);
      return;
    }

    setAuthState("ready");

    try {
      const res = await fetch("/api/patient/addresses", {
        method: "GET",
        credentials: "same-origin",
      });
      const json = (await res.json()) as { error?: boolean; data?: PatientAddress[] | null };
      if (res.ok && !json.error && Array.isArray(json.data)) {
        setAddresses(json.data);
        setSelectedAddressId((current) =>
          current ?? (json.data && json.data.length > 0 ? json.data[0].id : null)
        );
      }
    } catch {
      // Address list stays empty — the patient can add one inline.
    } finally {
      setAddressesLoading(false);
    }
  }, [locale, router]);

  useEffect(() => {
    if (hydrated && !isEmpty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadSessionAndAddresses();
    }
  }, [hydrated, isEmpty, loadSessionAndAddresses]);

  // ── Inline add-address form ──
  const handleAddressFormChange = (field: keyof typeof EMPTY_ADDRESS_FORM, value: string) => {
    setAddressForm((previous) => ({ ...previous, [field]: value }));
  };

  const saveAddress = async () => {
    if (addressFormState === "saving") return;

    setAddressError(null);
    const requiredFields: (keyof typeof EMPTY_ADDRESS_FORM)[] = ["address_line_1", "zip_code", "city"];
    const missing = requiredFields.some(
      (field) => addressForm[field].trim().length === 0
    );

    if (missing || addressForm.address_line_1.trim().length < 5) {
      setAddressError(t("checkout.addressInvalid"));
      return;
    }

    setAddressFormState("saving");

    try {
      const res = await fetch("/api/patient/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          address_line_1: addressForm.address_line_1.trim(),
          address_line_2: addressForm.address_line_2.trim(),
          zip_code: addressForm.zip_code.trim(),
          city: addressForm.city.trim(),
          name: addressForm.name.trim() || null,
          phone: addressForm.phone.trim() || null,
          type: "home",
        }),
      });
      const json = (await res.json()) as { error?: boolean; data?: PatientAddress | null };

      if (!res.ok || json.error || !json.data) {
        setAddressError(t("checkout.addressSaveError"));
        setAddressFormState("open");
        return;
      }

      const created = json.data;
      setAddresses((previous) => [...previous, created]);
      setSelectedAddressId(created.id);
      setAddressForm({ ...EMPTY_ADDRESS_FORM });
      setAddressFormState("hidden");
    } catch {
      setAddressError(t("checkout.addressSaveError"));
      setAddressFormState("open");
    }
  };

  // ── Place the COD order ──
  const placeOrder = async () => {
    if (orderState === "submitting") return;
    if (!selectedAddressId) {
      setAddressError(t("checkout.needAddress"));
      return;
    }

    setAddressError(null);
    setOrderState("submitting");

    try {
      const res = await fetch("/api/products/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.productSlug,
            quantity: item.quantity,
          })),
          address_id: selectedAddressId,
          payment_method: "COD",
        }),
      });

      const json = (await res.json()) as {
        error?: boolean;
        message?: string;
        data?: { invoice_number?: string | null } | null;
      };

      if (!res.ok || json.error) {
        setOrderState("error");
        return;
      }

      setInvoiceNumber(json.data?.invoice_number ?? null);
      clearCart();
      setOrderState("success");
    } catch {
      setOrderState("error");
    }
  };

  // ── Guard rendering ──
  if (!hydrated) {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-48 bg-[#0B1220]/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </section>
    );
  }

  if (orderState === "success") {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="heading-serif text-[clamp(1.6rem,3vw,2.2rem)] text-[#0B1220] mb-3">
            {t("checkout.orderSuccessTitle")}
          </h1>
          <p className="text-sm text-[#2B2F36]/60 leading-[1.8] mb-2">
            {t("checkout.orderSuccessCod")}
          </p>
          {invoiceNumber && (
            <p className="text-sm font-semibold text-[#0B1220] mb-8">
              {t("checkout.orderNumber").replace("{num}", invoiceNumber)}
            </p>
          )}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={h(locale, "/compte")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors"
            >
              {t("produits.detail.viewAccount")}
            </Link>
            <Link
              href={h(locale, "/produits")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium border border-[#0B1220]/[0.12] text-[#0B1220] hover:border-[#0B1220]/30 transition-colors"
            >
              {t("panier.continueShopping")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center py-20">
          <p className="text-[#2B2F36]/40 text-lg mb-2">{t("panier.empty")}</p>
          <Link
            href={h(locale, "/produits")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors mt-4"
          >
            {t("panier.continueShopping")}
          </Link>
        </div>
      </section>
    );
  }

  if (authState !== "ready") {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-48 bg-[#0B1220]/[0.04] rounded-lg animate-pulse mb-8" />
          <div className="h-40 bg-[#0B1220]/[0.03] rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  const addressList = addresses.filter(Boolean);

  return (
    <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href={h(locale, "/panier")}
          className="inline-flex items-center gap-1.5 text-sm text-[#2B2F36]/40 hover:text-[#0B1220] transition-colors mb-6"
        >
          ← {t("checkout.back")}
        </Link>

        <h1 className="heading-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#0B1220] mb-8">
          {t("checkout.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: payment + destination */}
          <div className="lg:col-span-3">
            {/* COD */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04] p-6 sm:p-8 mb-6">
              <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-3">
                {t("checkout.paymentMethod")}
              </h2>
              <label className="flex items-start gap-3 rounded-lg border border-[#B88A5A]/40 bg-[#B88A5A]/[0.06] p-4 cursor-pointer">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="mt-1 accent-[#B88A5A]"
                  aria-label={t("checkout.codLabel")}
                />
                <span>
                  <span className="block text-sm font-semibold text-[#0B1220]">
                    {t("checkout.codLabel")}
                  </span>
                  <span className="block mt-1 text-xs text-[#2B2F36]/60 leading-[1.7]">
                    {t("checkout.codDescription")}
                  </span>
                </span>
              </label>
            </div>

            {/* Destination address */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-heading font-semibold text-lg text-[#0B1220]">
                  {t("checkout.deliveryAddress")}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setAddressError(null);
                    setAddressFormState(addressFormState === "hidden" ? "open" : "hidden");
                  }}
                  disabled={addressFormState === "saving"}
                  className="text-xs font-medium text-[#B88A5A] hover:underline disabled:opacity-40"
                >
                  + {t("checkout.addAddress")}
                </button>
              </div>

              {addressesLoading ? (
                <p className="text-sm text-[#2B2F36]/40 py-4">{t("loadingAddresses")}</p>
              ) : addressList.length === 0 ? (
                <p className="text-sm text-[#2B2F36]/50 py-2">{t("checkout.noAddress")}</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {addressList.map((address) => {
                    const label = [
                      address.address_street_1,
                      address.address_street_2,
                      [address.zip, address.city].filter(Boolean).join(" "),
                    ]
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? "border-[#B88A5A] bg-[#B88A5A]/[0.06]"
                            : "border-[#0B1220]/[0.08] bg-white hover:border-[#0B1220]/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping-address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 accent-[#B88A5A]"
                          aria-label={t("checkout.deliveryAddress")}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-[#0B1220]">
                            {address.name || t("checkout.defaultAddress")}
                          </span>
                          <span className="block mt-1 text-xs text-[#2B2F36]/60 leading-[1.7] break-words">
                            {label || "—"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Inline add-address */}
              {(addressFormState === "open" || addressFormState === "saving") && (
                <div className="rounded-lg border border-[#0B1220]/[0.08] bg-white p-4 sm:p-5 space-y-3 mb-4">
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(event) => handleAddressFormChange("name", event.target.value)}
                    placeholder={t("checkout.addressName")}
                    className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                  />
                  <input
                    type="text"
                    value={addressForm.address_line_1}
                    onChange={(event) => handleAddressFormChange("address_line_1", event.target.value)}
                    placeholder={t("checkout.street1")}
                    required
                    className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                  />
                  <input
                    type="text"
                    value={addressForm.address_line_2}
                    onChange={(event) => handleAddressFormChange("address_line_2", event.target.value)}
                    placeholder={t("checkout.street2")}
                    className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={addressForm.zip_code}
                      onChange={(event) => handleAddressFormChange("zip_code", event.target.value)}
                      placeholder={t("checkout.postalCode")}
                      required
                      className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                    />
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(event) => handleAddressFormChange("city", event.target.value)}
                      placeholder={t("checkout.city")}
                      required
                      className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                    />
                  </div>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(event) => handleAddressFormChange("phone", event.target.value)}
                    placeholder={t("checkout.phoneDelivery")}
                    className="w-full px-3 py-2.5 text-sm text-[#0B1220] rounded-md border border-[#0B1220]/[0.12] bg-white focus:outline-none focus:ring-2 focus:ring-[#B88A5A]/50"
                  />
                  <p className="text-[10px] text-[#2B2F36]/40">{t("checkout.locationNote")}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={saveAddress}
                      disabled={addressFormState === "saving"}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] disabled:opacity-40 transition-colors"
                    >
                      {addressFormState === "saving" ? t("checkout.saving") : t("checkout.saveAddress")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddressForm({ ...EMPTY_ADDRESS_FORM });
                        setAddressError(null);
                        setAddressFormState("hidden");
                      }}
                      disabled={addressFormState === "saving"}
                      className="text-sm text-[#2B2F36]/50 hover:text-[#0B1220] transition-colors"
                    >
                      {t("checkout.cancelAdd")}
                    </button>
                  </div>
                </div>
              )}

              {addressError && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {addressError}
                </p>
              )}

              {/* Place order */}
              <button
                type="button"
                onClick={placeOrder}
                disabled={orderState === "submitting"}
                className="inline-flex w-full items-center justify-center px-6 py-4 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              >
                {orderState === "submitting"
                  ? t("checkout.placingOrder")
                  : t("checkout.placeOrder")}
              </button>

              {orderState === "error" && (
                <p
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {t("checkout.orderError")}
                </p>
              )}
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04] p-6 sticky top-28">
              <h2 className="font-heading font-semibold text-sm text-[#2B2F36]/40 uppercase tracking-wider mb-4">
                {t("checkout.orderSummary")}
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productSlug} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#0B1220]/[0.03] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0B1220] truncate">{item.productName}</p>
                      <p className="text-[10px] text-[#2B2F36]/30">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#0B1220] tabular-nums">
                      {formatNumber(item.unitPrice * item.quantity, locale)} {item.currency}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#0B1220]/[0.06] pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#2B2F36]/40">{totalItems} {totalItems === 1 ? itemWord : itemWords}</span>
                  <span className="text-lg font-bold text-[#0B1220]">
                    {formatNumber(subtotal, locale)} {items[0]?.currency || "MAD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
