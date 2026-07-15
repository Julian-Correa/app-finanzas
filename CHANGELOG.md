# CHANGELOG.md

## Unreleased

### Added

-   Phase 2 modular SQL package in `04_Database/`.
-   PostgreSQL enums, tables, indexes, constraints, functions, triggers, views, no-auth RLS policies and seed data.
-   TypeScript database contract in `src/types/database.ts`.
-   Typed Supabase query helpers in `src/supabase/queries.ts`.
-   Database package README with execution order and security model.

### Changed

-   Supabase client is now typed with the generated database contract.
-   SQL generation guide now uses `created_by_profile_id` and `updated_by_profile_id` for the no-auth profile model.
-   Database package README now documents CLI and Supabase SQL Editor execution paths.

### Verified

-   `npm.cmd run typecheck` passes.
-   `npm.cmd run build` passes.

### Pending

-   Execute the SQL package against a fresh Supabase project; local `psql` and Supabase CLI are not installed in this environment.

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

### Verified

-   `npm.cmd run typecheck` passes.
-   `npm.cmd run build` passes.

### Known Issues

-   No-auth Supabase persistence is not suitable for public multi-user data isolation.
