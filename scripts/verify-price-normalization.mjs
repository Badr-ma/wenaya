#!/usr/bin/env node
/**
 * Verification for normalizeLegacyPrice (src/lib/format.ts) — the render-time
 * normalizer that rewrites legacy local-specialist "300 DH" price labels to the
 * backend-established canonical "300 MAD", without touching API-sourced values.
 *
 * Runs with the built-in Node test runner (node:test) — NO third-party
 * framework, consistent with a repo that has none. The formatter under test is
 * a pure dependency-free TS module, so this imports it directly via a
 * file:// URL under `node --experimental-strip-types`.
 *
 * Run: `npm run verify:price`  (or node --experimental-strip-types scripts/verify-price-normalization.mjs)
 */
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const FORMAT_TS = pathToFileURL(join(ROOT, "src", "lib", "format.ts")).href;

const { normalizeLegacyPrice } = await import(FORMAT_TS);

test("exact legacy '300 DH' → '300 MAD'", () => {
  assert.equal(normalizeLegacyPrice("300 DH"), "300 MAD");
});

test("exact '300 MAD' (canonical currency) is never touched", () => {
  assert.equal(normalizeLegacyPrice("300 MAD"), "300 MAD");
});

test("numeric value is preserved verbatim (never reformatted or converted)", () => {
  assert.equal(normalizeLegacyPrice("450 DH"), "450 MAD");
  assert.equal(normalizeLegacyPrice("800 DH"), "800 MAD");
  assert.equal(normalizeLegacyPrice("300,50 DH"), "300,50 MAD");
});

test("zero ('0 DH') is normalized to '0 MAD' — value stays zero", () => {
  const out = normalizeLegacyPrice("0 DH");
  assert.equal(out, "0 MAD");
  assert.equal(Number.parseInt(out, 10), 0);
});

test("missing values (null / undefined / empty) pass through unchanged", () => {
  assert.equal(normalizeLegacyPrice(null), null);
  assert.equal(normalizeLegacyPrice(undefined), undefined);
  assert.equal(normalizeLegacyPrice(""), "");
});

test("suffix matching is exact — malformed labels are left untouched", () => {
  assert.equal(normalizeLegacyPrice("300DH"), "300DH");
  assert.equal(normalizeLegacyPrice("300 DH extra"), "300 DH extra");
  assert.equal(normalizeLegacyPrice("price: 300 DH"), "price: 300 DH");
  assert.equal(normalizeLegacyPrice("-300 DH"), "-300 DH");
});