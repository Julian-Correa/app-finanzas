# FinOS --- FormulaReference.md

## Purpose

This document is the mathematical reference for every financial
calculation in FinOS.

Unlike `FinancialRules.md`, this document contains **only formulas** and
their expected outputs.

All formulas must be deterministic.

No AI is involved.

------------------------------------------------------------------------

# General Rules

-   Currency: Argentine Peso (ARS)
-   Decimal precision: 2 digits
-   Percentages: rounded to one decimal
-   Division by zero must always return 0
-   Negative values are allowed only where explicitly defined
-   Every calculation must be pure (no side effects)

------------------------------------------------------------------------

# Income

## Total Monthly Income

``` text
SUM(All Income Transactions)
```

## Average Monthly Income

``` text
Total Income / Months
```

------------------------------------------------------------------------

# Expenses

## Total Expenses

``` text
SUM(All Expense Transactions)
```

## Essential Expenses

``` text
SUM(Utilities + Food + Housing + Medicine + Transportation)
```

## Variable Expenses

``` text
Total Expenses - Essential Expenses
```

------------------------------------------------------------------------

# Cash Flow

## Monthly Cash Flow

``` text
Income - Expenses
```

## Projected Cash Flow

``` text
Income - Projected Expenses
```

------------------------------------------------------------------------

# Available Cash

``` text
Current Account Balance
- Upcoming Bills
- Reserved Goal Contributions
```

## Net Available Cash

``` text
Cash + Bank + Mercado Pago + Savings - Pending Payments
```

------------------------------------------------------------------------

# Burn Rate

## Daily Burn Rate

``` text
Expenses / Days Elapsed
```

## Monthly Projection

``` text
Daily Burn Rate × Days In Month
```

------------------------------------------------------------------------

# Savings

## Savings Amount

``` text
Income - Expenses
```

## Savings Rate

``` text
((Income - Expenses) / Income) × 100
```

------------------------------------------------------------------------

# Debt

## Total Debt

``` text
SUM(All Remaining Debts)
```

## Monthly Debt Payment

``` text
SUM(All Monthly Installments)
```

## Debt Ratio

``` text
(Monthly Debt Payment / Income) × 100
```

## Debt Remaining %

``` text
(Remaining Debt / Original Debt) × 100
```

## Debt Paid %

``` text
(Paid Amount / Original Debt) × 100
```

------------------------------------------------------------------------

# Goals

## Goal Progress %

``` text
(Current Amount / Target Amount) × 100
```

## Remaining Goal Amount

``` text
Target - Current
```

## Recommended Monthly Contribution

``` text
Remaining Amount / Months Remaining
```

## Goal ETA

``` text
Remaining Amount / Average Monthly Contribution
```

------------------------------------------------------------------------

# Budgets

## Budget Used %

``` text
(Spent / Budget) × 100
```

## Budget Remaining

``` text
Budget - Spent
```

## Budget Remaining %

``` text
(Remaining / Budget) × 100
```

------------------------------------------------------------------------

# Credit Card

## Credit Card Usage

``` text
(Statement Balance / Income) × 100
```

## Credit Card Growth

``` text
((Current Statement - Previous Statement) / Previous Statement) × 100
```

------------------------------------------------------------------------

# Liquidity

## Liquidity Ratio

``` text
Available Cash / Monthly Expenses
```

        Ratio Status
  ----------- -----------
        \>1.5 Excellent
    1.0--1.49 Healthy
    0.5--0.99 Warning
        \<0.5 Critical

------------------------------------------------------------------------

# Emergency Fund

## Coverage

``` text
Emergency Fund / Essential Monthly Expenses
```

------------------------------------------------------------------------

# Monthly Prediction

## Average Daily Expense

``` text
Expenses / Days Elapsed
```

## Expected Expenses

``` text
Average Daily Expense × Days In Month
```

## Expected Balance

``` text
Income - Expected Expenses
```

------------------------------------------------------------------------

# Financial Health Score

  Metric                Weight
  ------------------- --------
  Cash Flow                25%
  Liquidity                20%
  Debt Ratio               20%
  Savings Rate             15%
  Goal Progress            10%
  Budget Discipline        10%

## Formula

``` text
(CashFlowScore × 0.25)
+ (LiquidityScore × 0.20)
+ (DebtScore × 0.20)
+ (SavingsScore × 0.15)
+ (GoalScore × 0.10)
+ (BudgetScore × 0.10)
```

------------------------------------------------------------------------

# Risk Score

``` text
100 - Financial Health Score
```

------------------------------------------------------------------------

# Purchase Advisor

## Cash Impact

``` text
Available Cash - Purchase Price
```

## Installment Impact

``` text
(Installment Amount / Income) × 100
```

## Goal Delay

``` text
Purchase Price / Average Monthly Goal Contribution
```

------------------------------------------------------------------------

# Timeline

## Remaining Balance

``` text
Previous Balance + Income - Expense
```

------------------------------------------------------------------------

# Reports

## Expense Difference

``` text
Current Month - Previous Month
```

## Income Difference

``` text
Current Income - Previous Income
```

## Percentage Difference

``` text
((Current - Previous) / Previous) × 100
```

------------------------------------------------------------------------

# Simulator

## New Cash Flow

``` text
Simulated Income - Simulated Expenses
```

## New Debt Ratio

``` text
(Simulated Monthly Debt / Simulated Income) × 100
```

------------------------------------------------------------------------

# Snapshot Fields

-   Total Income
-   Total Expenses
-   Cash Flow
-   Savings
-   Debt
-   Debt Ratio
-   Liquidity
-   Burn Rate
-   Financial Health Score
-   Risk Score
-   Goal Progress
-   Budget Usage
-   Credit Card Usage
-   Prediction
-   Timeline

------------------------------------------------------------------------

# Recalculation Order

1.  Transaction
2.  Account Balance
3.  Budget
4.  Debt
5.  Goals
6.  Cash Flow
7.  Liquidity
8.  Burn Rate
9.  Prediction
10. Financial Health Score
11. Risk Score
12. Dashboard
13. Alerts
14. Timeline
15. Monthly Snapshot

------------------------------------------------------------------------

# Performance

-   Deterministic calculations only.
-   \<100 ms execution time.
-   Memoize expensive calculations.
-   Never depend on UI state.
-   Financial logic must remain independent from React components.
