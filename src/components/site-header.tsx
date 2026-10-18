"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MapPin, Menu, Search, Truck, X } from "lucide-react";
import { CATEGORIES, CITIES } from "@/data/marketplace";
import { Dropdown } from "./ui/dropdown";
import { scrollToResults, useMarketplace } from "./marketplace-provider";

/* N12 · Announcement banner + retracting nav.
   Banner fill=solid accent, dismissible; the bar below retracts on scroll-down
   and returns on scroll-up so the search never goes far away. */

export function SiteHeader() {
  const {
    query,
    setQuery,
    city,
    setCity,
    category,
    setCategory,
    savedIds,
  } = useMarketplace();

  const [bannerOpen, setBannerOpen] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Only retract once the user is genuinely past the fold, and never
      // while the mobile sheet is open.
      setHidden(y > 220 && y > lastY.current && !menuOpen);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToResults();
  };

  const pickCategory = (name: string) => {
    setCategory(name);
    scrollToResults();
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.name,
    label: c.name,
    hint: c.listings.toLocaleString("en-PH"),
  }));

  const cityOptions = CITIES.map((c) => ({
    value: c.name,
    label: c.name,
    hint: c.region,
  }));

  return (
    <header className="sticky top-0 z-30">
      {bannerOpen && (
        <div className="bg-accent text-accent-ink">
          <div className="shell flex items-center justify-center gap-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)]">
            <Truck size={15} strokeWidth={2} className="shrink-0" />
            <p className="text-center font-medium">
              Free flatbed delivery on orders over ₱25,000 within Metro Manila.
            </p>
            <button
              type="button"
              onClick={() => setBannerOpen(false)}
              aria-label="Dismiss announcement"
              className="ctl ml-[var(--space-2xs)] grid size-6 shrink-0 place-items-center rounded-xs transition-colors duration-[var(--dur-short)] hover:bg-accent-hover"
            >
              <X size={14} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      )}

      <div
        className="bg-paper/92 backdrop-blur-md transition-transform duration-[var(--dur-mid)] ease-[var(--ease-out)]"
        style={{ transform: hidden ? "translateY(-101%)" : "none" }}
      >
        <div className="shell flex items-center gap-[var(--space-md)] py-[var(--space-xs)]">
          <a
            href="#"
            className="flex shrink-0 items-baseline gap-[2px] font-display text-[length:var(--text-xl)] font-extrabold tracking-[-0.045em] nowrap"
          >
            Build
            <span className="text-flag-blue">Republic</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <Dropdown
              label="All categories"
              options={categoryOptions}
              value={category}
              onChange={pickCategory}
              triggerClassName="px-[var(--space-2xs)] text-[length:var(--text-sm)] font-medium text-ink-2 hover:bg-paper-2 hover:text-ink"
              footer={
                <button
                  type="button"
                  onClick={() => setCategory(null)}
                  className="w-full rounded-xs px-[var(--space-2xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] font-medium text-flag-red transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
                >
                  Clear category
                </button>
              }
            />
          </nav>

          <form
            role="search"
            onSubmit={submit}
            className="field hidden min-h-11 min-w-0 flex-1 items-center gap-[var(--space-2xs)] rounded-sm border border-rule bg-paper-2 px-[var(--space-xs)] transition-colors duration-[var(--dur-short)] focus-within:border-flag-blue focus-within:bg-paper md:flex"
          >
            <Search size={16} strokeWidth={2} className="shrink-0 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Portland cement, 10mm rebar, Cebu…"
              aria-label="Search listings"
              className="min-w-0 flex-1 bg-transparent text-[length:var(--text-sm)] outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="ctl grid size-6 shrink-0 place-items-center rounded-xs text-muted transition-colors duration-[var(--dur-short)] hover:text-ink"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            )}
            <span className="hidden h-4 w-px bg-rule lg:block" />
            <div className="hidden lg:block">
              <Dropdown
                label="Location"
                align="end"
                options={cityOptions}
                value={city.name}
                onChange={(name) =>
                  setCity(CITIES.find((c) => c.name === name) ?? CITIES[0])
                }
                icon={<MapPin size={14} strokeWidth={2.25} className="shrink-0" />}
                triggerClassName="text-[length:var(--text-sm)] font-medium text-ink-2 hover:text-flag-blue"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-[var(--space-2xs)] md:ml-0">
            <a
              href="#browse"
              className="ctl relative hidden min-h-11 items-center gap-[var(--space-3xs)] rounded-sm px-[var(--space-2xs)] text-[length:var(--text-sm)] font-medium text-ink-2 transition-colors duration-[var(--dur-short)] hover:text-ink sm:inline-flex nowrap"
            >
              <Heart
                size={16}
                strokeWidth={2}
                className={savedIds.length ? "fill-flag-red text-flag-red" : ""}
              />
              Saved
              {savedIds.length > 0 && (
                <span className="tnum rounded-full bg-flag-red px-[var(--space-3xs)] text-[length:var(--text-xs)] font-semibold text-on-ink">
                  {savedIds.length}
                </span>
              )}
            </a>
            {/* Below 400 px "Post a listing" + the menu button overflow the
                row, so the label shortens rather than wrapping to two lines. */}
            <a
              href="#"
              className="ctl inline-flex min-h-11 items-center rounded-sm bg-ink px-[var(--space-xs)] text-[length:var(--text-sm)] font-semibold text-on-ink transition-colors duration-[var(--dur-short)] hover:bg-ink-surface-2 nowrap min-[400px]:px-[var(--space-sm)]"
            >
              <span className="min-[400px]:hidden">Sell</span>
              <span className="hidden min-[400px]:inline">Post a listing</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="ctl grid size-11 place-items-center rounded-sm text-ink transition-colors duration-[var(--dur-short)] hover:bg-paper-2 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile: the search field is too important to hide behind an icon. */}
        <div className="shell flex items-center gap-[var(--space-2xs)] pb-[var(--space-xs)] md:hidden">
          <form
            role="search"
            onSubmit={submit}
            className="field flex min-h-11 min-w-0 flex-1 items-center gap-[var(--space-2xs)] rounded-sm border border-rule bg-paper-2 px-[var(--space-xs)] focus-within:border-flag-blue focus-within:bg-paper"
          >
            <Search size={16} strokeWidth={2} className="shrink-0 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search materials, tools, trades…"
              aria-label="Search listings"
              className="min-w-0 flex-1 bg-transparent text-[length:var(--text-sm)] outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="ctl grid size-6 shrink-0 place-items-center rounded-xs text-muted"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            )}
          </form>
          <Dropdown
            label="Location"
            align="end"
            options={cityOptions}
            value={city.name}
            onChange={(name) =>
              setCity(CITIES.find((c) => c.name === name) ?? CITIES[0])
            }
            icon={<MapPin size={14} strokeWidth={2.25} className="shrink-0" />}
            triggerClassName="shrink-0 border border-rule bg-paper-2 px-[var(--space-2xs)] text-[length:var(--text-xs)] font-medium text-ink-2 max-w-[8.5rem]"
          />
        </div>

        {menuOpen && (
          <nav
            aria-label="Categories"
            className="shell border-t border-rule-2 pb-[var(--space-sm)] pt-[var(--space-xs)] md:hidden"
          >
            <ul className="grid grid-cols-2 gap-x-[var(--space-sm)]">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => {
                      pickCategory(c.name);
                      setMenuOpen(false);
                    }}
                    className={`block w-full rounded-xs py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] font-medium transition-colors duration-[var(--dur-short)] ${
                      category === c.name
                        ? "text-flag-blue"
                        : "text-ink-2 hover:text-ink"
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* The flag bar, once — it closes the header instead of a grey hairline. */}
        <div className="flag-bar h-[3px]" aria-hidden />
      </div>
    </header>
  );
}
