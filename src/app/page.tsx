import { Hero } from "@/components/hero";
import { MarketplaceProvider } from "@/components/marketplace-provider";
import {
  BrowseGrid,
  CategoryRail,
  NearYouRail,
  SupplierRail,
} from "@/components/rails";
import { PriceIndex, TradesSection } from "@/components/sections";
import { HowItWorks, SellStrip } from "@/components/sections-static";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/* Ecosystem Index — the page is several different cuts of the same catalogue:
   browse by trade, what's moving, what delivers here, the price picture, who
   sells, who builds. No single hero CTA carries the page; the surfaces do.

   Search, category and city live in MarketplaceProvider because the header sets
   them and the sections below read them — all client-side over the static seed
   data in src/data/marketplace.ts. */

export default function Home() {
  return (
    <MarketplaceProvider>
      <a
        href="#browse"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--space-sm)] focus:top-[var(--space-sm)] focus:z-50 focus:rounded-sm focus:bg-ink focus:px-[var(--space-sm)] focus:py-[var(--space-2xs)] focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-on-ink"
      >
        Skip to listings
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <CategoryRail />
        <BrowseGrid />
        <NearYouRail />
        <PriceIndex />
        <SupplierRail />
        <TradesSection />
        <HowItWorks />
        <SellStrip />
      </main>
      <SiteFooter />
    </MarketplaceProvider>
  );
}
