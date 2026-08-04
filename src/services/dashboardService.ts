import {
  fetchDashboardOverview,
  fetchBudgets,
  fetchGoals,
  fetchAlerts,
} from "@/supabase/queries";
import {
  calculateBudgetDiscipline,
  calculateGoalScore,
  calculateFinancialScore,
  calculateBurnRate,
  calculateSavingsRate,
  calculateMonthlyPrediction,
  calculateLiquidityRatio,
} from "@/engine";
import type { DashboardData } from "@/engine/types";
import type { Json } from "@/types/database";

interface DashboardOverviewPayload {
  cashflow?: {
    income?: number;
    expenses?: number;
    cashflow?: number;
  } | null;
  liquidity?: number | string | null;
  debt_ratio?: number | string | null;
}

function parseDashboardOverview(overview: Json): {
  cashflow: Required<DashboardData>["cashflow"];
  liquidity: number;
  debtRatio: number;
} {
  const payload =
    overview && typeof overview === "object" && !Array.isArray(overview)
      ? (overview as DashboardOverviewPayload)
      : {};

  return {
    cashflow: {
      income: Number(payload.cashflow?.income ?? 0),
      expenses: Number(payload.cashflow?.expenses ?? 0),
      cashflow: Number(payload.cashflow?.cashflow ?? 0),
    },
    liquidity: Number(payload.liquidity ?? 0),
    debtRatio: Number(payload.debt_ratio ?? 0),
  };
}

export async function getDashboardData(
  profileId: string | undefined,
  month: number,
  year: number
): Promise<DashboardData> {
  const julianId = "11111111-1111-4111-8111-111111111111";
  const parejaId = "22222222-2222-4222-8222-222222222222";

  const [overviewJulian, overviewPareja, budgets, goals, alerts] =
    await Promise.all([
      profileId && profileId !== "ambos" ? fetchDashboardOverview(profileId, month, year) : fetchDashboardOverview(julianId, month, year),
      profileId && profileId !== "ambos" ? Promise.resolve(null) : fetchDashboardOverview(parejaId, month, year),
      fetchBudgets(profileId, month, year),
      fetchGoals(profileId),
      fetchAlerts(profileId, 3),
    ]);

  const parsedJulian = parseDashboardOverview(overviewJulian);
  const parsedPareja = overviewPareja ? parseDashboardOverview(overviewPareja) : null;

  let cashflow: Required<DashboardData>["cashflow"];
  let liquidity: number;
  let debtRatio: number;

  if (parsedPareja) {
    cashflow = {
      income: parsedJulian.cashflow.income + parsedPareja.cashflow.income,
      expenses: parsedJulian.cashflow.expenses + parsedPareja.cashflow.expenses,
      cashflow: parsedJulian.cashflow.cashflow + parsedPareja.cashflow.cashflow,
    };
    liquidity = parsedJulian.liquidity + parsedPareja.liquidity;
    const julianPayments = (parsedJulian.cashflow.income * parsedJulian.debtRatio) / 100;
    const parejaPayments = (parsedPareja.cashflow.income * parsedPareja.debtRatio) / 100;
    const totalIncome = cashflow.income;
    debtRatio = totalIncome > 0 ? ((julianPayments + parejaPayments) / totalIncome) * 100 : 0;
    debtRatio = Math.round(debtRatio * 100) / 100;
  } else {
    cashflow = parsedJulian.cashflow;
    liquidity = parsedJulian.liquidity;
    debtRatio = parsedJulian.debtRatio;
  }

  const liquidityRatio = calculateLiquidityRatio(liquidity, cashflow.expenses);
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
    alerts: [...evalAlerts, ...alerts.map((a) => ({
      severity: a.severity as DashboardData["alerts"][number]["severity"],
      type: a.type as DashboardData["alerts"][number]["type"],
      title: a.title,
      description: a.description ?? "",
    }))],
    prediction,
  };
}
