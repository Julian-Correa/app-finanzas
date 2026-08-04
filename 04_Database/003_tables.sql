-- FinOS relational schema.
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text,
  color text not null default '#2563eb',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid,
  updated_by_profile_id uuid
);

comment on table profiles is 'People or household members managed by FinOS.';

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  name text not null,
  type account_type not null,
  currency text not null default 'ARS',
  initial_balance numeric(14,2) not null default 0,
  current_balance numeric(14,2) not null default 0,
  icon text,
  color text,
  is_archived boolean not null default false,
  allow_overdraft boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table accounts is 'Wallets, bank accounts and other balance containers.';

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete restrict,
  name text not null,
  type transaction_type not null,
  icon text,
  color text,
  display_order integer not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table categories is 'Income and expense categories with optional nesting.';

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  account_id uuid not null references accounts(id) on delete restrict,
  category_id uuid not null references categories(id) on delete restrict,
  amount numeric(14,2) not null,
  transaction_type transaction_type not null,
  description text not null,
  notes text,
  date date not null default current_date,
  is_recurring boolean not null default false,
  attachment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table transactions is 'Main financial ledger. Deletes must be soft deletes.';

create table if not exists recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null unique references transactions(id) on delete restrict,
  frequency recurrence_frequency not null default 'monthly',
  next_execution date not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table recurring_transactions is 'Recurring schedule linked to a base transaction.';

create table if not exists debts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  name text not null,
  creditor text,
  original_amount numeric(14,2) not null,
  remaining_amount numeric(14,2) not null,
  installment_amount numeric(14,2) not null default 0,
  installments_total integer not null default 0,
  installments_left integer not null default 0,
  interest_rate numeric(7,4) not null default 0,
  priority debt_priority not null default 'other',
  due_day integer,
  status debt_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table debts is 'Installments, utilities debt, loans and liabilities.';

create table if not exists debt_payments (
  id uuid primary key default gen_random_uuid(),
  debt_id uuid not null references debts(id) on delete restrict,
  amount numeric(14,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table debt_payments is 'Payment history for debts.';

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  category_id uuid not null references categories(id) on delete restrict,
  month integer not null,
  year integer not null,
  limit_amount numeric(14,2) not null,
  spent_amount numeric(14,2) not null default 0,
  remaining_amount numeric(14,2) not null default 0,
  status budget_status not null default 'on_track',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table budgets is 'Monthly spending limits per category and profile.';

create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  name text not null,
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null default 0,
  monthly_target numeric(14,2) not null default 0,
  priority goal_priority not null default 'medium',
  deadline date,
  status goal_status not null default 'active',
  icon text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table goals is 'Financial goals tracked by profile.';

create table if not exists goal_contributions (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references goals(id) on delete restrict,
  amount numeric(14,2) not null,
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table goal_contributions is 'Contribution history for financial goals.';

create table if not exists monthly_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  month integer not null,
  year integer not null,
  income numeric(14,2) not null default 0,
  expenses numeric(14,2) not null default 0,
  cashflow numeric(14,2) not null default 0,
  debt numeric(14,2) not null default 0,
  savings numeric(14,2) not null default 0,
  financial_score integer not null default 0,
  json_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table monthly_snapshots is 'Immutable month-end financial state.';

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  type alert_type not null default 'system',
  title text not null,
  description text,
  severity alert_severity not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table alerts is 'Actionable notifications and warnings.';

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  theme theme_mode not null default 'system',
  language text not null default 'es-AR',
  currency text not null default 'ARS',
  default_profile uuid references profiles(id) on delete set null,
  animations boolean not null default true,
  notifications boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by_profile_id uuid references profiles(id) on delete set null,
  updated_by_profile_id uuid references profiles(id) on delete set null
);

comment on table settings is 'Application-level preferences for the no-auth FinOS deployment.';
