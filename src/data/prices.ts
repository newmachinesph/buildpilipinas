/**
 * Material price index — regional spot prices plus a short weekly history so
 * the /price-index page can draw a trend instead of a single number.
 */

export type PriceRow = {
  material: string;
  unit: string;
  luzon: number;
  visayas: number;
  mindanao: number;
  /** Week-on-week move as a percentage. */
  change: number;
  /**
   * Prior 10 weekly Luzon quotes, oldest first. The current `luzon` value is
   * the 11th point — append it when charting. One region's history is enough
   * for a trend line; the regional spread is already in the columns.
   */
  history: number[];
};

/** When the index was last refreshed — the Friday close before the current week. */
export const PRICE_INDEX_UPDATED = "17 July 2026";

export const PRICE_INDEX: PriceRow[] = [
  {
    material: "Portland cement, Type 1P",
    unit: "40 kg bag",
    luzon: 285,
    visayas: 302,
    mindanao: 311,
    change: 0.7,
    history: [272, 274, 273, 276, 278, 277, 280, 281, 283, 283],
  },
  {
    material: "Deformed bar, Grade 40, 10 mm",
    unit: "6 m length",
    luzon: 178,
    visayas: 186,
    mindanao: 194,
    change: -1.2,
    history: [183, 184, 186, 185, 183, 182, 181, 182, 181, 180],
  },
  {
    material: "Marine plywood, 3/4″",
    unit: "4 × 8 sheet",
    luzon: 1450,
    visayas: 1520,
    mindanao: 1585,
    change: 2.1,
    history: [1370, 1375, 1380, 1390, 1385, 1395, 1400, 1410, 1415, 1420],
  },
  {
    material: "Concrete hollow block, 4″",
    unit: "piece",
    luzon: 18,
    visayas: 17,
    mindanao: 19,
    change: 0,
    history: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18],
  },
  {
    material: "Washed sand",
    unit: "cubic metre",
    luzon: 1250,
    visayas: 1180,
    mindanao: 1090,
    change: -0.4,
    history: [1270, 1265, 1268, 1262, 1260, 1258, 1260, 1256, 1258, 1255],
  },
  {
    material: "Pre-painted roofing, 0.40 mm",
    unit: "linear metre",
    luzon: 285,
    visayas: 298,
    mindanao: 305,
    change: 1.4,
    history: [270, 271, 273, 272, 274, 276, 277, 278, 280, 281],
  },
];
