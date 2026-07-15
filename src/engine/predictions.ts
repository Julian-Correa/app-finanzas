import type { Tables } from "@/types/database";

export interface PredictionData {
  projectedExpenses: number;
  projectedIncome: number;
  projectedCashflow: number;
  projectedDebt: number;
  projectedGoalProgress: number;
}

export function calculateProjectedExpenses(
  currentExpenses: number,
  daysElapsed: number,
  daysInMonth: number
): number {
  if (daysElapsed <= 0) return 0;
  const burnRate = currentExpenses / daysElapsed;
  return round(burnRate * daysInMonth);
}

export function calculateProjectedIncome(
  currentIncome: number,
  daysElapsed: number,
  daysInMonth: number
): number {
  if (daysElapsed <= 0) return 0;
  const dailyRate = currentIncome / daysElapsed;
  return round(dailyRate * daysInMonth);
}

export function calculateMonthlyPrediction(
  transactions: Pick<Tables<"transactions">, "amount" | "transaction_type" | "date">[],
  month: number,
  year: number
): PredictionData {
  const now = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth = now.getMonth() + 1 === month && now.getFullYear() === year;
  const daysElapsed = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const currentIncome = filtered
    .filter((t) => t.transaction_type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const currentExpenses = filtered
    .filter((t) => t.transaction_type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const projectedIncome = calculateProjectedIncome(currentIncome, daysElapsed, daysInMonth);
  const projectedExpenses = calculateProjectedExpenses(currentExpenses, daysElapsed, daysInMonth);

  return {
    projectedIncome: round(projectedIncome),
    projectedExpenses: round(projectedExpenses),
    projectedCashflow: round(projectedIncome - projectedExpenses),
    projectedDebt: 0,
    projectedGoalProgress: 0,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
