import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  MapPin,
  Truck,
} from "lucide-react";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ListingCard } from "@/components/listing-card";
import {
  LISTINGS,
  formatPeso,
  getListing,
  getListingsByCategory,
  getListingsBySupplier,
  getSupplier,
  slugify,
  type Listing,
  type StockState,
} from "@/data/marketplace";

/* Listing detail — the split diptych again: photo plate left, the buying
   facts right, everything below is depth (description, specs, more stock).
   Server Component throughout; the only hydration is what SiteHeader and
   ListingCard already carry via MarketplaceProvider. */

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return { title: "Listing not found — BuildRepublic" };
  return {
    title: `${listing.title} — ${formatPeso(listing.price)} ${listing.unit} | BuildRepublic`,
    description: `${listing.description} Sold by ${listing.seller}, ${listing.location}.`,
  };
}

/* Stock reads as a signal, not a paragraph: red = urgency (matches the card
   badge), everything else stays ink. */
const STOCK_DOT: Record<StockState, string> = {
  "In stock": "bg-ink",
  "Low stock": "bg-flag-red",
  "By order": "bg-muted",
};
const STOCK_TEXT: Record<StockState, string> = {
  "In stock": "text-ink",
  "Low stock": "text-flag-red",
  "By order": "text-ink-2",
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();

  const supplier = getSupplier(listing.supplierSlug);
  const categorySlug = slugify(listing.category);
  const fromSupplier = getListingsBySupplier(listing.supplierSlug).filter(
    (l) => l.id !== listing.id,
  );
  /* "Similar" = same shelf, different yard — listings already shown in the
     supplier strip would just repeat one card up. */
  const supplierIds = new Set(fromSupplier.map((l) => l.id));
  const similar = getListingsByCategory(categorySlug).filter(
    (l) => l.id !== listing.id && !supplierIds.has(l.id),
  );

  return (
    <MarketplaceProvider>
      <a
        href="#listing"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to listing
      </a>
      <SiteHeader />

      <main id="main">
        <nav aria-label="Breadcrumb" className="shell pt-[var(--space-md)]">
          <ol className="flex flex-wrap items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] text-muted">
            <li>
              <Link
                href="/"
                className="transition-colors duration-[var(--dur-short)] hover:text-ink"
              >
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={13} strokeWidth={2} />
            </li>
            <li>
              <Link
                href={`/category/${categorySlug}`}
                className="transition-colors duration-[var(--dur-short)] hover:text-ink nowrap"
              >
                {listing.category}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight size={13} strokeWidth={2} />
            </li>
            <li aria-current="page" className="truncate font-medium text-ink-2">
              {listing.title}
            </li>
          </ol>
        </nav>

        <article
          id="listing"
          className="shell grid gap-[var(--space-lg)] pb-[var(--space-xl)] pt-[var(--space-md)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[var(--space-2xl)]"
        >
          {/* Photo plate — the page's LCP, so it loads eagerly at high
              priority; every other image on the page stays lazy. */}
          <div className="relative aspect-4/3 min-w-0 overflow-hidden rounded-lg bg-paper-3">
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
            {listing.badge && (
              <span
                className={`absolute left-[var(--space-xs)] top-[var(--space-xs)] rounded-xs px-[var(--space-2xs)] py-[var(--space-4xs)] text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.06em] nowrap ${
                  listing.badge === "Low stock"
                    ? "bg-flag-red text-on-ink"
                    : "bg-accent text-accent-ink"
                }`}
              >
                {listing.badge}
              </span>
            )}
          </div>

          {/* The buying facts, in the order a foreman asks for them:
              what, how much, is there any, where from, who's selling. */}
          <div className="flex min-w-0 flex-col gap-[var(--space-sm)]">
            <div>
              <h1 className="text-[length:var(--text-3xl)]">{listing.title}</h1>
              <p className="mt-[var(--space-2xs)] flex items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] text-muted">
                <MapPin size={13} strokeWidth={2} className="shrink-0" />
                <span className="truncate">{listing.location}</span>
                <span aria-hidden>·</span>
                <span className="nowrap">{listing.posted}</span>
              </p>
            </div>

            <p className="flex items-baseline gap-[var(--space-2xs)]">
              <span className="tnum font-display text-[length:var(--text-4xl)] font-extrabold tracking-[-0.03em]">
                {formatPeso(listing.price)}
              </span>
              <span className="text-[length:var(--text-base)] text-muted">
                {listing.unit}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-x-[var(--space-md)] gap-y-[var(--space-2xs)]">
              <p
                className={`flex items-center gap-[var(--space-2xs)] text-[length:var(--text-sm)] font-semibold nowrap ${STOCK_TEXT[listing.stock]}`}
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${STOCK_DOT[listing.stock]}`}
                />
                {listing.stock}
              </p>
              {listing.moq && (
                <p className="text-[length:var(--text-sm)] text-ink-2 nowrap">
                  Minimum order {listing.moq}
                </p>
              )}
            </div>

            <div className="rounded-md border border-rule bg-paper-2 p-[var(--space-sm)]">
              <p className="flex items-center gap-[var(--space-2xs)] text-[length:var(--text-sm)] font-semibold">
                <Truck size={15} strokeWidth={2.25} className="shrink-0" />
                Delivery &amp; lead time
              </p>
              <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[1.6] text-ink-2">
                {listing.delivery}
              </p>
            </div>

            {/* Seller block — the whole plate is the link to the yard. */}
            {supplier ? (
              <Link
                href={`/supplier/${supplier.slug}`}
                className="group flex items-center gap-[var(--space-xs)] rounded-md border border-rule bg-paper-2 p-[var(--space-xs)] transition-colors duration-[var(--dur-short)] hover:border-ink"
              >
                <Image
                  src={supplier.avatar}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-base)] font-semibold">
                    <span className="truncate">{supplier.name}</span>
                    {supplier.verified && (
                      <BadgeCheck
                        size={14}
                        strokeWidth={2.25}
                        className="shrink-0 text-flag-blue"
                        aria-label="Verified supplier"
                      />
                    )}
                  </p>
                  <p className="truncate text-[length:var(--text-sm)] text-ink-2">
                    {supplier.trade} · since {supplier.since}
                  </p>
                  <p className="mt-[var(--space-4xs)] truncate text-[length:var(--text-xs)] text-muted">
                    {supplier.responseTime}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="shrink-0 text-muted transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] group-hover:translate-x-[var(--space-3xs)] group-hover:text-ink"
                />
              </Link>
            ) : (
              /* The data test enforces this join — but a page should degrade,
                 not 500, if a seed edit ever breaks it. */
              <p className="text-[length:var(--text-sm)] text-ink-2">
                Sold by {listing.seller}
              </p>
            )}
          </div>
        </article>

        <section
          aria-labelledby="about-heading"
          className="shell border-t border-rule py-[var(--space-xl)]"
        >
          <div className="grid gap-[var(--space-lg)] md:grid-cols-2 md:gap-[var(--space-2xl)]">
            <div className="min-w-0">
              <h2 id="about-heading" className="text-[length:var(--text-2xl)]">
                About this listing
              </h2>
              <p className="mt-[var(--space-sm)] max-w-[58ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                {listing.description}
              </p>
            </div>

            <div className="min-w-0">
              <h2 className="text-[length:var(--text-2xl)]">Specifications</h2>
              <table className="mt-[var(--space-sm)] w-full border-collapse text-[length:var(--text-sm)]">
                <tbody>
                  {listing.specs.map((row) => (
                    <tr key={row.label} className="border-b border-rule-2">
                      <th
                        scope="row"
                        className="w-2/5 py-[var(--space-2xs)] pr-[var(--space-sm)] text-left align-top font-medium text-muted"
                      >
                        {row.label}
                      </th>
                      <td className="py-[var(--space-2xs)] align-top">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {fromSupplier.length > 0 && (
          <ListingStrip
            id="supplier-strip"
            title={`More from ${listing.seller}`}
            href={`/supplier/${listing.supplierSlug}`}
            linkLabel="Visit the yard"
            listings={fromSupplier}
          />
        )}

        {similar.length > 0 && (
          <ListingStrip
            id="similar-strip"
            title={`Similar in ${listing.category}`}
            href={`/category/${categorySlug}`}
            linkLabel={`All ${listing.category}`}
            listings={similar}
          />
        )}
      </main>

      <SiteFooter />
    </MarketplaceProvider>
  );
}

/* -------------------------------------------------------------- strips --- */

function ListingStrip({
  id,
  title,
  href,
  linkLabel,
  listings,
}: {
  id: string;
  title: string;
  href: string;
  linkLabel: string;
  listings: Listing[];
}) {
  return (
    <section
      aria-labelledby={id}
      className="shell border-t border-rule py-[var(--space-xl)]"
    >
      <div className="mb-[var(--space-md)] flex flex-col gap-[var(--space-2xs)] sm:flex-row sm:items-end sm:justify-between sm:gap-[var(--space-md)]">
        <h2 id={id} className="min-w-0 text-[length:var(--text-2xl)]">
          {title}
        </h2>
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-semibold text-flag-blue underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-flag-blue nowrap"
        >
          {linkLabel}
          <ArrowRight
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] group-hover:translate-x-[var(--space-3xs)]"
          />
        </Link>
      </div>

      <ul className="rail rail-bleed auto-cols-[15rem] gap-[var(--space-sm)] sm:auto-cols-[17rem]">
        {listings.map((l) => (
          <li key={l.id}>
            <ListingCard listing={l} />
          </li>
        ))}
      </ul>
    </section>
  );
}
