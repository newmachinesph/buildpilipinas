import type { Metadata } from "next";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TRADES } from "@/data/marketplace";
import { TradesDirectory } from "./_components/trades-directory";

/* /trades — the labour side of the shelf. Static seed data, one client island
   (the region/role filters); the hero and the escrow band ship no JS. The
   header needs MarketplaceProvider for its search state, same shell as home. */

export const metadata: Metadata = {
  title: "Hire the crew — BuildRepublic",
  description:
    "Credentialled masons, electricians, welders and more with quoted day rates, checked TESDA and PRC credentials, and named workers by area.",
};

/* Escrow, restated for day rates. The homepage version is written for
   deliveries ("pay on release, not on promise"); this one answers the labour
   question — what counts as delivered when the thing delivered is a workday. */
const LABOUR_ESCROW = [
  {
    n: "01",
    title: "The job post is the contract",
    body: "Day count, the quoted rate and what it covers — plastering to two coats, fittings by you — agreed in writing before day one. Vague scope is where disputes start, so a post won't publish without it.",
  },
  {
    n: "02",
    title: "Fund the milestone, not the whole build",
    body: "You load escrow a week or a stage at a time. The crew sees the money is real before they mobilise, and you never have more at stake than the work in front of you.",
  },
  {
    n: "03",
    title: "Release when you've walked the work",
    body: "Sign off and the funds land the same day. If something stalls, a human mediator is on it within one working day — unreleased milestones stay yours.",
  },
];

export default function TradesPage() {
  const availableNow = TRADES.reduce((n, t) => n + t.available, 0);

  return (
    <MarketplaceProvider>
      <a
        href="#directory"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to the directory
      </a>
      <SiteHeader />
      <main id="main">
        <section
          aria-labelledby="trades-page-heading"
          className="shell py-[var(--space-xl)] md:py-[var(--space-2xl)]"
        >
          <h1
            id="trades-page-heading"
            className="max-w-[14ch] text-[length:var(--text-display-s)]"
          >
            Hire the crew.
          </h1>
          <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            Every rate below is the range credentialled workers actually quote
            — TESDA or PRC, checked by a human against the issuing registry.
            What the rate covers is on the card, so two bids for the same job
            are finally comparable.
          </p>

          <dl className="mt-[var(--space-lg)] flex flex-wrap gap-x-[var(--space-xl)] gap-y-[var(--space-sm)]">
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Available this week
              </dt>
              <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                {availableNow.toLocaleString("en-PH")}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Credentialled roles
              </dt>
              <dd className="tnum font-display text-[length:var(--text-2xl)] font-bold">
                {TRADES.length}
              </dd>
            </div>
            <div>
              <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                Issuing registries
              </dt>
              <dd className="font-display text-[length:var(--text-2xl)] font-bold">
                TESDA · PRC
              </dd>
            </div>
          </dl>
        </section>

        <TradesDirectory />

        <section
          aria-labelledby="labour-escrow-heading"
          className="bg-ink-surface text-on-ink"
        >
          <div className="flag-bar h-[3px]" aria-hidden />
          <div className="shell py-[var(--space-2xl)]">
            <h2
              id="labour-escrow-heading"
              className="max-w-[18ch] text-[length:var(--text-3xl)] text-on-ink"
            >
              Escrow holds for labour, too.
            </h2>
            <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-on-ink-muted">
              The same release-on-confirmation flow that protects a cement
              order protects a day rate. The difference is what
              &ldquo;delivered&rdquo; means — so for labour, it gets written
              down first.
            </p>

            <ol className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] md:grid-cols-3 md:gap-[var(--space-xl)]">
              {LABOUR_ESCROW.map((s) => (
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
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
