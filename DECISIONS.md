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
