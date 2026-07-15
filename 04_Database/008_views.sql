-- Read-optimized views for UI and reports.
create or replace view monthly_summary as
select
  t.profile_id,
  extract(month from t.date)::integer as month,
  extract(year from t.date)::integer as year,
  coalesce(sum(case when t.transaction_type = 'income' then t.amount else 0 end), 0)::numeric(14,2) as income,
  coalesce(sum(case when t.transaction_type = 'expense' then t.amount else 0 end), 0)::numeric(14,2) as expenses,
  coalesce(sum(case when t.transaction_type = 'income' then t.amount else -t.amount end), 0)::numeric(14,2) as cashflow
from transactions t
where t.deleted_at is null
group by t.profile_id, extract(month from t.date), extract(year from t.date);

create or replace view account_balances as
select
  a.id,
  a.profile_id,
  a.name,
  a.type,
  a.currency,
  a.current_balance,
  a.is_archived,
  a.updated_at
from accounts a
where a.deleted_at is null;

create or replace view budget_progress as
select
  b.id,
  b.profile_id,
  b.category_id,
  c.name as category_name,
  b.month,
  b.year,
  b.limit_amount,
  b.spent_amount,
  b.remaining_amount,
  calculate_budget_usage(b.id) as usage_percentage,
  b.status
from budgets b
join categories c on c.id = b.category_id
where b.deleted_at is null
  and c.deleted_at is null;

create or replace view debt_progress as
select
  d.id,
  d.profile_id,
  d.name,
  d.creditor,
  d.original_amount,
  d.remaining_amount,
  (d.original_amount - d.remaining_amount)::numeric(14,2) as paid_amount,
  case when d.original_amount <= 0 then 0 else round(((d.original_amount - d.remaining_amount) / d.original_amount) * 100, 2) end as progress_percentage,
  d.installments_left,
  d.priority,
  d.status,
  d.due_day
from debts d
where d.deleted_at is null;

create or replace view goal_progress as
select
  g.id,
  g.profile_id,
  g.name,
  g.target_amount,
  g.current_amount,
  (g.target_amount - g.current_amount)::numeric(14,2) as remaining_amount,
  case when g.target_amount <= 0 then 0 else round((g.current_amount / g.target_amount) * 100, 2) end as progress_percentage,
  calculate_goal_eta(g.id) as eta_months,
  g.priority,
  g.deadline,
  g.status
from goals g
where g.deleted_at is null;

create or replace view financial_health as
select
  p.id as profile_id,
  extract(month from current_date)::integer as month,
  extract(year from current_date)::integer as year,
  calculate_financial_score(p.id, extract(month from current_date)::integer, extract(year from current_date)::integer) as score,
  calculate_liquidity(p.id) as liquidity,
  calculate_debt_ratio(p.id, extract(month from current_date)::integer, extract(year from current_date)::integer) as debt_ratio
from profiles p
where p.deleted_at is null
  and p.is_active is true;

create or replace view dashboard_overview as
select
  p.id as profile_id,
  p.name as profile_name,
  generate_dashboard(p.id, extract(month from current_date)::integer, extract(year from current_date)::integer) as dashboard
from profiles p
where p.deleted_at is null
  and p.is_active is true;
