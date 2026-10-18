/**
 * Shared primitives for the seed data — the peso formatter, the slug rule,
 * regions and cities. Lives in its own module so listings, suppliers and
 * trades can all import it without going through the marketplace barrel
 * (which re-exports them — importing the barrel back would be circular).
 */

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export const formatPeso = (value: number) => peso.format(value);

/**
 * One slug rule for every route param. Category and supplier slugs are
 * derived from display names with this, never hand-typed, so a renamed
 * supplier can't silently orphan its listings. tests/data.mjs asserts
 * uniqueness of everything derived from it.
 */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type Region = "Luzon" | "Visayas" | "Mindanao";

/* ------------------------------------------------------------- locations --- */

export type City = { name: string; region: Region };

export const CITIES: City[] = [
  { name: "Quezon City", region: "Luzon" },
  { name: "Manila", region: "Luzon" },
  { name: "Angeles City", region: "Luzon" },
  { name: "Cebu City", region: "Visayas" },
  { name: "Iloilo City", region: "Visayas" },
  { name: "Davao City", region: "Mindanao" },
  { name: "Cagayan de Oro", region: "Mindanao" },
];

/* ------------------------------------------------------------ how it works */

export const STEPS = [
  {
    n: "01",
    title: "Search by material, not by shop",
    body: "One query returns every supplier within your delivery radius that actually has the item on hand — with the unit price, the minimum order and the lead time already on the card.",
  },
  {
    n: "02",
    title: "Compare the landed cost",
    body: "Hauling is most of the bill on aggregates and steel. Every quote shows the delivered price to your barangay, so ₱285 in Valenzuela and ₱311 in Davao are finally comparable.",
  },
  {
    n: "03",
    title: "Pay on release, not on promise",
    body: "Funds sit in escrow until your site foreman confirms the delivery count. Disputes go to a human within one working day — no chargeback maze.",
  },
];
