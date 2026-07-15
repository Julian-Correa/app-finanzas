# TODO.md

## Current Phase

All 12 feature pages implemented. Application feature-complete for v0.1.0.

## Completed

### Phase 1 - Documentation
-   Product documentation
-   Architecture, Design System, Components, Financial Engine specs
-   Business Rules, Financial Rules, Formula Reference, User Flows
-   Database specification, MASTER_PROMPT

### Phase 2 - Project Setup & Database
-   Created Vite + React + TypeScript scaffold.
-   Added TailwindCSS configuration and app providers.
-   Added responsive layout, navigation, route placeholders.
-   Installed dependencies and verified typecheck + build.
-   Recorded no-auth Supabase persistence decision.
-   Generated modular SQL package under `04_Database/`.
-   Added database TypeScript contract (`src/types/database.ts`).
-   Added typed Supabase query helpers (`src/supabase/queries.ts`).
-   Executed SQL package (001-010) against Supabase via SQL Editor successfully.

### Phase 3 - Financial Engine
-   Created `src/engine/` — deterministic TypeScript engine:
    -   Cashflow, liquidity, burn rate, savings rate
    -   Debt ratio, budget usage, goal ETA
    -   Financial health score (6 weighted components, 0-100)
    -   Monthly predictions and purchase advisor
-   Created `src/services/dashboardService.ts` — connects Supabase data with engine.
-   Created `src/features/dashboard/hooks/useDashboard.ts` — TanStack Query hook.
-   Updated `DashboardPage.tsx` — live KPIs, score breakdown, alerts.
-   Verified typecheck and build pass.

### Phase 4-8 - Feature Pages
-   TransactionsPage: list, search, filters, create/edit/delete with modal forms.
-   BudgetsPage: per-category cards with progress bars, totals, add/edit.
-   DebtsPage: expandable cards, payment tracking, register payments.
-   GoalsPage: expandable cards, contributions, ETA, progress bars.
-   ReportsPage: Chart.js bar, doughnut, line charts; period selector; summary table.
-   SimulatorPage: scenario-based what-if engine with sliders (never writes to DB).
-   PurchaseAdvisorPage: price/installment evaluation with decision matrix.
-   TimelinePage: vertical monthly timeline with income/expenses/debts.
-   CalendarPage: monthly grid with financial events per day.

## Future / Optional
-   Code-split large JS bundle (~850 kB) with dynamic imports or rollup manual chunks.
-   Add unit tests for engine functions (pure, deterministic).
-   Add integration tests for services.
-   Polish UI animations and transitions.
-   Review and optimize dashboard query performance.
