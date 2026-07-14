# FinOS --- UserFlows.md

## Goal

Define every important user journey to ensure a consistent, predictable
and premium experience.

------------------------------------------------------------------------

# Flow 01 --- First Launch

1.  Open application.
2.  Splash screen.
3.  Select theme:
    -   Light
    -   Dark
    -   System
4.  Create household profiles.
5.  Enter current monthly income.
6.  Create financial accounts.
7.  Create categories (or use defaults).
8.  Create current debts.
9.  Create financial goals.
10. Dashboard opens.

Success: User reaches a usable dashboard in less than 5 minutes.

------------------------------------------------------------------------

# Flow 02 --- Dashboard

User lands on Dashboard.

Visible immediately:

-   Financial Health
-   Cash Flow
-   Available Cash
-   Upcoming Bills
-   Goals
-   Alerts
-   Timeline
-   Charts

Possible actions:

-   Add transaction
-   Open reports
-   Pay debt
-   Run simulator
-   Export month

------------------------------------------------------------------------

# Flow 03 --- Add Transaction

Entry points

-   Floating Action Button
-   Dashboard shortcut
-   Transactions page

Steps

1.  Open modal.
2.  Select profile.
3.  Select income or expense.
4.  Select account.
5.  Select category.
6.  Enter amount.
7.  Optional notes.
8.  Save.

System actions

-   Update balances.
-   Update budget.
-   Update dashboard.
-   Recalculate scores.
-   Refresh charts.

------------------------------------------------------------------------

# Flow 04 --- Edit Transaction

Open transaction.

Modify fields.

Save.

Engine recalculates everything instantly.

------------------------------------------------------------------------

# Flow 05 --- Delete Transaction

Confirmation dialog.

Soft delete only.

Dashboard refreshes.

Monthly snapshot remains immutable.

------------------------------------------------------------------------

# Flow 06 --- Create Debt

Fields

-   Name
-   Creditor
-   Total
-   Installments
-   Interest
-   Due day

Save.

Debt appears on dashboard.

------------------------------------------------------------------------

# Flow 07 --- Register Debt Payment

Open debt.

Click "Register Payment".

Enter amount.

Engine updates:

-   Remaining balance
-   Installments left
-   Debt ratio
-   Financial score

------------------------------------------------------------------------

# Flow 08 --- Create Goal

Examples

-   Emergency Fund
-   Recover Edesur
-   Baby
-   Pay Off Card
-   Pay Off Notebook

Steps

Target

Deadline

Priority

Monthly contribution

Save.

------------------------------------------------------------------------

# Flow 09 --- Contribute to Goal

Select goal.

Enter contribution.

Dashboard updates.

ETA recalculated.

------------------------------------------------------------------------

# Flow 10 --- Monthly Budget

Select month.

Edit category limits.

Save.

Engine calculates:

Remaining budget

Usage

Alerts

------------------------------------------------------------------------

# Flow 11 --- Purchase Advisor

Open "Can I Buy This?"

Enter:

-   Item
-   Price
-   Optional installments

Output

Decision

YES

WAIT

NO

Impact

-   Cash Flow
-   Goals
-   Debt
-   Financial Score

------------------------------------------------------------------------

# Flow 12 --- Scenario Simulator

Choose scenario:

-   Salary increase
-   Salary decrease
-   Partner gets a job
-   Baby
-   Loan
-   Bonus
-   Vacation
-   New purchase

Run simulation.

Nothing is persisted.

User may discard or rerun.

------------------------------------------------------------------------

# Flow 13 --- Reports

Open Reports.

Choose month.

Export:

-   Excel
-   PDF
-   JSON

Generate GPT Prompt.

------------------------------------------------------------------------

# Flow 14 --- GPT Prompt

Click "Generate Prompt".

System compiles:

-   KPIs
-   Transactions
-   Debts
-   Goals
-   Budgets
-   Alerts
-   Timeline
-   Predictions

Preview modal.

Actions:

-   Copy
-   Download Markdown

------------------------------------------------------------------------

# Flow 15 --- Month End

Automatic process.

Engine creates immutable snapshot.

Stores:

-   KPIs
-   Charts
-   Transactions summary
-   Goals
-   Debts
-   Financial score

------------------------------------------------------------------------

# Flow 16 --- History

Open History.

Browse:

Year → Month.

Available actions:

-   Compare months
-   Compare years
-   Restore view
-   Export

------------------------------------------------------------------------

# Flow 17 --- Settings

Theme

Currency

Language

Default profile

Animations

Notifications

Export backup

Import backup

------------------------------------------------------------------------

# Error Flows

Network unavailable

→ Offline banner

Database error

→ Retry action

Validation error

→ Inline messages

Unexpected exception

→ Error boundary

------------------------------------------------------------------------

# UX Rules

-   Every important action requires no more than 3 clicks.
-   Save operations provide immediate feedback.
-   Undo should be available after destructive actions.
-   Forms preserve unsaved changes when possible.
-   Dashboard refreshes automatically after every mutation.
-   Mobile and desktop flows must remain functionally equivalent.
-   Empty states always provide a clear next action.
