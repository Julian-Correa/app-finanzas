import type { Tables } from "@/types/database";

export function calculateLiquidity(
  accounts: Pick<Tables<"accounts">, "current_balance" | "is_archived">[]
): number {
  return accounts
    .filter((a) => !a.is_archived)
    .reduce((sum, a) => sum + Number(a.current_balance), 0);
}

export function calculateLiquidityRatio(
  totalLiquidity: number,
  monthlyExpenses: number
): number {
  if (monthlyExpenses <= 0) return monthlyExpenses === 0 ? 999 : 0;
  return round(totalLiquidity / monthlyExpenses);
}

export function calculateLiquidityLevel(
  ratio: number
): "excellent" | "attention" | "critical" {
  if (ratio >= 1) return "excellent";
  if (ratio >= 0.5) return "attention";
  return "critical";
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
