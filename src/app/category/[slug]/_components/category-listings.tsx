"use client";

import { useState } from "react";
import { MapPin, PackageSearch } from "lucide-react";
import { CITIES, type Listing } from "@/data/marketplace";
import { ListingCard } from "@/components/listing-card";
import { Dropdown } from "@/components/ui/dropdown";

/* City filter over the category's catalogue. Client because the filter is
   state; everything above and below this section stays on the server. A city
   maps to its island group — the same "delivers to" reach the homepage's
   NearYouRail uses — because a Bulacan yard hauling to Quezon City is a match,
   not a miss. */

const ALL = "all";

export function CategoryListings({
  listings,
  categoryName,
}: {
  listings: Listing[];
  categoryName: string;
}) {
  const [cityName, setCityName] = useState<string>(ALL);

  const city = CITIES.find((c) => c.name === cityName);
  const shown = city
    ? listings.filter((l) => l.region === city.region)
    : listings;

  const cityOptions = [
    { value: ALL, label: "All locations" },
    ...CITIES.map((c) => ({ value: c.name, label: c.name, hint: c.region })),
  ];

  return (
    <section
      id="listings"
      aria-labelledby="listings-heading"
      className="shell scroll-mt-[9rem] border-t border-rule py-[var(--space-2xl)]"
    >
      <div className="mb-[var(--space-md)] flex flex-col gap-[var(--space-2xs)] sm:flex-row sm:items-end sm:justify-between sm:gap-[var(--space-md)]">
        <div className="min-w-0">
          <h2 id="listings-heading" className="text-[length:var(--text-3xl)]">
            {city ? `Delivers to ${city.name}` : "In the catalogue now"}
          </h2>
          <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-muted">
            {city
              ? `${shown.length} of ${listings.length} ${categoryName} listings haul within ${city.region}.`
              : `${shown.length} listings with the price, unit and minimum order already on the card.`}
          </p>
        </div>
        <div className="shrink-0">
          <Dropdown
            label="Filter by city"
            align="end"
            options={cityOptions}
            value={cityName}
            onChange={setCityName}
            icon={<MapPin size={15} strokeWidth={2.25} className="shrink-0" />}
            triggerClassName="border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink"
          />
        </div>
      </div>

      {shown.length > 0 ? (
        <ul className="grid grid-cols-2 gap-[var(--space-sm)] lg:grid-cols-4">
          {shown.map((l, i) => (
            <li key={l.id} className="min-w-0">
              <ListingCard listing={l} priority={i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-[var(--space-sm)] rounded-md border border-dashed border-rule bg-paper-2 p-[var(--space-lg)]">
          <PackageSearch size={24} strokeWidth={1.75} className="text-muted" />
          <p className="text-[length:var(--text-lg)] font-semibold">
            No {categoryName.toLowerCase()} stock hauling to {cityName} this
            week.
          </p>
          <p className="max-w-[52ch] text-[length:var(--text-base)] text-ink-2">
            Suppliers update delivery areas daily — check back, or browse what
            every island group has on the floor.
          </p>
          <button
            type="button"
            onClick={() => setCityName(ALL)}
            className="ctl inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap"
          >
            Show all locations
          </button>
        </div>
      )}
    </section>
  );
}
