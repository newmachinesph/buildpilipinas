import Link from "next/link";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/* Rendered when /listing/[id] gets an id the catalogue doesn't carry —
   same shell as every other page so the header search is still right there. */

export default function ListingNotFound() {
  return (
    <MarketplaceProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="shell py-[var(--space-3xl)]">
        <h1 className="max-w-[18ch] text-[length:var(--text-4xl)]">
          That listing is off the shelf.
        </h1>
        <p className="mt-[var(--space-sm)] max-w-[52ch] text-[length:var(--text-base)] leading-[1.6] text-ink-2">
          It may have sold out or been taken down by the supplier. The rest of
          the catalogue is still stocked.
        </p>
        <Link
          href="/"
          className="ctl mt-[var(--space-md)] inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap"
        >
          Back to the marketplace
        </Link>
      </main>

      <SiteFooter />
    </MarketplaceProvider>
  );
}
