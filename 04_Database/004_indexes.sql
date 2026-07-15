-- Indexes for common filters and dashboard reads.
create index if not exists idx_accounts_profile_id on accounts(profile_id) where deleted_at is null;
create index if not exists idx_categories_parent_id on categories(parent_id) where deleted_at is null;
create index if not exists idx_categories_type on categories(type) where deleted_at is null;
create index if not exists idx_transactions_profile_date on transactions(profile_id, date desc) where deleted_at is null;
create index if not exists idx_transactions_account_id on transactions(account_id) where deleted_at is null;
create index if not exists idx_transactions_category_id on transactions(category_id) where deleted_at is null;
create index if not exists idx_transactions_month_year on transactions(profile_id, (extract(year from date)), (extract(month from date))) where deleted_at is null;
create index if not exists idx_recurring_next_execution on recurring_transactions(next_execution) where enabled is true and deleted_at is null;
create index if not exists idx_debts_profile_status_priority on debts(profile_id, status, priority) where deleted_at is null;
create index if not exists idx_debt_payments_debt_date on debt_payments(debt_id, date desc) where deleted_at is null;
create index if not exists idx_budgets_profile_period on budgets(profile_id, year, month) where deleted_at is null;
create index if not exists idx_budgets_category_id on budgets(category_id) where deleted_at is null;
create index if not exists idx_goals_profile_status_priority on goals(profile_id, status, priority) where deleted_at is null;
create index if not exists idx_goal_contributions_goal_date on goal_contributions(goal_id, date desc) where deleted_at is null;
create index if not exists idx_monthly_snapshots_profile_period on monthly_snapshots(profile_id, year, month) where deleted_at is null;
create index if not exists idx_alerts_profile_created on alerts(profile_id, created_at desc) where deleted_at is null;
create index if not exists idx_alerts_profile_unread on alerts(profile_id, severity, created_at desc) where read is false and deleted_at is null;
