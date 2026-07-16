export const mockProfileId = "profile-001";

export const mockCategories = [
  { id: "cat-1", name: "Comida", type: "expense", icon: "utensils", color: "#10b981", display_order: 1, is_system: false },
  { id: "cat-2", name: "Transporte", type: "expense", icon: "car", color: "#f59e0b", display_order: 2, is_system: false },
  { id: "cat-3", name: "Salario", type: "income", icon: "briefcase", color: "#3b82f6", display_order: 10, is_system: false },
];

export const mockAccounts = [
  { id: "acc-1", name: "Banco Nación", type: "checking", current_balance: 50000, currency: "ARS", is_archived: false, profile_id: mockProfileId, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "acc-2", name: "Mercado Pago", type: "savings", current_balance: 15000, currency: "ARS", is_archived: false, profile_id: mockProfileId, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockTransactions = [
  { id: "tx-1", profile_id: mockProfileId, account_id: "acc-1", category_id: "cat-1", transaction_type: "expense", amount: 2500, description: "Supermercado", date: "2026-07-10", is_recurring: false, recurring_frequency: null, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "tx-2", profile_id: mockProfileId, account_id: "acc-1", category_id: "cat-3", transaction_type: "income", amount: 150000, description: "Sueldo", date: "2026-07-02", is_recurring: false, recurring_frequency: null, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "tx-3", profile_id: mockProfileId, account_id: "acc-2", category_id: "cat-2", transaction_type: "expense", amount: 1200, description: "Sube", date: "2026-07-15", is_recurring: false, recurring_frequency: null, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockBudgets = [
  { id: "bud-1", profile_id: mockProfileId, category_id: "cat-1", month: 7, year: 2026, limit_amount: 30000, spent_amount: 12000, remaining_amount: 18000, status: "on_track", created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "bud-2", profile_id: mockProfileId, category_id: "cat-2", month: 7, year: 2026, limit_amount: 15000, spent_amount: 14000, remaining_amount: 1000, status: "critical", created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockDebts = [
  { id: "debt-1", profile_id: mockProfileId, name: "Tarjeta Visa", type: "credit_card", total_amount: 100000, remaining_amount: 45000, interest_rate: 45, min_payment: 5000, due_date: "2026-08-15", status: "active", priority: 1, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "debt-2", profile_id: mockProfileId, name: "Préstamo", type: "loan", total_amount: 200000, remaining_amount: 150000, interest_rate: 30, min_payment: 8000, due_date: "2026-09-10", status: "active", priority: 2, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockDebtPayments = [
  { id: "dp-1", debt_id: "debt-1", amount: 5000, date: "2026-07-10", notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "dp-2", debt_id: "debt-1", amount: 5000, date: "2026-06-10", notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockGoals = [
  { id: "goal-1", profile_id: mockProfileId, name: "Vacaciones", target_amount: 500000, current_amount: 150000, monthly_target: 25000, deadline: "2026-12-31", status: "active", priority: 1, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
  { id: "goal-2", profile_id: mockProfileId, name: "Auto", target_amount: 1000000, current_amount: 100000, monthly_target: 50000, deadline: "2027-06-30", status: "active", priority: 2, notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockGoalContributions = [
  { id: "gc-1", goal_id: "goal-1", amount: 25000, date: "2026-07-05", notes: null, created_at: "", updated_at: "", deleted_at: null, created_by_profile_id: null, updated_by_profile_id: null },
];

export const mockAlerts = [
  { id: "alert-1", profile_id: mockProfileId, type: "budget", title: "Presupuesto cerca del límite", description: "Transporte está al 93%", severity: "warning", is_read: false, created_at: "2026-07-14T12:00:00Z", updated_at: "" as never },
];
