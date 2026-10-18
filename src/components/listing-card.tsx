"use client";

import Image from "next/image";
import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { formatPeso, type Listing } from "@/data/marketplace";
import { useMarketplace } from "./marketplace-provider";

/* F6 · Product card grid — ratio 4/3 landscape, micro-action = Save.
   The save control is always visible, never hover-revealed: on a touch device
   a hover-only affordance simply does not exist. */

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  const { isSaved, toggleSave } = useMarketplace();
  const saved = isSaved(listing.id);

  return (
    // One hover signal only — the image zoom. Stacking a border shift on top of
    // it is the "every card lifts" tell.
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-rule bg-paper">
      <div className="relative aspect-4/3 overflow-hidden bg-paper-3">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 22vw"
          /* Next 16: `priority` is deprecated — first cards are the mobile LCP,
             so they load eagerly at high fetch priority; the rest stay lazy. */
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover transition-transform duration-[var(--dur-long)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />

        {listing.badge && (
          <span
            className={`absolute left-[var(--space-2xs)] top-[var(--space-2xs)] rounded-xs px-[var(--space-2xs)] py-[var(--space-4xs)] text-[length:var(--text-xs)] font-semibold uppercase tracking-[0.06em] nowrap ${
              listing.badge === "Low stock"
                ? "bg-flag-red text-on-ink"
                : "bg-accent text-accent-ink"
            }`}
          >
            {listing.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleSave(listing.id)}
          aria-pressed={saved}
          aria-label={saved ? `Unsave ${listing.title}` : `Save ${listing.title}`}
          className="ctl absolute right-[var(--space-2xs)] top-[var(--space-3xs)] grid size-11 place-items-center rounded-sm bg-paper/85 text-ink-2 backdrop-blur-sm transition-colors duration-[var(--dur-short)] hover:bg-paper hover:text-flag-red"
        >
          <Heart
            size={17}
            strokeWidth={2}
            className={saved ? "fill-flag-red text-flag-red" : undefined}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--space-2xs)] p-[var(--space-xs)]">
        <h3 className="text-[length:var(--text-base)] font-semibold leading-[1.28] tracking-[-0.015em]">
          {listing.title}
        </h3>

        <p className="mt-auto flex items-baseline gap-[var(--space-3xs)]">
          <span className="tnum font-display text-[length:var(--text-xl)] font-bold tracking-[-0.03em]">
            {formatPeso(listing.price)}
          </span>
          <span className="text-[length:var(--text-xs)] text-muted">
            {listing.unit}
          </span>
        </p>

        {listing.moq && (
          <p className="text-[length:var(--text-xs)] text-muted">
            Minimum order {listing.moq}
          </p>
        )}

        <div className="mt-[var(--space-3xs)] border-t border-rule-2 pt-[var(--space-2xs)]">
          <p className="flex items-center gap-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium text-ink-2">
            {listing.verified && (
              <BadgeCheck
                size={14}
                strokeWidth={2.25}
                className="shrink-0 text-flag-blue"
                aria-label="Verified supplier"
              />
            )}
            <span className="truncate">{listing.seller}</span>
          </p>
          <p className="mt-[var(--space-4xs)] flex items-center gap-[var(--space-3xs)] text-[length:var(--text-xs)] text-muted">
            <MapPin size={12} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{listing.location}</span>
            <span aria-hidden>·</span>
            <span className="nowrap">{listing.posted}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
