import { CATEGORY_NAMES, CITIES } from "@/data/marketplace";

/* Markup-only sign-up form. No handler, no action, no server action — this is
   a demo build and the note above the button says so. Everything else is real:
   labels bound by htmlFor, fieldsets with legends, native input types and
   autocomplete tokens, so the markup is what the live form would ship. */

const fieldShell =
  "w-full rounded-sm border border-rule bg-paper px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-base)] transition-colors duration-[var(--dur-short)] hover:border-ink placeholder:text-muted";

const labelCls =
  "mb-[var(--space-3xs)] block text-[length:var(--text-sm)] font-semibold";

const legendCls =
  "mb-[var(--space-sm)] text-[length:var(--text-xs)] font-medium uppercase tracking-[0.1em] text-muted";

export function SignupForm() {
  return (
    <form
      aria-describedby="signup-demo-note"
      className="rounded-lg border border-rule bg-paper-2 p-[var(--space-md)] md:p-[var(--space-lg)]"
    >
      <fieldset className="min-w-0 border-0 p-0">
        <legend className={legendCls}>The business</legend>
        <div className="grid gap-[var(--space-sm)] md:grid-cols-2">
          <div>
            <label htmlFor="seller-business" className={labelCls}>
              Business name
            </label>
            <input
              id="seller-business"
              name="business"
              type="text"
              autoComplete="organization"
              placeholder="San Roque Builders Supply"
              className={fieldShell}
            />
          </div>
          <div>
            <label htmlFor="seller-registration" className={labelCls}>
              DTI or SEC registration number
            </label>
            <input
              id="seller-registration"
              name="registration"
              type="text"
              autoComplete="off"
              placeholder="e.g. 2019-123456"
              className={fieldShell}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-[var(--space-lg)] min-w-0 border-0 p-0">
        <legend className={legendCls}>Who to reach</legend>
        <div className="grid gap-[var(--space-sm)] md:grid-cols-3">
          <div>
            <label htmlFor="seller-contact" className={labelCls}>
              Contact person
            </label>
            <input
              id="seller-contact"
              name="contact"
              type="text"
              autoComplete="name"
              placeholder="Maria dela Cruz"
              className={fieldShell}
            />
          </div>
          <div>
            <label htmlFor="seller-email" className={labelCls}>
              Email
            </label>
            <input
              id="seller-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="yard@example.ph"
              className={fieldShell}
            />
          </div>
          <div>
            <label htmlFor="seller-phone" className={labelCls}>
              Mobile number
            </label>
            <input
              id="seller-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="0917 555 0143"
              className={fieldShell}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-[var(--space-lg)] min-w-0 border-0 p-0">
        <legend className={legendCls}>The yard</legend>
        <div className="grid gap-[var(--space-sm)] md:grid-cols-2">
          <div>
            <label htmlFor="seller-city" className={labelCls}>
              Nearest covered city
            </label>
            <select
              id="seller-city"
              name="city"
              autoComplete="address-level2"
              defaultValue=""
              className={fieldShell}
            >
              <option value="" disabled>
                Choose a city
              </option>
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} — {c.region}
                </option>
              ))}
              <option value="other">Somewhere else</option>
            </select>
          </div>
          <div>
            <label htmlFor="seller-address" className={labelCls}>
              Yard address
            </label>
            <input
              id="seller-address"
              name="address"
              type="text"
              autoComplete="street-address"
              placeholder="Warehouse 4, 210 MacArthur Hwy"
              className={fieldShell}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="seller-category" className={labelCls}>
              Main line of goods
            </label>
            <select
              id="seller-category"
              name="category"
              defaultValue=""
              className={fieldShell}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <p
        id="signup-demo-note"
        className="mt-[var(--space-lg)] max-w-[52ch] text-[length:var(--text-sm)] leading-[1.6] text-muted"
      >
        Demo build — this form doesn&apos;t submit and nothing you type leaves
        the page. On the live platform, this is where document upload and the
        delivery check get scheduled.
      </p>

      <button
        type="submit"
        className="ctl mt-[var(--space-sm)] inline-flex min-h-11 items-center rounded-sm bg-accent px-[var(--space-md)] text-[length:var(--text-sm)] font-semibold text-accent-ink transition-colors duration-[var(--dur-short)] hover:bg-accent-hover nowrap"
      >
        Apply to sell
      </button>
    </form>
  );
}
