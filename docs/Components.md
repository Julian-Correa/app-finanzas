# FinOS --- Components.md

## Philosophy

Components must be:

-   Reusable
-   Stateless whenever possible
-   Accessible
-   Fully typed
-   Theme aware
-   Responsive
-   Composable

Business logic belongs in hooks/services, never inside UI components.

------------------------------------------------------------------------

# Folder Structure

``` text
components/
├── ui/
├── layout/
├── charts/
├── forms/
├── feedback/
├── finance/
├── navigation/
└── common/
```

------------------------------------------------------------------------

# Layout Components

## AppLayout

Responsibilities: - Global layout - Sidebar - Header - Content container

Props: - children

------------------------------------------------------------------------

## Sidebar

Displays: - Navigation - Profile selector - Theme switch - Quick actions

------------------------------------------------------------------------

## Header

Displays: - Current month - Search - Notifications - Profile menu

------------------------------------------------------------------------

## BottomNavigation (Mobile)

Items: - Dashboard - Transactions - Goals - Reports - Settings

------------------------------------------------------------------------

# Dashboard Components

## KPIStatCard

Props

-   title
-   value
-   delta
-   trend
-   icon
-   color
-   loading

States

Loading

Success

Empty

------------------------------------------------------------------------

## FinancialHealthCard

Displays

-   Score
-   Classification
-   Explanation
-   Last update

------------------------------------------------------------------------

## CashFlowCard

Displays

Income

Expenses

Cash Flow

Trend

------------------------------------------------------------------------

## UpcomingBillsCard

Lists upcoming payments.

Actions

-   Mark as paid
-   Open debt

------------------------------------------------------------------------

## GoalProgressCard

Displays

-   Progress bar
-   ETA
-   Remaining
-   Priority

------------------------------------------------------------------------

## DebtCard

Displays

-   Remaining debt
-   Installments
-   Monthly payment
-   Progress

Actions

-   Register payment
-   Simulate payoff

------------------------------------------------------------------------

## BudgetCard

Displays

Budget

Spent

Remaining

Usage %

Color states

Green

Amber

Red

------------------------------------------------------------------------

## TimelineCard

Chronological monthly flow.

------------------------------------------------------------------------

# Finance Components

## TransactionTable

Features

-   Search
-   Sort
-   Filters
-   Pagination
-   Bulk actions

Columns configurable.

------------------------------------------------------------------------

## TransactionRow

Displays:

-   Icon
-   Category
-   Description
-   Date
-   Amount
-   Account

------------------------------------------------------------------------

## TransactionForm

Fields

-   Date
-   Amount
-   Category
-   Account
-   Description
-   Notes

Validation with Zod.

------------------------------------------------------------------------

## DebtForm

Create/Edit debt.

Supports installments.

------------------------------------------------------------------------

## GoalForm

Create/Edit goal.

------------------------------------------------------------------------

## BudgetForm

Monthly budget editor.

------------------------------------------------------------------------

# Charts

## ExpensePieChart

## IncomeExpenseLineChart

## CashFlowBarChart

## DebtProgressChart

## GoalProgressChart

All powered by Chart.js.

Responsive.

------------------------------------------------------------------------

# Simulator

## ScenarioPanel

Inputs

-   Salary
-   Expense
-   Loan
-   Goal
-   Purchase

Outputs

Updated KPIs.

------------------------------------------------------------------------

## PurchaseAdvisorCard

Inputs

Item

Price

Installments

Outputs

Decision

Risk

Goal delay

Cash impact

------------------------------------------------------------------------

# Reports

## ReportCard

Displays

Monthly summary

Export buttons

PDF

Excel

JSON

------------------------------------------------------------------------

## GPTPromptModal

Preview generated markdown.

Buttons

Copy

Download

Close

------------------------------------------------------------------------

# Feedback Components

## EmptyState

Props

-   title
-   description
-   action

------------------------------------------------------------------------

## SkeletonCard

Used during loading.

------------------------------------------------------------------------

## AlertBanner

Severity

Info

Warning

Critical

Success

------------------------------------------------------------------------

## Toast

Variants

Success

Error

Warning

Info

------------------------------------------------------------------------

# Navigation

## Breadcrumb

## PageTitle

## SearchBar

## ProfileSwitcher

## ThemeToggle

------------------------------------------------------------------------

# Shared Components

## Card

Base container.

Variants

Default

Glass

Outlined

------------------------------------------------------------------------

## Button

Variants

Primary

Secondary

Ghost

Danger

Icon

Loading

------------------------------------------------------------------------

## Modal

Reusable dialog.

------------------------------------------------------------------------

## Drawer

Mobile panels.

------------------------------------------------------------------------

## Badge

Status indicator.

------------------------------------------------------------------------

## ProgressBar

Animated.

Accessible.

------------------------------------------------------------------------

## EmptyChart

Shown when no data exists.

------------------------------------------------------------------------

# Hooks

useDashboard()

useTransactions()

useBudgets()

useDebts()

useGoals()

useReports()

useSimulator()

useFinancialScore()

useTheme()

------------------------------------------------------------------------

# Services

DashboardService

DebtService

GoalService

BudgetService

ReportService

PromptGeneratorService

SimulationService

FinancialEngineService

------------------------------------------------------------------------

# Component Rules

-   One responsibility per component.
-   Maximum 300 lines per component.
-   Prefer composition over inheritance.
-   Avoid prop drilling; use context only when justified.
-   No direct Supabase calls from UI components.
-   All business rules live in services/hooks.
-   Every component must support loading, empty and error states where
    applicable.
-   All interactive elements must be keyboard accessible.

------------------------------------------------------------------------

# Naming Convention

PascalCase for components.

Examples

StatCard.tsx

GoalCard.tsx

DebtCard.tsx

TransactionTable.tsx

PurchaseAdvisorCard.tsx

------------------------------------------------------------------------

# Testing Targets

Critical components:

-   TransactionForm
-   KPIStatCard
-   DebtCard
-   GoalProgressCard
-   PurchaseAdvisorCard
-   FinancialHealthCard

Target coverage: \>80%.
