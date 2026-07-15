import type { Tables } from "@/types/database";

export interface CashflowResult {
  income: number;
  expenses: number;
  cashflow: number;
}

export interface FinancialScoreParts {
  cashflowScore: number;
  liquidityScore: number;
  debtScore: number;
  savingsScore: number;
  goalScore: number;
  budgetScore: number;
  total: number;
}

export interface MonthlyPrediction {
  projectedExpenses: number;
  projectedBalance: number;
  burnRate: number;
  daysElapsed: number;
  daysRemaining: number;
}

export interface PurchaseEvaluation {
  decision: "yes" | "wait" | "no";
  risk: "low" | "medium" | "high";
  cashflowImpact: number;
  budgetImpact: number;
  debtImpact: number;
  goalDelay: number;
  financialScoreImpact: number;
  reasons: string[];
}

export interface AlertEvaluation {
  severity: "info" | "warning" | "high" | "critical";
  type: Tables<"alerts">["type"];
  title: string;
  description: string;
}

export interface DashboardData {
  cashflow: CashflowResult;
  liquidity: number;
  debtRatio: number;
  financialScore: FinancialScoreParts;
  burnRate: number;
  savingsRate: number;
  budgetUsage: number;
  alerts: AlertEvaluation[];
  prediction: MonthlyPrediction;
}
