# TODO.md

## Current Phase

Application feature-complete for v0.1.0. History page backed by persisted immutable snapshots (no live fallback); `saveSnapshot` returns a typed outcome and respects the DB immutability trigger. Real Settings page with configurable preferences (theme, language, default profile, animations/notifications toggles) with localStorage-first plus optional Supabase sync. CSV/PDF data export shipped across Transactions, Reports and Settings. Full i18n (es/en) implemented across all pages and layout components. PWA with offline app shell, web app manifest and Supabase read caching. All 119 tests pass, typecheck and build clean.

## Completed

### Phase 1 - Documentation
- Product documentation (PRD, Architecture, Design System, Components, Financial Engine specs)
- Business Rules, Financial Rules, Formula Reference, User Flows
- Database specification, MASTER_PROMPT

### Phase 2 - Project Setup & Database
- Vite + React 19 + TypeScript scaffold with TailwindCSS
- Responsive layout, navigation, route placeholders
- App providers (TanStack Query, Theme, Profile)
- Supabase client scaffold, typed queries, database contract
- Modular SQL package with enums, tables, RLS, seed data (executed successfully)

### Phase 3 - Financial Engine
- `src/engine/` — deterministic TypeScript engine (cashflow, liquidity, burn rate, savings rate, debt ratio, budget usage, goal ETA, financial score, predictions, purchase advisor)
- Dashboard service, TanStack Query hook, live KPI dashboard

### Polish — UI Animations, Performance & Skeletons
- Framer Motion integration (PageTransition, MotionCard, StaggerContainer, ModalWrapper)
- Route transitions, staggered lists, animated modals, hover lift, scroll-triggered reveals
- Count-up animations on KPIs, shimmer skeletons
- CSS dark/light mode transitions, custom Tailwind keyframes
- Code-splitting: React.lazy() + Suspense for all 12 pages, vendor chunk splitting
- Reusable shimmer loading skeletons (`Skeleton`, `SkeletonCard`, and new `SkeletonForm` for form modal loading/saving states)
- Integrated `SkeletonForm` in all entity modals (Transactions, Budgets, Debts, Payments, Goals, Contributions) when submitting or loading data

### Phase 4-8 — Feature Pages
- All 12 pages implemented: Dashboard, Transactions, Budgets, Debts, Goals, Reports, Simulator, Purchase Advisor, Timeline, Calendar, History, Settings
- Each with dedicated services, TanStack Query hooks, typed forms with React Hook Form + Zod

### i18n
- LanguageProvider with browser detection, localStorage persistence, `es`/`en` support
- `useTranslation` hook with typed TranslationKey union and `{param}` interpolation
- LanguageToggle with compact and full modes
- ~1,080 translation keys covering all 12 pages and shell layout

### Testing
- 80 engine unit tests + 30 service integration tests = 110 total (all passing)
- Vitest test runner configured

### History page (real)
-   `getHistorySnapshots` returns only persisted rows; dropped live-compute fallback.
-   `saveSnapshot` is insert-only and returns `{ status: "created" | "already_exists" }`, respecting the `trg_monthly_snapshots_immutable` trigger.
-   New `insertSnapshotIfAbsent` and `fetchSnapshot` query helpers replace `upsertSnapshot` (which issued a forbidden `UPDATE`).
-   `computeSnapshot` no longer synthesizes `id`/`createdAt`; returns `Omit<SnapshotData, "id" | "createdAt">`.
-   Typed `SnapshotJson` interface with defensive `coerceSnapshotJson` defaults.
-   `HistoryPage` surfaces a status notice (created / already_exists / error) instead of the bespoke `generatedMsg` flag; adds an "Immutable" badge and new i18n keys (`history.alreadyExists`, `history.snapshotFinal`, `history.generateCurrent`, `history.immutable`).
-   9 integration tests added for `historyService` (119 total).

### Settings page (real)
-   `settingsService.ts` with `AppSettings` type, localStorage-first persistence (`finos.settings`), optional Supabase sync (`loadSettingsFromDb` / `persistSettings`) and `getDefaultProfileId` mapping.
-   `useSettings` hook bridging theme/language/profile providers with a persist/save flow.
-   `fetchSettings` and `upsertSetting` query helpers in `src/supabase/queries.ts`.
-   `SettingsPage` with 5 sections: Appearance (theme light/dark/system, language es/en), Profile (Julián/Pareja/Ambos), Preferences (animations, notifications toggles), Data (export buttons) and About (version, framework, language).
-   38 new translation keys (es/en).

### Data export (CSV/PDF)
-   `exportService.ts`: `generateCsv` (UTF-8 BOM, CSV escaping), `downloadFile`, `downloadCsv`, `printAsPdf` (styled HTML print template).
-   TransactionsPage: CSV/PDF export of the filtered transaction list.
-   ReportsPage: CSV/PDF export of the monthly summary table.
-   SettingsPage: full dataset export (transactions, budgets, debts, goals) via CSV and PDF report.
-   6 new translation keys (es/en).

### PWA / offline
-   `vite-plugin-pwa@1.3.0` with `registerType: "autoUpdate"` and generateSW mode.
-   Web app manifest (name, short_name, `es-AR`, standalone, `#09090B` theme/background, icons 64/192/512 + maskable).
-   Brand icon set in `public/` generated from `finos-icon.svg` via `@vite-pwa/assets-generator` (favicon.ico, apple-touch-icon, pwa-64/192/512, maskable-512).
-   Service worker registration in `main.tsx`; `sw.js` precaches app shell (46 entries) with SPA `navigateFallback` to `/index.html`.
-   Workbox runtime caching for Supabase REST GETs (`NetworkFirst`, 3s timeout, 24h cache).
-   Updated `index.html` with PWA/Apple metas and favicons; added `public/_redirects` SPA fallback for Netlify.
-   Vendor chunk `vendor-pwa`.

## Future / Optional
-   E2E tests (Playwright/Cypress)
-   Keyboard shortcuts and accessibility audit
