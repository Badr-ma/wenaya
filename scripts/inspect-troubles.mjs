const BASE = "https://dev-api.wenaya.com";

async function main() {
  const listRes = await fetch(`${BASE}/api/v1/getAllPublicTroubles?page=1`);
  const listJson = await listRes.json();
  const all = listJson.data.data;
  console.log(`TOTAL: ${all.length}`);
  for (const t of all) {
    const d = t.details ?? "";
    const c = t.causes ?? "";
    console.log("=".repeat(80));
    console.log(`id=${t.id} slug=${t.slug}`);
    console.log(`name: ${t.name}`);
    console.log(`description(${d.length}): ${JSON.stringify(t.description)}`);
    console.log(`details(${d.length}): ${JSON.stringify(d)}`);
    console.log(`causes(${c.length}): ${JSON.stringify(c)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
