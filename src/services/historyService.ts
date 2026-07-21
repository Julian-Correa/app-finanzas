import {
  fetchSnapshots,
  fetchTransactions,
  fetchAccounts,
  fetchDebts,
  fetchGoals,
  fetchBudgets,
  upsertSnapshot,
  fetchCategories,
} from "@/supabase/queries";
import {
  calculateCashflow,
  calculateLiquidity,
  calculateDebtRatio,
  calculateTotalDebt,
  calculateGoalScore,
  calculateBudgetDiscipline,
  calculateFinancialScore,
} from "@/engine";
import type { Tables } from "@/types/database";

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
  jsonSnapshot: unknown;
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

function toSnapshotData(row: Tables<"monthly_snapshots">): SnapshotData {
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
    jsonSnapshot: row.json_snapshot,
    createdAt: row.created_at,
  };
}

export async function getHistorySnapshots(profileId: string): Promise<HistoryData> {
  const rows = await fetchSnapshots(profileId);

  if (rows.length > 0) {
    return {
      snapshots: rows.map(toSnapshotData),
      monthsWithData: rows.map((r) => ({ month: r.month, year: r.year })),
    };
  }

  const now = new Date();
  const computed: SnapshotData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const snapshot = await computeSnapshot(profileId, m, y);
    computed.push(snapshot);
  }

  return {
    snapshots: computed,
    monthsWithData: computed.map((s) => ({ month: s.month, year: s.year })),
  };
}

export async function computeSnapshot(
  profileId: string,
  month: number,
  year: number
): Promise<SnapshotData & { month: number; year: number }> {
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

  const jsonSnapshot = {
    transactions: transactions.length,
    accounts: accounts.length,
    debts: debts.filter((d) => d.status === "active").length,
    goals: goals.filter((g) => g.status === "active").length,
    budgets: budgets.length,
  };

  return {
    id: `computed-${year}-${month}`,
    month,
    year,
    income: cashflow.income,
    expenses: cashflow.expenses,
    cashflow: cashflow.cashflow,
    debt: totalDebt,
    savings,
    financialScore: financialScore.total,
    jsonSnapshot,
    createdAt: new Date().toISOString(),
  };
}

export async function saveSnapshot(profileId: string, month: number, year: number): Promise<SnapshotData> {
  const computed = await computeSnapshot(profileId, month, year);

  const saved = await upsertSnapshot({
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

  return toSnapshotData(saved);
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
