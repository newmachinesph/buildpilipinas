/**
 * Seed-data integrity check. Run: node tests/data.mjs
 *
 * Plain node + assert, no framework. Uses Node's native TypeScript type
 * stripping (Node >= 22.18); the registerHooks shim below resolves the
 * extensionless relative imports the bundler normally handles.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (specifier.startsWith(".") && !specifier.endsWith(".ts")) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});

const {
  CATEGORIES,
  LISTINGS,
  SUPPLIERS,
  TRADES,
  PRICE_INDEX,
  slugify,
  getListing,
  getCategory,
  getSupplier,
  getListingsByCategory,
  getListingsBySupplier,
} = await import("../src/data/marketplace.ts");

const uniq = (arr, label) => {
  const dupes = arr.filter((v, i) => arr.indexOf(v) !== i);
  assert.equal(dupes.length, 0, `duplicate ${label}: ${dupes.join(", ")}`);
};

/* --- slug uniqueness and shape ------------------------------------------- */
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
uniq(CATEGORIES.map((c) => c.slug), "category slugs");
uniq(SUPPLIERS.map((s) => s.slug), "supplier slugs");
uniq(SUPPLIERS.map((s) => s.name), "supplier names");
uniq(LISTINGS.map((l) => l.id), "listing ids");
for (const slug of [...CATEGORIES.map((c) => c.slug), ...SUPPLIERS.map((s) => s.slug)]) {
  assert.match(slug, kebab, `slug not kebab-case: ${slug}`);
}

/* --- listing -> supplier referential integrity ---------------------------- */
const supplierByName = new Map(SUPPLIERS.map((s) => [s.name, s]));
for (const l of LISTINGS) {
  const s = supplierByName.get(l.seller);
  assert.ok(s, `listing ${l.id}: seller "${l.seller}" has no Supplier entry`);
  assert.equal(l.supplierSlug, s.slug, `listing ${l.id}: supplierSlug mismatch`);
  assert.equal(
    l.verified,
    s.verified,
    `listing ${l.id}: verified flag disagrees with supplier "${s.name}"`,
  );
  assert.ok(l.description.length > 0, `listing ${l.id}: empty description`);
  assert.ok(l.specs.length >= 2, `listing ${l.id}: needs at least 2 spec rows`);
}

/* --- supplier listing counts match reality -------------------------------- */
for (const s of SUPPLIERS) {
  const actual = LISTINGS.filter((l) => l.seller === s.name).length;
  assert.equal(
    s.listings,
    actual,
    `supplier "${s.name}": listings=${s.listings} but catalogue has ${actual}`,
  );
  assert.ok(actual > 0, `supplier "${s.name}" has no listings`);
}

/* --- every category has at least one listing ------------------------------ */
const categoryNames = new Set(CATEGORIES.map((c) => c.name));
for (const c of CATEGORIES) {
  const n = LISTINGS.filter((l) => l.category === c.name).length;
  assert.ok(n >= 1, `category "${c.name}" has no listings`);
}
for (const l of LISTINGS) {
  assert.ok(categoryNames.has(l.category), `listing ${l.id}: unknown category "${l.category}"`);
}

/* --- lookup helpers -------------------------------------------------------- */
assert.equal(getListing("l-cement-40")?.seller, "Sta. Mesa Hardware & Construction Supply");
assert.equal(getCategory("safety-gear")?.name, "Safety Gear");
assert.equal(getSupplier(slugify("Cebu Builders Depot"))?.name, "Cebu Builders Depot");
assert.equal(getListingsBySupplier("cebu-builders-depot").length, 4);
assert.ok(getListingsByCategory("cement-aggregates").length >= 4);
assert.equal(getListing("no-such-id"), undefined);

/* --- trades and price history ---------------------------------------------- */
for (const t of TRADES) {
  assert.ok(t.workers.length >= 3, `trade "${t.role}": needs named workers`);
  assert.ok(t.covers.length > 0 && t.crewSize.length > 0, `trade "${t.role}": missing detail`);
}
for (const r of PRICE_INDEX) {
  assert.ok(
    r.history.length >= 8 && r.history.length <= 12,
    `price row "${r.material}": history must be 8–12 weeks, got ${r.history.length}`,
  );
}

console.log(
  `ok — ${LISTINGS.length} listings, ${SUPPLIERS.length} suppliers, ` +
    `${CATEGORIES.length} categories, ${TRADES.length} trades, ${PRICE_INDEX.length} price rows`,
);
