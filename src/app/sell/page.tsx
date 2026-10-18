import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/data/images";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPeso } from "@/data/marketplace";
import { SignupForm } from "./_components/signup-form";

/* /sell — the page behind the homepage SellStrip's "How selling works". Same
   numbers as the strip (₱0 to list, no monthly plan, flat 3% on release),
   spelled out: the full fee schedule with a worked payout, the verification
   checklist the /suppliers page alludes to, how money actually lands, and
   what a dispute does to it. Ends in a markup-only sign-up form. All server;
   the route ships no JS of its own. */

export const metadata: Metadata = {
  title: "Sell on BuildRepublic — fees, verification and payouts",
  description:
    "List construction materials in about four minutes. No listing fee, no monthly plan — a flat 3% only when the buyer releases payment. What verification takes, how payouts land, and what happens in a dispute.",
};

/* The whole fee schedule. Short enough to be a table, honest enough to
   include the rows that are zero. */
const FEES = [
  {
    item: "Posting a listing",
    cost: "₱0",
    note: "List 1 item or 400. No cap, no tiers.",
  },
  {
    item: "Monthly subscription",
    cost: "₱0",
    note: "There is no plan to be on.",
  },
  {
    item: "Commission",
    cost: "3% of the order",
    note: "Charged only when the buyer releases payment from escrow. A cancelled or refunded order costs you nothing.",
  },
  {
    item: "Payout transfer",
    cost: "₱0",
    note: "InstaPay or PESONet to any Philippine bank account, fee absorbed by the platform.",
  },
  {
    item: "Featured placement",
    cost: "Not sold",
    note: "Search rank is stock accuracy and response time. You can't buy your way up it.",
  },
];

/* Worked payout, computed so the copy can't drift from the arithmetic. */
const EXAMPLE_ORDER = 52000;
const EXAMPLE_FEE = EXAMPLE_ORDER * 0.03;
const EXAMPLE_PAYOUT = EXAMPLE_ORDER - EXAMPLE_FEE;

/* Verification: the same requirements the /suppliers page summarises as
   "submitted business permits and passed a delivery check". */
const VERIFICATION_STEPS = [
  {
    title: "Government ID",
    body: "A valid ID of the owner or authorised representative — the person the platform calls when a dispute needs an answer.",
  },
  {
    title: "DTI or SEC registration",
    body: "DTI business name certificate for sole proprietors, SEC certificate for corporations and partnerships.",
  },
  {
    title: "Mayor's permit",
    body: "The current business permit for the yard address you'll ship from. A satellite warehouse needs its own.",
  },
  {
    title: "BIR Form 2303",
    body: "Certificate of Registration, so buyers who need official receipts know they'll get them.",
  },
  {
    title: "Yard photos",
    body: "Stock under roof and your signage in frame. These never publish — they're for the review team.",
  },
  {
    title: "First-delivery check",
    body: "Your first fulfilled order is spot-checked against the delivery receipt. Pass it and the Verified badge goes live.",
  },
];

const PAYOUT_STEPS = [
  {
    n: "01",
    title: "The buyer funds escrow",
    body: "You see \"funded\" on the order before you load a single truck. If the money isn't there, the order isn't real — don't mobilise.",
  },
  {
    n: "02",
    title: "You deliver, they count",
    body: "The buyer's foreman counts the delivery against your receipt at the gate. Match the count and confirmation usually follows the same day; if nobody confirms or disputes within seven days, funds release automatically.",
  },
  {
    n: "03",
    title: "Release, minus 3%, lands in your account",
    body: `On a ${formatPeso(EXAMPLE_ORDER)} rebar order the fee is ${formatPeso(EXAMPLE_FEE)} and ${formatPeso(EXAMPLE_PAYOUT)} lands with you — InstaPay same day up to ₱50,000 per transfer, PESONet the next banking day above it.`,
  },
];

export default function SellPage() {
  return (
    <MarketplaceProvider>
      <a
        href="#selling"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to selling details
      </a>
      <SiteHeader />
      <main id="main">
        {/* ------------------------------------------------------- hero --- */}
        <section
          id="selling"
          aria-labelledby="sell-page-heading"
          className="shell scroll-mt-[9rem] py-[var(--space-xl)] md:py-[var(--space-2xl)]"
        >
          <div className="grid gap-[var(--space-lg)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-[var(--space-2xl)]">
            <div className="min-w-0">
              <h1
                id="sell-page-heading"
                className="max-w-[14ch] text-[length:var(--text-display-s)]"
              >
                Put your yard on the shelf.
              </h1>
              <p className="mt-[var(--space-sm)] max-w-[48ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                A listing takes about four minutes: photos, unit price, minimum
                order, lead time. It costs nothing to post and nothing per
                month — the platform earns a flat 3% only when a buyer releases
                payment to you. Overruns, off-cuts and surplus move fastest.
              </p>

              <dl className="mt-[var(--space-lg)] flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)]">
                <div>
                  <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                    To list
                  </dt>
                  <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                    ₱0
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                    On release only
                  </dt>
                  <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                    3%
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                    Document review
                  </dt>
                  <dd className="font-display text-[length:var(--text-2xl)] font-bold">
                    2–3 working days
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative min-h-[16rem] overflow-hidden rounded-lg border border-rule bg-paper-3 md:min-h-[22rem]">
              <Image
                src={IMG.warehouse}
                alt="Racked warehouse aisles stocked with palletised construction materials"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- fee table --- */}
        <section
          aria-labelledby="fees-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <h2 id="fees-heading" className="max-w-[18ch] text-[length:var(--text-3xl)]">
            The whole fee schedule fits in one table.
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            The 3% covers escrow handling, payment processing and a human
            mediator when a delivery is contested. There are no rows missing
            from this table.
          </p>

          <div className="mt-[var(--space-lg)] overflow-x-auto rounded-lg border border-rule">
            <table className="w-full min-w-[34rem] border-collapse text-[length:var(--text-sm)]">
              <thead>
                <tr className="border-b border-rule bg-paper-2 text-left">
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] font-semibold">
                    What
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] font-semibold">
                    You pay
                  </th>
                  <th scope="col" className="px-[var(--space-md)] py-[var(--space-xs)] font-semibold">
                    The fine print, in full
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((f) => (
                  <tr key={f.item} className="border-b border-rule-2 align-top last:border-b-0">
                    <th
                      scope="row"
                      className="px-[var(--space-md)] py-[var(--space-sm)] text-left font-medium nowrap"
                    >
                      {f.item}
                    </th>
                    <td className="tnum px-[var(--space-md)] py-[var(--space-sm)] font-semibold nowrap">
                      {f.cost}
                    </td>
                    <td className="max-w-[36rem] px-[var(--space-md)] py-[var(--space-sm)] leading-[1.6] text-ink-2">
                      {f.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------------ verification --- */}
        <section
          aria-labelledby="verification-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <h2
            id="verification-heading"
            className="max-w-[18ch] text-[length:var(--text-3xl)]"
          >
            What the Verified badge takes.
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            You can start listing while your documents are in review — the
            badge and the search placement that comes with it arrive after the
            checks below. Buyers filter by it, so it&apos;s worth the folder of
            paperwork.
          </p>

          <ol className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[var(--space-xl)]">
            {VERIFICATION_STEPS.map((v, i) => (
              <li
                key={v.title}
                className="min-w-0 border-t-2 border-ink pt-[var(--space-sm)]"
              >
                <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-[var(--space-2xs)] text-[length:var(--text-xl)]">
                  {v.title}
                </h3>
                <p className="mt-[var(--space-2xs)] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                  {v.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------- payouts --- */}
        <section
          aria-labelledby="payouts-heading"
          className="bg-ink-surface text-on-ink"
        >
          <div className="flag-bar h-[3px]" aria-hidden />
          <div className="shell py-[var(--space-2xl)]">
            <h2
              id="payouts-heading"
              className="max-w-[18ch] text-[length:var(--text-3xl)] text-on-ink"
            >
              How the money lands.
            </h2>
            <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-on-ink-muted">
              Escrow protects you as much as the buyer: funded before you
              truck, released against a gate count, never hostage to a client
              who stops answering.
            </p>

            <ol className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] md:grid-cols-3 md:gap-[var(--space-xl)]">
              {PAYOUT_STEPS.map((s) => (
                <li
                  key={s.n}
                  className="min-w-0 border-t border-ink-rule pt-[var(--space-sm)]"
                >
                  <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent">
                    {s.n}
                  </span>
                  <h3 className="mt-[var(--space-2xs)] text-[length:var(--text-xl)] text-on-ink">
                    {s.title}
                  </h3>
                  <p className="mt-[var(--space-2xs)] text-[length:var(--text-base)] leading-[1.6] text-on-ink-muted">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------- disputes --- */}
        <section
          aria-labelledby="disputes-heading"
          className="shell py-[var(--space-2xl)]"
        >
          <div className="grid gap-[var(--space-lg)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-[var(--space-2xl)]">
            <h2
              id="disputes-heading"
              className="max-w-[14ch] text-[length:var(--text-3xl)]"
            >
              When a delivery is contested.
            </h2>
            <div className="min-w-0 max-w-[56ch]">
              <p className="text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                A buyer can flag an order as short or damaged within 48 hours
                of the signed delivery receipt. The moment they do, the
                disputed amount freezes in escrow — anything already confirmed
                stays released to you — and a human mediator picks the case up
                within one working day.
              </p>
              <p className="mt-[var(--space-sm)] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                You make your case with the paper you already have: the
                delivery receipt, the tally photos your driver took at the
                gate, the mill certificates if grade is questioned. Outcomes
                are full release, partial release for the confirmed count, or
                a return with hauling billed to whoever the paper says is at
                fault.
              </p>
              <p className="mt-[var(--space-sm)] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                Dispute history cuts both ways: a pattern of short deliveries
                risks the Verified badge, and a buyer who disputes habitually
                loses the benefit of the doubt with the mediation team.
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- sign-up --- */}
        <section
          aria-labelledby="signup-heading"
          className="shell border-t border-rule py-[var(--space-2xl)]"
        >
          <div className="grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[var(--space-2xl)]">
            <div className="min-w-0">
              <h2
                id="signup-heading"
                className="max-w-[14ch] text-[length:var(--text-3xl)]"
              >
                Open your shop.
              </h2>
              <p className="mt-[var(--space-sm)] max-w-[44ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
                Three short sections — the business, who to reach, and where
                the stock sits. Document upload and the delivery check are
                scheduled after review, not before, so this really does take
                minutes.
              </p>
            </div>
            <SignupForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
