import type { FinancialScoreParts } from "./types";

export function calculateFinancialScore(params: {
  cashflow: number;
  liquidity: number;
  monthlyExpenses: number;
  debtRatio: number;
  income: number;
  budgetDiscipline: number;
  goalProgressScore: number;
}): FinancialScoreParts {
  const { cashflow, liquidity, monthlyExpenses, debtRatio, income, budgetDiscipline, goalProgressScore } = params;

  const cashflowScore =
    cashflow > 0 ? 25 : cashflow === 0 ? 12 : 0;

  const liquidityScore =
    monthlyExpenses <= 0
      ? 20
      : liquidity >= monthlyExpenses
        ? 20
        : liquidity >= monthlyExpenses * 0.5
          ? 10
          : 0;

  const debtScore =
    debtRatio <= 20 ? 20 : debtRatio <= 35 ? 14 : debtRatio <= 50 ? 7 : 0;

  const savingsRate = income > 0 ? (cashflow / income) * 100 : 0;
  const savingsScore =
    income <= 0 ? 0 : savingsRate >= 20 ? 15 : savingsRate >= 10 ? 10 : cashflow > 0 ? 5 : 0;

  const budgetScore = budgetDiscipline;

  const total = Math.max(
    0,
    Math.min(100, Math.round(cashflowScore + liquidityScore + debtScore + savingsScore + goalProgressScore + budgetScore))
  );

  return {
    cashflowScore,
    liquidityScore,
    debtScore,
    savingsScore,
    goalScore: goalProgressScore,
    budgetScore,
    total,
  };
}

export function calculateScoreLevel(
  score: number
): "excellent" | "good" | "warning" | "critical" {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 40) return "warning";
  return "critical";
}
