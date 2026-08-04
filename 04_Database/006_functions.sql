-- Database functions for deterministic financial summaries and maintenance.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function set_updated_at() is 'Maintains updated_at on mutable tables.';

create or replace function calculate_cashflow(p_profile_id uuid, p_month integer, p_year integer)
returns table(income numeric, expenses numeric, cashflow numeric)
language sql
stable
as $$
  select
    coalesce(sum(case when t.transaction_type = 'income' then t.amount else 0 end), 0)::numeric(14,2) as income,
    coalesce(sum(case when t.transaction_type = 'expense' then t.amount else 0 end), 0)::numeric(14,2) as expenses,
    coalesce(sum(case when t.transaction_type = 'income' then t.amount else -t.amount end), 0)::numeric(14,2) as cashflow
  from transactions t
  where t.profile_id = p_profile_id
    and t.deleted_at is null
    and extract(month from t.date)::integer = p_month
    and extract(year from t.date)::integer = p_year;
$$;

comment on function calculate_cashflow(uuid, integer, integer) is 'Returns monthly income, expenses and net cashflow for one profile.';

create or replace function calculate_liquidity(p_profile_id uuid)
returns numeric
language sql
stable
as $$
  select coalesce(sum(a.current_balance), 0)::numeric(14,2)
  from accounts a
  where a.profile_id = p_profile_id
    and a.is_archived is false
    and a.deleted_at is null;
$$;

comment on function calculate_liquidity(uuid) is 'Returns available cash across active accounts for one profile.';

create or replace function calculate_budget_usage(p_budget_id uuid)
returns numeric
language sql
stable
as $$
  select case
    when b.limit_amount <= 0 then 0
    else round((b.spent_amount / b.limit_amount) * 100, 2)
  end
  from budgets b
  where b.id = p_budget_id
    and b.deleted_at is null;
$$;

comment on function calculate_budget_usage(uuid) is 'Returns spent percentage for one budget.';

create or replace function calculate_debt_ratio(p_profile_id uuid, p_month integer, p_year integer)
returns numeric
language sql
stable
as $$
  with cashflow as (
    select income from calculate_cashflow(p_profile_id, p_month, p_year)
  ), payments as (
    select coalesce(sum(dp.amount), 0)::numeric as amount
    from debt_payments dp
    join debts d on d.id = dp.debt_id
    where d.profile_id = p_profile_id
      and d.deleted_at is null
      and dp.deleted_at is null
      and extract(month from dp.date)::integer = p_month
      and extract(year from dp.date)::integer = p_year
  )
  select case
    when cashflow.income <= 0 then 0
    else round((payments.amount / cashflow.income) * 100, 2)
  end
  from cashflow, payments;
$$;

comment on function calculate_debt_ratio(uuid, integer, integer) is 'Returns monthly debt payment percentage over income.';

create or replace function calculate_goal_eta(p_goal_id uuid)
returns integer
language sql
stable
as $$
  select case
    when g.status = 'completed' then 0
    when g.monthly_target <= 0 then null
    else greatest(ceil((g.target_amount - g.current_amount) / g.monthly_target)::integer, 0)
  end
  from goals g
  where g.id = p_goal_id
    and g.deleted_at is null;
$$;

comment on function calculate_goal_eta(uuid) is 'Returns estimated months remaining for one goal.';

create or replace function calculate_financial_score(p_profile_id uuid, p_month integer, p_year integer)
returns integer
language sql
stable
as $$
  with cf as (
    select income, expenses, cashflow from calculate_cashflow(p_profile_id, p_month, p_year)
  ), metrics as (
    select
      cf.income,
      cf.expenses,
      cf.cashflow,
      calculate_liquidity(p_profile_id) as liquidity,
      calculate_debt_ratio(p_profile_id, p_month, p_year) as debt_ratio,
      coalesce((select avg(least(calculate_budget_usage(b.id), 100)) from budgets b where b.profile_id = p_profile_id and b.month = p_month and b.year = p_year and b.deleted_at is null), 0) as budget_usage,
      coalesce((select avg((g.current_amount / nullif(g.target_amount, 0)) * 100) from goals g where g.profile_id = p_profile_id and g.deleted_at is null), 0) as goal_progress
    from cf
  ), score_parts as (
    select
      case when cashflow > 0 then 25 when cashflow = 0 then 12 else 0 end as cashflow_score,
      case when expenses <= 0 then 20 when liquidity >= expenses then 20 when liquidity >= expenses * 0.5 then 10 else 0 end as liquidity_score,
      case when debt_ratio <= 20 then 20 when debt_ratio <= 35 then 14 when debt_ratio <= 50 then 7 else 0 end as debt_score,
      case when income <= 0 then 0 when cashflow / income >= 0.2 then 15 when cashflow / income >= 0.1 then 10 when cashflow > 0 then 5 else 0 end as savings_score,
      least(goal_progress, 100) * 0.10 as goal_score,
      case when budget_usage <= 50 then 10 when budget_usage <= 75 then 7 when budget_usage <= 90 then 4 when budget_usage <= 100 then 2 else 0 end as budget_score
    from metrics
  )
  select greatest(0, least(100, round(cashflow_score + liquidity_score + debt_score + savings_score + goal_score + budget_score)::integer))
  from score_parts;
$$;

comment on function calculate_financial_score(uuid, integer, integer) is 'Deterministic 0-100 health score from cashflow, liquidity, debt, savings, goals and budgets.';

create or replace function refresh_account_balance(p_account_id uuid)
returns void
language plpgsql
as $$
begin
  update accounts a
  set current_balance = (
    a.initial_balance + coalesce((
      select sum(case when t.transaction_type = 'income' then t.amount else -t.amount end)
      from transactions t
      where t.account_id = a.id
        and t.deleted_at is null
    ), 0)
  )
  where a.id = p_account_id;
end;
$$;

comment on function refresh_account_balance(uuid) is 'Recomputes account balance from initial balance and non-deleted transactions.';

create or replace function refresh_budget_amount(p_profile_id uuid, p_category_id uuid, p_month integer, p_year integer)
returns void
language plpgsql
as $$
begin
  update budgets b
  set
    spent_amount = coalesce((
      select sum(t.amount)
      from transactions t
      where t.profile_id = p_profile_id
        and t.category_id = p_category_id
        and t.transaction_type = 'expense'
        and t.deleted_at is null
        and extract(month from t.date)::integer = p_month
        and extract(year from t.date)::integer = p_year
    ), 0),
    remaining_amount = b.limit_amount - coalesce((
      select sum(t.amount)
      from transactions t
      where t.profile_id = p_profile_id
        and t.category_id = p_category_id
        and t.transaction_type = 'expense'
        and t.deleted_at is null
        and extract(month from t.date)::integer = p_month
        and extract(year from t.date)::integer = p_year
    ), 0),
    status = case
      when b.limit_amount <= 0 then 'on_track'::budget_status
      when coalesce((
        select sum(t.amount)
        from transactions t
        where t.profile_id = p_profile_id
          and t.category_id = p_category_id
          and t.transaction_type = 'expense'
          and t.deleted_at is null
          and extract(month from t.date)::integer = p_month
          and extract(year from t.date)::integer = p_year
      ), 0) > b.limit_amount then 'exceeded'::budget_status
      when coalesce((
        select sum(t.amount)
        from transactions t
        where t.profile_id = p_profile_id
          and t.category_id = p_category_id
          and t.transaction_type = 'expense'
          and t.deleted_at is null
          and extract(month from t.date)::integer = p_month
          and extract(year from t.date)::integer = p_year
      ), 0) >= b.limit_amount * 0.9 then 'critical'::budget_status
      when coalesce((
        select sum(t.amount)
        from transactions t
        where t.profile_id = p_profile_id
          and t.category_id = p_category_id
          and t.transaction_type = 'expense'
          and t.deleted_at is null
          and extract(month from t.date)::integer = p_month
          and extract(year from t.date)::integer = p_year
      ), 0) >= b.limit_amount * 0.75 then 'high'::budget_status
      when coalesce((
        select sum(t.amount)
        from transactions t
        where t.profile_id = p_profile_id
          and t.category_id = p_category_id
          and t.transaction_type = 'expense'
          and t.deleted_at is null
          and extract(month from t.date)::integer = p_month
          and extract(year from t.date)::integer = p_year
      ), 0) >= b.limit_amount * 0.5 then 'warning'::budget_status
      else 'on_track'::budget_status
    end
  where b.profile_id = p_profile_id
    and b.category_id = p_category_id
    and b.month = p_month
    and b.year = p_year
    and b.deleted_at is null;
end;
$$;

comment on function refresh_budget_amount(uuid, uuid, integer, integer) is 'Recomputes budget spend, remaining amount and status for a period.';

create or replace function refresh_debt_amount(p_debt_id uuid)
returns void
language plpgsql
as $$
begin
  update debts d
  set
    remaining_amount = greatest(d.original_amount - coalesce((
      select sum(dp.amount)
      from debt_payments dp
      where dp.debt_id = d.id
        and dp.deleted_at is null
    ), 0), 0),
    installments_left = greatest(d.installments_total - coalesce((
      select count(*)
      from debt_payments dp
      where dp.debt_id = d.id
        and dp.deleted_at is null
    ), 0), 0),
    status = case
      when greatest(d.original_amount - coalesce((select sum(dp.amount) from debt_payments dp where dp.debt_id = d.id and dp.deleted_at is null), 0), 0) = 0 then 'completed'::debt_status
      else d.status
    end
  where d.id = p_debt_id;
end;
$$;

comment on function refresh_debt_amount(uuid) is 'Recomputes remaining debt and installments after payment changes.';

create or replace function refresh_goal_amount(p_goal_id uuid)
returns void
language plpgsql
as $$
begin
  update goals g
  set
    current_amount = least(coalesce((
      select sum(gc.amount)
      from goal_contributions gc
      where gc.goal_id = g.id
        and gc.deleted_at is null
    ), 0), g.target_amount),
    status = case
      when least(coalesce((select sum(gc.amount) from goal_contributions gc where gc.goal_id = g.id and gc.deleted_at is null), 0), g.target_amount) >= g.target_amount then 'completed'::goal_status
      else g.status
    end
  where g.id = p_goal_id;
end;
$$;

comment on function refresh_goal_amount(uuid) is 'Recomputes goal current amount and completion status.';

create or replace function create_month_snapshot(p_profile_id uuid, p_month integer, p_year integer)
returns uuid
language plpgsql
as $$
declare
  v_cashflow record;
  v_debt numeric(14,2);
  v_savings numeric(14,2);
  v_score integer;
  v_snapshot_id uuid;
begin
  select income, expenses, cashflow into v_cashflow from calculate_cashflow(p_profile_id, p_month, p_year);
  select coalesce(sum(remaining_amount), 0)::numeric(14,2) into v_debt from debts where profile_id = p_profile_id and deleted_at is null;
  select calculate_liquidity(p_profile_id)::numeric(14,2) into v_savings;
  select calculate_financial_score(p_profile_id, p_month, p_year) into v_score;

  insert into monthly_snapshots(profile_id, month, year, income, expenses, cashflow, debt, savings, financial_score, json_snapshot)
  values (
    p_profile_id,
    p_month,
    p_year,
    v_cashflow.income,
    v_cashflow.expenses,
    v_cashflow.cashflow,
    v_debt,
    v_savings,
    v_score,
    generate_monthly_report(p_profile_id, p_month, p_year)
  )
  on conflict (profile_id, month, year) where deleted_at is null do nothing
  returning id into v_snapshot_id;

  if v_snapshot_id is null then
    select id into v_snapshot_id
    from monthly_snapshots
    where profile_id = p_profile_id
      and month = p_month
      and year = p_year
      and deleted_at is null;
  end if;

  return v_snapshot_id;
end;
$$;

comment on function create_month_snapshot(uuid, integer, integer) is 'Creates or refreshes a deterministic monthly snapshot payload.';

create or replace function generate_dashboard(p_profile_id uuid, p_month integer, p_year integer)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'profile_id', p_profile_id,
    'month', p_month,
    'year', p_year,
    'cashflow', (select row_to_json(cf) from calculate_cashflow(p_profile_id, p_month, p_year) cf),
    'liquidity', calculate_liquidity(p_profile_id),
    'debt_ratio', calculate_debt_ratio(p_profile_id, p_month, p_year),
    'financial_score', calculate_financial_score(p_profile_id, p_month, p_year),
    'alerts', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'title', a.title, 'severity', a.severity, 'created_at', a.created_at) order by a.created_at desc) from alerts a where a.profile_id = p_profile_id and a.read is false and a.deleted_at is null), '[]'::jsonb)
  );
$$;

comment on function generate_dashboard(uuid, integer, integer) is 'Returns dashboard JSON for the selected profile and period.';

create or replace function generate_monthly_report(p_profile_id uuid, p_month integer, p_year integer)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'dashboard', generate_dashboard(p_profile_id, p_month, p_year),
    'budgets', coalesce((select jsonb_agg(to_jsonb(b)) from budgets b where b.profile_id = p_profile_id and b.month = p_month and b.year = p_year and b.deleted_at is null), '[]'::jsonb),
    'debts', coalesce((select jsonb_agg(to_jsonb(d)) from debts d where d.profile_id = p_profile_id and d.deleted_at is null), '[]'::jsonb),
    'goals', coalesce((select jsonb_agg(to_jsonb(g)) from goals g where g.profile_id = p_profile_id and g.deleted_at is null), '[]'::jsonb)
  );
$$;

comment on function generate_monthly_report(uuid, integer, integer) is 'Returns a report-ready JSON payload for one profile and month.';

create or replace function reset_database()
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Borrar tablas secundarias que dependen de otras (Hijos de nivel 2)
  delete from debt_payments where id is not null;
  delete from goal_contributions where id is not null;
  delete from recurring_transactions where id is not null;

  -- 2. Borrar tablas intermedias (Hijos de nivel 1)
  delete from transactions where id is not null;
  delete from budgets where id is not null;
  delete from debts where id is not null;
  delete from goals where id is not null;
  delete from alerts where id is not null;
  
  -- Desactivar el trigger de inmutabilidad temporalmente para limpiar los snapshots
  alter table monthly_snapshots disable trigger trg_monthly_snapshots_immutable;
  delete from monthly_snapshots where id is not null;
  alter table monthly_snapshots enable trigger trg_monthly_snapshots_immutable;

  delete from settings where id is not null;

  -- 3. Borrar tablas principales (Padres)
  delete from accounts where id is not null;
  delete from profiles where id is not null;

  insert into profiles(id, name, avatar, color, is_active)
  values
    ('11111111-1111-4111-8111-111111111111', 'Julian', null, '#2563eb', true),
    ('22222222-2222-4222-8222-222222222222', 'Sol', null, '#d946ef', true);

  insert into accounts(id, profile_id, name, type, currency, initial_balance, current_balance, icon, color, allow_overdraft)
  values
    ('40000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Cash', 'cash', 'ARS', 0, 0, 'banknote', '#22c55e', true),
    ('40000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Bank', 'bank', 'ARS', 0, 0, 'building-2', '#2563eb', true),
    ('40000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Mercado Pago', 'mercado_pago', 'ARS', 0, 0, 'wallet-cards', '#38bdf8', true),
    ('40000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Credit Card', 'credit_card', 'ARS', 0, 0, 'credit-card', '#f97316', true),
    ('40000000-0000-4000-8000-000000000101', '22222222-2222-4222-8222-222222222222', 'Cash', 'cash', 'ARS', 0, 0, 'banknote', '#d946ef', true),
    ('40000000-0000-4000-8000-000000000102', '22222222-2222-4222-8222-222222222222', 'Bank', 'bank', 'ARS', 0, 0, 'building-2', '#7c3aed', true);

  insert into goals(id, profile_id, name, target_amount, current_amount, monthly_target, priority, deadline, status, icon, color)
  values
    ('50000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Recover Edesur', 250000, 0, 50000, 'critical', null, 'active', 'zap', '#ef4444'),
    ('50000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Emergency Fund', 1500000, 0, 150000, 'high', null, 'active', 'shield', '#22c55e'),
    ('50000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Baby', 1000000, 0, 100000, 'high', null, 'active', 'baby', '#ec4899'),
    ('50000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Pay Off Credit Card', 500000, 0, 100000, 'high', null, 'active', 'credit-card', '#f97316'),
    ('50000000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'Pay Off Notebook', 350000, 0, 70000, 'medium', null, 'active', 'laptop', '#6366f1');

  insert into alerts(id, profile_id, type, title, description, severity)
  values
    ('60000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'system', 'FinOS listo', 'Carga tus saldos iniciales para activar los indicadores.', 'info');

  insert into settings(id, profile_id, language, currency, default_profile, animations_enabled, notifications_enabled)
  values
    ('70000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'es-AR', 'ARS', '11111111-1111-4111-8111-111111111111', true, true);
end;
$$;

comment on function reset_database() is 'Deletes all user data and restores default seed data.';
