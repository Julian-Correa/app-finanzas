import { getDashboardData } from "@/services/dashboardService";
import {
  calculateCashflow,
  calculateLiquidity,
  calculateDebtRatio,
  calculateFinancialScore,
  calculateBurnRate,
  calculateSavingsRate,
  calculateMonthlyPrediction,
} from "@/engine";
import type { CashflowResult, FinancialScoreParts } from "@/engine/types";

export interface SimulatorScenario {
  label: string;
  incomeChange: number;
  expensesChange: number;
  oneTimeExpense: number;
  newRecurringExpense: number;
  liquidityChange: number;
  debtChange: number;
}

export interface SimulatorResult {
  baseline: {
    cashflow: CashflowResult;
    financialScore: FinancialScoreParts;
    liquidity: number;
    debtRatio: number;
    burnRate: number;
    savingsRate: number;
  };
  projected: {
    cashflow: CashflowResult;
    financialScore: FinancialScoreParts;
    liquidity: number;
    debtRatio: number;
    burnRate: number;
    savingsRate: number;
  };
  differences: {
    cashflowDelta: number;
    scoreDelta: number;
    liquidityDelta: number;
    debtRatioDelta: number;
    burnRateDelta: number;
    savingsRateDelta: number;
  };
}

export async function getSimulatorBaseline(profileId: string): Promise<SimulatorResult["baseline"]> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const dashboard = await getDashboardData(profileId, month, year);

  return {
    cashflow: dashboard.cashflow,
    financialScore: dashboard.financialScore,
    liquidity: dashboard.liquidity,
    debtRatio: dashboard.debtRatio,
    burnRate: dashboard.burnRate,
    savingsRate: dashboard.savingsRate,
  };
}

export function runSimulation(
  baseline: SimulatorResult["baseline"],
  scenario: SimulatorScenario
): SimulatorResult {
  const projectedIncome = baseline.cashflow.income + scenario.incomeChange;
  const projectedExpensesTotal = Math.abs(baseline.cashflow.expenses) + scenario.expensesChange + scenario.oneTimeExpense + scenario.newRecurringExpense;

  const projectedCashflow: CashflowResult = {
    income: projectedIncome,
    expenses: projectedExpensesTotal,
    cashflow: projectedIncome - projectedExpensesTotal,
  };

  const projectedLiquidity = Math.max(0, baseline.liquidity + scenario.liquidityChange - scenario.oneTimeExpense);

  const projectedDebtRatio = calculateDebtRatio(
    [],
    projectedIncome,
    new Date().getMonth() + 1,
    new Date().getFullYear()
  ) + scenario.debtChange;

  const projectedScore = calculateFinancialScore({
    cashflow: projectedCashflow.cashflow,
    liquidity: projectedLiquidity,
    monthlyExpenses: projectedExpensesTotal,
    debtRatio: projectedDebtRatio,
    income: projectedIncome,
    budgetDiscipline: baseline.financialScore.budgetScore,
    goalProgressScore: baseline.financialScore.goalScore,
  });

  const projectedBurnRate = calculateBurnRate(projectedExpensesTotal, new Date().getDate());
  const projectedSavingsRate = calculateSavingsRate(projectedIncome, projectedExpensesTotal);

  return {
    baseline,
    projected: {
      cashflow: projectedCashflow,
      financialScore: projectedScore,
      liquidity: projectedLiquidity,
      debtRatio: projectedDebtRatio,
      burnRate: projectedBurnRate,
      savingsRate: projectedSavingsRate,
    },
    differences: {
      cashflowDelta: projectedCashflow.cashflow - baseline.cashflow.cashflow,
      scoreDelta: projectedScore.total - baseline.financialScore.total,
      liquidityDelta: projectedLiquidity - baseline.liquidity,
      debtRatioDelta: projectedDebtRatio - baseline.debtRatio,
      burnRateDelta: projectedBurnRate - baseline.burnRate,
      savingsRateDelta: projectedSavingsRate - baseline.savingsRate,
    },
  };
}
