# FinOS --- BusinessRules.md

## Purpose

This document defines the business rules of FinOS. Business rules are
the single source of truth for all financial behavior. If business rules
conflict with implementation, the business rules take precedence.

------------------------------------------------------------------------

# General Rules

1.  Every financial operation must be traceable.
2.  Financial data is never permanently deleted (soft delete only).
3.  Every change must update the dashboard immediately.
4.  All calculations are deterministic.
5.  Currency is ARS only.
6.  Every entity must belong to a profile.
7.  Simulator never modifies production data.

------------------------------------------------------------------------

# Profiles

-   A transaction belongs to exactly one profile.
-   Reports may filter by one profile or all profiles.
-   Household totals are calculated by aggregating all active profiles.

------------------------------------------------------------------------

# Transactions

-   Every transaction must belong to one category.
-   Amount must be greater than zero.
-   Transaction type must be Income or Expense.
-   Expenses reduce account balance.
-   Income increases account balance.
-   Future dates are only allowed for recurring transactions.
-   Editing a transaction recalculates all dependent metrics.
-   Deleting a transaction performs a soft delete only.

------------------------------------------------------------------------

# Accounts

-   An account cannot have a negative balance unless "allow overdraft"
    is enabled.
-   Archived accounts are read-only.
-   Transactions cannot be created against archived accounts.

------------------------------------------------------------------------

# Categories

-   Categories are fully editable.
-   Categories support unlimited nesting.
-   A deleted category cannot be removed while transactions reference
    it.
-   Uncategorized transactions are not allowed.

------------------------------------------------------------------------

# Budgets

-   Budgets are monthly.
-   Budget usage updates after every expense.
-   Budget alerts:
    -   50%: Info
    -   75%: Warning
    -   90%: High
    -   100%: Critical
-   Overspending is allowed but generates an alert.

------------------------------------------------------------------------

# Debts

Priority order:

1.  Essential utilities
2.  Housing
3.  Credit cards
4.  Personal loans
5.  Installment purchases

Rules:

-   Registering a payment reduces remaining balance.
-   Installments left cannot be negative.
-   Completed debts become read-only.
-   Early payoff simulation never changes real data.

------------------------------------------------------------------------

# Goals

Supported goals:

-   Recover Edesur
-   Emergency Fund
-   Baby
-   Pay Off Credit Card
-   Pay Off Notebook

Rules:

-   Every goal has a target amount.
-   Current amount cannot exceed target.
-   Completed goals become read-only.
-   Goals with deadlines increase priority automatically.
-   Goal progress updates after every contribution.

Priority:

Critical High Medium Low

------------------------------------------------------------------------

# Dashboard

Dashboard refreshes after:

-   Transaction created
-   Transaction edited
-   Transaction deleted
-   Debt payment
-   Goal contribution
-   Budget update
-   Settings change

Dashboard must always show:

-   Financial Health
-   Cash Flow
-   Available Cash
-   Debt
-   Upcoming Bills
-   Goal Progress
-   Alerts
-   Timeline

------------------------------------------------------------------------

# Purchase Advisor

Decision outcomes:

YES WAIT NO

Evaluation considers:

-   Available cash
-   Monthly cash flow
-   Debt ratio
-   Goal delays
-   Budget impact
-   Financial health score

A purchase must never modify data until confirmed.

------------------------------------------------------------------------

# Alerts

Critical alerts:

-   Negative cash flow
-   Budget exceeded
-   Debt overdue
-   Financial score below 40
-   Available cash below zero

Warnings:

-   Goal delayed
-   Budget above 75%
-   High debt ratio
-   Upcoming due date within 7 days

------------------------------------------------------------------------

# Monthly Snapshot

At month end the system creates an immutable snapshot containing:

-   Income
-   Expenses
-   Debts
-   Goals
-   Budgets
-   Dashboard KPIs
-   Charts
-   Financial score

Snapshots can never be edited.

------------------------------------------------------------------------

# Reports

Reports must always reflect the selected period only.

Supported exports:

-   PDF
-   Excel
-   JSON
-   GPT Markdown Prompt

------------------------------------------------------------------------

# Data Integrity

-   No duplicated transaction IDs.
-   No orphan records.
-   Referential integrity must be preserved.
-   Failed operations are rolled back.

------------------------------------------------------------------------

# Business Rule Priority

If multiple rules conflict:

1.  Data Integrity
2.  Financial Accuracy
3.  User Data Preservation
4.  Business Rules
5.  UI Convenience

Never sacrifice data integrity for user convenience.
