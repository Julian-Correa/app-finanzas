import { getDashboardData } from "@/services/dashboardService";
import { evaluatePurchase } from "@/engine";
import type { PurchaseEvaluation } from "@/engine/types";

export async function getPurchaseBaseline(profileId: string | undefined) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return getDashboardData(profileId, month, year);
}

export function evaluateAdvisedPurchase(
  dashboard: Awaited<ReturnType<typeof getPurchaseBaseline>>,
  price: number,
  installments: number
): PurchaseEvaluation {
  return evaluatePurchase({
    price,
    installments,
    availableCash: dashboard.liquidity,
    cashflow: dashboard.cashflow.cashflow,
    income: dashboard.cashflow.income,
    expenses: Math.abs(dashboard.cashflow.expenses),
    liquidity: dashboard.liquidity,
    monthlyExpenses: Math.abs(dashboard.cashflow.expenses),
    debtRatio: dashboard.debtRatio,
    budgetUsage: dashboard.budgetUsage,
    financialScore: dashboard.financialScore.total,
    emergencyFund: dashboard.liquidity * 0.3,
  });
}
