"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { TRADES, slugify, type Region } from "@/data/marketplace";
import { Dropdown } from "@/components/ui/dropdown";

/* The one client island on /trades: two filters over seven static rows.
   Everything around it — hero, escrow band, shell — stays a Server Component. */

const REGION_FILTERS: [Region | "all", string][] = [
  ["all", "All of PH"],
  ["Luzon", "Luzon"],
  ["Visayas", "Visayas"],
  ["Mindanao", "Mindanao"],
];

export function TradesDirectory() {
  const [region, setRegion] = useState<Region | "all">("all");
  const [role, setRole] = useState<string | null>(null);

  const trades = TRADES.filter(
    (t) =>
      (region === "all" || t.region === region) &&
      (role === null || t.role === role),
  );

  const roleOptions = TRADES.map((t) => ({
    value: t.role,
    label: t.role,
    hint: `${t.available}`,
  }));

  const clearFilters = () => {
    setRegion("all");
    setRole(null);
  };

  return (
    <section
      id="directory"
      aria-labelledby="directory-heading"
      className="shell border-t border-rule py-[var(--space-xl)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h2 id="directory-heading" className="text-[length:var(--text-2xl)]">
          The directory
        </h2>

        <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
          <div
            role="group"
            aria-label="Filter trades by region"
            className="inline-flex rounded-sm border border-rule p-[2px]"
          >
            {REGION_FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRegion(key)}
                aria-pressed={region === key}
                className={`ctl min-h-11 rounded-xs px-[var(--space-xs)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--dur-short)] nowrap ${
                  region === key
                    ? "bg-ink text-on-ink"
                    : "text-ink-2 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Dropdown
            label="All roles"
            align="end"
            options={roleOptions}
            value={role}
            onChange={setRole}
            triggerClassName="border border-rule px-[var(--space-xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:border-ink hover:text-ink"
            footer={
              <button
                type="button"
                onClick={() => setRole(null)}
                className="w-full rounded-xs px-[var(--space-2xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] font-medium text-flag-red transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
              >
                Clear role
              </button>
            }
          />

          <p
            aria-live="polite"
            className="tnum text-[length:var(--text-sm)] text-muted nowrap"
          >
            {trades.length} of {TRADES.length} roles
          </p>
        </div>
      </div>

      <ul className="mt-[var(--space-md)] border-t border-rule">
        {trades.map((t) => {
          const headingId = `role-${slugify(t.role)}`;
          return (
            <li key={t.role}>
              <article
                aria-labelledby={headingId}
                className="border-b border-rule py-[var(--space-lg)]"
              >
                <div className="grid gap-[var(--space-md)] sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <h3
                      id={headingId}
                      className="text-[length:var(--text-2xl)]"
                    >
                      {t.role}
                    </h3>
                    <p className="mt-[var(--space-2xs)] flex items-center gap-[var(--space-3xs)] text-[length:var(--text-sm)] font-medium text-flag-blue">
                      <ShieldCheck
                        size={15}
                        strokeWidth={2.25}
                        className="shrink-0"
                        aria-hidden
                      />
                      {t.credential} — checked against the {t.credentialBody}{" "}
                      registry
                    </p>

                    <dl className="mt-[var(--space-sm)] grid max-w-[62ch] gap-[var(--space-xs)]">
                      <div>
                        <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                          Rate covers
                        </dt>
                        <dd className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] leading-[1.6] text-ink-2">
                          {t.covers}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                          Crew
                        </dt>
                        <dd className="mt-[var(--space-4xs)] text-[length:var(--text-sm)] leading-[1.6] text-ink-2">
                          {t.crewSize}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <p className="tnum font-display text-[length:var(--text-2xl)] font-bold nowrap">
                      {t.rate}
                    </p>
                    <p className="text-[length:var(--text-xs)] text-muted">
                      {t.basis}
                    </p>
                    <p className="mt-[var(--space-2xs)] tnum text-[length:var(--text-sm)] font-medium text-ink-2 nowrap">
                      {t.available} available now
                    </p>
                    <p className="mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
                      {t.areas} · {t.region}
                    </p>
                  </div>
                </div>

                <div className="mt-[var(--space-md)]">
                  <p className="text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted">
                    Taking bookings
                  </p>
                  <ul className="mt-[var(--space-2xs)] grid gap-[var(--space-2xs)] sm:grid-cols-3">
                    {t.workers.map((w) => (
                      <li
                        key={w.name}
                        className="min-w-0 rounded-sm border border-rule bg-paper-2 px-[var(--space-xs)] py-[var(--space-2xs)]"
                      >
                        <p className="truncate text-[length:var(--text-sm)] font-semibold">
                          {w.name}
                        </p>
                        <p className="mt-[var(--space-4xs)] text-[length:var(--text-xs)] text-muted">
                          {w.area} · {w.years} yrs on the tools
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          );
        })}

        {trades.length === 0 && (
          <li className="flex flex-wrap items-center gap-[var(--space-sm)] py-[var(--space-lg)]">
            <p className="text-[length:var(--text-base)] text-ink-2">
              No {role ?? "credentialled"} listings in{" "}
              {region === "all" ? "the Philippines" : region} yet.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="ctl inline-flex min-h-11 items-center rounded-sm border border-rule px-[var(--space-sm)] text-[length:var(--text-sm)] font-semibold transition-colors duration-[var(--dur-short)] hover:border-ink nowrap"
            >
              Clear filters
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
