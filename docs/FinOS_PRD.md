# FinOS --- Product Requirements Document (PRD)

> Personal Financial Operating System for Argentina.

## Vision

Build a premium SaaS-quality personal finance application inspired by
Apple design and products like Monarch Money and YNAB, optimized for
Argentine users.

------------------------------------------------------------------------

# Tech Stack

-   React 19
-   Vite
-   TailwindCSS
-   shadcn/ui
-   Supabase
-   Chart.js
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Framer Motion
-   Lucide Icons

Deploy: - Netlify

------------------------------------------------------------------------

# Core Principles

-   Mobile First
-   Responsive
-   Offline-first cache
-   Fast (\<2s load)
-   Modular architecture
-   Feature-based structure
-   Accessible (WCAG AA)
-   Dark/Light mode
-   Apple-inspired UI

------------------------------------------------------------------------

# Authentication

No authentication.

The app is shared between two people.

A configurable profile selector ("Julian", "Pareja", "Ambos") filters
data.

------------------------------------------------------------------------

# Currency

Only Argentine Pesos (ARS).

------------------------------------------------------------------------

# Main Modules

## Dashboard

Display KPI cards:

-   Monthly Income
-   Available Cash
-   Fixed Expenses
-   Variable Expenses
-   Debt
-   Debt Ratio
-   Savings Rate
-   Burn Rate
-   Cash Flow
-   Emergency Fund
-   Financial Health Score
-   Risk Score
-   Upcoming Payments

Charts:

-   Expenses by Category
-   Income vs Expenses
-   Debt Evolution
-   Monthly Cash Flow
-   Goal Progress

Timeline:

Salary → Bills → Purchases → Remaining Balance → Risk

------------------------------------------------------------------------

## Transactions

CRUD

Fields

-   Date
-   Type
-   Amount
-   Category
-   Subcategory
-   Account
-   Description
-   Notes
-   Tags
-   Attachment (future)

Everything editable.

------------------------------------------------------------------------

## Categories

Fully editable.

Nested categories.

Example

Food

-   Supermarket
-   Butcher
-   Delivery

Debt

-   Credit Card
-   Notebook
-   Edesur

Income

-   Salary
-   Freelance
-   Bonus

------------------------------------------------------------------------

## Budgets

Monthly budgets.

Alerts at

-   50%
-   75%
-   90%
-   100%

------------------------------------------------------------------------

## Debts

Track:

-   Remaining balance
-   Installments
-   Interest
-   Due date
-   Priority
-   Estimated payoff
-   Progress bar

Special handling for:

-   Credit Cards
-   Utility plans
-   Installment purchases

------------------------------------------------------------------------

## Financial Goals

Current goals

-   Recover Edesur
-   Emergency Fund
-   Baby
-   Pay Off Credit Card
-   Pay Off Notebook

Each goal includes

-   Target
-   Current Amount
-   Monthly Contribution
-   ETA
-   Progress
-   Priority

------------------------------------------------------------------------

## Calendar

Financial calendar

Bills

Installments

Subscriptions

Goals

Recurring payments

------------------------------------------------------------------------

## Timeline

Visual month flow

Income

↓

Bills

↓

Purchases

↓

Remaining

↓

Risk

------------------------------------------------------------------------

## History

Each month is snapshotted.

Example

2026

-   July
-   August
-   September

Open any month and inspect:

-   Dashboard
-   Transactions
-   Debts
-   Goals
-   Budget
-   Charts

Compare months.

Compare years.

------------------------------------------------------------------------

## Simulator

"What happens if..."

Examples

-   Increase salary
-   New job
-   Baby
-   Loan
-   Buy item
-   Pay debt early
-   Remove subscription

Everything recalculates.

------------------------------------------------------------------------

## Purchase Advisor

Screen:

"Can I buy this?"

Inputs

-   Item
-   Price

Outputs

-   Yes / No
-   Impact on cashflow
-   Impact on goals
-   Impact on debt
-   Risk level
-   Suggested purchase date

------------------------------------------------------------------------

## Alerts

Examples

-   Credit card increased 15%
-   Budget exceeded
-   Goal delayed
-   Upcoming payment
-   Low liquidity

------------------------------------------------------------------------

## Reports

Export

-   Excel
-   PDF
-   JSON

Import

-   JSON backup

Monthly archive.

------------------------------------------------------------------------

## GPT Prompt Generator

One-click button.

Generate a structured markdown report including:

-   Income
-   Expenses
-   Categories
-   Debts
-   Goals
-   Timeline
-   Budget
-   Cash Flow
-   Financial Health

No AI integration.

The prompt is copied for external analysis.

------------------------------------------------------------------------

# Dashboard Widgets

-   Financial Health
-   Liquidity
-   Cash Flow
-   Debt Ratio
-   Savings
-   Emergency Fund
-   Upcoming Bills
-   Spending Trend
-   Budget Usage
-   Goal Progress
-   Monthly Prediction

------------------------------------------------------------------------

# Theme

Apple inspired

-   Glassmorphism (subtle)
-   Rounded corners
-   Soft shadows
-   Large spacing
-   Smooth animations
-   SF Pro (Inter fallback)

Dark and Light mode.

------------------------------------------------------------------------

# Supabase Schema

profiles accounts transactions categories budgets goals debts
monthly_snapshots alerts settings

------------------------------------------------------------------------

# Future Modules

-   University
-   Habits
-   Gym
-   Health
-   Tasks
-   Investments
-   Family Budget
-   AI Assistant

------------------------------------------------------------------------

# Definition of Done

-   Production ready
-   Fully responsive
-   Clean Architecture
-   TypeScript strict mode
-   Reusable components
-   No duplicated code
-   Error boundaries
-   Loading states
-   Empty states
-   Unit-ready architecture
