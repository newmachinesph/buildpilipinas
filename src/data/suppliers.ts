/**
 * Supplier directory.
 *
 * One entry per distinct `seller` in listings.ts — the join is by exact name,
 * slugs are derived with the shared slugify, and each `listings` count is the
 * real number of catalogue listings referencing the supplier (tests/data.mjs
 * recounts them). `verified` here is the source of truth; a listing's badge
 * must agree with its seller.
 */

import { IMG } from "./images";
import { slugify, type Region } from "./core";

export type Supplier = {
  name: string;
  /** Derived from `name` via slugify; route param for /supplier/[slug]. */
  slug: string;
  trade: string;
  location: string;
  region: Region;
  avatar: string;
  since: number;
  /** Count of LISTINGS entries whose seller is this supplier — kept honest by the test. */
  listings: number;
  verified: boolean;
  about: string;
  deliveryAreas: string;
  paymentTerms: string;
  responseTime: string;
};

type SupplierSeed = Omit<Supplier, "slug">;

const SUPPLIER_SEED: SupplierSeed[] = [
  {
    name: "Sta. Mesa Hardware & Construction Supply",
    trade: "General hardware & cement",
    location: "Valenzuela City",
    region: "Luzon",
    avatar: IMG.avatars[0],
    since: 2018,
    listings: 2,
    verified: true,
    about:
      "Family hardware that grew into a two-warehouse operation along MacArthur Highway. Cement moves fast enough here that nothing on the floor is older than a month.",
    deliveryAreas: "Valenzuela, Malabon, Caloocan, Quezon City",
    paymentTerms: "Cash, bank transfer, platform escrow; 30-day terms for accredited contractors",
    responseTime: "Replies within ~1 hour, 7 am–6 pm",
  },
  {
    name: "Cebu Steel Center",
    trade: "Structural steel",
    location: "Mandaue City, Cebu",
    region: "Visayas",
    avatar: IMG.avatars[1],
    since: 2017,
    listings: 2,
    verified: true,
    about:
      "Mill-accredited steel yard serving Metro Cebu contractors since 2017. Every delivery leaves with mill certificates matched to heat numbers on the bundle tags.",
    deliveryAreas: "Metro Cebu; Bohol and Leyte via RoRo",
    paymentTerms: "Bank transfer or platform escrow; 50% down on orders over ₱100k",
    responseTime: "Replies within ~2 hours on working days",
  },
  {
    name: "Bulacan Lumber Yard",
    trade: "Lumber & panels",
    location: "Meycauayan, Bulacan",
    region: "Luzon",
    avatar: IMG.avatars[2],
    since: 2019,
    listings: 2,
    verified: true,
    about:
      "Plywood and formwork panels stocked under roof, counted sheet by sheet with the buyer's hauler before loading. No 'more or less' tallies.",
    deliveryAreas: "Bulacan, Metro Manila, Pampanga",
    paymentTerms: "Cash on delivery, bank transfer, platform escrow",
    responseTime: "Replies within ~3 hours",
  },
  {
    name: "JCM Builders Depot",
    trade: "Masonry supplies",
    location: "Antipolo City, Rizal",
    region: "Luzon",
    avatar: IMG.avatars[3],
    since: 2023,
    listings: 1,
    verified: false,
    about:
      "Block-making plant in Antipolo curing CHB a full 14 days before release. Newer on the platform — verification documents under review.",
    deliveryAreas: "Rizal, Marikina, Pasig",
    paymentTerms: "Cash on delivery only while verification is pending",
    responseTime: "Replies within ~5 hours",
  },
  {
    name: "Pampanga Roofing Systems",
    trade: "Roofing systems",
    location: "San Fernando, Pampanga",
    region: "Luzon",
    avatar: IMG.avatars[4],
    since: 2018,
    listings: 1,
    verified: true,
    about:
      "Roll-forming plant that cuts every order to the buyer's exact schedule — sheets arrive at final length with no site cutting and no rust-prone edges.",
    deliveryAreas: "Central Luzon, Metro Manila",
    paymentTerms: "50% down on cutting orders, balance via escrow on delivery",
    responseTime: "Replies within ~2 hours",
  },
  {
    name: "Iloilo Tile Gallery",
    trade: "Tiles & flooring",
    location: "Iloilo City",
    region: "Visayas",
    avatar: IMG.avatars[5],
    since: 2021,
    listings: 3,
    verified: true,
    about:
      "Showroom and warehouse in one compound — what's displayed is what's in stock, batch numbers reserved per order so a whole floor comes from one shade lot.",
    deliveryAreas: "Iloilo City, Oton, Pavia; Panay-wide by arrangement",
    paymentTerms: "Cash, cards in-store, platform escrow online",
    responseTime: "Replies within ~1 hour, store hours",
  },
  {
    name: "Cavite Paint & Hardware",
    trade: "Paint & finishes",
    location: "Imus, Cavite",
    region: "Luzon",
    avatar: IMG.avatars[0],
    since: 2022,
    listings: 3,
    verified: false,
    about:
      "Paint-focused hardware with in-store tinting while you wait. Coverage figures on listings are per-coat and honest — bring your square metres.",
    deliveryAreas: "Imus, Bacoor, Dasmariñas, Kawit",
    paymentTerms: "Cash on delivery, GCash, bank transfer",
    responseTime: "Replies within ~4 hours",
  },
  {
    name: "Quiapo Tool Traders",
    trade: "Power tools",
    location: "Manila",
    region: "Luzon",
    avatar: IMG.avatars[1],
    since: 2016,
    listings: 3,
    verified: true,
    about:
      "Third-generation tool counter off Raon. Six-month over-the-counter warranty on everything with a motor, and the spare parts drawer to back it up.",
    deliveryAreas: "Metro Manila same-day; nationwide by courier",
    paymentTerms: "Cash, cards, platform escrow",
    responseTime: "Replies within ~30 minutes, store hours",
  },
  {
    name: "Davao Aggregates Trading",
    trade: "Aggregates & hauling",
    location: "Davao City",
    region: "Mindanao",
    avatar: IMG.avatars[2],
    since: 2019,
    listings: 1,
    verified: true,
    about:
      "Permitted river-quarry operator with its own 6-wheeler fleet. Volume is checked against truck bed markings at the site, not back at the quarry.",
    deliveryAreas: "Davao City, Toril, Bunawan, Panabo",
    paymentTerms: "Cash on delivery, bank transfer; escrow for first-time buyers",
    responseTime: "Replies within ~2 hours",
  },
  {
    name: "Pasig Electrical Supply",
    trade: "Electrical supplies",
    location: "Pasig City",
    region: "Luzon",
    avatar: IMG.avatars[3],
    since: 2018,
    listings: 3,
    verified: true,
    about:
      "PEC-listed wire and switchgear for contractors — full-measure rolls, resistance test print-outs on request, and branch breakers sold by the schedule.",
    deliveryAreas: "Pasig, Mandaluyong, Makati; Metro-wide next-day",
    paymentTerms: "Bank transfer, platform escrow; 15-day terms for repeat contractors",
    responseTime: "Replies within ~1 hour on working days",
  },
  {
    name: "Laguna Plumbing Depot",
    trade: "Plumbing & PVC",
    location: "Calamba, Laguna",
    region: "Luzon",
    avatar: IMG.avatars[4],
    since: 2022,
    listings: 3,
    verified: false,
    about:
      "Pipe and fittings warehouse along the national highway in Calamba. Pipe is stored racked under roof — brittleness is a storage problem, and they know it.",
    deliveryAreas: "Laguna, Batangas, south Metro Manila",
    paymentTerms: "Cash on delivery, GCash",
    responseTime: "Replies within ~4 hours",
  },
  {
    name: "Metro Glass & Aluminium",
    trade: "Glass & aluminium",
    location: "Parañaque City",
    region: "Luzon",
    avatar: IMG.avatars[5],
    since: 2017,
    listings: 2,
    verified: true,
    about:
      "Fabrication shop for aluminium windows and doors — send rough opening sizes and the quote comes back with fabrication days, not a shrug.",
    deliveryAreas: "Metro Manila; installation crews available south of the Pasig",
    paymentTerms: "50% down on fabrication, balance via escrow on installation",
    responseTime: "Replies within ~3 hours",
  },
  {
    name: "Northgate Equipment Rentals",
    trade: "Equipment rental",
    location: "Caloocan City",
    region: "Luzon",
    avatar: IMG.avatars[0],
    since: 2020,
    listings: 2,
    verified: true,
    about:
      "Scaffolding and light equipment yard with load-tested, tagged stock. Damage charges follow a printed parts price list — no negotiated surprises at return.",
    deliveryAreas: "Metro Manila; pickup in Caloocan",
    paymentTerms: "Deposit plus rental via escrow; deposit released on inspected return",
    responseTime: "Replies within ~2 hours",
  },
  {
    name: "Batangas Heavy Equipment",
    trade: "Heavy equipment",
    location: "Lipa City, Batangas",
    region: "Luzon",
    avatar: IMG.avatars[1],
    since: 2015,
    listings: 2,
    verified: true,
    about:
      "Backhoes and boom trucks with operators on payroll, not per-day pickups. Rates state exactly what's covered — operator, fuel, hours — before you book.",
    deliveryAreas: "Batangas free mobilisation; Laguna, Cavite, Quezon quoted per km",
    paymentTerms: "50% booking deposit, balance via escrow at end of hire",
    responseTime: "Replies within ~3 hours",
  },
  {
    name: "Quezon Wood Traders",
    trade: "Coco lumber",
    location: "Lucena City, Quezon",
    region: "Luzon",
    avatar: IMG.avatars[2],
    since: 2023,
    listings: 1,
    verified: false,
    about:
      "Coco lumber dealer sourcing from Quezon plantations, kiln-drying on site. Bowed pieces are culled at the yard, not loaded and argued about later.",
    deliveryAreas: "Quezon province, Laguna",
    paymentTerms: "Cash on delivery",
    responseTime: "Replies within ~6 hours",
  },
  {
    name: "Baguio Woodworks",
    trade: "Doors & joinery",
    location: "Baguio City",
    region: "Luzon",
    avatar: IMG.avatars[3],
    since: 2019,
    listings: 2,
    verified: true,
    about:
      "Joinery shop working kiln-dried tanguile — panel doors, flush doors and jamb sets, crated properly for the drive down from the mountains.",
    deliveryAreas: "Metro Manila, Central Luzon, Baguio–La Trinidad",
    paymentTerms: "50% down on orders, balance via escrow on delivery",
    responseTime: "Replies within ~4 hours",
  },
  {
    name: "Cebu Builders Depot",
    trade: "General building supply",
    location: "Cebu City",
    region: "Visayas",
    avatar: IMG.avatars[4],
    since: 2018,
    listings: 4,
    verified: true,
    about:
      "One-stop yard near the port — cement, adhesives, paint and electricals landed in Cebu, priced at the Visayas index instead of Manila-plus-freight.",
    deliveryAreas: "Cebu City, Mandaue, Lapu-Lapu, Talisay",
    paymentTerms: "Cash, bank transfer, platform escrow; contractor terms on application",
    responseTime: "Replies within ~1 hour, 7 am–7 pm",
  },
  {
    name: "Negros Timber & Panel",
    trade: "Lumber & panels",
    location: "Bacolod City",
    region: "Visayas",
    avatar: IMG.avatars[5],
    since: 2020,
    listings: 1,
    verified: true,
    about:
      "Panel supplier stocking marine plywood in Bacolod so Negros builders stop paying Manila freight on every sheet.",
    deliveryAreas: "Bacolod, Talisay, Silay; Negros-wide in 2–3 days",
    paymentTerms: "Cash on delivery, bank transfer, platform escrow",
    responseTime: "Replies within ~3 hours",
  },
  {
    name: "Mindanao Steel Traders",
    trade: "Steel & rebar",
    location: "Davao City",
    region: "Mindanao",
    avatar: IMG.avatars[0],
    since: 2019,
    listings: 2,
    verified: true,
    about:
      "Rebar and tie wire ex-Davao warehouse, weighed and tagged at dispatch with scale tickets stapled to the delivery receipt.",
    deliveryAreas: "Davao City next-day; Tagum, GenSan by consolidated truck",
    paymentTerms: "Bank transfer or escrow; 50% down over ₱100k",
    responseTime: "Replies within ~2 hours on working days",
  },
  {
    name: "Northern Mindanao Roofing",
    trade: "Roofing",
    location: "Cagayan de Oro",
    region: "Mindanao",
    avatar: IMG.avatars[1],
    since: 2024,
    listings: 2,
    verified: false,
    about:
      "CDO roll-forming shop cutting rib-type to order for Misamis Oriental and Bukidnon. Recently listed — verification documents under review.",
    deliveryAreas: "Cagayan de Oro, Misamis Oriental, Bukidnon",
    paymentTerms: "Cash on delivery while verification is pending",
    responseTime: "Replies within ~5 hours",
  },
  {
    name: "Angeles Galvanized & Steel",
    trade: "Roofing & GI sheets",
    location: "Angeles City",
    region: "Luzon",
    avatar: IMG.avatars[2],
    since: 2021,
    listings: 1,
    verified: true,
    about:
      "GI sheet dealer that sells full gauge — bring a micrometer to pickup, the yard genuinely doesn't mind. Fencing and roofing stock always on hand.",
    deliveryAreas: "Angeles, Mabalacat, San Fernando; Pampanga-wide next-day",
    paymentTerms: "Cash, GCash, platform escrow",
    responseTime: "Replies within ~2 hours",
  },
  {
    name: "SafeSite PPE Supply",
    trade: "Safety gear",
    location: "Quezon City",
    region: "Luzon",
    avatar: IMG.avatars[3],
    since: 2022,
    listings: 2,
    verified: true,
    about:
      "PPE distributor stocking gear that carries a standard number, not just a colour — the difference between passing a DOLE inspection and re-buying everything.",
    deliveryAreas: "Quezon City same-day; nationwide by courier",
    paymentTerms: "Cash, cards, bank transfer, platform escrow; PO terms for corporates",
    responseTime: "Replies within ~1 hour on working days",
  },
  {
    name: "Visayas Safety Essentials",
    trade: "Safety gear",
    location: "Cebu City",
    region: "Visayas",
    avatar: IMG.avatars[4],
    since: 2023,
    listings: 1,
    verified: false,
    about:
      "Cebu-based PPE seller focused on hearing and eye protection for fabrication shops. Verification in progress.",
    deliveryAreas: "Cebu City same-day; Visayas-wide by courier",
    paymentTerms: "Cash on delivery, GCash",
    responseTime: "Replies within ~4 hours",
  },
  {
    name: "GenSan Tools & Machinery",
    trade: "Power tools & welding",
    location: "General Santos City",
    region: "Mindanao",
    avatar: IMG.avatars[5],
    since: 2020,
    listings: 2,
    verified: true,
    about:
      "Tool and welding supply serving SOCCSKSARGEN fabricators — machines on the floor, consumables and spare wheels two shelves over.",
    deliveryAreas: "General Santos same-day; SOCCSKSARGEN in 2–3 days",
    paymentTerms: "Cash, bank transfer, platform escrow",
    responseTime: "Replies within ~2 hours, store hours",
  },
];

export const SUPPLIERS: Supplier[] = SUPPLIER_SEED.map((s) => ({
  ...s,
  slug: slugify(s.name),
}));

/* ponytail: O(n) scan — two dozen suppliers, an index is more code than it saves. */
export const getSupplier = (slug: string): Supplier | undefined =>
  SUPPLIERS.find((s) => s.slug === slug);
