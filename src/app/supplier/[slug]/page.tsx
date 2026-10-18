import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  Truck,
  Wallet,
} from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getListingsBySupplier, getSupplier, SUPPLIERS } from "@/data/marketplace";

/* Supplier profile — the yard's own page: who they are, where they haul,
   how they take payment, and everything they currently list. Fully static;
   MarketplaceProvider is only here because SiteHeader and ListingCard read it. */

export function generateStaticParams() {
  return SUPPLIERS.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) return { title: "Supplier not found — BuildRepublic" };
  return {
    title: `${supplier.name} — supplier in ${supplier.location} | BuildRepublic`,
    description: `${supplier.trade} in ${supplier.location}, on BuildRepublic since ${supplier.since}. ${supplier.about}`,
  };
}

export default async function SupplierProfilePage({ params }: Props) {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) notFound();

  const listings = getListingsBySupplier(slug);

  const facts = [
    { icon: Truck, label: "Delivers to", value: supplier.deliveryAreas },
    { icon: Wallet, label: "Payment", value: supplier.paymentTerms },
    { icon: Clock, label: "Response time", value: supplier.responseTime },
  ];

  return (
    <MarketplaceProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <section
          aria-labelledby="supplier-heading"
          className="shell py-[var(--space-xl)]"
        >
          <Link
            href="/suppliers"
            className="group mb-[var(--space-md)] inline-flex items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-semibold text-flag-blue underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-flag-blue nowrap"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2.5}
              className="transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] group-hover:-translate-x-[var(--space-3xs)]"
            />
            All suppliers
          </Link>

          <div className="flex flex-col gap-[var(--space-md)] sm:flex-row sm:items-start">
            <Image
              src={supplier.avatar}
              alt=""
              width={96}
              height={96}
              loading="eager"
              fetchPriority="high"
              className="size-24 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <h1
                id="supplier-heading"
                className="text-[length:var(--text-3xl)]"
              >
                {supplier.name}
              </h1>
              <p className="mt-[var(--space-2xs)] flex flex-wrap items-center gap-x-[var(--space-xs)] gap-y-[var(--space-4xs)] text-[length:var(--text-sm)] text-ink-2">
                {supplier.verified ? (
                  <span className="inline-flex items-center gap-[var(--space-3xs)] font-semibold text-flag-blue nowrap">
                    <BadgeCheck size={15} strokeWidth={2.25} aria-hidden />
                    Verified supplier
                  </span>
                ) : (
                  <span className="font-semibold text-flag-red nowrap">
                    Verification pending
                  </span>
                )}
                <span>{supplier.trade}</span>
                <span className="inline-flex items-center gap-[var(--space-3xs)] nowrap">
                  <MapPin size={13} strokeWidth={2} aria-hidden />
                  {supplier.location}
                </span>
                <span className="tnum nowrap">
                  On the platform since {supplier.since}
                </span>
              </p>
              <p className="mt-[var(--space-sm)] max-w-[62ch] text-[length:var(--text-base)] text-ink-2">
                {supplier.about}
              </p>
            </div>
          </div>

          <dl className="mt-[var(--space-lg)] grid gap-[var(--space-sm)] sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-md border border-rule bg-paper-2 p-[var(--space-sm)]"
              >
                <dt className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-muted">
                  <Icon size={14} strokeWidth={2} aria-hidden />
                  {label}
                </dt>
                <dd className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] text-ink-2">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="supplier-listings"
          className="shell border-t border-rule py-[var(--space-xl)]"
        >
          <div className="mb-[var(--space-md)]">
            <h2
              id="supplier-listings"
              className="text-[length:var(--text-3xl)]"
            >
              On the shelf
            </h2>
            <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
              {listings.length}{" "}
              {listings.length === 1 ? "listing" : "listings"} from this yard.
            </p>
          </div>

          {listings.length > 0 ? (
            <ul className="grid grid-cols-2 gap-[var(--space-sm)] lg:grid-cols-4">
              {listings.map((l, i) => (
                <li key={l.id} className="min-w-0">
                  <ListingCard listing={l} priority={i < 2} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[length:var(--text-base)] text-ink-2">
              Nothing listed right now — check back after their next stock
              update.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
