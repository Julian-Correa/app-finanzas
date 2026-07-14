# FinOS --- Database.md

## Database

Provider: Supabase (PostgreSQL)

Goals:

-   Normalized schema
-   Future-proof
-   Multi-profile support
-   Fast analytics
-   Row Level Security ready

------------------------------------------------------------------------

# Entity Relationship Overview

profiles │ ├── accounts ├── transactions ├── debts ├── goals ├── budgets
├── monthly_snapshots └── alerts

categories │ └── transactions

accounts │ └── transactions

------------------------------------------------------------------------

# Tables

## profiles

Purpose: Represents a person using FinOS.

Fields

id (uuid)

name

avatar

color

is_active

created_at

updated_at

------------------------------------------------------------------------

## accounts

Purpose: Wallets and financial accounts.

Examples

Cash

Bank

Mercado Pago

Naranja X

Savings

Fields

id

profile_id

name

type

currency

initial_balance

current_balance

icon

color

is_archived

created_at

------------------------------------------------------------------------

## categories

Purpose

Expense & income categories.

Supports nesting.

Fields

id

parent_id

name

type

icon

color

order

is_default

created_at

Examples

Income

Salary

Freelance

Bonus

Expense

Food

Transport

Utilities

Debt

Savings

Baby

------------------------------------------------------------------------

## transactions

Purpose

Main ledger.

Fields

id

profile_id

account_id

category_id

amount

transaction_type

description

notes

date

is_recurring

attachment_url

created_at

updated_at

Indexes

date

category_id

profile_id

------------------------------------------------------------------------

## recurring_transactions

Purpose

Automatic monthly transactions.

Fields

id

transaction_id

frequency

next_execution

enabled

------------------------------------------------------------------------

## debts

Purpose

Installments and liabilities.

Fields

id

profile_id

name

creditor

original_amount

remaining_amount

installment_amount

installments_total

installments_left

interest_rate

priority

due_day

status

created_at

Examples

Notebook

Credit Card

Edesur

Loan

------------------------------------------------------------------------

## debt_payments

Purpose

Payment history.

Fields

id

debt_id

amount

date

notes

------------------------------------------------------------------------

## budgets

Purpose

Monthly spending limits.

Fields

id

profile_id

category_id

month

year

limit_amount

spent_amount

remaining_amount

status

------------------------------------------------------------------------

## goals

Purpose

Financial goals.

Fields

id

profile_id

name

target_amount

current_amount

monthly_target

priority

deadline

status

icon

color

Examples

Emergency Fund

Baby

Pay Off Card

Recover Edesur

------------------------------------------------------------------------

## goal_contributions

Purpose

Track every contribution.

Fields

id

goal_id

amount

date

notes

------------------------------------------------------------------------

## monthly_snapshots

Purpose

Freeze month status.

Fields

id

profile_id

month

year

income

expenses

cashflow

debt

savings

financial_score

json_snapshot

created_at

------------------------------------------------------------------------

## alerts

Purpose

Notifications.

Fields

id

profile_id

type

title

description

severity

read

created_at

------------------------------------------------------------------------

## settings

Purpose

User preferences.

Fields

id

theme

language

currency

default_profile

animations

notifications

------------------------------------------------------------------------

# Relationships

profiles 1:N accounts

profiles 1:N transactions

profiles 1:N debts

profiles 1:N goals

profiles 1:N budgets

profiles 1:N snapshots

accounts 1:N transactions

categories 1:N transactions

debts 1:N debt_payments

goals 1:N goal_contributions

------------------------------------------------------------------------

# Index Strategy

Create indexes for

date

profile_id

category_id

account_id

month

year

status

priority

------------------------------------------------------------------------

# Row Level Security

Enable RLS on every table.

Policies:

Only authenticated users.

Profiles can only access their own data.

Future-ready for shared household accounts.

------------------------------------------------------------------------

# Soft Delete

Every editable entity should contain

deleted_at

Never permanently delete financial data.

------------------------------------------------------------------------

# Audit Fields

Every table should include

created_at

updated_at

created_by

updated_by

------------------------------------------------------------------------

# Views

monthly_summary

monthly_cashflow

goal_progress

debt_progress

budget_progress

dashboard_overview

------------------------------------------------------------------------

# SQL Functions

calculate_financial_score()

calculate_cashflow()

calculate_budget_usage()

calculate_goal_eta()

calculate_debt_ratio()

generate_month_snapshot()

------------------------------------------------------------------------

# Triggers

After insert transaction

→ update budgets

→ update dashboard

→ update goals

→ update cashflow

After debt payment

→ update remaining debt

→ update score

Monthly

→ create snapshot

------------------------------------------------------------------------

# Backup Strategy

Daily automatic Supabase backups.

JSON export from UI.

Manual restore support.

------------------------------------------------------------------------

# Future Tables

investments

baby_expenses

health

gym

habits

tasks

documents

subscriptions

family_members

income_sources

assets

liabilities

No breaking migrations should be required.
