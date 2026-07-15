import {
  fetchAccounts,
  fetchTransactions,
  fetchBudgets,
  fetchDebts,
  fetchDebtPayments,
  fetchGoals,
  fetchAlerts,
} from "@/supabase/queries";
import {
  calculateCashflow,
  calculateLiquidity,
  calculateLiquidityRatio,
  calculateDebtRatio,
  calculateBudgetDiscipline,
  calculateGoalScore,
  calculateFinancialScore,
  calculateBurnRate,
  calculateSavingsRate,
  calculateMonthlyPrediction,
} from "@/engine";
import type { DashboardData } from "@/engine/types";

export async function getDashboardData(
  profileId: string,
  month: number,
  year: number
): Promise<DashboardData> {
  const [accounts, transactions, budgets, debts, debtPayments, goals, alerts] =
    await Promise.all([
      fetchAccounts(profileId),
      fetchTransactions(profileId, month, year),
      fetchBudgets(profileId, month, year),
      fetchDebts(profileId),
      fetchDebtPayments(""),
      fetchGoals(profileId),
      fetchAlerts(profileId),
    ]);

  const cashflow = calculateCashflow(transactions, month, year);
  const liquidity = calculateLiquidity(accounts);
  const liquidityRatio = calculateLiquidityRatio(liquidity, cashflow.expenses);
  const debtRatio = calculateDebtRatio(debtPayments, cashflow.income, month, year);
  const budgetDiscipline = calculateBudgetDiscipline(budgets);
  const goalProgressScore = calculateGoalScore(goals);

  const financialScore = calculateFinancialScore({
    cashflow: cashflow.cashflow,
    liquidity,
    monthlyExpenses: cashflow.expenses,
    debtRatio,
    income: cashflow.income,
    budgetDiscipline,
    goalProgressScore,
  });

  const burnRate = calculateBurnRate(cashflow.expenses, new Date().getDate());
  const savingsRate = calculateSavingsRate(cashflow.income, cashflow.expenses);
  const prediction = calculateMonthlyPrediction(cashflow.expenses, cashflow.income, month, year);

  const avgBudgetUsage = budgets.length > 0
    ? budgets.reduce((s, b) => s + (Number(b.limit_amount) > 0 ? (Number(b.spent_amount) / Number(b.limit_amount)) * 100 : 0), 0) / budgets.length
    : 0;

  const evalAlerts: DashboardData["alerts"] = [];

  if (cashflow.cashflow < 0) {
    evalAlerts.push({
      severity: "critical",
      type: "cashflow",
      title: "Flujo de caja negativo",
      description: "Los gastos superan a los ingresos este mes.",
    });
  }

  if (liquidity <= 0) {
    evalAlerts.push({
      severity: "critical",
      type: "cashflow",
      title: "Sin efectivo disponible",
      description: "El saldo total en cuentas es $0. Revisá tus cuentas.",
    });
  }

  if (financialScore.total < 40) {
    evalAlerts.push({
      severity: "critical",
      type: "system",
      title: "Score financiero crítico",
      description: `Tu salud financiera es ${financialScore.total}/100. Revisá tus gastos y deudas.`,
    });
  }

  if (debtRatio > 50) {
    evalAlerts.push({
      severity: "critical",
      type: "debt",
      title: "Endeudamiento crítico",
      description: `La tasa de endeudamiento es ${debtRatio.toFixed(0)}%. Supera el 50%.`,
    });
  }

  if (budgets.some((b) => b.status === "exceeded")) {
    evalAlerts.push({
      severity: "high",
      type: "budget",
      title: "Presupuesto excedido",
      description: "Al menos una categoría superó su límite mensual.",
    });
  }

  if (avgBudgetUsage > 75) {
    evalAlerts.push({
      severity: "warning",
      type: "budget",
      title: "Presupuesto al límite",
      description: `El uso promedio de presupuestos es ${avgBudgetUsage.toFixed(0)}%.`,
    });
  }

  if (liquidityRatio < 0.5 && liquidityRatio >= 0) {
    evalAlerts.push({
      severity: "warning",
      type: "cashflow",
      title: "Liquidez baja",
      description: `El efectivo disponible cubre menos de la mitad de los gastos mensuales.`,
    });
  }

  const delayedGoals = goals.filter((g) => {
    if (g.status !== "active" || !g.deadline) return false;
    return new Date(g.deadline) < new Date() && Number(g.current_amount) < Number(g.target_amount);
  });

  for (const g of delayedGoals) {
    evalAlerts.push({
      severity: "warning",
      type: "goal",
      title: `Meta retrasada: ${g.name}`,
      description: `La fecha límite pasó y no se alcanzó el objetivo.`,
    });
  }

  return {
    cashflow,
    liquidity,
    debtRatio,
    financialScore,
    burnRate,
    savingsRate,
    budgetUsage: avgBudgetUsage,
    alerts: [...evalAlerts, ...alerts.slice(0, 3).map((a) => ({
      severity: a.severity as DashboardData["alerts"][number]["severity"],
      type: a.type as DashboardData["alerts"][number]["type"],
      title: a.title,
      description: a.description ?? "",
    }))],
    prediction,
  };
}
