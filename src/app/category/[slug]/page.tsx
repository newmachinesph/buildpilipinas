import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, TrendingDown, TrendingUp } from "lucide-react";
import {
  CATEGORIES,
  PRICE_INDEX,
  PRICE_INDEX_UPDATED,
  formatPeso,
  getCategory,
  getListingsByCategory,
  getSupplier,
  type Supplier,
} from "@/data/marketplace";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CategoryListings } from "./_components/category-listings";

/* Category landing — one trade's cut of the catalogue: the live listings with
   a city filter, the price-index rows that belong to this trade, and the yards
   that actually stock it. Server-rendered except the filter. */

/* Which index materials belong to which category. Hand-kept against the seed
   data — both sides are static, and the section simply doesn't render for the
   eight categories the index doesn't track. */
const PRICE_MATERIALS: Record<string, string[]> = {
  "cement-aggregates": [
    "Portland cement, Type 1P",
    "Concrete hollow block, 4″",
    "Washed sand",
  ],
  "steel-rebar": ["Deformed bar, Grade 40, 10 mm"],
  "lumber-plywood": ["Marine plywood, 3/4″"],
  roofing: ["Pre-painted roofing, 0.40 mm"],
};

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} — BuildRepublic`,
    description: category.blurb,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const listings = getListingsByCategory(slug);

  // The yards behind this category's listings, deduped in catalogue order.
  const suppliers = [...new Set(listings.map((l) => l.supplierSlug))]
    .map(getSupplier)
    .filter((s): s is Supplier => s !== undefined);

  const priceRows = PRICE_INDEX.filter((r) =>
    (PRICE_MATERIALS[slug] ?? []).includes(r.material),
  );

  return (
    <MarketplaceProvider>
      <a
        href="#listings"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to listings
      </a>
      <SiteHeader />
      <main id="main">
        {/* ------------------------------------------------ category header */}
        <section
          aria-labelledby="category-heading"
          className="shell py-[var(--space-xl)]"
        >
          <Link
            href="/"
            className="ctl inline-flex min-h-11 items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-semibold text-flag-blue underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-flag-blue nowrap"
          >
            <ArrowLeft size={15} strokeWidth={2.5} />
            All of BuildRepublic
          </Link>

          <h1
            id="category-heading"
            className="mt-[var(--space-sm)] max-w-[16ch] text-[length:var(--text-display-s)]"
          >
            {category.name}
          </h1>

          <p className="mt-[var(--space-sm)] max-w-[58ch] text-[length:var(--text-lg)] leading-[1.55] text-ink-2">
            {category.blurb}
          </p>

          <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] text-muted">
            <span className="tnum font-display text-[length:var(--text-xl)] font-bold text-ink">
              {category.listings.toLocaleString("en-PH")}
            </span>{" "}
            active listings across Luzon, Visayas and Mindanao — every one
            quoted delivered, so the hauling fee is in the number, not a
            surprise on the truck.
          </p>
        </section>

        {/* --------------------------------------- listings with city filter */}
        <CategoryListings listings={listings} categoryName={category.name} />

        {/* ----------------------------------------------- typical prices */}
        {priceRows.length > 0 && (
          <section
            aria-labelledby="prices-heading"
            className="shell border-t border-rule py-[var(--space-2xl)]"
          >
            <div className="mb-[var(--space-md)] min-w-0">
              <h2 id="prices-heading" className="text-[length:var(--text-3xl)]">
                Typical prices this week
              </h2>
              <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
                Median asking price across active listings, by island group.
                Updated {PRICE_INDEX_UPDATED}. Sample data for this demo build.
              </p>
            </div>

            {/* Focusable region: on narrow screens the table overflows
                sideways, and a scroll container needs focus before arrow keys
                can move it. */}
            <div
              role="region"
              aria-labelledby="prices-heading"
              tabIndex={0}
              className="overflow-x-auto"
            >
              <table className="w-full min-w-[38rem] border-collapse text-left">
                <caption className="sr-only">
                  Median {category.name} prices by island group, week on week.
                </caption>
                <thead>
                  <tr className="border-b border-rule text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-muted">
                    <th scope="col" className="py-[var(--space-2xs)] font-medium">
                      Material
                    </th>
                    <th scope="col" className="py-[var(--space-2xs)] text-right font-medium">
                      Luzon
                    </th>
                    <th scope="col" className="py-[var(--space-2xs)] text-right font-medium">
                      Visayas
                    </th>
                    <th scope="col" className="py-[var(--space-2xs)] text-right font-medium">
                      Mindanao
                    </th>
                    <th scope="col" className="py-[var(--space-2xs)] text-right font-medium">
                      W/W
                    </th>
                    <th scope="col" className="font-medium">
                      <span className="sr-only">Unit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[length:var(--text-sm)]">
                  {priceRows.map((r) => {
                    const up = r.change > 0;
                    const flat = r.change === 0;
                    return (
                      <tr key={r.material} className="border-b border-rule-2">
                        <th
                          scope="row"
                          className="py-[var(--space-xs)] pr-[var(--space-sm)] font-body text-[length:var(--text-base)] font-medium"
                        >
                          {r.material}
                        </th>
                        <td className="tnum py-[var(--space-xs)] text-right">
                          {formatPeso(r.luzon)}
                        </td>
                        <td className="tnum py-[var(--space-xs)] text-right text-ink-2">
                          {formatPeso(r.visayas)}
                        </td>
                        <td className="tnum py-[var(--space-xs)] text-right text-ink-2">
                          {formatPeso(r.mindanao)}
                        </td>
                        <td className="py-[var(--space-xs)] text-right">
                          <span
                            className={`tnum inline-flex items-center justify-end gap-[var(--space-3xs)] nowrap ${
                              flat
                                ? "text-muted"
                                : up
                                  ? "text-flag-red"
                                  : "text-flag-blue"
                            }`}
                          >
                            {!flat &&
                              (up ? (
                                <TrendingUp size={13} strokeWidth={2.25} />
                              ) : (
                                <TrendingDown size={13} strokeWidth={2.25} />
                              ))}
                            {flat
                              ? "—"
                              : `${up ? "+" : ""}${r.change.toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="py-[var(--space-xs)] pl-[var(--space-sm)] text-[length:var(--text-xs)] text-muted nowrap">
                          {r.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------ suppliers */}
        <section
          aria-labelledby="suppliers-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <div className="mb-[var(--space-md)] min-w-0">
            <h2 id="suppliers-heading" className="text-[length:var(--text-3xl)]">
              Who sells it
            </h2>
            <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
              Every yard with live {category.name.toLowerCase()} stock on the
              platform right now.
            </p>
          </div>

          <ul className="rail rail-bleed auto-cols-[16rem] gap-[var(--space-sm)] sm:auto-cols-[19rem]">
            {suppliers.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/supplier/${s.slug}`}
                  className="flex h-full items-center gap-[var(--space-xs)] rounded-md border border-rule bg-paper-2 p-[var(--space-xs)] transition-colors duration-[var(--dur-short)] hover:border-ink"
                >
                  <Image
                    src={s.avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-base)] font-semibold">
                      <span className="truncate">{s.name}</span>
                      {s.verified && (
                        <BadgeCheck
                          size={14}
                          strokeWidth={2.25}
                          className="shrink-0 text-flag-blue"
                          aria-label="Verified"
                        />
                      )}
                    </p>
                    <p className="truncate text-[length:var(--text-sm)] text-ink-2">
                      {s.trade}
                    </p>
                    <p className="tnum mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
                      {s.location} · {s.listings}{" "}
                      {s.listings === 1 ? "listing" : "listings"} · since{" "}
                      {s.since}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
