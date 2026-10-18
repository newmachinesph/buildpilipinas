import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, X } from "lucide-react";
import {
  CATEGORIES,
  CITIES,
  LISTINGS,
  slugify,
  type Listing,
} from "@/data/marketplace";
import { ListingCard } from "@/components/listing-card";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BrowseFilters } from "./_components/browse-filters";
import {
  browseHref,
  isSortOrder,
  type SortOrder,
} from "./_components/browse-params";

/* Listing index — the "See all" target behind every homepage rail. The URL is
   the state: ?category, ?city and ?sort are parsed here on the server, so a
   filtered view is shareable and the grid ships as plain HTML. The only
   client code on the page is the three filter menus.

   City filtering follows the homepage's "near you" semantics: a city selects
   its island group, because what matters on aggregates and steel is whether a
   yard can actually truck to you — not whether it shares your city hall. */

export const metadata: Metadata = {
  title: "Browse listings — BuildRepublic",
  description:
    "Every listing on the shelf — filter by trade and city, sort by price or recency.",
};

function sortListings(listings: Listing[], sort: SortOrder) {
  const copy = [...listings];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    default:
      return copy.sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);
  }
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  // Unknown values fall back to unfiltered rather than 404 — a mistyped
  // shared URL should still land somewhere useful.
  const category =
    CATEGORIES.find((c) => c.slug === first(sp.category)) ?? null;
  const city =
    CITIES.find((c) => slugify(c.name) === first(sp.city)) ?? null;
  const sortParam = first(sp.sort);
  const sort: SortOrder = isSortOrder(sortParam) ? sortParam : "newest";

  const results = sortListings(
    LISTINGS.filter(
      (l) =>
        (!category || l.category === category.name) &&
        (!city || l.region === city.region),
    ),
    sort,
  );

  const citySlug = city ? slugify(city.name) : null;
  const isFiltering = category !== null || city !== null;

  const count = `${results.length} ${results.length === 1 ? "listing" : "listings"}`;
  const scope = [
    category?.name,
    city ? `stocked in ${city.region}, delivers to ${city.name}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const note = scope
    ? `${count} · ${scope}`
    : `${count} — every yard on the shelf.`;

  return (
    <MarketplaceProvider>
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to listings
      </a>
      <SiteHeader />
      <main id="main">
        <section
          id="results"
          aria-labelledby="results-heading"
          className="shell scroll-mt-[9rem] py-[var(--space-xl)]"
        >
          <div className="mb-[var(--space-md)] flex flex-col gap-[var(--space-2xs)] sm:flex-row sm:items-end sm:justify-between sm:gap-[var(--space-md)]">
            <div className="min-w-0">
              <h1
                id="results-heading"
                className="text-[length:var(--text-3xl)]"
              >
                Browse listings
              </h1>
              <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
                {note}
              </p>
            </div>
            <div className="shrink-0">
              <BrowseFilters category={category?.slug ?? null} city={citySlug} sort={sort} />
            </div>
          </div>

          {/* Active filters — visible, each individually removable by link,
              so removal works before a single byte of JS arrives. */}
          {isFiltering && (
            <div className="mb-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-2xs)]">
              {category && (
                <RemoveChip
                  label={category.name}
                  href={browseHref({ city: citySlug, sort })}
                />
              )}
              {city && (
                <RemoveChip
                  label={city.name}
                  href={browseHref({ category: category?.slug, sort })}
                />
              )}
              <Link
                href="/browse"
                className="ctl text-[length:var(--text-sm)] font-semibold text-flag-red underline decoration-rule underline-offset-4 nowrap"
              >
                Clear all
              </Link>
            </div>
          )}

          {results.length > 0 ? (
            <ul className="grid grid-cols-2 gap-[var(--space-sm)] lg:grid-cols-4">
              {results.map((l, i) => (
                <li key={l.id} className="min-w-0">
                  <ListingCard listing={l} priority={i < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-[var(--space-sm)] rounded-md border border-dashed border-rule bg-paper-2 p-[var(--space-lg)]">
              <SearchX size={24} strokeWidth={1.75} className="text-muted" />
              <p className="text-[length:var(--text-lg)] font-semibold">
                Nothing on the shelf for that combination yet.
              </p>
              <p className="max-w-[52ch] text-[length:var(--text-base)] text-ink-2">
                {category && city
                  ? `No ${category.name} listings stocked in ${city.region} right now — suppliers post daily, or widen the net.`
                  : "Suppliers post daily — try again later, or widen the net."}
              </p>
              <Link
                href="/browse"
                className="ctl inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap"
              >
                Show all {LISTINGS.length} listings
              </Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}

/* Chip whose whole surface is a link to the same URL minus this filter —
   the server-side sibling of the homepage's client FilterChip. */
function RemoveChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      aria-label={`Remove filter ${label}`}
      className="ctl inline-flex items-center gap-[var(--space-3xs)] rounded-full border border-rule bg-paper-2 py-[var(--space-3xs)] pl-[var(--space-xs)] pr-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium transition-colors duration-[var(--dur-short)] hover:border-ink nowrap"
    >
      {label}
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full text-muted"
      >
        <X size={12} strokeWidth={2.5} />
      </span>
    </Link>
  );
}
