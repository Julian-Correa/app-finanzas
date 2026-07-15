import { supabase } from "@/supabase/client";
import type { Json, Tables } from "@/types/database";

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

export async function fetchAccounts(profileId: string): Promise<Tables<"accounts">[]> {
  const { data, error } = await getSupabaseClient()
    .from("accounts")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

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
  profileId: string,
  month?: number,
  year?: number
): Promise<Tables<"transactions">[]> {
  let query = getSupabaseClient()
    .from("transactions")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .order("date", { ascending: false });

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
  profileId: string,
  month: number,
  year: number
): Promise<Tables<"budgets">[]> {
  const { data, error } = await getSupabaseClient()
    .from("budgets")
    .select("*")
    .eq("profile_id", profileId)
    .eq("month", month)
    .eq("year", year)
    .is("deleted_at", null);

  if (error) throw error;
  return data;
}

export async function fetchDebts(profileId: string): Promise<Tables<"debts">[]> {
  const { data, error } = await getSupabaseClient()
    .from("debts")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .order("priority", { ascending: true });

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

export async function fetchGoals(profileId: string): Promise<Tables<"goals">[]> {
  const { data, error } = await getSupabaseClient()
    .from("goals")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .order("priority", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchAlerts(profileId: string): Promise<Tables<"alerts">[]> {
  const { data, error } = await getSupabaseClient()
    .from("alerts")
    .select("*")
    .eq("profile_id", profileId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchDashboardOverview(profileId: string, month: number, year: number): Promise<Json> {
  const { data, error } = await getSupabaseClient()
    .rpc("generate_dashboard", { p_profile_id: profileId, p_month: month, p_year: year });

  if (error) throw error;
  return data;
}
