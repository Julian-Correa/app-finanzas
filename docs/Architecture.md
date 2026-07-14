# FinOS --- Architecture.md

## Architecture Style

-   Feature-Based Architecture
-   Clean Architecture
-   Component Driven Design
-   SOLID principles
-   Mobile First
-   Offline-first cache
-   TypeScript Strict Mode

------------------------------------------------------------------------

# Stack

-   React 19
-   Vite
-   TypeScript
-   TailwindCSS
-   shadcn/ui
-   Chart.js
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Framer Motion
-   Supabase
-   Lucide Icons

------------------------------------------------------------------------

# Folder Structure

``` text
src/
 ├── app/
 ├── assets/
 ├── components/
 │    ├── ui/
 │    ├── charts/
 │    ├── layout/
 │    └── common/
 ├── features/
 │    ├── dashboard/
 │    ├── transactions/
 │    ├── budgets/
 │    ├── debts/
 │    ├── goals/
 │    ├── reports/
 │    ├── simulator/
 │    ├── purchase-advisor/
 │    ├── timeline/
 │    ├── calendar/
 │    └── settings/
 ├── hooks/
 ├── lib/
 ├── services/
 ├── supabase/
 │    ├── client.ts
 │    ├── queries.ts
 │    └── policies.sql
 ├── store/
 ├── types/
 ├── utils/
 ├── constants/
 └── styles/
```

------------------------------------------------------------------------

# Pages

-   Dashboard
-   Transactions
-   Budgets
-   Debts
-   Goals
-   Timeline
-   Calendar
-   Reports
-   Simulator
-   Purchase Advisor
-   Settings

------------------------------------------------------------------------

# Navigation

Desktop: - Left Sidebar - Top Header - Main Content

Mobile: - Bottom Navigation - Floating Action Button (New Transaction)

------------------------------------------------------------------------

# State Management

Global: - Theme - Current Profile - Settings

Server: - TanStack Query + Supabase

Forms: - React Hook Form + Zod

------------------------------------------------------------------------

# Database (Supabase)

## profiles

-   id
-   name
-   avatar
-   color
-   active

## accounts

-   id
-   profile_id
-   name
-   type
-   balance

## categories

-   id
-   parent_id
-   name
-   icon
-   color

## transactions

-   id
-   profile_id
-   account_id
-   category_id
-   amount
-   type
-   description
-   notes
-   date
-   recurring

## debts

-   id
-   name
-   total
-   remaining
-   installment
-   installments_left
-   due_day
-   priority
-   interest

## goals

-   id
-   name
-   target
-   current
-   monthly_contribution
-   priority
-   deadline

## budgets

-   id
-   category_id
-   month
-   limit

## snapshots

-   id
-   month
-   json_data

## settings

-   id
-   theme
-   currency
-   language

------------------------------------------------------------------------

# Business Rules

1.  Every transaction belongs to one category.
2.  Categories are editable.
3.  Budgets are monthly.
4.  Snapshots are generated automatically at month end.
5.  Debt progress updates after each payment.
6.  Simulator never modifies real data.
7.  Purchase Advisor uses current cash flow + goals + debts.
8.  Financial Health Score recalculates after every change.

------------------------------------------------------------------------

# Financial Engine

Calculates:

-   Cash Flow
-   Burn Rate
-   Savings Rate
-   Debt Ratio
-   Liquidity
-   Goal ETA
-   Monthly Prediction
-   Remaining Budget
-   Risk Score
-   Financial Health Score

------------------------------------------------------------------------

# Reports

Export: - PDF - Excel - JSON

Import: - JSON Backup

------------------------------------------------------------------------

# Prompt Generator

Creates a Markdown report containing:

-   Income
-   Expenses
-   Debt summary
-   Goal progress
-   Timeline
-   Cash Flow
-   Budget analysis
-   KPIs

Copies it to clipboard.

------------------------------------------------------------------------

# Performance

-   Lazy loading
-   Route splitting
-   Memoized charts
-   Optimized queries
-   Virtualized transaction lists
-   Image optimization

------------------------------------------------------------------------

# Security

-   Supabase Row Level Security
-   Environment variables
-   Input validation
-   Zod validation
-   Error boundaries

------------------------------------------------------------------------

# Scalability

Future-ready modules:

-   Investments
-   Family Budget
-   Baby Planner
-   University
-   Gym
-   Habits
-   Health
-   AI Assistant

No refactoring should be required to add new modules.
