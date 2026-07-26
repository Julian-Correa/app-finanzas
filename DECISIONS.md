# DECISIONS.md

## ADR-001 - Feature-Based Structure

Status: Accepted

Decision: Use a feature-based `src/features/*` structure with shared app, component, service, type and Supabase layers.

Reason: Matches the project documentation and keeps future modules isolated.

## ADR-002 - Supabase Isolation

Status: Accepted

Decision: Supabase client configuration lives under `src/supabase`; UI components must not import Supabase directly.

Reason: Preserves Clean Architecture and keeps UI presentation-only.

## ADR-003 - No Authentication Persistence Model

Status: Accepted

Decision: FinOS will not use Supabase Auth. Supabase is used only as a remote persistence database for the app data.

Implication: Database access from the client must use the public anon key, so SQL policies cannot depend on `auth.uid()` and cannot provide per-user isolation.

Risk: This model is appropriate only for a trusted/private deployment. If the app is publicly deployed, anyone with access to the anon key and allowed policies could read or write persisted data.

Implementation: Phase 2 SQL must avoid authenticated RLS assumptions. If RLS is enabled, policies must explicitly support the anonymous persistence model and document the tradeoff.

## ADR-006 - `monthly_snapshots` Are Client-Immutability-Aware

Status: Accepted

Decision: The TypeScript service layer treats `monthly_snapshots` as insert-only. `saveSnapshot` performs a `fetchSnapshot` first and, when a row already exists for `(profile_id, month, year)`, returns `{ status: "already_exists" }` without issuing an `UPDATE`. Concurrent inserts are reconciled via a second `fetchSnapshot` instead of an upsert.

Reason: The database enforces immutability through the `trg_monthly_snapshots_immutable` trigger (`BEFORE UPDATE OR DELETE`). Any `UPDATE` from the client would be rejected at runtime. The previous `upsertSnapshot` implementation silently broke this contract by attempting an `UPDATE`.

Implication: Once a snapshot is created for a month, its financial state is final for that month. Users cannot "regenerate" a past month; they can only create new snapshots for periods that do not yet have one. The UI surfaces this via the `history.alreadyExists` notice.

Side effect: `getHistorySnapshots` no longer falls back to computing the last 6 months in live when no snapshots are persisted. History is now strictly the set of persisted rows; an empty database simply shows an empty state.
