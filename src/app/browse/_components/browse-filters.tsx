"use client";

import { useRouter } from "next/navigation";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, CITIES, slugify } from "@/data/marketplace";
import { Dropdown } from "@/components/ui/dropdown";
import { browseHref, SORT_OPTIONS, type SortOrder } from "./browse-params";

/* The only interactive part of /browse — three menus that rewrite the query
   string. Everything else renders on the server from the URL, so a filtered
   view survives a refresh and pastes into a group chat intact. */

type Props = {
  /** Current selection as URL slugs; null = unfiltered. */
  category: string | null;
  city: string | null;
  sort: SortOrder;
};

const TRIGGER =
  "border border-rule bg-paper-2 px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink";

export function BrowseFilters({ category, city, sort }: Props) {
  const router = useRouter();

  const apply = (next: Partial<Props>) => {
    // scroll:false — the controls sit beside the results; jumping to the top
    // of the page on every filter change would lose the user's place.
    router.push(browseHref({ category, city, sort, ...next }), {
      scroll: false,
    });
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.slug,
    label: c.name,
    hint: c.listings.toLocaleString("en-PH"),
  }));

  const cityOptions = CITIES.map((c) => ({
    value: slugify(c.name),
    label: c.name,
    hint: c.region,
  }));

  return (
    <div className="flex flex-wrap items-center gap-[var(--space-2xs)]">
      <Dropdown
        label="All categories"
        options={categoryOptions}
        value={category}
        onChange={(v) => apply({ category: v })}
        triggerClassName={TRIGGER}
        footer={
          category && (
            <button
              type="button"
              onClick={() => apply({ category: null })}
              className="w-full rounded-xs px-[var(--space-2xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] font-medium text-flag-red transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
            >
              Clear category
            </button>
          )
        }
      />

      <Dropdown
        label="All cities"
        options={cityOptions}
        value={city}
        onChange={(v) => apply({ city: v })}
        icon={<MapPin size={14} strokeWidth={2.25} className="shrink-0" />}
        triggerClassName={TRIGGER}
        footer={
          city && (
            <button
              type="button"
              onClick={() => apply({ city: null })}
              className="w-full rounded-xs px-[var(--space-2xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] font-medium text-flag-red transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
            >
              Clear city
            </button>
          )
        }
      />

      <Dropdown
        label="Sort"
        align="end"
        options={SORT_OPTIONS}
        value={sort}
        onChange={(v) => apply({ sort: v as SortOrder })}
        icon={
          <SlidersHorizontal size={15} strokeWidth={2.25} className="shrink-0" />
        }
        triggerClassName={TRIGGER}
      />
    </div>
  );
}
