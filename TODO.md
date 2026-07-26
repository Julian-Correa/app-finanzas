# TODO.md

## Current Phase

Application feature-complete for v0.1.0. History page now backed by persisted immutable snapshots (no live fallback); `saveSnapshot` returns a typed outcome and respects the DB immutability trigger. Full i18n (es/en) implemented across all pages and layout components. All 119 tests pass, typecheck and build clean.

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

### Polish — UI Animations & Performance
- Framer Motion integration (PageTransition, MotionCard, StaggerContainer, ModalWrapper)
- Route transitions, staggered lists, animated modals, hover lift, scroll-triggered reveals
- Count-up animations on KPIs, shimmer skeletons
- CSS dark/light mode transitions, custom Tailwind keyframes
- Code-splitting: React.lazy() + Suspense for all 12 pages, vendor chunk splitting

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

## Future / Optional
-   Real Settings page with configurable preferences
- E2E tests (Playwright/Cypress)
- PWA / offline support
- Data export (CSV/PDF)
- Keyboard shortcuts and accessibility audit
- Extend shimmer skeletons to forms and modal loading states
