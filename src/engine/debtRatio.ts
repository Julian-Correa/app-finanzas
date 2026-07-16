import type { Tables } from "@/types/database";

export function calculateDebtRatio(
  debtPayments: Pick<Tables<"debt_payments">, "amount" | "date">[],
  income: number,
  month: number,
  year: number
): number {
  const monthlyPayments = debtPayments
    .filter((dp) => {
      const [y, m] = dp.date.split("-").map(Number);
      return m === month && y === year;
    })
    .reduce((sum, dp) => sum + Number(dp.amount), 0);

  if (income <= 0) return 0;
  return round((monthlyPayments / income) * 100);
}

export function calculateDebtRatioLevel(
  ratio: number
): "excellent" | "good" | "warning" | "critical" {
  if (ratio <= 20) return "excellent";
  if (ratio <= 35) return "good";
  if (ratio <= 50) return "warning";
  return "critical";
}

export function calculateTotalDebt(
  debts: Pick<Tables<"debts">, "remaining_amount">[]
): number {
  return debts.reduce((sum, d) => sum + Number(d.remaining_amount), 0);
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
