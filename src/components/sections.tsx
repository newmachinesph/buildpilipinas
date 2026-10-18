"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Hammer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PRICE_INDEX, TRADES, formatPeso, type PriceRow } from "@/data/marketplace";
import { useMarketplace } from "./marketplace-provider";

/* HowItWorks and SellStrip are static and live in sections-static.tsx so they
   stay Server Components instead of riding this file's "use client". */

/* ----------------------------------------------------------------- trades --- */

export function TradesSection() {
  const { city } = useMarketplace();
  const [scope, setScope] = useState<"all" | "region">("all");

  const trades = useMemo(
    () => (scope === "all" ? TRADES : TRADES.filter((t) => t.region === city.region)),
    [scope, city],
  );

  return (
    <section
      aria-labelledby="trades-heading"
      className="shell border-t border-rule py-[var(--space-2xl)]"
    >
      <div className="grid gap-[var(--space-lg)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[var(--space-2xl)]">
        <div className="min-w-0 lg:sticky lg:top-[9rem] lg:self-start">
          <h2 id="trades-heading" className="text-[length:var(--text-3xl)]">
            Hire the crew, not just the cement.
          </h2>
          <p className="mt-[var(--space-sm)] max-w-[46ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
            Every tradesperson listed here has uploaded a TESDA or PRC
            credential that a human on our side has checked against the issuing
            registry. Rates are what they actually quote — not a lead-gen
            teaser.
          </p>

          <div
            role="group"
            aria-label="Filter trades by area"
            className="mt-[var(--space-md)] inline-flex rounded-sm border border-rule p-[2px]"
          >
            {(
              [
                ["all", "All of PH"],
                ["region", city.region],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setScope(key)}
                aria-pressed={scope === key}
                className={`ctl min-h-11 rounded-xs px-[var(--space-sm)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--dur-short)] nowrap ${
                  scope === key
                    ? "bg-ink text-on-ink"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div>
            <a
              href="#"
              className="ctl mt-[var(--space-md)] inline-flex min-h-11 items-center gap-[var(--space-3xs)] rounded-sm border-2 border-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--dur-short)] hover:bg-ink hover:text-on-ink nowrap"
            >
              <Hammer size={16} strokeWidth={2.25} />
              Post a job
            </a>
          </div>
        </div>

        <ul className="min-w-0 border-t border-rule">
          {trades.map((t) => (
            <li key={t.role}>
              <a
                href="#"
                className="flex items-center gap-[var(--space-sm)] border-b border-rule py-[var(--space-sm)] transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--text-lg)] font-semibold tracking-[-0.02em]">
                    {t.role}
                  </p>
                  <p className="mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
                    {t.credential} · {t.areas}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="tnum font-display text-[length:var(--text-base)] font-bold nowrap">
                    {t.rate}
                  </p>
                  <p className="text-[length:var(--text-xs)] text-muted nowrap">
                    {t.basis}
                  </p>
                </div>

                <div className="hidden w-[7rem] shrink-0 text-right sm:block">
                  <p className="tnum text-[length:var(--text-sm)] font-medium text-ink-2 nowrap">
                    {t.available} available
                  </p>
                </div>

                <ArrowUpRight size={18} strokeWidth={2} className="shrink-0 text-muted" />
              </a>
            </li>
          ))}

          {trades.length === 0 && (
            <li className="py-[var(--space-lg)] text-[length:var(--text-base)] text-ink-2">
              No credentialled trades listed in {city.region} yet.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ price index --- */

type PriceCol = keyof Pick<
  PriceRow,
  "material" | "luzon" | "visayas" | "mindanao" | "change"
>;

const PRICE_COLS: { key: PriceCol; label: string; numeric: boolean }[] = [
  { key: "material", label: "Material", numeric: false },
  { key: "luzon", label: "Luzon", numeric: true },
  { key: "visayas", label: "Visayas", numeric: true },
  { key: "mindanao", label: "Mindanao", numeric: true },
  { key: "change", label: "W/W", numeric: true },
];

export function PriceIndex() {
  const [sortCol, setSortCol] = useState<PriceCol>("material");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const copy = [...PRICE_INDEX];
    copy.sort((a, b) => {
      const x = a[sortCol];
      const y = b[sortCol];
      const cmp =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y));
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [sortCol, asc]);

  const toggle = (col: PriceCol) => {
    if (col === sortCol) {
      setAsc((v) => !v);
    } else {
      setSortCol(col);
      setAsc(true);
    }
  };

  return (
    <section aria-labelledby="index-heading" className="bg-ink-surface text-on-ink">
      <div className="flag-bar h-[3px]" aria-hidden />

      <div className="shell py-[var(--space-2xl)]">
        <div className="mb-[var(--space-lg)] flex flex-col gap-[var(--space-2xs)] sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 id="index-heading" className="text-[length:var(--text-3xl)] text-on-ink">
              This week&rsquo;s material index
            </h2>
            <p className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] text-on-ink-muted">
              Median asking price across active listings, by island group. Tap a
              column to sort. Sample data for this demo build.
            </p>
          </div>
          <a
            href="#"
            className="ctl inline-flex min-h-11 shrink-0 items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-semibold text-accent underline decoration-ink-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-accent nowrap"
          >
            Download CSV
            <ArrowRight size={15} strokeWidth={2.5} />
          </a>
        </div>

        {/* Focusable region: on narrow screens the table overflows sideways,
            and a scroll container needs focus before arrow keys can move it. */}
        <div
          role="region"
          aria-labelledby="index-heading"
          tabIndex={0}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">
              Median material prices by island group, week on week. Sortable.
            </caption>
            <thead>
              <tr className="border-b border-ink-rule text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-on-ink-muted">
                {PRICE_COLS.map((c) => {
                  const active = sortCol === c.key;
                  return (
                    <th
                      key={c.key}
                      scope="col"
                      aria-sort={
                        active ? (asc ? "ascending" : "descending") : "none"
                      }
                      className={c.numeric ? "text-right" : ""}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(c.key)}
                        className={`ctl inline-flex min-h-11 items-center gap-[var(--space-3xs)] font-medium uppercase tracking-[0.1em] transition-colors duration-[var(--dur-short)] hover:text-on-ink nowrap ${
                          active ? "text-accent" : ""
                        }`}
                      >
                        {c.label}
                        {active &&
                          (asc ? (
                            <ArrowUp size={12} strokeWidth={2.5} />
                          ) : (
                            <ArrowDown size={12} strokeWidth={2.5} />
                          ))}
                      </button>
                    </th>
                  );
                })}
                <th scope="col" className="font-medium">
                  <span className="sr-only">Unit</span>
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-[length:var(--text-sm)]">
              {rows.map((r) => {
                const up = r.change > 0;
                const flat = r.change === 0;
                return (
                  <tr key={r.material} className="border-b border-ink-rule/60">
                    <th
                      scope="row"
                      className="py-[var(--space-xs)] pr-[var(--space-sm)] font-body text-[length:var(--text-base)] font-medium text-on-ink"
                    >
                      {r.material}
                    </th>
                    <td className="tnum py-[var(--space-xs)] text-right">
                      {formatPeso(r.luzon)}
                    </td>
                    <td className="tnum py-[var(--space-xs)] text-right text-on-ink-muted">
                      {formatPeso(r.visayas)}
                    </td>
                    <td className="tnum py-[var(--space-xs)] text-right text-on-ink-muted">
                      {formatPeso(r.mindanao)}
                    </td>
                    <td className="py-[var(--space-xs)] text-right">
                      <span
                        className={`tnum inline-flex items-center justify-end gap-[var(--space-3xs)] nowrap ${
                          flat
                            ? "text-on-ink-muted"
                            : up
                              ? "text-flag-red-on-ink"
                              : "text-flag-blue-on-ink"
                        }`}
                      >
                        {!flat &&
                          (up ? (
                            <TrendingUp size={13} strokeWidth={2.25} />
                          ) : (
                            <TrendingDown size={13} strokeWidth={2.25} />
                          ))}
                        {flat ? "—" : `${up ? "+" : ""}${r.change.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="py-[var(--space-xs)] pl-[var(--space-sm)] text-[length:var(--text-xs)] text-on-ink-muted nowrap">
                      {r.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

