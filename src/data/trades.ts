/**
 * Trades directory — credentialled roles plus a few named workers per role so
 * /trades has people to list, not just rate rows. Rates are quoted ranges,
 * the same numbers crews actually give, not lead-gen teasers.
 */

import type { Region } from "./core";

export type TradeWorker = {
  name: string;
  area: string;
  years: number;
};

export type Trade = {
  role: string;
  rate: string;
  basis: string;
  credential: string;
  /** Registry that issued the credential — drives the "verified against" line. */
  credentialBody: "TESDA" | "PRC";
  /** What the quoted rate actually includes, so bids are comparable. */
  covers: string;
  /** Typical crew a booking brings, because a kantero rarely arrives alone. */
  crewSize: string;
  areas: string;
  region: Region;
  available: number;
  workers: TradeWorker[];
};

export const TRADES: Trade[] = [
  {
    role: "Mason (kantero)",
    rate: "₱950 – ₱1,200",
    basis: "per day",
    credential: "TESDA NC II",
    credentialBody: "TESDA",
    covers: "Labour and hand tools; CHB laying, plastering and finishing. Materials and scaffolding by the client.",
    crewSize: "Usually books with 1–2 helpers (peon) at ₱650/day each",
    areas: "Metro Manila · Rizal",
    region: "Luzon",
    available: 214,
    workers: [
      { name: "Edgardo Ramos", area: "Marikina · Antipolo", years: 18 },
      { name: "Joel Cabrera", area: "Quezon City", years: 11 },
      { name: "Marlon Sta. Ana", area: "Pasig · Cainta", years: 7 },
    ],
  },
  {
    role: "Electrician",
    rate: "₱1,400 – ₱1,800",
    basis: "per day",
    credential: "PRC Registered Master Electrician",
    credentialBody: "PRC",
    covers: "Roughing-in, wire pulling, panel termination and testing. Sign-off on as-built plans quoted separately.",
    crewSize: "Solo for service work; with 1 apprentice on roughing-in",
    areas: "Metro Manila · Cavite",
    region: "Luzon",
    available: 88,
    workers: [
      { name: "Arnel Buenaventura", area: "Makati · Taguig", years: 15 },
      { name: "Christian Yap", area: "Bacoor · Imus", years: 9 },
      { name: "Rodel Villanueva", area: "Quezon City · Caloocan", years: 12 },
    ],
  },
  {
    role: "Welder, 6G pipe",
    rate: "₱1,600 – ₱2,100",
    basis: "per day",
    credential: "TESDA NC III / PCAB",
    credentialBody: "TESDA",
    covers: "SMAW/GTAW pipe welding to 6G position; consumables by the client. X-ray-passing rate on request.",
    crewSize: "Solo, or with a fitter on spool work",
    areas: "Batangas · Laguna",
    region: "Luzon",
    available: 41,
    workers: [
      { name: "Renato Malabanan", area: "Batangas City · Bauan", years: 21 },
      { name: "Jayson Aquino", area: "Calamba · Sta. Rosa", years: 8 },
      { name: "Diosdado Perez", area: "Lipa · Tanauan", years: 14 },
    ],
  },
  {
    role: "Plumber",
    rate: "₱1,100 – ₱1,400",
    basis: "per day",
    credential: "TESDA NC II",
    credentialBody: "TESDA",
    covers: "Sanitary and waterline roughing-in, fixture setting, pressure testing. Fittings and pipe by the client.",
    crewSize: "Usually solo; with a helper on multi-storey risers",
    areas: "Metro Manila",
    region: "Luzon",
    available: 129,
    workers: [
      { name: "Bernardo Dizon", area: "Manila · San Juan", years: 16 },
      { name: "Alvin Soriano", area: "Parañaque · Las Piñas", years: 10 },
      { name: "Erwin Magpantay", area: "Mandaluyong · Pasig", years: 6 },
    ],
  },
  {
    role: "Tile setter",
    rate: "₱110 – ₱150",
    basis: "per sq.m",
    credential: "TESDA NC II",
    credentialBody: "TESDA",
    covers: "Setting, grouting and edge trims per finished square metre; layout day charged as a day rate. Adhesive by the client.",
    crewSize: "Pairs — setter plus mixer/helper",
    areas: "Cebu · Bohol",
    region: "Visayas",
    available: 63,
    workers: [
      { name: "Nonoy Alcordo", area: "Cebu City · Talisay", years: 13 },
      { name: "Ramil Godinez", area: "Lapu-Lapu · Mandaue", years: 9 },
      { name: "Felix Torremocha", area: "Tagbilaran", years: 17 },
    ],
  },
  {
    role: "Backhoe operator",
    rate: "₱1,800 – ₱2,400",
    basis: "per day",
    credential: "TESDA NC II, with unit",
    credentialBody: "TESDA",
    covers: "Operator with heavy-equipment NC II; unit, fuel and mobilisation quoted by the rental yard separately.",
    crewSize: "Operator plus spotter on tight sites",
    areas: "Bulacan · Pampanga",
    region: "Luzon",
    available: 27,
    workers: [
      { name: "Larry Manansala", area: "San Fernando · Angeles", years: 19 },
      { name: "Roberto Gatchalian", area: "Malolos · Meycauayan", years: 12 },
      { name: "Dennis Pineda", area: "Guagua · Lubao", years: 8 },
    ],
  },
  {
    role: "Steel fixer",
    rate: "₱1,000 – ₱1,300",
    basis: "per day",
    credential: "TESDA NC II",
    credentialBody: "TESDA",
    covers: "Cutting, bending and tying rebar to bar schedules; tie wire and cutters on hand. Bar bender machine by the client.",
    crewSize: "Crews of 3–4 on footing and column work",
    areas: "Davao · Gen. Santos",
    region: "Mindanao",
    available: 34,
    workers: [
      { name: "Samuel Bacaltos", area: "Davao City · Panabo", years: 15 },
      { name: "Jun Rey Omandam", area: "General Santos", years: 7 },
      { name: "Antonio Lumapas", area: "Tagum · Carmen", years: 11 },
    ],
  },
];
