import { supabase } from "@/supabase/client";
import type { Json, Tables, AuditFields } from "@/types/database";

function getSupabaseClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

export async function fetchProfiles(): Promise<Tables<"profiles">[]> {
  const { data, error } = await getSupabaseClient()
    .from("profiles")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchAccounts(profileId?: string): Promise<Tables<"accounts">[]> {
  let query = getSupabaseClient()
    .from("accounts")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchCategories(): Promise<Tables<"categories">[]> {
  const { data, error } = await getSupabaseClient()
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchTransactions(
  profileId?: string,
  month?: number,
  year?: number
): Promise<Tables<"transactions">[]> {
  let query = getSupabaseClient()
    .from("transactions")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending: false });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  if (month !== undefined && year !== undefined) {
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;
    query = query.gte("date", start).lt("date", end);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchBudgets(
  profileId: string | undefined,
  month: number,
  year: number
): Promise<Tables<"budgets">[]> {
  let query = getSupabaseClient()
    .from("budgets")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .is("deleted_at", null);

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchDebts(profileId?: string): Promise<Tables<"debts">[]> {
  let query = getSupabaseClient()
    .from("debts")
    .select("*")
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchDebtPayments(
  debtId: string
): Promise<Tables<"debt_payments">[]> {
  const { data, error } = await getSupabaseClient()
    .from("debt_payments")
    .select("*")
    .eq("debt_id", debtId)
    .is("deleted_at", null)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchGoals(profileId?: string): Promise<Tables<"goals">[]> {
  let query = getSupabaseClient()
    .from("goals")
    .select("*")
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchAlerts(profileId?: string, limit?: number): Promise<Tables<"alerts">[]> {
  let query = getSupabaseClient()
    .from("alerts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function fetchDashboardOverview(profileId: string, month: number, year: number): Promise<Json> {
  const { data, error } = await getSupabaseClient()
    .rpc("generate_dashboard", { p_profile_id: profileId, p_month: month, p_year: year });

  if (error) throw error;
  return data;
}

export async function createTransaction(
  transaction: Omit<Tables<"transactions">, "id" | keyof AuditFields>
): Promise<Tables<"transactions">> {
  const { data, error } = await getSupabaseClient()
    .from("transactions")
    .insert(transaction as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(
  id: string,
  updates: Partial<Omit<Tables<"transactions">, keyof AuditFields>>
): Promise<Tables<"transactions">> {
  const { data, error } = await getSupabaseClient()
    .from("transactions")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteTransaction(id: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("transactions")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) throw error;
}

export async function createBudget(
  budget: Omit<Tables<"budgets">, "id" | keyof AuditFields>
): Promise<Tables<"budgets">> {
  const { data, error } = await getSupabaseClient()
    .from("budgets")
    .insert(budget as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBudget(
  id: string,
  updates: Partial<Omit<Tables<"budgets">, keyof AuditFields>>
): Promise<Tables<"budgets">> {
  const { data, error } = await getSupabaseClient()
    .from("budgets")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteBudget(id: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("budgets")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) throw error;
}

export async function createDebt(
  debt: Omit<Tables<"debts">, "id" | keyof AuditFields>
): Promise<Tables<"debts">> {
  const { data, error } = await getSupabaseClient()
    .from("debts")
    .insert(debt as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDebt(
  id: string,
  updates: Partial<Omit<Tables<"debts">, keyof AuditFields>>
): Promise<Tables<"debts">> {
  const { data, error } = await getSupabaseClient()
    .from("debts")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteDebt(id: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("debts")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) throw error;
}

export async function createDebtPayment(
  payment: Omit<Tables<"debt_payments">, "id" | keyof AuditFields>
): Promise<Tables<"debt_payments">> {
  const { data, error } = await getSupabaseClient()
    .from("debt_payments")
    .insert(payment as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteDebtPayment(id: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("debt_payments")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) throw error;
}

export async function createGoal(
  goal: Omit<Tables<"goals">, "id" | keyof AuditFields>
): Promise<Tables<"goals">> {
  const { data, error } = await getSupabaseClient()
    .from("goals")
    .insert(goal as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(
  id: string,
  updates: Partial<Omit<Tables<"goals">, keyof AuditFields>>
): Promise<Tables<"goals">> {
  const { data, error } = await getSupabaseClient()
    .from("goals")
    .update(updates as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function softDeleteGoal(id: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("goals")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id);

  if (error) throw error;
}

export async function createGoalContribution(
  contribution: Omit<Tables<"goal_contributions">, "id" | keyof AuditFields>
): Promise<Tables<"goal_contributions">> {
  const { data, error } = await getSupabaseClient()
    .from("goal_contributions")
    .insert(contribution as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchGoalContributions(
  goalId: string
): Promise<Tables<"goal_contributions">[]> {
  const { data, error } = await getSupabaseClient()
    .from("goal_contributions")
    .select("*")
    .eq("goal_id", goalId)
    .is("deleted_at", null)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchSnapshots(profileId?: string): Promise<Tables<"monthly_snapshots">[]> {
  let query = getSupabaseClient()
    .from("monthly_snapshots")
    .select("*")
    .is("deleted_at", null)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (profileId && profileId !== "ambos") {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export class SnapshotAlreadyExistsError extends Error {
  constructor() {
    super("Snapshot already exists for this period and is immutable");
    this.name = "SnapshotAlreadyExistsError";
  }
}

export async function insertSnapshotIfAbsent(
  snapshot: {
    profile_id: string;
    month: number;
    year: number;
    income: number;
    expenses: number;
    cashflow: number;
    debt: number;
    savings: number;
    financial_score: number;
    json_snapshot: Json;
  }
): Promise<Tables<"monthly_snapshots"> | null> {
  const { data: existing } = await getSupabaseClient()
    .from("monthly_snapshots")
    .select("id")
    .eq("profile_id", snapshot.profile_id)
    .eq("month", snapshot.month)
    .eq("year", snapshot.year)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    return null;
  }

  const { data, error } = await getSupabaseClient()
    .from("monthly_snapshots")
    .insert(snapshot as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSnapshot(
  profileId: string,
  month: number,
  year: number
): Promise<Tables<"monthly_snapshots"> | null> {
  const { data, error } = await getSupabaseClient()
    .from("monthly_snapshots")
    .select("*")
    .eq("profile_id", profileId)
    .eq("month", month)
    .eq("year", year)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchSettings(): Promise<Tables<"settings"> | null> {
  const { data, error } = await getSupabaseClient()
    .from("settings")
    .select("*")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertSetting(
  setting: {
    theme: string;
    language: string;
    currency: string;
    default_profile: string | null;
    animations: boolean;
    notifications: boolean;
  }
): Promise<Tables<"settings">> {
  const { data: existing } = await getSupabaseClient()
    .from("settings")
    .select("id")
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    const { data, error } = await getSupabaseClient()
      .from("settings")
      .update(setting as never)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await getSupabaseClient()
    .from("settings")
    .insert(setting as never)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchTransactionsByDateRange(
  profileId: string,
  startDate: string,
  endDate: string
): Promise<Tables<"transactions">[]> {
  const { data, error } = await getSupabaseClient()
    .from("transactions")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}
