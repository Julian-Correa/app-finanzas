# TODO.md

## Current Phase

Phase 3 — Deterministic financial engine implemented. Dashboard connected. Pending remaining feature pages and Chart.js visualizations.

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

## Immediate TODO

-   Add `.env` file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
-   Implement remaining feature pages with real hooks/services:
    -   Transactions page (list, create, edit)
    -   Budgets page (progress, management)
    -   Debts page (tracking, payments)
    -   Goals page (progress, contributions)
    -   Reports page (Chart.js visualizations)
-   Add Chart.js visualizations to dashboard.
-   Implement simulator engine (scenario-based, never writes to DB).
-   Implement purchase advisor UI.
-   Add Timeline and Calendar views.
