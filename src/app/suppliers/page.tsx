import type { Metadata } from "next";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SUPPLIERS } from "@/data/marketplace";
import { SupplierDirectory } from "./_components/supplier-directory";

/* Supplier directory — every yard on the platform, narrowable by trade and
   region. The filtering lives in the client leaf; this page stays server. */

export const metadata: Metadata = {
  title: "Supplier directory — BuildRepublic",
  description:
    "Browse verified construction suppliers across Luzon, Visayas and Mindanao — cement yards, steel centers, lumber dealers and tool traders, filterable by trade and region.",
};

export default function SuppliersPage() {
  return (
    <MarketplaceProvider>
      <a
        href="#directory"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to suppliers
      </a>
      <SiteHeader />
      <main id="main">
        <section
          id="directory"
          aria-labelledby="directory-heading"
          className="shell py-[var(--space-xl)]"
        >
          <div className="mb-[var(--space-lg)]">
            <h1
              id="directory-heading"
              className="text-[length:var(--text-4xl)]"
            >
              Who&apos;s selling
            </h1>
            <p className="mt-[var(--space-2xs)] max-w-[58ch] text-[length:var(--text-base)] text-ink-2">
              All {SUPPLIERS.length} yards trading on the platform. Verified
              suppliers have submitted business permits and passed a delivery
              check; the rest are still in document review.
            </p>
          </div>
          <SupplierDirectory />
        </section>
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
