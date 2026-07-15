import type { MonthlyPrediction } from "./types";

export function calculateBurnRate(
  totalExpenses: number,
  daysElapsed: number
): number {
  if (daysElapsed <= 0) return 0;
  return round(totalExpenses / daysElapsed);
}

export function calculateMonthlyPrediction(
  totalExpenses: number,
  totalIncome: number,
  month: number,
  year: number
): MonthlyPrediction {
  const now = new Date();
  const daysInMonth = new Date(year, month, 0).getDate();
  const isCurrentMonth = now.getMonth() + 1 === month && now.getFullYear() === year;
  const daysElapsed = isCurrentMonth
    ? Math.max(1, now.getDate())
    : daysInMonth;
  const daysRemaining = daysInMonth - daysElapsed;

  const burnRate = calculateBurnRate(totalExpenses, daysElapsed);
  const projectedExpenses = round(burnRate * daysInMonth);
  const projectedBalance = round(totalIncome - projectedExpenses);

  return {
    burnRate,
    daysElapsed,
    daysRemaining,
    projectedExpenses,
    projectedBalance,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
