import type { Metadata } from "next";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRICE_INDEX, PRICE_INDEX_UPDATED } from "@/data/marketplace";
import { PriceTable } from "./_components/price-table";
import { TrendCard } from "./_components/trend-card";

/* The expanded view the homepage price band points at: the full table, an
   eleven-week trend per material, and a methodology note that says plainly
   where the numbers come from. MarketplaceProvider wraps the page only
   because SiteHeader reads its context — nothing below consumes it. */

export const metadata: Metadata = {
  title: "Material price index — BuildRepublic",
  description:
    "Weekly median asking prices for cement, rebar, plywood, hollow block, sand and roofing across Luzon, Visayas and Mindanao, with eleven weeks of history per material.",
};

export default function PriceIndexPage() {
  return (
    <MarketplaceProvider>
      <a
        href="#index-table"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to price table
      </a>
      <SiteHeader />
      <main id="main">
        <div className="shell pb-[var(--space-lg)] pt-[var(--space-xl)]">
          <p className="text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-muted">
            Updated {PRICE_INDEX_UPDATED}
          </p>
          <h1 className="mt-[var(--space-2xs)] max-w-[16ch] text-[length:var(--text-display-s)]">
            The material price index, in full.
          </h1>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            Six tracked materials, three island groups, eleven weeks of history
            apiece. The homepage shows this week&rsquo;s cut; this is the whole
            ledger.
          </p>
        </div>

        <section
          id="index-table"
          aria-labelledby="table-heading"
          className="bg-ink-surface text-on-ink"
        >
          <div className="flag-bar h-[3px]" aria-hidden />
          <div className="shell py-[var(--space-2xl)]">
            <div className="mb-[var(--space-lg)] min-w-0">
              <h2
                id="table-heading"
                className="text-[length:var(--text-3xl)] text-on-ink"
              >
                This week, by island group
              </h2>
              <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-on-ink-muted">
                Median asking price across active listings. Tap a column to
                sort; W/W compares the two most recent Friday closes.
              </p>
            </div>
            <PriceTable />
          </div>
        </section>

        <section
          aria-labelledby="trends-heading"
          className="shell py-[var(--space-2xl)]"
        >
          <h2 id="trends-heading" className="text-[length:var(--text-3xl)]">
            Eleven weeks, one line each
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            Luzon median only — the island spread is mostly hauling cost and it
            barely moves week to week; the story is in the time axis. Every
            chart&rsquo;s exact weekly figures sit right under it.
          </p>
          <div className="mt-[var(--space-xl)] grid gap-x-[var(--space-lg)] gap-y-[var(--space-xl)] sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_INDEX.map((row) => (
              <TrendCard key={row.material} row={row} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="methodology-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <div className="grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[var(--space-2xl)]">
            <h2
              id="methodology-heading"
              className="max-w-[16ch] text-[length:var(--text-3xl)]"
            >
              Where these numbers come from
            </h2>
            <div className="min-w-0 space-y-[var(--space-sm)] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
              <p>
                Each cell is the median asking price across active listings for
                that material in that island group, read at Friday close —{" "}
                {PRICE_INDEX_UPDATED} for the current column. Asking price, not
                transaction price: it&rsquo;s what the counter quotes before you
                haggle, which is also the number you plan a budget around.
              </p>
              <p>
                The week-on-week move compares the two most recent Friday
                medians. The trend charts plot the Luzon median only; the
                regional columns drift together, so two more lines would just be
                the same line, shifted by the freight.
              </p>
              <p>
                And the part worth being plain about: this is a demo build.
                Every figure on this page is hand-authored seed data — shaped to
                sit near mid-2026 hardware-counter prices, but sourced from no
                survey and no scraper. Don&rsquo;t take it to a supplier&rsquo;s
                counter.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
