# PROJECT_MEMORY.md

> Living project memory for FinOS.
>
> This document must be updated after every meaningful development
> session. It serves as long-term memory for developers and AI agents.
> Never delete historical entries; append new ones.

------------------------------------------------------------------------

# Project Overview

**Project:** FinOS

**Status:** Phase 1 scaffold implemented

**Version:** 0.1.0

**Current Phase:** Phase 1 - Project setup, routing, theme, layout and Supabase scaffold

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
  User Flows             ✅
  SQL Generation Guide   ✅
  MASTER_PROMPT          ✅

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

Chart.js selected.

Reason: Lightweight, flexible and sufficient for dashboard needs.

------------------------------------------------------------------------

## ADR-004

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

Status: ⏳ Pending

Tasks:

-   Create Vite project
-   Configure TypeScript
-   Install dependencies
-   Configure TailwindCSS
-   Configure shadcn/ui
-   Configure Supabase
-   Configure aliases
-   Configure ESLint
-   Configure Prettier

------------------------------------------------------------------------

## Phase 3 --- Database

Status: ⏳ Pending

Tasks:

-   Generate SQL package
-   Configure migrations
-   Apply RLS
-   Seed database

------------------------------------------------------------------------

## Phase 4 --- Core Engine

Status: ⏳ Pending

Tasks:

-   Financial calculations
-   Dashboard services
-   Prediction engine
-   Alerts

------------------------------------------------------------------------

# Known Risks

-   Financial calculations must remain deterministic.
-   Documentation and implementation may diverge if not updated.
-   Performance of dashboard queries must be monitored.
-   Simulator must never affect production data.

------------------------------------------------------------------------

# Open Questions

-   Will authentication remain disabled?
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

# Pending Decisions

-   Final SQL implementation.
-   CI/CD workflow.
-   Testing framework details.
-   Analytics integration.
-   Final authentication/RLS model because PRD says no authentication while database documentation requires authenticated RLS.

------------------------------------------------------------------------

# Technical Debt

None.

------------------------------------------------------------------------

# Next Recommended Task

1.  Generate SQL package.
2.  Bootstrap React application.
3.  Configure Supabase.
4.  Build layout and routing.
5.  Implement dashboard foundation.

------------------------------------------------------------------------

# Rules

-   Update this file after every session.
-   Never rewrite history.
-   Append new sessions.
-   Record architectural decisions.
-   Record unfinished work.
-   Record important bugs.
-   Keep this document synchronized with CHANGELOG.md and TODO.md.
