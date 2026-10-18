const META_LINKS = [
  "About",
  "Buyer protection",
  "Seller fees",
  "Delivery partners",
  "Help centre",
  "Terms",
  "Privacy",
];

/* Ft5 · Statement — one closing line carries the footer; the meta row beneath
   is small, muted, and single-rowed. Not a four-column sitemap. */

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink-surface text-on-ink">
      <div className="shell py-[var(--space-2xl)]">
        <p className="min-w-0 max-w-[16ch] font-display text-[length:var(--text-display-s)] font-extrabold leading-[1.02] tracking-[-0.035em] text-on-ink [overflow-wrap:anywhere]">
          Every yard in the country, on one shelf.
        </p>

        <div className="flag-bar mt-[var(--space-2xl)] h-[3px] w-[7rem]" aria-hidden />

        <div className="mt-[var(--space-md)] border-t border-ink-rule pt-[var(--space-md)]">
          <div className="flex flex-col gap-[var(--space-md)] lg:flex-row lg:items-center lg:justify-between">
            <p className="flex items-baseline gap-[var(--space-4xs)] font-display text-[length:var(--text-lg)] font-extrabold tracking-[-0.045em]">
              Build<span className="text-flag-blue-on-ink">Republic</span>
            </p>

            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-[var(--space-md)] gap-y-[var(--space-2xs)]">
                {META_LINKS.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[length:var(--text-sm)] text-on-ink-muted transition-colors duration-[var(--dur-short)] hover:text-on-ink nowrap"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="mt-[var(--space-md)] text-[length:var(--text-xs)] text-on-ink-muted">
            Demo build. Listings, suppliers, trades and prices on this page are
            sample data, not live inventory. Photography via Unsplash.
          </p>
        </div>
      </div>
    </footer>
  );
}
