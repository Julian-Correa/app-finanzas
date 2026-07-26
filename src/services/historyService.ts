import {
  fetchSnapshots,
  fetchTransactions,
  fetchAccounts,
  fetchDebts,
  fetchGoals,
  fetchBudgets,
  insertSnapshotIfAbsent,
  fetchSnapshot,
} from "@/supabase/queries";
import {
  calculateCashflow,
  calculateLiquidity,
  calculateTotalDebt,
  calculateGoalScore,
  calculateBudgetDiscipline,
  calculateFinancialScore,
} from "@/engine";
import type { Tables } from "@/types/database";

export interface SnapshotJson {
  transactions: number;
  accounts: number;
  debts: number;
  goals: number;
  budgets: number;
}

export interface SnapshotData {
  id: string;
  month: number;
  year: number;
  income: number;
  expenses: number;
  cashflow: number;
  debt: number;
  savings: number;
  financialScore: number;
  jsonSnapshot: SnapshotJson;
  createdAt: string;
}

export interface SnapshotDiff {
  income: number;
  expenses: number;
  cashflow: number;
  debt: number;
  savings: number;
  financialScore: number;
}

export interface HistoryData {
  snapshots: SnapshotData[];
  monthsWithData: Array<{ month: number; year: number }>;
}

function coerceSnapshotJson(raw: unknown): SnapshotJson {
  const obj = (raw ?? {}) as Partial<SnapshotJson>;
  return {
    transactions: obj.transactions ?? 0,
    accounts: obj.accounts ?? 0,
    debts: obj.debts ?? 0,
    goals: obj.goals ?? 0,
    budgets: obj.budgets ?? 0,
  };
}

export function toSnapshotData(row: Tables<"monthly_snapshots">): SnapshotData {
  return {
    id: row.id,
    month: row.month,
    year: row.year,
    income: Number(row.income),
    expenses: Number(row.expenses),
    cashflow: Number(row.cashflow),
    debt: Number(row.debt),
    savings: Number(row.savings),
    financialScore: row.financial_score,
    jsonSnapshot: coerceSnapshotJson(row.json_snapshot),
    createdAt: row.created_at,
  };
}

export async function getHistorySnapshots(profileId: string): Promise<HistoryData> {
  const rows = await fetchSnapshots(profileId);
  const snapshots = rows.map(toSnapshotData);
  return {
    snapshots,
    monthsWithData: snapshots.map((s) => ({ month: s.month, year: s.year })),
  };
}

export async function computeSnapshot(
  profileId: string,
  month: number,
  year: number
): Promise<Omit<SnapshotData, "id" | "createdAt">> {
  const [transactions, accounts, debts, goals, budgets] = await Promise.all([
    fetchTransactions(profileId, month, year),
    fetchAccounts(profileId),
    fetchDebts(profileId),
    fetchGoals(profileId),
    fetchBudgets(profileId, month, year),
  ]);

  const cashflow = calculateCashflow(transactions, month, year);
  const liquidity = calculateLiquidity(accounts);
  const totalDebt = calculateTotalDebt(debts);
  const goalProgressScore = calculateGoalScore(goals);
  const budgetDiscipline = calculateBudgetDiscipline(budgets);
  const savings = cashflow.income > 0 ? cashflow.cashflow : 0;

  const financialScore = calculateFinancialScore({
    cashflow: cashflow.cashflow,
    liquidity,
    monthlyExpenses: cashflow.expenses,
    debtRatio: cashflow.income > 0 ? (totalDebt / cashflow.income) * 100 : 0,
    income: cashflow.income,
    budgetDiscipline,
    goalProgressScore,
  });

  const jsonSnapshot: SnapshotJson = {
    transactions: transactions.length,
    accounts: accounts.length,
    debts: debts.filter((d) => d.status === "active").length,
    goals: goals.filter((g) => g.status === "active").length,
    budgets: budgets.length,
  };

  return {
    month,
    year,
    income: cashflow.income,
    expenses: cashflow.expenses,
    cashflow: cashflow.cashflow,
    debt: totalDebt,
    savings,
    financialScore: financialScore.total,
    jsonSnapshot,
  };
}

export type SaveSnapshotOutcome =
  | { status: "created"; snapshot: SnapshotData }
  | { status: "already_exists"; snapshot: SnapshotData };

export async function saveSnapshot(
  profileId: string,
  month: number,
  year: number
): Promise<SaveSnapshotOutcome> {
  const existing = await fetchSnapshot(profileId, month, year);
  if (existing) {
    return { status: "already_exists", snapshot: toSnapshotData(existing) };
  }

  const computed = await computeSnapshot(profileId, month, year);
  const inserted = await insertSnapshotIfAbsent({
    profile_id: profileId,
    month: computed.month,
    year: computed.year,
    income: computed.income,
    expenses: computed.expenses,
    cashflow: computed.cashflow,
    debt: computed.debt,
    savings: computed.savings,
    financial_score: computed.financialScore,
    json_snapshot: computed.jsonSnapshot as never,
  });

  if (!inserted) {
    const concurrent = await fetchSnapshot(profileId, month, year);
    if (!concurrent) {
      throw new Error("Snapshot insert returned null and no existing snapshot found");
    }
    return { status: "already_exists", snapshot: toSnapshotData(concurrent) };
  }

  return { status: "created", snapshot: toSnapshotData(inserted) };
}

export function diffSnapshots(baseline: SnapshotData, target: SnapshotData): SnapshotDiff {
  return {
    income: target.income - baseline.income,
    expenses: target.expenses - baseline.expenses,
    cashflow: target.cashflow - baseline.cashflow,
    debt: target.debt - baseline.debt,
    savings: target.savings - baseline.savings,
    financialScore: target.financialScore - baseline.financialScore,
  };
}
