# PROJECT_MEMORY.md

> Living project memory for FinOS.
>
> This document must be updated after every meaningful development
> session. It serves as long-term memory for developers and AI agents.
> Never delete historical entries; append new ones.

------------------------------------------------------------------------

# Project Overview

**Project:** FinOS

**Status:** v0.1.0 — Feature-complete with full i18n (es/en), real History page backed by persisted immutable snapshots, real Settings page with configurable preferences, CSV/PDF data export, and PWA/offline support.

**Version:** 0.1.0

**Current Phase:** v0.1.0 complete — all 12 feature pages implemented, UI animations polished, i18n applied across all pages and layout, History module migrated to insert-only persistence semantics, Settings with localStorage-first + DB sync, CSV/PDF export shipped. 119 tests passing.

------------------------------------------------------------------------

# Vision

Build a premium Personal Financial Operating System for Argentina with
SaaS-level quality, focused on helping users make better financial
decisions through deterministic analysis, forecasting and simulations.

------------------------------------------------------------------------

# Current Stack

-   React 19
-   Vite
-   TypeScript
-   TailwindCSS
-   shadcn/ui
-   Supabase
-   Chart.js
-   Framer Motion
-   TanStack Query
-   React Hook Form
-   Zod
-   Netlify
-   i18n (built-in, no external library)

------------------------------------------------------------------------

# Documentation Status

  Document               Status
  ---------------------- --------
  PRD                    ✅
  Architecture           ✅
  Database               ✅
  Design System          ✅
  Components             ✅
  Financial Engine       ✅
  Business Rules         ✅
  Financial Rules        ✅
  Formula Reference      ✅
  SQL Generation Guide   ✅
  MASTER_PROMPT          ✅
  CHANGELOG              ✅
  PROJECT_MEMORY         ✅
  TODO                   ✅

------------------------------------------------------------------------

# Architecture Decisions

## ADR-001

Feature-Based Architecture.

Reason: Scalable, modular and easier maintenance.

------------------------------------------------------------------------

## ADR-002

Supabase over Firebase.

Reason: PostgreSQL, SQL, RLS and better relational modeling.

------------------------------------------------------------------------

## ADR-003

No Supabase Auth for v1.

Reason: Product requirement is no authentication; Supabase is used only to persist app data remotely.

Implication: RLS policies cannot rely on `auth.uid()` or authenticated user isolation. This is acceptable only for trusted/private deployment.

------------------------------------------------------------------------

## ADR-004

Chart.js selected.

Reason: Lightweight, flexible and sufficient for dashboard needs.

------------------------------------------------------------------------

## ADR-005

React + Vite.

Reason: Fast development, modern ecosystem and optimized build.

------------------------------------------------------------------------

# Development Progress

## Phase 1 --- Documentation

Status: ✅ Complete

Completed:

-   Product documentation
-   Architecture
-   Design System
-   Financial rules
-   Database specification
-   Component specification
-   Master Prompt

Pending:

-   SQL generation
-   Initial project scaffold

------------------------------------------------------------------------

## Phase 2 --- Project Setup

Status: ✅ Complete

------------------------------------------------------------------------

## Phase 3 --- Database

Status: ✅ Complete (SQL executed against Supabase)

------------------------------------------------------------------------

## Phase 4 --- Feature Pages & Polish

Status: ✅ Complete

Includes: all 12 feature pages, code-splitting, tests, animations, dashboard optimization, i18n, real History/Settings pages, CSV/PDF data export.

------------------------------------------------------------------------

# Known Risks

-   Financial calculations must remain deterministic.
-   Documentation and implementation may diverge if not updated.
-   Performance of dashboard queries must be monitored.
-   Simulator must never affect production data.
-   No-auth Supabase persistence is not a security boundary for public multi-user deployments.

------------------------------------------------------------------------

# Open Questions

-   Will the no-auth persistence model remain private/trusted deployment only?
-   Will profiles eventually synchronize across devices?
-   Will investments be included in v2?

------------------------------------------------------------------------

# Session Log

## Session 001

Date: YYYY-MM-DD

Completed:

-   Defined project vision.
-   Completed core documentation.
-   Established architecture.
-   Defined financial engine.
-   Defined database model.

Pending:

-   Generate SQL.
-   Bootstrap application.

Notes:

Initial planning completed.

------------------------------------------------------------------------

## Session 002

Date: 2026-07-14

Completed:

-   Bootstrapped Vite + React 19 + TypeScript strict project structure.
-   Added TailwindCSS configuration and global styles.
-   Added feature-based `src` structure.
-   Added app providers for TanStack Query, theme and profile scope.
-   Added responsive app layout with desktop sidebar, mobile bottom navigation, header and floating action button.
-   Added route placeholders for Dashboard, Transactions, Budgets, Debts, Goals, Timeline, Calendar, Reports, Simulator, Purchase Advisor, History and Settings.
-   Added Supabase client scaffold isolated under `src/supabase`.
-   Added `.env.example` for Supabase configuration.

Pending:

-   Install dependencies successfully in this Windows environment.
-   Run `npm.cmd run typecheck` and `npm.cmd run build` after dependencies install.
-   Resolve authentication vs no-auth/RLS decision before Phase 2 database work.

Notes:

PowerShell blocks direct `npm` execution through `npm.ps1`; use `npm.cmd`. Dependency installation repeatedly timed out and did not create `node_modules` or `package-lock.json`.

------------------------------------------------------------------------

## Session 003

Date: 2026-07-14

Completed:

-   Installed dependencies successfully with `npm.cmd install`.
-   Generated `package-lock.json`.
-   Verified TypeScript with `npm.cmd run typecheck`.
-   Verified production build with `npm.cmd run build`.
-   Confirmed no Phase 1 code fixes were required after verification.

Pending:

-   Get approval before starting Phase 2 database work.

Notes:

Phase 1 implementation is now installed and verified in this Windows environment. Continue using `npm.cmd` for npm scripts in PowerShell.

Decision update: user confirmed the app will not have authentication and Supabase will be used only for data persistence.

------------------------------------------------------------------------

## Session 004

Date: 2026-07-14

Completed:

-   Started Phase 2 after user approval.
-   Generated modular SQL package under `04_Database/` with extensions, enums, tables, indexes, constraints, functions, triggers, views, no-auth RLS policies and seed data.
-   Added `04_Database/schema.sql` with ordered script includes.
-   Added `04_Database/README.md` documenting execution order and no-auth persistence risk.
-   Added typed database contract in `src/types/database.ts`.
-   Typed the Supabase client with `Database`.
-   Added typed query helpers in `src/supabase/queries.ts`.
-   Verified `npm.cmd run typecheck` and `npm.cmd run build`.

Pending:

-   Execute the SQL package against a fresh Supabase project.
-   Fix SQL runtime issues if Supabase reports any during execution.
-   Get approval before starting Phase 3.

Notes:

Local `psql` is not installed in this Windows environment, so SQL syntax/runtime validation could not be executed locally. Phase 2 code artifacts are generated and TypeScript-valid.

------------------------------------------------------------------------

## Session 005

Date: 2026-07-14

Completed:

-   Resumed from Phase 2 pending SQL execution.
-   Confirmed `psql` is not installed locally.
-   Confirmed Supabase CLI is not installed locally.
-   Re-ran `npm.cmd run typecheck` successfully.
-   Re-ran `npm.cmd run build` successfully.
-   Updated `04_Database/README.md` with execution options for `psql`, Supabase CLI and Supabase SQL Editor.
-   Updated `TODO.md` with the explicit tooling/dashboard prerequisite.

Pending:

-   Execute the SQL package against a fresh Supabase project using `psql`, Supabase CLI or Supabase SQL Editor.
-   Fix SQL runtime issues if Supabase reports any during execution.
-   Get approval before starting Phase 3.

Notes:

The project remains locally valid. The current blocker is external database execution, not TypeScript/build correctness.

---

## Session 006

Date: 2026-07-14

Completed:

-   Executed SQL package (001-010) against Supabase via SQL Editor successfully (no errors).
-   Started Phase 3 after user approval.
-   Created `src/engine/` — deterministic TypeScript financial engine with modular calculations:
    -   `cashflow.ts` — income, expenses, net cashflow, cashflow status
    -   `liquidity.ts` — total available cash, liquidity ratio, liquidity level
    -   `burnRate.ts` — daily burn rate, monthly prediction
    -   `savingsRate.ts` — savings rate calculation and level
    -   `debtRatio.ts` — debt/income ratio, total debt, ratio level
    -   `budgetUsage.ts` — usage %, budget status, discipline score
    -   `goalEta.ts` — estimated months remaining, progress %, goal score
    -   `financialScore.ts` — 0-100 health score from 6 weighted components
    -   `predictions.ts` — monthly expense/income/cashflow projections
    -   `purchaseAdvisor.ts` — purchase evaluation with decision matrix
    -   `types.ts` — shared engine types and interfaces
    -   `index.ts` — unified re-exports
-   Updated `src/supabase/queries.ts` — added query helpers for transactions, budgets, debts, debt payments, goals, alerts, categories.
-   Created `src/services/dashboardService.ts` — aggregates Supabase data through engine calculations and produces full `DashboardData`.
-   Created `src/features/dashboard/hooks/useDashboard.ts` — TanStack Query hook for dashboard data.
-   Updated `DashboardPage.tsx` — replaces placeholders with live KPIs (cashflow, liquidity, score, debt ratio, burn rate, savings rate), score breakdown bars, and alert list.
-   Verified `npm.cmd run typecheck` and `npm.cmd run build` pass.

Pending:

-   Implement remaining feature pages (transactions, budgets, debts, goals, etc.) with real hooks/services.
-   Add Chart.js visualizations to dashboard.
-   Implement simulator engine.
-   Implement purchase advisor UI.

Notes:

Phase 3 engine is pure TypeScript, deterministic, no external dependencies beyond database types. All calculations mirror the SQL-side engine but operate on in-memory data fetched from Supabase.

---

## Session 007

Date: 2026-07-14

Completed:

-   Implemented TransactionsPage with full CRUD (list, search, filter, create/edit modal).
-   Implemented BudgetsPage with progress bars, per-category cards, total summary.
-   Implemented DebtsPage with expandable cards, payment tracking, payment form.
-   Implemented GoalsPage with expandable cards, contributions, ETA, progress.
-   Implemented ReportsPage with Chart.js visualizations (bar, doughnut, line charts).
-   Added mutation queries to `src/supabase/queries.ts` for all entities (create, update, soft-delete).
-   Created typed services (`transactionsService`, `budgetsService`, `debtsService`, `goalsService`, `reportsService`).
-   Created TanStack Query hooks for each feature.
-   Updated PROJECT_MEMORY.md, TODO.md, CHANGELOG.md.
-   Verified `npm.cmd run typecheck` and `npm.cmd run build` pass.

Pending:
-   Implement SimulatorPage, PurchaseAdvisorPage, TimelinePage, CalendarPage.

---

## Session 008

Date: 2026-07-14

Completed:

-   Implemented SimulatorPage with scenario-based what-if engine (sliders for income, expenses, liquidity, debt; baseline vs projected comparison; score breakdown).
-   Implemented PurchaseAdvisorPage with price input, installment selector, engine-based evaluation (decision yes/wait/no, risk level, financial impact breakdown, reasons).
-   Implemented TimelinePage with vertical monthly timeline of transactions, budgets, and debt due dates (month navigation).
-   Implemented CalendarPage with monthly grid calendar displaying income, expenses, debt due dates, and goal deadlines per day.
-   Created services (`simulatorService`, `purchaseAdvisorService`) and TanStack Query hooks.
-   Simulator explicitly never writes to database (in-memory projections only).
-   Verified `npm.cmd run typecheck` and `npm.cmd run build` pass.

Pending:
-   No pending feature pages. All core FinOS modules are implemented.
-   Optional: code-split large bundles, add tests, polish UI animations.

Notes:

All 12 FinOS feature pages are now implemented with real hooks, services, and UI. The application is feature-complete for v0.1.0.

------------------------------------------------------------------------

## Session 009

Date: 2026-07-15

Completed:

-   Added Vitest as test runner with `npm run test` script.
-   Created 80 unit tests across 10 test files covering all 9 engine modules.
-   Verified `npm run typecheck` and `npm run build` pass.

Pending:

-   Code-split large JS bundle (~850 kB) with dynamic imports or rollup manual chunks.
-   Add integration tests for services.
-   Polish UI animations and transitions.
-   Review and optimize dashboard query performance.

Notes:

All engine tests pass (80/80).

---

## Session 010

Date: 2026-07-15

Completed:

-   Code-split all 12 feature pages using `React.lazy()` + `Suspense` — each page loads on demand.
-   Added Vite `manualChunks` to split vendor libraries: react (202 kB), chart.js (206 kB), supabase (211 kB), tanstack-query (35 kB).
-   Initial bundle reduced from 852 kB to ~284 kB (entry + react), remaining chunks loaded lazily.
-   Created 30 integration tests across 8 test files for all 7 services (`src/services/`), using `vi.hoisted()` mock pattern.
-   Fixed timezone-dependent date parsing bug in engine: `cashflow.ts`, `debtRatio.ts`, `predictions.ts` now parse `YYYY-MM-DD` strings manually instead of using `new Date()` to avoid UTC-to-local timezone shift that caused incorrect month matching in Argentina (GMT-3).
-   All 110 tests pass (80 engine unit + 30 service integration).
-   Verified `npm run typecheck` and `npm run build`.
-   Updated PROJECT_MEMORY.md, TODO.md, CHANGELOG.md.

Pending:

-   Polish UI animations and transitions.
-   Review and optimize dashboard query performance.

Notes:

The timezone bug was discovered during service integration test debugging. Dates on the 1st of the month (like `"2026-07-01"`) were being parsed as UTC midnight, which in GMT-3 becomes 9 PM of the previous month's last day, causing `getMonth()` to return the wrong month. Fixed all 3 engine functions that filtered by date.

---

---
 
## Session 011

Date: 2026-07-16

Completed:

-   Added custom TailwindCSS keyframes and animations (`fade-in`, `fade-in-up`, `scale-in`, `slide-up`).
-   Created 4 shared animation components:
    -   `PageTransition` — fade+slide entrance/exit for page routes.
    -   `MotionCard` — staggered card entrance with hover lift effect.
    -   `StaggerContainer` — staggered children reveal container.
    -   `ModalWrapper` — animated modal backdrop + content with spring physics.
-   Wired `AnimatePresence` in `AppLayout` for route transitions (`mode="wait"` with `location.pathname` key).
-   Updated `PageShell` with fade-in hero banner animation.
-   Updated all 12 feature pages with `PageTransition` wrapper, staggered card grids, and animated modals.
-   Replaced all 5 modal overlays (Transaction, Budget, Debt, Goal, Contribution/Payment) with `ModalWrapper`.
-   Added CSS smooth transitions for dark/light mode theme switching (background-color, border-color, color).
-   Verified `npm run typecheck`, `npm run build`, and `npm run test` (110/110 pass).

Pending:

-   Review and optimize dashboard query performance.
-   Add scroll-triggered animations (`whileInView`).
-   Add number count-up animations on dashboard KPIs.
-   Add skeleton loading shimmer animations.

Notes:

Framer Motion was already installed as a dependency but completely unused until this session. The vendor chunk `vendor-motion` (127 kB) is now properly code-split alongside the existing vendor chunks.

---

## Session 012

Date: 2026-07-20

Completed:

-   Added `LanguageProvider` with browser language auto-detection (`navigator.language`), `localStorage` persistence, and `document.documentElement.lang` sync.
-   Created typed `TranslationKey` union (~120 keys) and `useTranslation` hook with `{param}` interpolation support.
-   Created `LanguageToggle` component with compact (header icon, toggle EN/ES) and full (sidebar segmented control) modes.
-   Added 406 unique keys per language (~810 entries, es + en) covering all 12 feature pages and shell layout (sidebar, header, bottom nav).
-   Updated all 12 pages to use `useTranslation()` instead of hardcoded strings:
    -   DashboardPage, TransactionsPage, BudgetsPage, DebtsPage, GoalsPage
    -   ReportsPage, SimulatorPage, PurchaseAdvisorPage, TimelinePage, CalendarPage
    -   HistoryPage, SettingsPage
-   Updated layout components: Sidebar, Header, BottomNavigation, ThemeToggle, ProfileSwitcher.
-   Exposed `locale` from LanguageProvider (`es-AR` / `en-US`) for future date/number formatting.
-   Improved sidebar scroll behavior for better usability on smaller screens.
-   Verified `npm run typecheck`, `npm run build`, and `npm run test -- --run` (110/110 pass).

Pending:

-   Implement real History page with monthly snapshots.
-   Implement real Settings page with configurable preferences.
-   Add E2E tests, PWA support, data export.

Notes:

-   i18n is implemented as a built-in system (no external i18n library). The `useTranslation` hook is lightweight and typed.
-   All existing tests continue to pass without modification since translations are a UI-only layer.
-   The project is now fully bilingual (es/en) out of the box.

---

## Session 013

Date: 2026-07-25

Completed:

-   Hardened the History module against the `trg_monthly_snapshots_immutable` database trigger. The previous `upsertSnapshot` issued an `UPDATE` that the trigger rejects at runtime; replaced it with `insertSnapshotIfAbsent` and `fetchSnapshot` query helpers.
-   Rewrote `saveSnapshot` to be insert-only: returns a typed `SaveSnapshotOutcome` (`{ status: "created" } | { status: "already_exists" }`) and reconciles concurrent inserts via a second `fetchSnapshot` lookup.
-   Removed the live-compute fallback from `getHistorySnapshots`. History now strictly reflects persisted rows; an empty database shows an empty state instead of fabricating the last 6 months.
-   Tightened `computeSnapshot` to return `Omit<SnapshotData, "id" | "createdAt">` so a computed payload can no longer be mistaken for a persisted row (no synthetic `computed-{year}-{month}` id).
-   Introduced a typed `SnapshotJson` interface and `coerceSnapshotJson` defensive defaulting; removed the `unknown` payload and the `Record<string, number>` casts in `HistoryPage`.
-   Reworked `HistoryPage` snapshot generation UI: replaced the bespoke `generatedMsg` boolean with an effect-driven status notice (`created` / `already_exists` / `error`) and added an "Immutable" badge plus new i18n keys (`history.alreadyExists`, `history.snapshotFinal`, `history.generateCurrent`, `history.immutable`) for es and en.
-   Added 9 integration tests for `historyService` covering `getHistorySnapshots`, `computeSnapshot`, `saveSnapshot` (created, already_exists, concurrent insert, error path), and `diffSnapshots`. Full suite: 119/119 passing.
-   Updated `CHANGELOG.md`, `DECISIONS.md` (ADR-006), `TODO.md`, and this file.

Pending:

-   Settings page — real configurable preferences (still placeholder in some areas).
-   E2E tests, PWA/offline, accessibility audit.

Notes:

-   The previous implementation masked the immutability mismatch by computing live snapshots when none were persisted, so the bug only surfaced the first time a user regenerated an existing month. The new contract makes the invariant explicit at the service boundary.

---

## Session 014

Date: 2026-07-20

Completed:

-   Implemented the real HistoryPage replacing the placeholder: month-by-month snapshot browser with KPI cards (income, expenses, cashflow, debt, savings, financial score), prev/next month navigation plus a pill selector of available months.
-   Comparison mode: select a baseline month to diff against the current selection — delta values, percentage bars and directional indicators for all 6 KPIs.
-   "Generate Snapshot" button computes and persists the current month via the `generateSnapshot` mutation; snapshot detail panel shows counts of budgets, transactions, goals, debts and accounts.
-   Created `src/services/historyService.ts` (`getHistorySnapshots`, `computeSnapshot`, `saveSnapshot`, `diffSnapshots`), `useHistory` TanStack Query hook with `generateSnapshot` mutation, and `fetchSnapshots`/`upsertSnapshot` query helpers.
-   Added 22 new translation keys (es/en).
-   Implemented the real SettingsPage replacing the placeholder with 5 sections:
    -   Appearance: theme picker (light/dark/system) and language selector (es/en).
    -   Profile: default profile selector (Julián/Pareja/Ambos) wired to `ProfileProvider`.
    -   Preferences: animations and notifications toggle switches.
    -   Data: CSV/PDF export buttons (UI placeholder at this point, wired in Session 016).
    -   About: version, framework and current language display.
-   Created `src/services/settingsService.ts` with `AppSettings` type, localStorage-first persistence (`finos.settings` key), optional Supabase sync (`loadSettingsFromDb` / `persistSettings`) and `getDefaultProfileId` mapping; `useSettings` hook bridging the theme/language/profile providers; `fetchSettings`/`upsertSetting` query helpers.
-   Added 38 new translation keys (es/en).
-   Verified `npm run typecheck`, `npm run build` and `npm run test -- --run` pass.

Pending:

-   Data export implementation (CSV/PDF) — the Settings Data section was UI-only.
-   E2E tests, PWA/offline, accessibility audit.

Notes:

-   Settings uses localStorage-first with best-effort Supabase sync: `persistSettings` saves locally and tries the DB but swallows failures, so the app remains usable offline.

---

## Session 015

Date: 2026-07-20

Completed:

-   Implemented CSV/PDF data export across the app:
    -   `src/services/exportService.ts` with `generateCsv` (UTF-8 BOM for Excel compatibility, proper CSV escaping), `downloadFile`, `downloadCsv` and `printAsPdf` (styled HTML print template with `@page` margins and footer).
    -   TransactionsPage: export dropdown with CSV/PDF for the currently filtered transaction list.
    -   ReportsPage: CSV/PDF export buttons for the monthly summary table.
    -   SettingsPage: full data export of transactions, budgets, debts and goals via CSV and PDF report.
-   Added 6 new translation keys (es/en).
-   Verified `npm run typecheck`, `npm run build` and `npm run test -- --run` pass.

Pending:

-   E2E tests, PWA/offline, accessibility audit.

Notes:

-   CSV generation is deterministic and locale-agnostic; BOM is prepended so Excel renders UTF-8 characters (e.g. accents in Spanish) correctly. PDF is generated client-side via the browser print dialog (no external dependency).

---

## Session 016

Date: 2026-07-25

Completed:

-   Hardened the History module against the `trg_monthly_snapshots_immutable` database trigger (see Session 013 details above — this is the session log for the `bb27b7f` fix that landed after Session 014's `upsertSnapshot` implementation).
-   Updated project documentation (`CHANGELOG.md`, `TODO.md`, this file) to reflect Sessions 014 and 015, which had not been logged.

Pending:

-   E2E tests, PWA/offline, accessibility audit, shimmer skeletons for forms/modals.

Notes:

-   Documentation was lagging behind the repository state; reconciled `CHANGELOG.md`, `TODO.md` and `PROJECT_MEMORY.md` with the last 3 feature commits.

---

## Session 017

Date: 2026-08-03

Completed:

-   Verified Supabase connectivity — the project had been auto-paused and auto-deleted by the Free Plan inactivity policy; after the user restored it from the dashboard, DNS and the REST API came back up. The seed data survived the restore (profiles, transactions, budgets, debts, goals, monthly_snapshots, settings all respond 200). `.env` keys required no change.
-   Implemented PWA / offline support:
    -   Installed `vite-plugin-pwa@1.3.0` (generateSW mode, `registerType: "autoUpdate"`).
    -   Web app manifest: FinOS name/short_name, `es-AR` lang, standalone display, `#09090B` theme/background, icons 64/192/512 + maskable 512.
    -   Created `public/finos-icon.svg` and generated the icon set (`favicon.ico`, `apple-touch-icon-180x180.png`, `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`) with `@vite-pwa/assets-generator`.
    -   Registered the service worker from `main.tsx` via `virtual:pwa-register`; `sw.js` precaches the app shell (46 entries) with SPA `navigateFallback` → `/index.html`.
    -   Workbox runtime caching for Supabase REST GETs (`NetworkFirst`, 3s network timeout, 24h cache) so previously fetched data renders offline.
    -   Updated `index.html` with PWA/Apple metas and favicons; added `public/_redirects` SPA fallback for Netlify; new `vendor-pwa` chunk.
-   Verified `npm run typecheck`, `npm run build` (sw.js + manifest.webmanifest emitted) and `npm run test -- --run` (119/119 pass).
-   Updated `CHANGELOG.md`, `TODO.md` and this file.

Pending:

-   E2E tests, accessibility audit / keyboard shortcuts, shimmer skeletons for forms and modals.

Notes:

-   Free-tier Supabase projects are auto-paused after ~1 week of inactivity and later deleted if never restored; cheap API requests (e.g. a daily cron ping) keep a project alive. Manual deletion only frees the subdomain — an NXDOMAIN means the project is gone from edge DNS (paused projects still resolve).

---

## Session 018

Date: 2026-08-04

Completed:

-   Created reusable `SkeletonForm` component in `src/components/common/Skeleton.tsx` to display shimmer loaders inside forms.
-   Integrated `SkeletonForm` into all critical entity modals/forms during loading/saving (`isPending` states):
    -   `TransactionsPage.tsx` -> `TransactionFormModal` (4 rows)
    -   `BudgetsPage.tsx` -> `BudgetFormModal` (2 rows)
    -   `DebtsPage.tsx` -> `DebtFormModal` (5 rows) and `PaymentFormModal` (3 rows)
    -   `GoalsPage.tsx` -> `GoalFormModal` (4 rows) and `ContributionFormModal` (3 rows)
-   Validated that all 119 tests pass and the production build completes cleanly.

Pending:

-   E2E tests, accessibility audit / keyboard shortcuts.

---

## Session 019

Date: 2026-08-04

Completed:

-   Resolved the "Ambos" profile selection bugs by enabling queries and passing `"ambos"` instead of `undefined` in React Query keys.
-   Consolidated dashboard metrics, charts, and history snapshots mathematically when `"ambos"` profile is active.
-   Added profile select dropdown in modal forms (Transactions, Budgets, Debts, Goals) dynamically when `"ambos"` view is active.
-   Implemented dependent filtering of accounts and categories by the selected profile UUID to prevent cross-profile assignment errors.
-   Enforced positive transaction amounts in `TransactionsPage.tsx` to satisfy the database check constraint `transactions_amount_positive`.
-   Renamed the "Pareja" profile to "Sol" in settings, dropdown lists, translation files, and database seed.
-   Removed the account negative balance check constraint and changed the default value of `allow_overdraft` to `true` to allow negative balances.
-   Added a "Restablecer cuenta" (Reset account) database function RPC and UI button in the Settings page Danger Zone card to clear all tables and re-populate with seed data.

Pending:

-   E2E tests, accessibility audit / keyboard shortcuts.

---

# Pending Decisions

-   Final SQL implementation.
-   CI/CD workflow.
-   Testing framework details.
-   Analytics integration.
-   Public/private deployment boundary for no-auth Supabase persistence.

------------------------------------------------------------------------

# Technical Debt

None.

------------------------------------------------------------------------

# Next Recommended Task

1.  E2E tests — add Playwright or Cypress for critical user flows.
2.  Keyboard shortcuts and accessibility audit (WCAG AA compliance).
3.  Update `PROJECT_MEMORY.md`, `TODO.md`, `CHANGELOG.md` after each session.

------------------------------------------------------------------------

# Rules

-   Update this file after every session.
-   Never rewrite history.
-   Append new sessions.
-   Record architectural decisions.
-   Record unfinished work.
-   Record important bugs.
-   Keep this document synchronized with CHANGELOG.md and TODO.md.
