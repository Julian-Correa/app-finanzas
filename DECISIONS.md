# DECISIONS.md

## ADR-001 - Feature-Based Structure

Status: Accepted

Decision: Use a feature-based `src/features/*` structure with shared app, component, service, type and Supabase layers.

Reason: Matches the project documentation and keeps future modules isolated.

## ADR-002 - Supabase Isolation

Status: Accepted

Decision: Supabase client configuration lives under `src/supabase`; UI components must not import Supabase directly.

Reason: Preserves Clean Architecture and keeps UI presentation-only.

## ADR-003 - Authentication/RLS Blocker

Status: Pending

Decision: No final decision yet.

Problem: PRD says no authentication, while database documentation requires authenticated RLS and no anonymous write access.

Recommendation: Resolve before generating SQL or implementing data services.
