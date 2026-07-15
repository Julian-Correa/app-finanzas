-- Trigger wiring for automatic recalculation.
create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();
create trigger trg_accounts_updated_at before update on accounts for each row execute function set_updated_at();
create trigger trg_categories_updated_at before update on categories for each row execute function set_updated_at();
create trigger trg_transactions_updated_at before update on transactions for each row execute function set_updated_at();
create trigger trg_recurring_transactions_updated_at before update on recurring_transactions for each row execute function set_updated_at();
create trigger trg_debts_updated_at before update on debts for each row execute function set_updated_at();
create trigger trg_debt_payments_updated_at before update on debt_payments for each row execute function set_updated_at();
create trigger trg_budgets_updated_at before update on budgets for each row execute function set_updated_at();
create trigger trg_goals_updated_at before update on goals for each row execute function set_updated_at();
create trigger trg_goal_contributions_updated_at before update on goal_contributions for each row execute function set_updated_at();
create trigger trg_alerts_updated_at before update on alerts for each row execute function set_updated_at();
create trigger trg_settings_updated_at before update on settings for each row execute function set_updated_at();

create or replace function after_transaction_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform refresh_account_balance(old.account_id);
    perform refresh_budget_amount(old.profile_id, old.category_id, extract(month from old.date)::integer, extract(year from old.date)::integer);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    perform refresh_account_balance(new.account_id);
    perform refresh_budget_amount(new.profile_id, new.category_id, extract(month from new.date)::integer, extract(year from new.date)::integer);
    return new;
  end if;

  return old;
end;
$$;

comment on function after_transaction_change() is 'Keeps account balances and budgets synchronized after ledger changes.';

create trigger trg_transactions_recalculate after insert or update or delete on transactions for each row execute function after_transaction_change();

create or replace function after_debt_payment_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform refresh_debt_amount(old.debt_id);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    perform refresh_debt_amount(new.debt_id);
    return new;
  end if;

  return old;
end;
$$;

comment on function after_debt_payment_change() is 'Keeps debt balances synchronized after payment changes.';

create trigger trg_debt_payments_recalculate after insert or update or delete on debt_payments for each row execute function after_debt_payment_change();

create or replace function after_goal_contribution_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') then
    perform refresh_goal_amount(old.goal_id);
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    perform refresh_goal_amount(new.goal_id);
    return new;
  end if;

  return old;
end;
$$;

comment on function after_goal_contribution_change() is 'Keeps goal progress synchronized after contribution changes.';

create trigger trg_goal_contributions_recalculate after insert or update or delete on goal_contributions for each row execute function after_goal_contribution_change();

create or replace function prevent_monthly_snapshot_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'monthly_snapshots are immutable';
end;
$$;

comment on function prevent_monthly_snapshot_mutation() is 'Prevents updates and deletes on immutable snapshots.';

create trigger trg_monthly_snapshots_immutable before update or delete on monthly_snapshots for each row execute function prevent_monthly_snapshot_mutation();
