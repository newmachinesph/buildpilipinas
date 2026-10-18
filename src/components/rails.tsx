"use client";

import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  DoorOpen,
  Drill,
  Grid3x3,
  Grip,
  HardHat,
  Home,
  Layers,
  PaintRoller,
  Pipette,
  SearchX,
  SlidersHorizontal,
  TreePine,
  Truck,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, CITIES, SUPPLIERS } from "@/data/marketplace";
import { ListingCard } from "./listing-card";
import { Dropdown } from "./ui/dropdown";
import {
  SORT_LABELS,
  scrollToResults,
  useMarketplace,
  type SortKey,
} from "./marketplace-provider";

const ICONS: Record<string, LucideIcon> = {
  Layers,
  Grip,
  TreePine,
  Home,
  Grid3x3,
  PaintRoller,
  Pipette,
  Zap,
  DoorOpen,
  Drill,
  Truck,
  HardHat,
};

/* Rail head — heading and its trailing control. Single column below 40rem so
   the control never gets squeezed onto a second line beside the title. */
function RailHead({
  id,
  title,
  note,
  children,
}: {
  /** Placed on the h2 so a section's aria-labelledby names the heading alone,
   *  not the note and trailing control beside it. */
  id?: string;
  title: string;
  note?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-[var(--space-md)] flex flex-col gap-[var(--space-2xs)] sm:flex-row sm:items-end sm:justify-between sm:gap-[var(--space-md)]">
      <div className="min-w-0">
        <h2 id={id} className="text-[length:var(--text-3xl)]">{title}</h2>
        {note && (
          <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
            {note}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function SeeAllLink({ label }: { label: string }) {
  return (
    <a
      href="#browse"
      className="group inline-flex shrink-0 items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-semibold text-flag-blue underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-flag-blue nowrap"
    >
      {label}
      <ArrowRight
        size={15}
        strokeWidth={2.5}
        className="transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] group-hover:translate-x-[var(--space-3xs)]"
      />
    </a>
  );
}

/* ------------------------------------------------------------ categories --- */

export function CategoryRail() {
  const { category, setCategory } = useMarketplace();

  const pick = (name: string) => {
    const next = category === name ? null : name;
    setCategory(next);
    if (next) scrollToResults();
  };

  return (
    <section
      aria-labelledby="cat-heading"
      className="shell border-t border-rule py-[var(--space-xl)]"
    >
      <h2
        id="cat-heading"
        className="mb-[var(--space-md)] text-[length:var(--text-sm)] font-semibold uppercase tracking-[0.14em] text-muted"
      >
        Browse by trade
      </h2>

      <ul className="rail rail-bleed auto-cols-[9.5rem] gap-[var(--space-2xs)] sm:auto-cols-[10.5rem]">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.icon] ?? Layers;
          const active = category === c.name;
          return (
            <li key={c.name}>
              <button
                type="button"
                onClick={() => pick(c.name)}
                aria-pressed={active}
                className={`flex h-full w-full flex-col gap-[var(--space-2xs)] rounded-md border p-[var(--space-xs)] text-left transition-colors duration-[var(--dur-short)] ${
                  active
                    ? "border-ink bg-paper"
                    : "border-rule bg-paper-2 hover:border-ink"
                }`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-sm ${
                    active
                      ? "bg-flag-blue text-on-ink"
                      : "bg-accent text-accent-ink"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="text-[length:var(--text-sm)] font-semibold leading-[1.25]">
                  {c.name}
                </span>
                <span className="tnum mt-auto text-[length:var(--text-xs)] text-muted">
                  {c.listings.toLocaleString("en-PH")} listings
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------ browse grid --- */

export function BrowseGrid() {
  const {
    results,
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    isFiltering,
    clearFilters,
  } = useMarketplace();

  const sortOptions = (Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({
    value: k,
    label: SORT_LABELS[k],
  }));

  const heading = isFiltering ? "Matching listings" : "Moving today";
  const note = isFiltering
    ? `${results.length} ${results.length === 1 ? "listing" : "listings"} found`
    : "Highest-turnover listings in the last 24 hours.";

  return (
    <section
      id="browse"
      aria-labelledby="browse-heading"
      className="shell scroll-mt-[9rem] border-t border-rule py-[var(--space-2xl)]"
    >
      <RailHead id="browse-heading" title={heading} note={note}>
        <Dropdown
          label="Sort"
          align="end"
          options={sortOptions}
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          icon={
            <SlidersHorizontal size={15} strokeWidth={2.25} className="shrink-0" />
          }
          triggerClassName="border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink"
        />
      </RailHead>

      {/* Active filters — visible, and each one individually removable. */}
      {isFiltering && (
        <div className="mb-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-2xs)]">
          {query.trim() && (
            <FilterChip label={`“${query.trim()}”`} onRemove={() => setQuery("")} />
          )}
          {category && (
            <FilterChip label={category} onRemove={() => setCategory(null)} />
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="ctl text-[length:var(--text-sm)] font-semibold text-flag-red underline decoration-rule underline-offset-4 nowrap"
          >
            Clear all
          </button>
        </div>
      )}

      {results.length > 0 ? (
        <ul className="grid grid-cols-2 gap-[var(--space-sm)] lg:grid-cols-4">
          {results.map((l, i) => (
            <li key={l.id} className="min-w-0">
              <ListingCard listing={l} priority={!isFiltering && i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-[var(--space-sm)] rounded-md border border-dashed border-rule bg-paper-2 p-[var(--space-lg)]">
          <SearchX size={24} strokeWidth={1.75} className="text-muted" />
          <p className="text-[length:var(--text-lg)] font-semibold">
            Nothing matches that yet.
          </p>
          <p className="max-w-[52ch] text-[length:var(--text-base)] text-ink-2">
            Try a shorter term — searching the material on its own (
            <span className="font-medium">cement</span>,{" "}
            <span className="font-medium">plywood</span>) usually finds more than
            a full product name.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="ctl inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap"
          >
            Reset search
          </button>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-[var(--space-3xs)] rounded-full border border-rule bg-paper-2 py-[var(--space-3xs)] pl-[var(--space-xs)] pr-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium nowrap">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="ctl grid size-6 place-items-center rounded-full text-muted transition-colors duration-[var(--dur-short)] hover:bg-paper-3 hover:text-ink"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* --------------------------------------------------------------- near you --- */

export function NearYouRail() {
  const { city, setCity, nearby } = useMarketplace();

  const cityOptions = CITIES.map((c) => ({
    value: c.name,
    label: c.name,
    hint: c.region,
  }));

  return (
    <section
      aria-labelledby="near-heading"
      className="shell border-t border-rule py-[var(--space-2xl)]"
    >
      <RailHead
        id="near-heading"
        title={`Delivers to ${city.name}`}
        note={`${nearby.length} suppliers currently hauling within ${city.region}.`}
      >
        <Dropdown
          label="Change location"
          align="end"
          options={cityOptions}
          value={city.name}
          onChange={(name) =>
            setCity(CITIES.find((c) => c.name === name) ?? CITIES[0])
          }
          triggerClassName="border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink"
        />
      </RailHead>

      <ul className="rail rail-bleed auto-cols-[15rem] gap-[var(--space-sm)] sm:auto-cols-[17rem]">
        {nearby.map((l) => (
          <li key={l.id}>
            <ListingCard listing={l} />
          </li>
        ))}
      </ul>

      {nearby.length < 4 && (
        <p className="mt-[var(--space-md)] text-[length:var(--text-sm)] text-ink-2">
          Thin inventory in {city.region} this week —{" "}
          <SeeAllLink label="browse everything instead" />
        </p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- suppliers --- */

export function SupplierRail() {
  return (
    <section
      aria-labelledby="sup-heading"
      className="shell border-t border-rule py-[var(--space-2xl)]"
    >
      <RailHead
        id="sup-heading"
        title="Yards worth knowing"
        note="Verified suppliers with a trading history on the platform."
      >
        <SeeAllLink label="Browse suppliers" />
      </RailHead>
      <ul className="rail rail-bleed auto-cols-[16rem] gap-[var(--space-sm)] sm:auto-cols-[19rem]">
        {SUPPLIERS.map((s) => (
          <li key={s.name}>
            <a
              href="#"
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
                  <BadgeCheck
                    size={14}
                    strokeWidth={2.25}
                    className="shrink-0 text-flag-blue"
                    aria-label="Verified"
                  />
                </p>
                <p className="truncate text-[length:var(--text-sm)] text-ink-2">
                  {s.trade}
                </p>
                <p className="tnum mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
                  {s.location} · {s.listings} listings · since {s.since}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
