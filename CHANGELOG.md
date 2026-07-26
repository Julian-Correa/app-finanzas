# CHANGELOG.md

## Unreleased

### Changed

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
-   ~1,080 translation keys covering all 12 feature pages: dashboard, transactions, budgets, debts, goals, reports, simulator, purchase advisor, timeline, calendar, history, settings.
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
-   "Generate Snapshot" button to compute and persist a snapshot for the current month via `upsertSnapshot`.
-   `historyService.ts` with `getHistorySnapshots`, `computeSnapshot`, `saveSnapshot`, and `diffSnapshots` functions.
-   `useHistory` TanStack Query hook with `generateSnapshot` mutation.
-   Snapshot detail panel showing counts of budgets, transactions, goals, debts, and accounts.
-   Query helpers `fetchSnapshots` and `upsertSnapshot` in `src/supabase/queries.ts`.
-   22 new translation keys for history page (es/en).

### Verified

-   `npm run typecheck` passes.
-   `npm run build` passes.
-   `npm run test -- --run` passes (`110` tests).

### Notes

-   All 12 FinOS feature pages are now implemented with real hooks, services, and UI.
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
