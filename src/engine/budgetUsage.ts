import type { Tables } from "@/types/database";
import type { BudgetStatus } from "@/types/database";

export function calculateBudgetUsage(
  spent: number,
  limit: number
): number {
  if (limit <= 0) return 0;
  return round((spent / limit) * 100);
}

export function calculateBudgetStatus(
  usage: number
): BudgetStatus {
  if (usage >= 100) return "exceeded";
  if (usage >= 90) return "critical";
  if (usage >= 75) return "high";
  if (usage >= 50) return "warning";
  return "on_track";
}

export function calculateBudgetDiscipline(
  budgets: Pick<Tables<"budgets">, "spent_amount" | "limit_amount">[]
): number {
  if (budgets.length === 0) return 100;

  const totalUsage = budgets.reduce((sum, b) => {
    return sum + calculateBudgetUsage(Number(b.spent_amount), Number(b.limit_amount));
  }, 0);

  const avgUsage = totalUsage / budgets.length;
  if (avgUsage <= 50) return 10;
  if (avgUsage <= 75) return 7;
  if (avgUsage <= 90) return 4;
  if (avgUsage <= 100) return 2;
  return 0;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
