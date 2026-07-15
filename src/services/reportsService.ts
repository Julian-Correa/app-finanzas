import { fetchTransactions, fetchCategories, fetchAccounts } from "@/supabase/queries";
import { calculateCashflow } from "@/engine";

export interface MonthlySummary {
  month: number;
  year: number;
  income: number;
  expenses: number;
  cashflow: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  total: number;
  color: string;
  percentage: number;
}

export async function getMonthlyReports(profileId: string, months: number = 6) {
  const now = new Date();
  const categories = await fetchCategories();

  const monthlyData: MonthlySummary[] = [];
  const categoryTotals: Record<string, number> = {};

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();

    const transactions = await fetchTransactions(profileId, m, y);
    const cashflow = calculateCashflow(transactions, m, y);

    monthlyData.push({ month: m, year: y, ...cashflow });

    for (const t of transactions) {
      if (t.transaction_type === "expense") {
        const catId = t.category_id;
        categoryTotals[catId] = (categoryTotals[catId] || 0) + Math.abs(Number(t.amount));
      }
    }
  }

  const totalExpenses = Object.values(categoryTotals).reduce((s, v) => s + v, 0);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const categorySummary: CategorySummary[] = Object.entries(categoryTotals)
    .map(([categoryId, total]) => ({
      categoryId,
      categoryName: catMap.get(categoryId)?.name ?? "Sin categoría",
      total,
      color: catMap.get(categoryId)?.color ?? "#94a3b8",
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return { monthlyData, categorySummary };
}

export async function getCategoryExpenses(profileId: string, month: number, year: number) {
  const [transactions, categories] = await Promise.all([
    fetchTransactions(profileId, month, year),
    fetchCategories(),
  ]);

  const catMap = new Map(categories.map((c) => [c.id, c]));
  const totals: Record<string, { name: string; total: number; color: string }> = {};

  for (const t of transactions) {
    if (t.transaction_type === "expense") {
      const cat = catMap.get(t.category_id);
      const key = t.category_id;
      if (!totals[key]) {
        totals[key] = { name: cat?.name ?? "Sin categoría", total: 0, color: cat?.color ?? "#94a3b8" };
      }
      totals[key].total += Math.abs(Number(t.amount));
    }
  }

  return Object.values(totals).sort((a, b) => b.total - a.total);
}
