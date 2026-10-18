import type { Metadata } from "next";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  PRICE_INDEX,
  PRICE_INDEX_UPDATED,
  STEPS,
  formatPeso,
} from "@/data/marketplace";
import { Faq } from "./_components/faq";

/* /how-it-works — the homepage's three-step strip, given the room it doesn't
   get there. Same three numbers and titles (from STEPS, so the two pages can't
   drift apart), but each step earns a full section: what a result card
   actually shows, a worked landed-cost comparison, and the escrow timeline
   state by state. All server-rendered; the only disclosure on the page is a
   native <details> FAQ, so the route ships no JS of its own. */

export const metadata: Metadata = {
  title: "How it works — BuildRepublic",
  description:
    "How buying works on BuildRepublic: search by material across every yard near you, compare landed costs instead of sticker prices, and pay through escrow that releases only when your foreman confirms the count.",
};

/* --- Step 01: what every result card carries, so "compare" means compare --- */
const CARD_FIELDS = [
  {
    label: "Unit price",
    detail: "Per bag, per length, per sheet — a number, never “PM for price”.",
  },
  {
    label: "Minimum order",
    detail:
      "So you know before you message whether 20 bags is worth the yard’s truck.",
  },
  {
    label: "Lead time",
    detail: "Same-day, next-day or by-order — quoted on the card, not implied.",
  },
  {
    label: "Stock state",
    detail:
      "In stock, low stock or by order, maintained by the supplier and shown before you ask.",
  },
  {
    label: "Verified badge",
    detail:
      "Business permits on file and a delivery check passed. Unverified yards can list, but they say so.",
  },
];

/* --- Step 02: the worked example. Cement price anchored to the live index so
       this page and /price-index can't quote two different Luzons. --- */
const BAGS = 200;
const cementLuzon =
  PRICE_INDEX.find((r) => r.material.startsWith("Portland cement"))?.luzon ??
  285;

const QUOTES = [
  {
    yard: "Yard A — Valenzuela, 14 km from site",
    perBag: cementLuzon,
    hauling: 3600,
  },
  {
    yard: "Yard B — Project 8, 3 km from site",
    perBag: cementLuzon + 8,
    hauling: 800,
  },
].map((q) => ({
  ...q,
  landedTotal: q.perBag * BAGS + q.hauling,
  landedPerBag: q.perBag + q.hauling / BAGS,
}));

const bestLandedTotal = Math.min(...QUOTES.map((q) => q.landedTotal));

/* --- Step 03: escrow, state by state --- */
const ESCROW_TIMELINE = [
  {
    state: "Funded",
    body: "You pay in; the money sits with the escrow partner, not the seller. The yard sees “funded” and schedules the truck — nobody mobilises on a promise.",
  },
  {
    state: "Delivered",
    body: "The truck arrives with a delivery receipt. Your foreman counts bags, lengths or sheets against it at the gate — that count is the record.",
  },
  {
    state: "Released",
    body: "The foreman confirms and funds move to the seller the same day. Confirm a partial count and only that share releases; the rest stays held.",
  },
  {
    state: "Disputed",
    body: "Short or damaged? Flag it and a human mediator is on it within one working day. Held funds don’t move until it’s settled — no chargeback maze on either side.",
  },
];

export default function HowItWorksPage() {
  const [search, landed, escrow] = STEPS;

  return (
    <MarketplaceProvider>
      <a
        href="#how"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to how it works
      </a>
      <SiteHeader />
      <main id="main">
        {/* ------------------------------------------------------- hero --- */}
        <section
          id="how"
          aria-labelledby="how-heading"
          className="shell scroll-mt-[9rem] py-[var(--space-xl)] md:py-[var(--space-2xl)]"
        >
          <h1
            id="how-heading"
            className="max-w-[16ch] text-[length:var(--text-display-s)]"
          >
            From quote to delivery receipt.
          </h1>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            Buying materials here is three moves: find every yard that actually
            stocks the thing, compare what it costs delivered to your barangay,
            and pay through escrow that releases when your foreman signs off.
            Here is each move in full.
          </p>

          <dl className="mt-[var(--space-lg)] flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)]">
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Buyer fee
              </dt>
              <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                ₱0
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Seller fee, on release only
              </dt>
              <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                3%
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Dispute response
              </dt>
              <dd className="font-display text-[length:var(--text-2xl)] font-bold">
                1 working day
              </dd>
            </div>
          </dl>
        </section>

        {/* -------------------------------------------- 01 · the search --- */}
        <section
          aria-labelledby="step-search-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <div className="grid gap-[var(--space-lg)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-[var(--space-2xl)]">
            <div className="min-w-0">
              <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent-deep">
                {search.n}
              </span>
              <h2
                id="step-search-heading"
                className="mt-[var(--space-2xs)] max-w-[16ch] text-[length:var(--text-3xl)]"
              >
                {search.title}
              </h2>
              <p className="mt-[var(--space-sm)] max-w-[46ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                Type the material, not a shop name. The result is every listing
                within a delivery radius of your site — a Valenzuela yard shows
                up for a Quezon City build, a Mandaue yard doesn&apos;t. No
                calling six numbers off a tarpaulin to ask who has 10&nbsp;mm
                bars this week.
              </p>
              <p className="mt-[var(--space-sm)] max-w-[46ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                Every card answers the questions you&apos;d otherwise spend a
                morning texting about, before you contact anyone.
              </p>
            </div>

            {/* The anatomy of a result card, as a definition list — the point
                is that these five fields are non-negotiable on every listing. */}
            <dl className="min-w-0 self-start rounded-lg border border-rule bg-paper-2 p-[var(--space-md)] md:p-[var(--space-lg)]">
              <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                On every result card
              </p>
              {CARD_FIELDS.map((f) => (
                <div
                  key={f.label}
                  className="mt-[var(--space-sm)] border-t border-rule-2 pt-[var(--space-sm)] first-of-type:mt-[var(--space-xs)]"
                >
                  <dt className="text-[length:var(--text-base)] font-semibold">
                    {f.label}
                  </dt>
                  <dd className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] leading-[1.6] text-ink-2">
                    {f.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------- 02 · the landed cost --- */}
        <section
          aria-labelledby="step-landed-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent-deep">
            {landed.n}
          </span>
          <h2
            id="step-landed-heading"
            className="mt-[var(--space-2xs)] max-w-[18ch] text-[length:var(--text-3xl)]"
          >
            {landed.title}
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            On aggregates, cement and steel, hauling is a real slice of the
            bill — so the cheapest sticker price loses surprisingly often.
            Every quote here shows the delivered total to your barangay, and
            the comparison happens on that number. Here&apos;s the same
            200-bag cement order quoted by two yards:
          </p>

          <div className="mt-[var(--space-lg)] overflow-x-auto rounded-lg border border-rule">
            <table className="w-full min-w-[38rem] border-collapse text-[length:var(--text-sm)]">
              <caption className="border-b border-rule bg-paper-2 px-[var(--space-md)] py-[var(--space-xs)] text-left text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                {BAGS} bags, Portland cement Type 1P, delivered to Barangay
                Bagong Pag-asa, Quezon City · index of {PRICE_INDEX_UPDATED}
              </caption>
              <thead>
                <tr className="border-b border-rule bg-paper-2 text-left">
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] font-semibold">
                    Quote
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] text-right font-semibold">
                    Price per bag
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] text-right font-semibold">
                    Hauling to site
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] text-right font-semibold">
                    Landed per bag
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] text-right font-semibold">
                    Landed total
                  </th>
                </tr>
              </thead>
              <tbody>
                {QUOTES.map((q) => {
                  const wins = q.landedTotal === bestLandedTotal;
                  return (
                    <tr
                      key={q.yard}
                      className="border-b border-rule-2 last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-[var(--space-md)] py-[var(--space-sm)] text-left font-medium"
                      >
                        {q.yard}
                      </th>
                      <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] text-right">
                        {formatPeso(q.perBag)}
                      </td>
                      <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] text-right">
                        {formatPeso(q.hauling)}
                      </td>
                      <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] text-right">
                        {formatPeso(q.landedPerBag)}
                      </td>
                      <td
                        className={`tnum px-[var(--space-md)] py-[var(--space-sm)] text-right font-semibold ${
                          wins ? "text-flag-blue" : ""
                        }`}
                      >
                        {formatPeso(q.landedTotal)}
                        {wins && (
                          <span className="ml-[var(--space-2xs)] rounded-full bg-flag-blue px-[var(--space-2xs)] py-[var(--space-4xs)] text-[length:var(--text-xs)] font-semibold text-on-ink nowrap">
                            Best landed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-sm)] leading-[1.6] text-muted">
            Yard B charges {formatPeso(QUOTES[1].perBag - QUOTES[0].perBag)}{" "}
            more per bag and still wins by{" "}
            {formatPeso(QUOTES[0].landedTotal - QUOTES[1].landedTotal)} — the
            14&nbsp;km of hauling is the difference. That maths is done for you
            on every quote.
          </p>
        </section>

        {/* ------------------------------------- 03 · the escrow release --- */}
        <section
          aria-labelledby="step-escrow-heading"
          className="bg-ink-surface text-on-ink"
        >
          <div className="flag-bar h-[3px]" aria-hidden />
          <div className="shell py-[var(--space-2xl)]">
            <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent">
              {escrow.n}
            </span>
            <h2
              id="step-escrow-heading"
              className="mt-[var(--space-2xs)] max-w-[18ch] text-[length:var(--text-3xl)] text-on-ink"
            >
              {escrow.title}
            </h2>
            <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-on-ink-muted">
              The seller never holds your money before delivery, and you never
              hold theirs after it. Four states, and the gate count — not the
              invoice — decides when funds move.
            </p>

            <ol className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[var(--space-xl)]">
              {ESCROW_TIMELINE.map((t, i) => (
                <li
                  key={t.state}
                  className="min-w-0 border-t border-ink-rule pt-[var(--space-sm)]"
                >
                  <span className="tnum text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-on-ink-muted">
                    State {i + 1}
                  </span>
                  <h3 className="mt-[var(--space-2xs)] text-[length:var(--text-xl)] text-on-ink">
                    {t.state}
                  </h3>
                  <p className="mt-[var(--space-2xs)] text-[length:var(--text-base)] leading-[1.6] text-on-ink-muted">
                    {t.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* --------------------------------------------------------- faq --- */}
        <Faq />
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
