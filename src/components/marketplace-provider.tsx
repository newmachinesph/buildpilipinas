"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CITIES, LISTINGS, type City, type Listing } from "@/data/marketplace";

export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: "Most relevant",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  newest: "Newest first",
};

type MarketplaceState = {
  query: string;
  setQuery: (q: string) => void;
  city: City;
  setCity: (c: City) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => void;
  /** Listings matching the current query + category, in the current sort. */
  results: Listing[];
  /** Listings that deliver to the selected city's island group. */
  nearby: Listing[];
  isFiltering: boolean;
  clearFilters: () => void;
};

const MarketplaceContext = createContext<MarketplaceState | null>(null);

/** Match on title, seller, category and location so a search for "cebu" or
 *  "plywood" both land somewhere sensible. */
function matches(listing: Listing, needle: string) {
  const haystack =
    `${listing.title} ${listing.seller} ${listing.category} ${listing.location}`.toLowerCase();
  // Every whitespace-separated term must appear — "cement cebu" narrows.
  return needle
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function sortListings(listings: Listing[], sort: SortKey) {
  const copy = [...listings];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);
    default:
      return copy;
  }
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<City>(CITIES[0]);
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const trimmedQuery = query.trim();
  const isFiltering = trimmedQuery.length > 0 || category !== null;

  const results = useMemo(() => {
    const filtered = LISTINGS.filter(
      (l) =>
        (!category || l.category === category) &&
        (!trimmedQuery || matches(l, trimmedQuery)),
    );
    return sortListings(filtered, sort);
  }, [trimmedQuery, category, sort]);

  const nearby = useMemo(
    () => LISTINGS.filter((l) => l.region === city.region),
    [city],
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setCategory(null);
    setSort("relevance");
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      city,
      setCity,
      category,
      setCategory,
      sort,
      setSort,
      savedIds,
      isSaved,
      toggleSave,
      results,
      nearby,
      isFiltering,
      clearFilters,
    }),
    [
      query,
      city,
      category,
      sort,
      savedIds,
      isSaved,
      toggleSave,
      results,
      nearby,
      isFiltering,
      clearFilters,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error("useMarketplace must be used inside <MarketplaceProvider>");
  }
  return ctx;
}

/** Scroll the browse results into view — used when a filter is set from the
 *  header or the category rail, which both sit above the results. */
export function scrollToResults() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("browse")?.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}
