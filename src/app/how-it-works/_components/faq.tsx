import type { ReactNode } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CITIES } from "@/data/marketplace";

/* Native <details> disclosures — the browser owns open/close, so the FAQ
   ships zero JS. The plus rotates to a cross via group-open, CSS only. */

const cityNames = CITIES.map((c) => c.name);
const coverage = `${cityNames.slice(0, -1).join(", ")} and ${cityNames.at(-1)}`;

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Does it cost anything to buy?",
    a: (
      <p>
        No. Buyers pay the listed price and nothing else — no service fee, no
        escrow charge. The platform is paid by the seller: a flat 3% of the
        order, deducted only when you release payment.
      </p>
    ),
  },
  {
    q: "Who arranges the hauling?",
    a: (
      <p>
        The supplier does, and the quote you compare already includes it —
        that&apos;s the landed cost. Orders over ₱25,000 within Metro Manila
        ship free on the supplier&apos;s flatbed; everywhere else the hauling
        line is itemised on the quote before you commit.
      </p>
    ),
  },
  {
    q: "What if the delivery count is short?",
    a: (
      <p>
        Confirm what actually arrived and dispute the difference. Your foreman
        can release payment for the 180 bags on the ground while the missing 20
        stay in escrow. A human mediator picks up the dispute within one
        working day — the held amount doesn&apos;t move until it&apos;s
        settled.
      </p>
    ),
  },
  {
    q: "How long can money sit in escrow?",
    a: (
      <p>
        Until your foreman confirms — that&apos;s the point. If nobody confirms
        or disputes within seven days of the signed delivery receipt, funds
        release automatically, so a seller is never held hostage by a buyer who
        stops answering.
      </p>
    ),
  },
  {
    q: "Which cities do you cover?",
    a: (
      <p>
        Suppliers currently stock and deliver around {coverage}. A listing
        shows its delivery radius, so a Cebu yard never appears in a Davao
        search as if it could truck there.
      </p>
    ),
  },
  {
    q: "I sell materials — how do I get on the shelf?",
    a: (
      <p>
        Listing takes about four minutes and costs nothing up front.{" "}
        <Link
          href="/sell"
          className="font-semibold text-ink underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-ink"
        >
          The seller page
        </Link>{" "}
        walks through fees, verification and payouts.
      </p>
    ),
  },
];

export function Faq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="shell py-[var(--space-2xl)]"
    >
      <h2 id="faq-heading" className="text-[length:var(--text-3xl)]">
        Quick answers
      </h2>
      <div className="mt-[var(--space-lg)] max-w-[46rem] border-b border-rule">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group border-t border-rule py-[var(--space-sm)]"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-[var(--space-sm)] rounded-xs text-[length:var(--text-lg)] font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus
                size={18}
                strokeWidth={2.25}
                aria-hidden
                className="shrink-0 text-muted transition-transform duration-[var(--dur-short)] group-open:rotate-45"
              />
            </summary>
            <div className="mt-[var(--space-2xs)] max-w-[58ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
