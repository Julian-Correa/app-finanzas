# CHANGELOG.md

## Unreleased

### Added

-   Consolidated "Ambos" profile view across all dashboard components, transaction lists, budgets, history snapshots, and calendar/timeline components.
-   Profile selection dropdown inside creation forms (Transactions, Budgets, Debts, Goals) dynamically displayed when the "Ambos" view is active.
-   Dependent dropdown filtering of accounts and categories based on the selected profile to avoid cross-profile assignment errors.
-   "Restablecer cuenta" (Reset account) button in the Settings page Danger Zone with a PostgreSQL RPC `reset_database` to wipe all tables and reload starter seed data.
-   "Eliminar" (Delete goal) button on each expanded goal card in GoalsPage with a confirmation dialog (`goals.delete` / `goals.deleteConfirm` i18n keys, es/en).
-   Console logging of database/API errors on form submissions for easier debugging.
-   Reusable `SkeletonForm` component for rendering shimmer placeholders inside modals/forms during network mutations.
-   Integrated `SkeletonForm` loader when creating or saving data (`isPending` state) across:
    -   Transactions (new and edit transaction)
    -   Budgets (new and edit budget limit)
    -   Debts (new debt and register payment)
    -   Goals (new goal and register contribution)

### Changed

-   `reset_database` no longer seeds demo goals and alerts; a reset now leaves the database in a clean default state (only profiles, accounts and settings).
-   Renamed the "Pareja" profile to "Sol" across settings, switcher dropdowns, translations (ES/EN), and database seed.
-   Removed negative balance constraint on accounts and changed default value of `allow_overdraft` to `true` to allow negative account balances.
-   Enforced positive transaction amounts in the frontend to align with the database check constraint `transactions_amount_positive`.
-   `historyService.getHistorySnapshots` now returns only persisted snapshots, dropping the live-compute fallback for the last 6 months.
-   `saveSnapshot` now resolves immutability by returning a typed `SaveSnapshotOutcome` (`{ status: "created" | "already_exists" }`) instead of upserting. Existing snapshots are no longer overwritten.
-   `historyService.computeSnapshot` no longer fabricates a synthetic `id`/`createdAt`; it returns `Omit<SnapshotData, "id" | "createdAt">` so callers cannot mistake a computed payload for a persisted row.
-   Replaced `upsertSnapshot` (which issued `UPDATE` against the immutable `monthly_snapshots` table) with `insertSnapshotIfAbsent` and added `fetchSnapshot` for single-period lookups. The DB trigger `prevent_monthly_snapshot_mutation` is now respected on the client side.

### Added

-   Typed `SnapshotJson` interface and `coerceSnapshotJson` helper, replacing the previous `unknown` payload with a normalized shape (`transactions`, `accounts`, `debts`, `goals`, `budgets`) and defensive defaults.
-   Integration tests for `historyService` — 9 tests covering `getHistorySnapshots`, `computeSnapshot`, `saveSnapshot` (created, already_exists, concurrent insert, error path), and `diffSnapshots`.
-   New i18n keys for the History page: `history.alreadyExists`, `history.snapshotFinal`, `history.generateCurrent`, `history.immutable`.
-   Status notice banner on `HistoryPage` for "created", "already_exists", and "error" outcomes of `generateSnapshot`, replacing the previous bespoke `generatedMsg` flag.
-   "Immutable" badge in the snapshot metadata card on `HistoryPage`.

### Added (previous)

-   Reusable shimmer loading skeletons via `Skeleton` and `SkeletonCard` components.
-   Scroll-triggered reveal animations with `whileInView` support in shared motion components.
-   Dashboard KPI count-up animations and animated financial score bars.
-   UI animations: Framer Motion integration with `PageTransition`, `MotionCard`, `StaggerContainer`, and `ModalWrapper` components.
-   Route transitions via `AnimatePresence` in `AppLayout` — fade+slide between pages.
-   Entrance animations (fade-in-up + stagger) on all 12 feature pages: cards, lists, metrics.
-   Modal open/close animations (spring scale + fade) across all 5 modal forms.
-   Custom TailwindCSS keyframes: `fade-in`, `fade-in-up`, `fade-in-down`, `scale-in`, `slide-up`.
-   Dark/light mode smooth CSS transitions on background and border colors.
-   Hover lift effect on cards (`MotionCard` with `whileHover`).
-   Vendor chunk `vendor-motion` (127 kB) for Framer Motion code-splitting.
-   Integration tests for all 7 services (`src/services/`) — 30 tests across 8 test files, using `vi.hoisted()` mock pattern.
-   Unit tests for all 9 financial engine modules — 80 tests across 10 test files.
-   Vitest as test runner (`npm run test`).
-   Code-splitting: `React.lazy()` + `Suspense` for all 12 feature pages (load on demand).
-   Vendor chunk splitting via Vite `manualChunks` (react, chart.js, supabase, tanstack-query).
-   Full CRUD mutation queries in `src/supabase/queries.ts` for all entities.
-   TransactionsPage with list, search, type filter, create/edit modal forms.
-   BudgetsPage with per-category progress cards, totals summary, add/edit.
-   DebtsPage with expandable cards, payment tracking, register payment modal.
-   GoalsPage with expandable cards, contributions, ETA, progress bars.
-   ReportsPage with Chart.js bar (income vs expenses), doughnut (category breakdown), and line (cashflow trend) charts; period selector (3/6/12 months); monthly summary table.
-   SimulatorPage with scenario-based what-if engine (sliders for income, expenses, liquidity, debt; baseline vs projected comparison; score breakdown). Never writes to database.
-   PurchaseAdvisorPage with price input, installment selector (1/3/6/12/18/24), engine-based evaluation (decision yes/wait/no, risk level, financial impact breakdown, reasons).
-   TimelinePage with vertical monthly timeline showing transactions, budgets, and debt due dates with month navigation.
-   CalendarPage with monthly grid calendar displaying income, expenses, debt due dates, and goal deadlines per day with event legend.
-   Typed services (`transactionsService`, `budgetsService`, `debtsService`, `goalsService`, `reportsService`, `simulatorService`, `purchaseAdvisorService`).
-   TanStack Query hooks for each feature.

### Added (i18n)

-   Full internationalization with `es` (Argentine Spanish) and `en` (English) support.
-   `LanguageProvider` with browser language auto-detection, `localStorage` persistence, and `document.documentElement.lang` sync.
-   `useTranslation` hook with typed `TranslationKey` union and `{param}` interpolation.
-   `LanguageToggle` component with compact (header icon) and full (sidebar) modes.
-   406 unique keys per language (~810 entries total, es + en) covering all 12 feature pages: dashboard, transactions, budgets, debts, goals, reports, simulator, purchase advisor, timeline, calendar, history, settings.
-   Shell navigation (sidebar, header, bottom nav) fully translated.
-   Locale-aware `locale` export (`es-AR` / `en-US`) from LanguageProvider for future date/number formatting.
-   Sidebar scroll improvements for better usability on smaller screens.

### Fixed

-   Dashboard loading now uses the aggregated Supabase RPC `generate_dashboard` instead of composing multiple raw data fetches on the client.
-   Dashboard debt ratio source was corrected as part of the RPC-backed load path.
-   Timezone-dependent date parsing in engine: replaced `new Date(t.date).getMonth()` with manual string split to avoid UTC-to-local timezone shift that caused incorrect month matching in GMT-3 (Argentina). Affected `calculateCashflow`, `calculateDebtRatio`, and `calculateMonthlyPrediction`.

### Added (History Page)

-   Real HistoryPage implementation replacing the placeholder — monthly snapshot browser with KPI cards (income, expenses, cashflow, debt, savings, financial score).
-   Month-by-month navigation via prev/next buttons and a pill selector of available months.
-   Comparison mode: select a baseline month to diff against the current selection, with delta values, percentage bars, and directional indicators for all 6 KPIs.
-   "Generate Snapshot" button to compute and persist a snapshot for the current month via the `generateSnapshot` mutation (insert-only, respects the `trg_monthly_snapshots_immutable` trigger; see Changed above).
-   `historyService.ts` with `getHistorySnapshots`, `computeSnapshot`, `saveSnapshot`, and `diffSnapshots` functions.
-   `useHistory` TanStack Query hook with `generateSnapshot` mutation and `useSnapshotComparison` helper.
-   Snapshot detail panel showing counts of budgets, transactions, goals, debts, and accounts.
-   Query helpers `fetchSnapshots`, `fetchSnapshot` and `insertSnapshotIfAbsent` in `src/supabase/queries.ts`.
-   22 new translation keys for history page (es/en).

### Added (Settings Page)

-   Real SettingsPage implementation replacing the placeholder with 5 configuration sections.
-   Appearance: theme picker (light/dark/system) and language selector (es/en).
-   Profile: default profile selector (Julián/Pareja/Ambos) wired to `ProfileProvider`.
-   Preferences: animations and notifications toggle switches.
-   Data: CSV/PDF export buttons for the full dataset (see Data Export below).
-   About: version, framework and current language display.
-   `settingsService.ts` with `AppSettings` type, localStorage-first persistence (`finos.settings` key), optional Supabase sync via `loadSettingsFromDb` and `persistSettings`, and `getDefaultProfileId` mapping.
-   `useSettings` TanStack Query hook bridging the theme/language/profile providers with a persist/save flow.
-   Query helpers `fetchSettings` and `upsertSetting` in `src/supabase/queries.ts`.
-   38 new translation keys for settings page (es/en).

### Added (Data Export)

-   `exportService.ts` with `generateCsv` (UTF-8 BOM for Excel compatibility, proper escaping/quotes), `downloadFile`, `downloadCsv` and `printAsPdf` (styled HTML print template with `@page` margins and footer).
-   TransactionsPage: export dropdown with CSV/PDF for the currently filtered transaction list.
-   ReportsPage: CSV/PDF export buttons for the monthly summary table.
-   SettingsPage: full data export of transactions, budgets, debts and goals via CSV and PDF report.
-   6 new translation keys (es/en).

### Added (PWA / Offline)

-   `vite-plugin-pwa@1.3.0` integration with `registerType: "autoUpdate"` and generateSW mode.
-   Web app manifest (`manifest.webmanifest`): FinOS name/short_name, `es-AR` lang, standalone display, dark theme/background color (`#09090B`), icons 64/192/512 + maskable 512.
-   Brand icon set in `public/`: `finos-icon.svg` (source), `favicon.ico`, `apple-touch-icon-180x180.png`, `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png` (generated with `@vite-pwa/assets-generator`).
-   Service worker registration in `main.tsx` via `virtual:pwa-register` (`registerSW({ immediate: true })`); `sw.js` precaches the app shell (46 entries) with SPA `navigateFallback` to `/index.html`.
-   Workbox runtime caching for Supabase REST GET requests (`NetworkFirst`, 3s network timeout, 24h cache) so previously loaded data renders offline.
-   `index.html` PWA metas: description, theme-color, mobile-web-app-capable, apple-touch-icon and mobile status bar settings; new favicon (SVG + ICO).
-   `public/_redirects` SPA fallback (`/* → /index.html 200`) for Netlify deploys.
-   Vendor chunk `vendor-pwa` for the PWA bootstrap code.

### Verified

-   `npm run typecheck` passes.
-   `npm run build` passes (dist includes `sw.js`, `workbox-*.js`, `manifest.webmanifest`).
-   `npm run test -- --run` passes (`119` tests: 80 engine unit + 39 service integration).

### Notes

-   All 12 FinOS feature pages are now implemented with real hooks, services, and UI.
-   History page is backed by persisted immutable snapshots; Settings page has configurable preferences with DB sync; CSV/PDF export is available in Transactions, Reports and Settings.
-   PWA installed: installable on desktop/mobile with offline app shell and cached Supabase reads.
-   Application is feature-complete for v0.1.0.
-   Full i18n (es/en) applied across all pages and layout components.

## 0.1.0 - 2026-07-14

### Added

-   Initial Vite + React 19 + TypeScript project scaffold.
-   TailwindCSS setup with FinOS design tokens.
-   App-level providers for query state, theme and profile scope.
-   Responsive desktop/mobile layout shell.
-   Navigation for all documented FinOS modules.
-   Placeholder pages for Phase 1 routing coverage.
-   Supabase client scaffold and environment example.
-   Dependency lockfile generated after successful installation.
-   No-auth Supabase persistence decision recorded.
-   Phase 2 modular SQL package in `04_Database/`.
-   PostgreSQL enums, tables, indexes, constraints, functions, triggers, views, no-auth RLS policies and seed data.
-   TypeScript database contract in `src/types/database.ts`.
-   Typed Supabase query helpers in `src/supabase/queries.ts`.
-   Deterministic TypeScript financial engine (`src/engine/`) with 10 modules.
-   Dashboard service, TanStack Query hook, and live KPI dashboard page.

### Changed

-   Supabase client is now typed with the generated database contract.
-   SQL generation guide now uses `created_by_profile_id` and `updated_by_profile_id` for the no-auth profile model.
-   Database package README now documents CLI and Supabase SQL Editor execution paths.

### Verified

-   `npm.cmd run typecheck` passes.
-   `npm.cmd run build` passes.

### Known Issues

-   No-auth Supabase persistence is not suitable for public multi-user data isolation.
