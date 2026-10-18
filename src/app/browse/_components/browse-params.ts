/* One source of truth for /browse's URL grammar — the server page parses with
   it and the client filter leaf writes with it, so the two can't drift. */

export type SortOrder = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function isSortOrder(v: string | undefined): v is SortOrder {
  return SORT_OPTIONS.some((o) => o.value === v);
}

/** Build a /browse URL, omitting defaults so the bare index stays `/browse`. */
export function browseHref(q: {
  category?: string | null;
  city?: string | null;
  sort?: SortOrder;
}) {
  const params = new URLSearchParams();
  if (q.category) params.set("category", q.category);
  if (q.city) params.set("city", q.city);
  if (q.sort && q.sort !== "newest") params.set("sort", q.sort);
  const qs = params.toString();
  return qs ? `/browse?${qs}` : "/browse";
}
