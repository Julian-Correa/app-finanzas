# SQL_Generation_Guide.md

# Purpose

Generate a complete production-ready PostgreSQL database for FinOS using
Supabase.

Do NOT generate a single giant schema.sql file.

Generate a modular SQL package following the structure below.

------------------------------------------------------------------------

# Target Database

-   PostgreSQL 16
-   Supabase
-   UUID primary keys
-   Row Level Security enabled
-   Timestamp with timezone
-   Soft delete support

------------------------------------------------------------------------

# Output Structure

``` text
04_Database/
├── 001_extensions.sql
├── 002_enums.sql
├── 003_tables.sql
├── 004_indexes.sql
├── 005_constraints.sql
├── 006_functions.sql
├── 007_triggers.sql
├── 008_views.sql
├── 009_rls.sql
├── 010_seed.sql
└── schema.sql
```

schema.sql must execute all previous scripts in order.

------------------------------------------------------------------------

# 001_extensions.sql

Install every required extension.

Examples:

-   pgcrypto
-   uuid-ossp (if needed)

Avoid unnecessary extensions.

------------------------------------------------------------------------

# 002_enums.sql

Create every ENUM used by the project.

Examples

-   transaction_type
-   debt_priority
-   goal_priority
-   goal_status
-   alert_severity
-   account_type
-   theme_mode
-   budget_status

Do not use VARCHAR where ENUM is appropriate.

------------------------------------------------------------------------

# 003_tables.sql

Create every table described in Database.md.

Required tables:

-   profiles
-   accounts
-   categories
-   transactions
-   recurring_transactions
-   debts
-   debt_payments
-   budgets
-   goals
-   goal_contributions
-   monthly_snapshots
-   alerts
-   settings

Every table must include:

-   id UUID PRIMARY KEY
-   created_at
-   updated_at
-   deleted_at
-   created_by
-   updated_by

Use foreign keys everywhere appropriate.

Never duplicate data.

Normalize to at least 3NF.

------------------------------------------------------------------------

# 004_indexes.sql

Create indexes for:

-   profile_id
-   account_id
-   category_id
-   debt_id
-   goal_id
-   month
-   year
-   status
-   priority
-   date

Add composite indexes where useful.

Explain index decisions with SQL comments.

------------------------------------------------------------------------

# 005_constraints.sql

Add:

CHECK constraints

UNIQUE constraints

Foreign Keys

NOT NULL

Default values

Prevent invalid financial data.

Examples

Amounts \> 0

Installments \>= 0

Remaining debt \>= 0

Goal progress \<= target

------------------------------------------------------------------------

# 006_functions.sql

Implement PostgreSQL functions for:

-   calculate_cashflow()
-   calculate_liquidity()
-   calculate_budget_usage()
-   calculate_financial_score()
-   calculate_goal_eta()
-   calculate_debt_ratio()
-   create_month_snapshot()
-   generate_dashboard()
-   generate_monthly_report()

Functions must be deterministic whenever possible.

------------------------------------------------------------------------

# 007_triggers.sql

Triggers must update the system automatically.

Examples

After INSERT transaction

-   update budgets
-   update dashboard
-   update cashflow
-   update financial score

After debt payment

-   update remaining debt
-   update debt ratio

After goal contribution

-   update goal progress

At month end

-   generate immutable snapshot

------------------------------------------------------------------------

# 008_views.sql

Create optimized read-only views.

Required:

-   dashboard_overview
-   monthly_summary
-   budget_progress
-   debt_progress
-   goal_progress
-   financial_health
-   account_balances

Views should avoid unnecessary joins.

------------------------------------------------------------------------

# 009_rls.sql

Enable Row Level Security on every table.

Policies:

Users can only access their own profile.

Support future shared household profiles.

No anonymous write access.

Document every policy.

------------------------------------------------------------------------

# 010_seed.sql

Insert production-quality starter data.

Profiles

-   Julian
-   Pareja

Default accounts

-   Cash
-   Bank
-   Mercado Pago
-   Credit Card

Categories

Income

Expenses

Utilities

Food

Transportation

Education

Health

Entertainment

Debt

Savings

Goals

-   Recover Edesur
-   Emergency Fund
-   Baby
-   Pay Off Credit Card
-   Pay Off Notebook

Budget templates

Alert templates

Settings defaults

------------------------------------------------------------------------

# SQL Standards

Use lowercase snake_case.

Never use SELECT \*.

Use explicit foreign keys.

Comment every table.

Comment every function.

Comment every trigger.

Use transactions where appropriate.

Avoid duplicated logic.

Prefer SQL functions over application logic when calculation belongs to
the database.

------------------------------------------------------------------------

# Performance

Use indexes carefully.

Avoid unnecessary indexes.

Prefer immutable functions.

Optimize joins.

Target dashboard queries below 100ms.

------------------------------------------------------------------------

# Security

Enable RLS.

Validate every input.

Prevent orphan records.

Use cascading rules only when justified.

Prefer RESTRICT over CASCADE unless explicitly required.

------------------------------------------------------------------------

# Deliverable

Generate every SQL file completely.

Do not leave TODOs.

Do not omit any table.

Do not simplify.

The final result must be deployable directly to a fresh Supabase project
without manual modifications.
