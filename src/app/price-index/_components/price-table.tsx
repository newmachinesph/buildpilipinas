"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";
import { PRICE_INDEX, formatPeso, type PriceRow } from "@/data/marketplace";

/* The homepage band shows this same table cut down; here every column keeps a
   visible label. Sort state is the only reason this file is a client
   component — the section shell, heading and methodology stay server. */

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

export function PriceTable() {
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
    /* Focusable region: on narrow screens the table overflows sideways, and a
       scroll container needs focus before arrow keys can move it. */
    <div
      role="region"
      aria-labelledby="table-heading"
      tabIndex={0}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[42rem] border-collapse text-left">
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
                  aria-sort={active ? (asc ? "ascending" : "descending") : "none"}
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
            <th
              scope="col"
              className="pl-[var(--space-sm)] font-medium uppercase tracking-[0.1em]"
            >
              Unit
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
  );
}
