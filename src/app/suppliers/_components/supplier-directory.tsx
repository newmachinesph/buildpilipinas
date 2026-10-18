"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, MapPin, SearchX } from "lucide-react";
import { SUPPLIERS, type Region, type Supplier } from "@/data/marketplace";
import { Dropdown } from "@/components/ui/dropdown";

/* Directory filters + grid. Client only because the two dropdowns filter the
   grid in place — everything else on /suppliers stays on the server. */

const ALL = "all";

const REGIONS: Region[] = ["Luzon", "Visayas", "Mindanao"];

/* ponytail: 2026 matches PRICE_INDEX_UPDATED ("17 July 2026") — derive from the
   data layer if the seed ever moves years. */
const PLATFORM_YEAR = 2026;

const TRADES = [...new Set(SUPPLIERS.map((s) => s.trade))].sort();

/* Verified yards with the longest trading history lead; a supplier still in
   document review shouldn't outrank one with eight years of deliveries. */
const ORDERED = [...SUPPLIERS].sort(
  (a, b) =>
    Number(b.verified) - Number(a.verified) ||
    a.since - b.since ||
    a.name.localeCompare(b.name),
);

export function SupplierDirectory() {
  const [trade, setTrade] = useState(ALL);
  const [region, setRegion] = useState(ALL);

  const filtered = ORDERED.filter(
    (s) =>
      (trade === ALL || s.trade === trade) &&
      (region === ALL || s.region === region),
  );

  const isFiltering = trade !== ALL || region !== ALL;

  const tradeOptions = [
    { value: ALL, label: "All trades" },
    ...TRADES.map((t) => ({ value: t, label: t })),
  ];

  const regionOptions = [
    { value: ALL, label: "All regions" },
    ...REGIONS.map((r) => ({
      value: r,
      label: r,
      hint: String(SUPPLIERS.filter((s) => s.region === r).length),
    })),
  ];

  return (
    <>
      <div className="mb-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-2xs)]">
        <Dropdown
          label="Trade"
          options={tradeOptions}
          value={trade}
          onChange={setTrade}
          triggerClassName="border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink"
        />
        <Dropdown
          label="Region"
          options={regionOptions}
          value={region}
          onChange={setRegion}
          triggerClassName="border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink"
        />
        <p
          aria-live="polite"
          className="tnum ml-auto text-[length:var(--text-sm)] text-muted nowrap"
        >
          {filtered.length} of {SUPPLIERS.length} suppliers
        </p>
      </div>

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-1 gap-[var(--space-sm)] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.slug} className="min-w-0">
              <SupplierCard supplier={s} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-[var(--space-sm)] rounded-md border border-dashed border-rule bg-paper-2 p-[var(--space-lg)]">
          <SearchX size={24} strokeWidth={1.75} className="text-muted" />
          <p className="text-[length:var(--text-lg)] font-semibold">
            No yards match that combination.
          </p>
          <p className="max-w-[52ch] text-[length:var(--text-base)] text-ink-2">
            Most trades cluster around one island group — try the trade on its
            own, then narrow by region.
          </p>
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setTrade(ALL);
                setRegion(ALL);
              }}
              className="ctl inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </>
  );
}

function SupplierCard({ supplier: s }: { supplier: Supplier }) {
  const years = PLATFORM_YEAR - s.since;

  return (
    <Link
      href={`/supplier/${s.slug}`}
      className="flex h-full flex-col gap-[var(--space-2xs)] rounded-md border border-rule bg-paper-2 p-[var(--space-sm)] transition-colors duration-[var(--dur-short)] hover:border-ink"
    >
      <div className="flex items-center gap-[var(--space-xs)]">
        <Image
          src={s.avatar}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-base)] font-semibold leading-[1.28]">
            <span className="truncate">{s.name}</span>
            {s.verified && (
              <BadgeCheck
                size={14}
                strokeWidth={2.25}
                className="shrink-0 text-flag-blue"
                aria-label="Verified supplier"
              />
            )}
          </h3>
          <p className="truncate text-[length:var(--text-sm)] text-ink-2">
            {s.trade}
          </p>
        </div>
      </div>

      <div className="mt-auto border-t border-rule-2 pt-[var(--space-2xs)]">
        <p className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-xs)] text-muted">
          <MapPin size={12} strokeWidth={2} className="shrink-0" />
          <span className="truncate">{s.location}</span>
        </p>
        <p className="tnum mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
          {s.listings} {s.listings === 1 ? "listing" : "listings"} ·{" "}
          {years === 0 ? "new this year" : `${years} yrs on the platform`}
          {!s.verified && (
            <span className="text-flag-red"> · verification pending</span>
          )}
        </p>
      </div>
    </Link>
  );
}
