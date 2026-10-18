import {
  PRICE_INDEX_UPDATED,
  formatPeso,
  type PriceRow,
} from "@/data/marketplace";

/* One material's eleven-week Luzon line: the ten weeks of history plus the
   current quote. The SVG is decoration — the sentence under it and the
   weekly-figures table carry the same information, so the chart is
   aria-hidden rather than badly described. Server Component: <details> gives
   the disclosure for free, no hydration. */

const W = 220;
const H = 56;
const PAD = 5;

function points(values: number[]) {
  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  return values
    .map((v, i) => {
      const x = PAD + (i * (W - PAD * 2)) / (values.length - 1);
      const y =
        range === 0 ? H / 2 : H - PAD - ((v - min) / range) * (H - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

/* ponytail: week-ending dates are derived from PRICE_INDEX_UPDATED, which V8
   parses as "17 July 2026". If the seed date ever changes format, this is the
   line that notices. */
const UPDATED = new Date(PRICE_INDEX_UPDATED);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const shortDate = new Intl.DateTimeFormat("en-PH", {
  day: "numeric",
  month: "short",
});

function weekEnding(idx: number, len: number) {
  return shortDate.format(new Date(UPDATED.getTime() - (len - 1 - idx) * WEEK_MS));
}

export function TrendCard({ row }: { row: PriceRow }) {
  const series = [...row.history, row.luzon];
  const first = series[0];
  const last = series[series.length - 1];
  const delta = last - first;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pct = (delta / first) * 100;
  const isFlat = min === max;
  /* Same signal as the table: red carries a rising price, blue a falling one. */
  const tone =
    delta > 0 ? "text-flag-red" : delta < 0 ? "text-flag-blue" : "text-muted";

  return (
    <div className="min-w-0 border-t-2 border-ink pt-[var(--space-sm)]">
      <h3 className="text-[length:var(--text-lg)]">{row.material}</h3>
      <p className="mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
        per {row.unit} · Luzon median
      </p>

      <div className="mt-[var(--space-sm)] flex items-baseline justify-between gap-[var(--space-sm)]">
        <p className="tnum font-display text-[length:var(--text-2xl)] font-bold">
          {formatPeso(last)}
        </p>
        <p
          className={`tnum text-[length:var(--text-sm)] font-semibold nowrap ${tone}`}
        >
          {delta === 0
            ? "flat"
            : `${delta > 0 ? "+" : ""}${pct.toFixed(1)}% / ${series.length} wk`}
        </p>
      </div>

      <div className={tone}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-[var(--space-2xs)] h-14 w-full"
          aria-hidden="true"
        >
          <polyline
            points={points(series)}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <p className="mt-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[1.6] text-ink-2">
        {isFlat
          ? `Held at ${formatPeso(last)} for the full window.`
          : `${formatPeso(first)} on ${weekEnding(0, series.length)} to ${formatPeso(
              last,
            )} this week; low ${formatPeso(min)}, high ${formatPeso(max)}.`}
      </p>

      <details className="mt-[var(--space-2xs)]">
        <summary className="ctl inline-flex min-h-11 cursor-pointer items-center text-[length:var(--text-sm)] font-semibold text-accent-deep underline decoration-rule underline-offset-4 transition-colors duration-[var(--dur-short)] hover:decoration-accent-deep nowrap">
          Weekly figures
        </summary>
        <table className="w-full border-collapse text-left font-mono text-[length:var(--text-sm)]">
          <caption className="sr-only">
            Weekly Luzon median for {row.material}, oldest first.
          </caption>
          <thead>
            <tr className="border-b border-rule text-[length:var(--text-xs)] uppercase tracking-[0.1em] text-muted">
              <th scope="col" className="py-[var(--space-3xs)] font-medium">
                Week ending
              </th>
              <th
                scope="col"
                className="py-[var(--space-3xs)] text-right font-medium"
              >
                Luzon median
              </th>
            </tr>
          </thead>
          <tbody>
            {series.map((v, i) => {
              const current = i === series.length - 1;
              return (
                <tr key={i} className="border-b border-rule-2">
                  <td
                    className={`py-[var(--space-3xs)] ${current ? "font-semibold" : "text-ink-2"}`}
                  >
                    {weekEnding(i, series.length)}
                    {current && " — this week"}
                  </td>
                  <td
                    className={`tnum py-[var(--space-3xs)] text-right ${current ? "font-semibold" : "text-ink-2"}`}
                  >
                    {formatPeso(v)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </div>
  );
}
