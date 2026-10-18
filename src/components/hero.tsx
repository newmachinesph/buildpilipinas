"use client";

import Image from "next/image";
import { ArrowRight, Search, ShieldCheck, X } from "lucide-react";
import { IMG } from "@/data/images";
import { POPULAR_SEARCHES } from "@/data/marketplace";
import { scrollToResults, useMarketplace } from "./marketplace-provider";

/* H2 · Split diptych — ratio 7/5, right side = overlapping photo stack.
   Not a full-viewport centred hero: it is the height of its content, biased
   left, and the fold deliberately shows the first category rail underneath. */

export function Hero() {
  const { query, setQuery } = useMarketplace();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToResults();
  };

  const pickTerm = (term: string) => {
    setQuery(term);
    scrollToResults();
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="shell grid items-center gap-[var(--space-xl)] pb-[var(--space-2xl)] pt-[var(--space-xl)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[var(--space-2xl)]"
    >
      <div className="rise min-w-0">
        <h1 id="hero-heading" className="text-[length:var(--text-display)] font-extrabold">
          The whole site, sourced in one search.
        </h1>

        <p className="mt-[var(--space-md)] max-w-[54ch] text-[length:var(--text-lg)] leading-[1.55] text-ink-2">
          Cement, steel, plywood, tools and licensed trades — from verified
          suppliers across Luzon, Visayas and Mindanao. Delivered prices up
          front, no phone tag.
        </p>

        <form
          role="search"
          onSubmit={search}
          className="field mt-[var(--space-lg)] flex flex-col gap-[var(--space-2xs)] rounded-md border-2 border-ink bg-paper p-[var(--space-3xs)] sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-[var(--space-2xs)] px-[var(--space-2xs)]">
            <Search size={18} strokeWidth={2} className="shrink-0 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search materials, tools and trades"
              placeholder="What does the site need today?"
              className="min-h-11 min-w-0 flex-1 bg-transparent text-[length:var(--text-base)] outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="ctl grid size-8 shrink-0 place-items-center rounded-xs text-muted transition-colors duration-[var(--dur-short)] hover:text-ink"
              >
                <X size={16} strokeWidth={2.25} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ctl flex min-h-11 items-center justify-center gap-[var(--space-3xs)] rounded-sm bg-accent px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-accent-ink transition-colors duration-[var(--dur-short)] hover:bg-accent-hover nowrap"
          >
            Search
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </form>

        <div className="mt-[var(--space-md)] flex flex-wrap items-center gap-[var(--space-2xs)]">
          <span className="text-[length:var(--text-xs)] text-muted nowrap">
            Trending:
          </span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => pickTerm(term)}
              aria-pressed={query === term}
              className={`ctl rounded-full border px-[var(--space-xs)] py-[var(--space-3xs)] text-[length:var(--text-xs)] font-medium transition-colors duration-[var(--dur-short)] nowrap ${
                query === term
                  ? "border-flag-blue text-flag-blue"
                  : "border-rule bg-paper-2 text-ink-2 hover:border-ink-2"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Photo stack — three overlapping plates rather than one flat banner.
          Hidden below the layout breakpoint: at 375 px an overlapped collage
          is noise, and the search is what matters on a phone. */}
      <div className="relative hidden aspect-4/3 lg:block">
        <div className="absolute inset-y-0 right-0 w-[82%] overflow-hidden rounded-lg bg-paper-3">
          <Image
            src={IMG.heroCrane}
            alt="Tower cranes over a high-rise construction site at dusk"
            fill
            sizes="40vw"
            /* Next 16: `priority` is deprecated. This is the desktop LCP but is
               hidden below lg, where the first listing cards take over — the
               docs say to use fetchPriority over preload in exactly that case. */
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>

        <div className="absolute bottom-[8%] left-0 w-[42%] overflow-hidden rounded-md border-4 border-paper bg-paper-3 shadow-[var(--bp-shadow-plate)]">
          <div className="relative aspect-square">
            <Image
              src={IMG.warehouse}
              alt="Building materials stacked in a supplier warehouse"
              fill
              sizes="20vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="absolute right-[6%] top-[8%] flex items-center gap-[var(--space-2xs)] rounded-sm bg-paper px-[var(--space-xs)] py-[var(--space-2xs)] shadow-[var(--bp-shadow-chip)]">
          <ShieldCheck size={16} strokeWidth={2.25} className="text-flag-blue" />
          <span className="text-[length:var(--text-xs)] font-semibold nowrap">
            Escrow held until delivery
          </span>
        </div>
      </div>
    </section>
  );
}
