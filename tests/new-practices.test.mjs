import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeApiSpeciality } from "@/lib/practice-adapter";
import { practicesContent } from "@/lib/practice-content";
import { getLivePratiquesStrict, getPracticesPageAsync } from "@/lib/pratiques";
import { getSpecialistPractices } from "@/lib/professionals-detail";

process.env.WENAYA_API_URL = "https://api.example.test";
const record = {
  id: 9001, fr_slug: "nouvelle-pratique", fr_name: "Nouvelle pratique",
  en_name: "New practice", description: "<p>A new backend description.</p>",
  details: "<p>First paragraph.</p><p>Second paragraph.</p>",
  image_web: "https://nbg1.your-objectstorage.com/new.jpg", category: "manualTherapies",
};
function page(number, last, data) {
  return Response.json({ error: false, data: {
    current_page: number, last_page: last, per_page: 12, total: 2, data,
  } });
}

test("a new backend practice needs no editorial registration in either locale", () => {
  for (const locale of ["fr", "en"]) {
    const practice = normalizeApiSpeciality(record, locale);
    assert.equal(practice.slug, "nouvelle-pratique-9001");
    assert.equal(practice.title, locale === "fr" ? record.fr_name : record.en_name);
    assert.equal(practice.image, record.image_web);
    assert.equal(practice.description, "A new backend description.");
    assert.deepEqual(practice.article, [{ body: ["First paragraph.", "Second paragraph."] }]);
    assert.equal(practice.category, "manualTherapies");
  }
});

test("all existing practice IDs preserve canonical routes and editorial articles", () => {
  for (const content of Object.values(practicesContent)) {
    const practice = normalizeApiSpeciality({ ...record, id: content.liveId }, "fr");
    assert.equal(practice.slug, content.slug);
    assert.deepEqual(practice.article, content.articleFr);
  }
});

test("new slugs remain route-safe and distinct for duplicate names or reserved names", () => {
  assert.equal(normalizeApiSpeciality({ ...record, fr_slug: "Kinésithérapie" }, "fr").slug, "kinesitherapie-9001");
  assert.notEqual(normalizeApiSpeciality(record, "fr").slug,
    normalizeApiSpeciality({ ...record, id: 9002 }, "fr").slug);
  const unnamed = { id: 9003 };
  assert.equal(normalizeApiSpeciality(unnamed, "en").slug, "practice-9003");
  assert.equal(normalizeApiSpeciality({ ...record, is_visible: false }, "fr"), null);
  assert.equal(normalizeApiSpeciality({ ...record, id: NaN }, "fr"), null);
});

test("missing English or image data uses available text without inventing an image", () => {
  const practice = normalizeApiSpeciality({ ...record, en_name: null, image_web: null }, "en");
  assert.equal(practice.title, record.fr_name);
  assert.equal(practice.image, "");
});

test("new practices on later API pages reach detail lookup, search, filters and professional links", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    const p = new URL(url).searchParams.get("page");
    return p === "2" ? page(2, 2, [record]) : page(1, 2, [{ ...record, id: practicesContent.nutrition.liveId }]);
  });
  const all = await getLivePratiquesStrict("en");
  assert.equal(all.find((p) => p.slug === "nouvelle-pratique-9001").title, "New practice");
  const search = await getPracticesPageAsync({ locale: "en", search: "New practice", category: "manualTherapies" });
  assert.deepEqual(search.items.map((p) => p.slug), ["nouvelle-pratique-9001"]);
  const links = await getSpecialistPractices({ specialtySlugs: ["nouvelle-pratique"] }, "fr");
  assert.deepEqual(links.map((p) => p.slug), ["nouvelle-pratique-9001"]);
});

test("detail access propagates upstream failures rather than claiming a missing practice", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  await assert.rejects(getLivePratiquesStrict("fr"), /HTTP 503/);
});
