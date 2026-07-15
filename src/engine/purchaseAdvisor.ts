import type { PurchaseEvaluation } from "./types";
import { calculateFinancialScore } from "./financialScore";

export function evaluatePurchase(params: {
  price: number;
  installments?: number;
  availableCash: number;
  cashflow: number;
  income: number;
  expenses: number;
  liquidity: number;
  monthlyExpenses: number;
  debtRatio: number;
  budgetUsage: number;
  financialScore: number;
  emergencyFund: number;
}): PurchaseEvaluation {
  const {
    price,
    installments = 1,
    availableCash,
    cashflow,
    income,
    liquidity,
    monthlyExpenses,
    debtRatio,
    budgetUsage,
    emergencyFund,
  } = params;

  const reasons: string[] = [];
  const monthlyInstallment = price / installments;

  const cashflowImpact = cashflow - monthlyInstallment;
  const budgetImpact = budgetUsage + (price / (income > 0 ? income : 1)) * 100;
  const debtImpact = debtRatio + (monthlyInstallment / (income > 0 ? income : 1)) * 100;

  const hypotheticalScore = calculateFinancialScore({
    cashflow: cashflow - monthlyInstallment,
    liquidity: liquidity - price,
    monthlyExpenses: monthlyExpenses + monthlyInstallment,
    debtRatio: debtImpact,
    income,
    budgetDiscipline: Math.max(0, 10 - budgetImpact / 10),
    goalProgressScore: 0,
  });

  const financialScoreImpact = hypotheticalScore.total - params.financialScore;

  let goalDelay = 0;
  if (monthlyInstallment > 0 && income > 0) {
    goalDelay = Math.ceil(monthlyInstallment / (income * 0.1));
  }

  if (cashflowImpact < 0) {
    reasons.push("La compra generaría flujo de caja negativo");
  }

  if (emergencyFund <= price) {
    reasons.push("Consumiría el fondo de emergencia");
  }

  if (debtImpact > 50) {
    reasons.push("Elevaría la tasa de endeudamiento a más del 50%");
  }

  if (price > availableCash) {
    reasons.push("Supera el efectivo disponible");
  }

  const hasCriticalReason = cashflowImpact < 0;
  const hasMajorReason = debtImpact > 50 || emergencyFund <= price;

  let decision: "yes" | "wait" | "no";
  let risk: "low" | "medium" | "high";

  if (hasCriticalReason) {
    decision = "no";
    risk = "high";
  } else if (hasMajorReason || hypotheticalScore.total < 60) {
    decision = "wait";
    risk = "medium";
  } else if (hypotheticalScore.total >= 80) {
    decision = "yes";
    risk = "low";
  } else {
    decision = "wait";
    risk = "medium";
  }

  if (reasons.length === 0) {
    reasons.push("La compra no afecta significativamente las finanzas");
  }

  return {
    decision,
    risk,
    cashflowImpact: Math.round(cashflowImpact * 100) / 100,
    budgetImpact: Math.round(budgetImpact * 100) / 100,
    debtImpact: Math.round(debtImpact * 100) / 100,
    goalDelay,
    financialScoreImpact: Math.round(financialScoreImpact * 100) / 100,
    reasons,
  };
}
