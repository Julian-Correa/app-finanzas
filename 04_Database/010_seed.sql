-- Production-quality starter data for a fresh FinOS project.
insert into profiles(id, name, avatar, color, is_active)
values
  ('11111111-1111-4111-8111-111111111111', 'Julian', null, '#2563eb', true),
  ('22222222-2222-4222-8222-222222222222', 'Sol', null, '#d946ef', true)
on conflict (id) do nothing;

insert into categories(id, parent_id, name, type, icon, color, display_order, is_default)
values
  ('30000000-0000-4000-8000-000000000001', null, 'Income', 'income', 'wallet', '#16a34a', 1, true),
  ('30000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'Salary', 'income', 'briefcase', '#22c55e', 2, true),
  ('30000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'Freelance', 'income', 'laptop', '#84cc16', 3, true),
  ('30000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', 'Bonus', 'income', 'sparkles', '#10b981', 4, true),
  ('30000000-0000-4000-8000-000000000010', null, 'Expenses', 'expense', 'receipt', '#ef4444', 10, true),
  ('30000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000010', 'Utilities', 'expense', 'zap', '#f97316', 11, true),
  ('30000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000010', 'Food', 'expense', 'utensils', '#eab308', 12, true),
  ('30000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000010', 'Transportation', 'expense', 'bus', '#06b6d4', 13, true),
  ('30000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000010', 'Education', 'expense', 'book-open', '#8b5cf6', 14, true),
  ('30000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000010', 'Health', 'expense', 'heart-pulse', '#ec4899', 15, true),
  ('30000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000010', 'Entertainment', 'expense', 'ticket', '#6366f1', 16, true),
  ('30000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000010', 'Debt', 'expense', 'credit-card', '#dc2626', 17, true),
  ('30000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000010', 'Savings', 'expense', 'piggy-bank', '#14b8a6', 18, true)
on conflict (id) do nothing;

insert into accounts(id, profile_id, name, type, currency, initial_balance, current_balance, icon, color, allow_overdraft)
values
  ('40000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Cash', 'cash', 'ARS', 0, 0, 'banknote', '#22c55e', true),
  ('40000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Bank', 'bank', 'ARS', 0, 0, 'building-2', '#2563eb', true),
  ('40000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Mercado Pago', 'mercado_pago', 'ARS', 0, 0, 'wallet-cards', '#38bdf8', true),
  ('40000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Credit Card', 'credit_card', 'ARS', 0, 0, 'credit-card', '#f97316', true),
  ('40000000-0000-4000-8000-000000000101', '22222222-2222-4222-8222-222222222222', 'Cash', 'cash', 'ARS', 0, 0, 'banknote', '#d946ef', true),
  ('40000000-0000-4000-8000-000000000102', '22222222-2222-4222-8222-222222222222', 'Bank', 'bank', 'ARS', 0, 0, 'building-2', '#7c3aed', true)
on conflict (id) do nothing;

insert into goals(id, profile_id, name, target_amount, current_amount, monthly_target, priority, deadline, status, icon, color)
values
  ('50000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Recover Edesur', 250000, 0, 50000, 'critical', null, 'active', 'zap', '#ef4444'),
  ('50000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'Emergency Fund', 1500000, 0, 150000, 'high', null, 'active', 'shield', '#22c55e'),
  ('50000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'Baby', 1000000, 0, 100000, 'high', null, 'active', 'baby', '#ec4899'),
  ('50000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'Pay Off Credit Card', 500000, 0, 100000, 'high', null, 'active', 'credit-card', '#f97316'),
  ('50000000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'Pay Off Notebook', 350000, 0, 70000, 'medium', null, 'active', 'laptop', '#6366f1')
on conflict (id) do nothing;

insert into budgets(profile_id, category_id, month, year, limit_amount, remaining_amount)
select
  '11111111-1111-4111-8111-111111111111'::uuid,
  c.id,
  extract(month from current_date)::integer,
  extract(year from current_date)::integer,
  case c.name
    when 'Utilities' then 180000
    when 'Food' then 300000
    when 'Transportation' then 80000
    when 'Education' then 100000
    when 'Health' then 80000
    when 'Entertainment' then 70000
    when 'Debt' then 250000
    when 'Savings' then 150000
    else 100000
  end,
  case c.name
    when 'Utilities' then 180000
    when 'Food' then 300000
    when 'Transportation' then 80000
    when 'Education' then 100000
    when 'Health' then 80000
    when 'Entertainment' then 70000
    when 'Debt' then 250000
    when 'Savings' then 150000
    else 100000
  end
from categories c
where c.type = 'expense'
  and c.parent_id is not null
on conflict do nothing;

insert into alerts(id, profile_id, type, title, description, severity)
values
  ('60000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'system', 'FinOS listo', 'Carga tus saldos iniciales para activar los indicadores.', 'info')
on conflict (id) do nothing;

insert into settings(id, theme, language, currency, default_profile, animations, notifications)
values ('70000000-0000-4000-8000-000000000001', 'system', 'es-AR', 'ARS', '11111111-1111-4111-8111-111111111111', true, true)
on conflict (id) do nothing;
