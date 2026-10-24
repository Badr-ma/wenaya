/**
 * Regression tests for the product price data contract.
 *
 * Contract (verified 2026-10-22; backend price confirmed as 450 DH):
 * the V2 public-products API returns a value 100× the intended MAD price —
 * `test-prod` (450 DH) returns `price: 45000`, `agnosco-cado-stipes`
 * (350 DH) returns `35000`. Displayed price = raw / 100 (45000 → 450 MAD).
 * Without the adapter conversion, fr-MA formatting renders `45000` as
 * "45.000 MAD" (dot = thousands separator) — the reported bug.
 *
 * Covers: all three adapter mappers convert raw → MAD exactly once, and
 * formatPrice renders the converted value correctly in BOTH locales (fr / en).
 * Static/canonical products are already MAD and never pass through the adapter.
 */
process.env.WENAYA_API_URL = "https://api.test";

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  mapBackendProductToProduct,
  mapBackendProductToProductItem,
  mapBackendProductToListItem,
  apiPriceToMad,
} from "@/lib/products/api-adapter";
import { formatPrice } from "@/lib/format";

/** Minimal BackendPublicProduct fixture — raw API price value (100× intended MAD price). */
function backendProduct(rawPrice) {
  return {
    id: 1,
    slug: "test-prod",
    name: "Test Product",
    description: null,
    price: rawPrice,
    currency: "MAD",
    availability: "in_stock",
  };
}

// ---------------------------------------------------------------------------
// apiPriceToMad — the conversion itself
// ---------------------------------------------------------------------------

test("apiPriceToMad: 45000 raw → 450 MAD (the reported bug case)", () => {
  assert.equal(apiPriceToMad(45000), 450);
});

test("apiPriceToMad: 35000 raw → 350 MAD (second live product)", () => {
  assert.equal(apiPriceToMad(35000), 350);
});

test("apiPriceToMad: non-round 45050 raw → 450.5 MAD", () => {
  assert.equal(apiPriceToMad(45050), 450.5);
});

test("apiPriceToMad: odd raw value 34999 → 349.99 MAD", () => {
  assert.equal(apiPriceToMad(34999), 349.99);
});

test("apiPriceToMad: zero stays zero", () => {
  assert.equal(apiPriceToMad(0), 0);
});

// ---------------------------------------------------------------------------
// All three adapter mappers convert the price
// ---------------------------------------------------------------------------

test("mapBackendProductToProduct: converts 45000 raw → 450 MAD", () => {
  const mapped = mapBackendProductToProduct(backendProduct(45000));
  assert.equal(mapped.price, 450);
  assert.equal(mapped.currency, "MAD");
});

test("mapBackendProductToProductItem: converts 45000 raw → 450 MAD", () => {
  const mapped = mapBackendProductToProductItem(backendProduct(45000));
  assert.equal(mapped.price, 450);
});

test("mapBackendProductToListItem: converts 45000 raw → 450 MAD", () => {
  const mapped = mapBackendProductToListItem(backendProduct(45000));
  assert.equal(mapped.price, 450);
});

test("all three mappers agree on a non-round price (45050 → 450.5)", () => {
  const raw = backendProduct(45050);
  assert.equal(mapBackendProductToProduct(raw).price, 450.5);
  assert.equal(mapBackendProductToProductItem(raw).price, 450.5);
  assert.equal(mapBackendProductToListItem(raw).price, 450.5);
});

// ---------------------------------------------------------------------------
// End-to-end: converted value + locale formatting (the user-visible strings)
// ---------------------------------------------------------------------------

test("formatPrice: 450 MAD renders correctly in FR", () => {
  assert.equal(formatPrice(450, "MAD", "fr"), "450 MAD");
});

test("formatPrice: 450 MAD renders correctly in EN", () => {
  assert.equal(formatPrice(450, "MAD", "en"), "450 MAD");
});

test("formatPrice: non-round 450.5 renders per-locale (fr comma / en dot)", () => {
  assert.equal(formatPrice(450.5, "MAD", "fr"), "450,5 MAD");
  assert.equal(formatPrice(450.5, "MAD", "en"), "450.5 MAD");
});

test("regression: full chain (adapter + format) no longer yields 45.000", () => {
  const mapped = mapBackendProductToProduct(backendProduct(45000));
  const fr = formatPrice(mapped.price, mapped.currency, "fr");
  const en = formatPrice(mapped.price, mapped.currency, "en");
  assert.equal(fr, "450 MAD");
  assert.equal(en, "450 MAD");
  assert.ok(!fr.includes("000"), "FR must not contain a thousands group");
  assert.ok(!en.includes("000"), "EN must not contain a thousands group");
});
