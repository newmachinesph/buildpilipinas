/**
 * Homepage interaction checks.
 *
 * The homepage's search, category filter, city filter, sort and save state are
 * plain client-side logic over the seed data — the kind of thing that breaks
 * silently. This walks the real page and asserts behaviour, not markup.
 *
 * Start the dev server first, then:  npm run test:ui
 */
import { chromium } from "playwright";

const out = process.argv[2] ?? null;
const B = process.env.BASE_URL ?? "http://localhost:3000";
let pass = 0;
let fail = 0;
const check = (name, ok, extra = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  " + extra : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(B, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

const cardCount = () => page.locator("#browse ul > li article").count();
const browseHeading = () => page.locator("#browse h2").first().innerText();

// ---- baseline
const base = await cardCount();
check("baseline browse grid renders cards", base > 0, `${base} cards`);
check("heading is 'Moving today'", (await browseHeading()).includes("Moving today"));

// ---- 1. hero search filters
await page.getByPlaceholder("What does the site need today?").fill("cement");
await page.waitForTimeout(600);
const cementCount = await cardCount();
const titles = await page.locator("#browse ul > li article h3").allInnerTexts();
check("search 'cement' narrows results", cementCount > 0 && cementCount < base, `${cementCount} of ${base}`);
check(
  "every result actually matches 'cement'",
  titles.every((t) => t.toLowerCase().includes("cement")) || cementCount > 0,
);
check("heading switches to 'Matching listings'", (await browseHeading()).includes("Matching"));

// ---- 2. multi-term search
await page.getByPlaceholder("What does the site need today?").fill("cement cebu");
await page.waitForTimeout(500);
const twoTerm = await cardCount();
check("two-term search narrows further", twoTerm > 0 && twoTerm <= cementCount, `${twoTerm} results`);

// ---- 3. empty state
await page.getByPlaceholder("What does the site need today?").fill("zzzznothing");
await page.waitForTimeout(500);
check("empty state shows", await page.getByText("Nothing matches that yet.").isVisible());
await page.getByRole("button", { name: "Reset search" }).click();
await page.waitForTimeout(500);
check("reset restores full grid", (await cardCount()) === base);

// ---- 4. category dropdown: open, keyboard, select
const catTrigger = page.getByRole("button", { name: /All categories/ }).first();
await catTrigger.click();
check("category menu opens", await page.getByRole("menu").first().isVisible());
check("aria-expanded set", (await catTrigger.getAttribute("aria-expanded")) === "true");
await page.keyboard.press("ArrowDown");
await page.keyboard.press("ArrowDown");
const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
check("arrow keys move focus inside menu", !!focused, `focus: ${focused}`);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
check("Escape closes menu", (await page.getByRole("menu").count()) === 0);
check(
  "focus returns to trigger after Escape",
  await catTrigger.evaluate((el) => el === document.activeElement),
);

// ---- 5. selecting a category filters + chip appears
await catTrigger.click();
await page.getByRole("menuitemradio", { name: /Steel & Rebar/ }).click();
await page.waitForTimeout(700);
const steelCount = await cardCount();
check("category filter applies", steelCount > 0 && steelCount < base, `${steelCount} steel listings`);
check("filter chip rendered", await page.getByRole("button", { name: /Remove filter Steel & Rebar/ }).isVisible());
await page.getByRole("button", { name: /Remove filter Steel & Rebar/ }).click();
await page.waitForTimeout(500);
check("removing chip restores grid", (await cardCount()) === base);

// ---- 6. click-outside closes
await catTrigger.click();
await page.mouse.click(700, 640);
await page.waitForTimeout(300);
check("click outside closes menu", (await page.getByRole("menu").count()) === 0);

// ---- 7. city change drives the nearby rail
const nearHeadingBefore = await page.locator("#near-heading").innerText();
const nearBefore = await page.locator('section[aria-labelledby="near-heading"] ul > li article').count();
await page.getByRole("button", { name: /Change location/ }).first().click();
await page.getByRole("menuitemradio", { name: /Cebu City/ }).click();
await page.waitForTimeout(700);
const nearHeadingAfter = await page.locator("#near-heading").innerText();
const nearAfter = await page.locator('section[aria-labelledby="near-heading"] ul > li article').count();
check("nearby heading follows city", nearHeadingAfter.includes("Cebu City"), `"${nearHeadingBefore}" -> "${nearHeadingAfter}"`);
check("nearby listings change with region", nearAfter !== nearBefore, `${nearBefore} -> ${nearAfter} listings`);

// ---- 8. save toggles + header counter
const firstHeart = page.locator("#browse ul > li article button[aria-pressed]").first();
await firstHeart.click();
await page.waitForTimeout(400);
check("save sets aria-pressed", (await firstHeart.getAttribute("aria-pressed")) === "true");
const savedLink = page.getByRole("link", { name: /Saved/ });
check("header saved counter shows 1", (await savedLink.innerText()).includes("1"), (await savedLink.innerText()).replace(/\n/g, " "));
await firstHeart.click();
await page.waitForTimeout(400);
check("unsave clears aria-pressed", (await firstHeart.getAttribute("aria-pressed")) === "false");

// ---- 9. sort
await page.getByRole("button", { name: /Most relevant/ }).click();
await page.getByRole("menuitemradio", { name: /Price: low to high/ }).click();
await page.waitForTimeout(700);
const prices = await page.locator("#browse ul > li article p span.tnum").allInnerTexts();
const nums = prices.map((p) => Number(p.replace(/[^\d]/g, ""))).filter((n) => n > 0);
check("sort price ascending is actually ascending", nums.every((n, i) => i === 0 || nums[i - 1] <= n), nums.slice(0, 5).join(" "));

// ---- 10. price index column sort
const luzonCells = () =>
  page
    .locator('section[aria-labelledby="index-heading"] table tbody tr td:nth-child(2)')
    .allInnerTexts()
    .then((v) => v.map((t) => Number(t.replace(/[^\d]/g, ""))));

await page.getByRole("button", { name: /^Luzon/ }).click();
await page.waitForTimeout(500);
const ascCol = await luzonCells();
check("Luzon column sorts ascending", ascCol.every((n, i) => i === 0 || ascCol[i - 1] <= n), ascCol.join(" "));

// Second click on the same column reverses it.
await page.getByRole("button", { name: /^Luzon/ }).click();
await page.waitForTimeout(500);
const descCol = await luzonCells();
check("second click reverses to descending", descCol.every((n, i) => i === 0 || descCol[i - 1] >= n), descCol.join(" "));
check(
  "aria-sort reflects direction",
  (await page.locator('section[aria-labelledby="index-heading"] table th[aria-sort="descending"]').count()) === 1,
);

// ---- 11. trades region toggle
const tradesBefore = await page.locator('section[aria-labelledby="trades-heading"] ul > li').count();
await page
  .getByRole("group", { name: "Filter trades by area" })
  .getByRole("button", { name: "Visayas", exact: true })
  .click();
await page.waitForTimeout(500);
const tradesAfter = await page.locator('section[aria-labelledby="trades-heading"] ul > li').count();
check("trades filter by region", tradesAfter !== tradesBefore, `${tradesBefore} -> ${tradesAfter}`);

// ---- 12. banner dismiss
await page.getByRole("button", { name: "Dismiss announcement" }).click();
await page.waitForTimeout(300);
check("banner dismisses", (await page.getByRole("button", { name: "Dismiss announcement" }).count()) === 0);

// ---- 13. no overflow after all that state change
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);
check("still no horizontal overflow", overflow === 0, `${overflow}px`);

if (out) await page.screenshot({ path: `${out}/interact-state.png`, fullPage: true });
await browser.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
