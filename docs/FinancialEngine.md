# FinOS --- FinancialEngine.md

## Purpose

The Financial Engine is the core business logic of FinOS.

Its responsibility is to transform raw financial data into actionable
insights, forecasts, simulations and health indicators.

The engine must be deterministic (no AI required).

------------------------------------------------------------------------

# Inputs

-   Income
-   Expenses
-   Debts
-   Goals
-   Budgets
-   Accounts
-   Transactions
-   Calendar
-   User Settings

------------------------------------------------------------------------

# Outputs

-   Dashboard KPIs
-   Alerts
-   Predictions
-   Goal ETA
-   Risk Score
-   Financial Health Score
-   Purchase Advisor
-   Monthly Snapshot
-   GPT Prompt

------------------------------------------------------------------------

# Core Metrics

## Cash Flow

Formula

Cash Flow = Income - Expenses

Status

Positive Zero Negative

------------------------------------------------------------------------

## Available Cash

Available Cash = Current Account Balance - Upcoming Bills - Reserved
Goal Contributions

------------------------------------------------------------------------

## Burn Rate

Burn Rate = Expenses / Days Elapsed

Prediction

Projected Expenses = Burn Rate × Days In Month

------------------------------------------------------------------------

## Savings Rate

Savings Rate = (Income - Expenses) / Income × 100

------------------------------------------------------------------------

## Debt Ratio

Debt Ratio = Monthly Debt Payments / Monthly Income × 100

Risk

0--20 Excellent

20--35 Good

35--50 Warning

50+ Critical

------------------------------------------------------------------------

## Liquidity

Liquidity = Available Cash / Monthly Expenses

Levels

> 1.0 Excellent

0.5--1 Attention

\<0.5 Critical

------------------------------------------------------------------------

# Financial Health Score

Scale

0--100

Weighted Model

Cash Flow .......... 25%

Liquidity .......... 20%

Debt Ratio ......... 20%

Savings Rate ....... 15%

Goal Progress ...... 10%

Budget Discipline .. 10%

Classification

90--100 Excellent

70--89 Good

40--69 Warning

0--39 Critical

------------------------------------------------------------------------

# Budget Engine

Every transaction updates

Spent

Remaining

Usage %

Alerts

50%

75%

90%

100%

Over Budget

------------------------------------------------------------------------

# Debt Engine

Calculates

Remaining Balance

Installments Left

Estimated Payoff Date

Monthly Debt Load

Debt Ratio

Early Payment Simulation

Priority Rules

Utilities

Housing

Credit Cards

Loans

Personal Installments

------------------------------------------------------------------------

# Goal Engine

Each Goal contains

Target

Current

Deadline

Priority

Monthly Contribution

Calculations

Completion %

Remaining Amount

ETA

Contribution Recommendation

Priority Queue

Critical

High

Medium

Low

------------------------------------------------------------------------

# Monthly Prediction

Projected Expenses = Average Daily Spend × Remaining Days

Projected Balance = Income - Projected Expenses

Projected Goal Progress

Projected Debt

------------------------------------------------------------------------

# Purchase Advisor

Inputs

Item

Price

Optional Installments

Calculates

Cash Flow Impact

Budget Impact

Debt Impact

Goal Delay

Emergency Fund Delay

Financial Score Impact

Decision

YES

WAIT

NO

Risk

Low

Medium

High

------------------------------------------------------------------------

# Scenario Simulator

Never writes to database.

Scenarios

Salary Increase

Salary Decrease

New Baby

New Debt

Debt Paid Early

Unexpected Expense

Bonus

Vacation

Partner Gets Job

Outputs

Updated Dashboard

New Cash Flow

New Debt Ratio

Updated Goals

Recommendation

------------------------------------------------------------------------

# Timeline Engine

Chronological Event Builder

Salary

↓

Bills

↓

Subscriptions

↓

Purchases

↓

Remaining Balance

↓

Warnings

------------------------------------------------------------------------

# Alert Engine

Examples

Budget exceeded

Goal delayed

Debt overdue

Negative Cash Flow

Emergency Fund empty

Credit Card usage increased

Upcoming Due Date

Low Liquidity

Each Alert

Severity

Timestamp

Recommended Action

Dismiss State

------------------------------------------------------------------------

# Monthly Snapshot Engine

At month end store

Income

Expenses

Cash Flow

Budgets

Goals

Debts

Financial Score

Charts Data

JSON Snapshot

Allows historical comparison.

------------------------------------------------------------------------

# GPT Prompt Generator

Generates Markdown including

Executive Summary

KPIs

Income

Expenses

Debts

Goals

Budgets

Timeline

Alerts

Predictions

Recommendations

No AI calls.

Copies to clipboard.

------------------------------------------------------------------------

# Rules

1.  Every calculation is deterministic.
2.  Every dashboard widget updates instantly.
3.  Simulator never changes production data.
4.  Financial Health Score recalculates after every mutation.
5.  Snapshots are immutable.
6.  Missing values are treated as zero.
7.  Every monetary value uses ARS.

------------------------------------------------------------------------

# Performance

Calculations must complete in under 100ms.

Heavy calculations should be memoized.

Snapshots generated asynchronously.

------------------------------------------------------------------------

# Extensibility

Future engines

Investment Engine

Subscription Optimizer

Tax Engine

Baby Planner

Retirement Planner

Net Worth Engine

AI Recommendation Engine

Architecture must allow adding new engines without modifying existing
business rules.
