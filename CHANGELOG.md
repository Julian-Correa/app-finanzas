# CHANGELOG.md

## Unreleased

### Added

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

### Verified

-   `npm.cmd run typecheck` passes.
-   `npm.cmd run build` passes.

### Notes

-   All 12 FinOS feature pages are now implemented with real hooks, services, and UI.
-   Application is feature-complete for v0.1.0.

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
-   Main JS bundle is ~850 kB; consider code-splitting with dynamic imports.
