# BuildRepublic

![License: MIT](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

BuildRepublic is a front-end prototype of a Philippine construction marketplace: browse construction materials, tools and tradespeople, compare a price index, and view supplier directories across Metro Manila, Cebu and Davao. All suppliers, listings and prices are illustrative seed data in `src/data/`; there is no backend.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
npm run test:ui  # Playwright-based homepage check (tests/homepage.mjs)
```

## Structure

- `src/app/` - Next.js App Router pages: browse, category, listing, price-index, supplier(s), trades, sell, how-it-works
- `src/components/` - shared UI (header, footer, hero, listing cards, marketplace provider)
- `src/data/` - seed data for listings, suppliers, trades and prices
- `tokens.css` - design tokens
- `docs/` - platform blueprint notes
- `tests/` - data and UI checks

## License

MIT - see [LICENSE](LICENSE).
