-- FinOS enum types.
do $$
begin
  create type account_type as enum ('cash', 'bank', 'mercado_pago', 'credit_card', 'savings', 'other');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type transaction_type as enum ('income', 'expense');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type recurrence_frequency as enum ('daily', 'weekly', 'monthly', 'yearly');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type debt_priority as enum ('essential', 'housing', 'credit_card', 'personal_loan', 'installment_purchase', 'other');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type debt_status as enum ('active', 'completed', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type goal_priority as enum ('critical', 'high', 'medium', 'low');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type goal_status as enum ('active', 'completed', 'paused', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type alert_type as enum ('budget', 'debt', 'goal', 'cashflow', 'system');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type alert_severity as enum ('info', 'warning', 'high', 'critical');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type budget_status as enum ('on_track', 'warning', 'high', 'critical', 'exceeded');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type theme_mode as enum ('system', 'light', 'dark');
exception when duplicate_object then null;
end $$;
