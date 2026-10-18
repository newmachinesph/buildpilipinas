/**
 * Static seed data for the BuildRepublic marketplace.
 *
 * Everything here is sample data written for a demo build — plausible
 * Philippine brands, cities and 2026-era price points, but not scraped from
 * any live supplier. Swap these modules for a real data source and every page
 * keeps working unchanged.
 *
 * This file is a barrel: the data outgrew one module, so it lives split by
 * domain (core, listings, suppliers, trades, prices) and re-exports here so
 * every existing `@/data/marketplace` import keeps working untouched.
 * tests/data.mjs asserts slug uniqueness and listing↔supplier integrity.
 */

export * from "./core";
export * from "./listings";
export * from "./suppliers";
export * from "./trades";
export * from "./prices";
