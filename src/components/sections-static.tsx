import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IMG } from "@/data/images";
import { STEPS } from "@/data/marketplace";

/* Server Components — no state, no handlers, so unlike the rest of the home
   sections these two ship no hydration JS. Kept out of sections.tsx purely
   because its file-level "use client" would drag them into the bundle. */

/* ---------------------------------------------------------- how it works --- */

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="shell py-[var(--space-2xl)]">
      <h2 id="how-heading" className="max-w-[18ch] text-[length:var(--text-4xl)]">
        Three steps between a quote and a delivery receipt.
      </h2>

      {/* Staggered, not a 3-equal-column card row: each step starts lower than
          the last so the sequence reads as a descent, not a comparison table. */}
      <ol className="step-stagger mt-[var(--space-xl)] grid items-start gap-[var(--space-lg)] md:grid-cols-3 md:gap-[var(--space-xl)]">
        {STEPS.map((s) => (
          <li key={s.n} className="min-w-0 border-t-2 border-ink pt-[var(--space-sm)]">
            <span className="tnum font-display text-[length:var(--text-2xl)] font-extrabold text-accent-deep">
              {s.n}
            </span>
            <h3 className="mt-[var(--space-2xs)] text-[length:var(--text-xl)]">
              {s.title}
            </h3>
            <p className="mt-[var(--space-2xs)] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------- sell strip --- */

export function SellStrip() {
  return (
    <section aria-labelledby="sell-heading" className="shell pb-[var(--space-2xl)]">
      <div className="grid overflow-hidden rounded-lg border border-rule bg-paper-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div className="min-w-0 p-[var(--space-lg)] md:p-[var(--space-xl)]">
          <h2 id="sell-heading" className="text-[length:var(--text-3xl)]">
            Got stock sitting in the yard?
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[46ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            List it in about four minutes. No listing fee, no monthly plan — a
            flat 3% only when the buyer releases payment. Overruns, off-cuts and
            surplus move fastest.
          </p>
          <div className="mt-[var(--space-md)] flex flex-wrap gap-[var(--space-2xs)]">
            <a
              href="#"
              className="ctl inline-flex min-h-11 items-center gap-[var(--space-3xs)] rounded-sm bg-accent px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-accent-ink transition-colors duration-[var(--dur-short)] hover:bg-accent-hover nowrap"
            >
              Start a listing
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a
              href="#"
              className="ctl inline-flex min-h-11 items-center rounded-sm border border-rule bg-paper px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--dur-short)] hover:border-ink nowrap"
            >
              How selling works
            </a>
          </div>
        </div>

        <div className="relative min-h-[13rem] bg-paper-3">
          <Image
            src={IMG.welding}
            alt="A welder working on a steel frame"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
