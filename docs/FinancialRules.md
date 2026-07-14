# FinOS --- FinancialRules.md

## Purpose

This document defines the financial rules used by the Financial Engine.
Unlike BusinessRules.md, this document focuses exclusively on financial
logic, priorities, calculations, forecasting, and decision-making.

------------------------------------------------------------------------

# Financial Philosophy

FinOS must prioritize:

1.  Financial stability
2.  Cash flow protection
3.  Essential expenses
4.  Debt reduction
5.  Goal completion
6.  Long-term savings

The system should discourage decisions that increase financial risk.

------------------------------------------------------------------------

# Expense Priority

Priority 1 --- Essential

-   Electricity
-   Water
-   Gas
-   Internet
-   Rent / Housing
-   Food
-   Medicine

Priority 2 --- Financial Obligations

-   Credit Card
-   Loans
-   Installment Purchases
-   Taxes

Priority 3 --- Personal Growth

-   Education
-   Courses
-   Books

Priority 4 --- Goals

-   Emergency Fund
-   Baby
-   Car
-   Vacation

Priority 5 --- Lifestyle

-   Entertainment
-   Clothing
-   Restaurants
-   Subscriptions

------------------------------------------------------------------------

# Cash Flow Rules

Positive Cash Flow

Income \> Expenses

Status = Healthy

Zero Cash Flow

Income == Expenses

Status = Attention

Negative Cash Flow

Income \< Expenses

Status = Critical

------------------------------------------------------------------------

# Liquidity Rules

Available Cash

> = Monthly Expenses

Excellent

50--99%

Warning

Below 50%

Critical

Negative

Emergency

------------------------------------------------------------------------

# Emergency Fund Rules

Recommended Target

3 months of essential expenses.

Current recommendation

Until completed:

Emergency Fund has higher priority than:

-   Car
-   Vacation
-   Electronics

------------------------------------------------------------------------

# Debt Rules

Debt Ratio

Monthly Debt Payments / Monthly Income

Risk

0--20% Excellent

20--35% Healthy

35--50% Warning

50%+ Critical

Utilities debt always has priority over credit card debt.

------------------------------------------------------------------------

# Goal Prioritization

Automatic Priority

1.  Recover Edesur
2.  Emergency Fund
3.  Baby
4.  Credit Card
5.  Notebook
6.  Other goals

If a goal has a deadline within 60 days, increase one priority level.

------------------------------------------------------------------------

# Purchase Rules

Every purchase is evaluated using:

-   Available Cash
-   Cash Flow
-   Debt Ratio
-   Budget Usage
-   Goal Delay
-   Emergency Fund
-   Financial Health Score

Decision Matrix

Financial Health \>= 80 → YES

60--79 → WAIT

Below 60 → NO

Any purchase creating negative cash flow must return NO.

------------------------------------------------------------------------

# Budget Rules

Each expense updates:

-   Category Budget
-   Monthly Budget
-   Dashboard
-   Financial Score

Overspending reduces Financial Health Score.

------------------------------------------------------------------------

# Monthly Prediction

Projection uses:

Average Daily Expense

×

Remaining Days

Produces:

-   Expected Expenses
-   Expected Balance
-   Goal Progress
-   Debt Projection

------------------------------------------------------------------------

# Goal Contribution Rules

Recommended Monthly Contribution

(Target - Current)

/

Months Remaining

Contribution cannot exceed Available Cash.

------------------------------------------------------------------------

# Financial Health Score Rules

Weighted Formula

Cash Flow........25%

Liquidity........20%

Debt Ratio.......20%

Savings Rate.....15%

Goal Progress....10%

Budget Control...10%

Maximum Score

100

Minimum

0

------------------------------------------------------------------------

# Burn Rate Rules

Burn Rate

Expenses

/

Days Elapsed

Forecast

Burn Rate

×

Days in Month

------------------------------------------------------------------------

# Credit Card Rules

Credit Card Usage

Statement Amount

/

Monthly Income

Risk

\<20% Excellent

20--35% Healthy

35--50% Warning

> 50% Critical

Repeated growth for 3 months generates an alert.

------------------------------------------------------------------------

# Alerts

Critical

-   Negative Cash Flow
-   Emergency Fund = 0
-   Financial Score \< 40
-   Debt Ratio \> 50%
-   Available Cash \< 0

Warning

-   Budget \> 75%
-   Goal Delayed
-   Credit Card Growth
-   Upcoming Bill (7 days)

Information

-   Goal Completed
-   Debt Paid Off
-   Budget Completed

------------------------------------------------------------------------

# Simulator Rules

Simulator must never:

-   Modify transactions
-   Modify debts
-   Modify goals
-   Create snapshots

Simulator only calculates projections.

------------------------------------------------------------------------

# Snapshot Rules

At month end store:

-   Income
-   Expenses
-   Debt
-   Goals
-   Budgets
-   Financial Score
-   Timeline
-   Charts
-   KPIs

Snapshots are immutable.

------------------------------------------------------------------------

# GPT Prompt Rules

The generated prompt must include:

-   Executive Summary
-   Income
-   Expenses
-   Cash Flow
-   Debt Summary
-   Budget Summary
-   Goal Progress
-   Timeline
-   Alerts
-   Monthly Prediction
-   Recommendations

No AI API calls are performed.

------------------------------------------------------------------------

# Future Financial Rules

Reserved for:

-   Investments
-   Retirement Planning
-   Baby Budget
-   Tax Estimation
-   Net Worth
-   Inflation Adjustment
-   Multi-currency
-   Subscription Optimization

Future rules must remain backward compatible.
