export function calculateSavingsRate(
  income: number,
  expenses: number
): number {
  if (income <= 0) return 0;
  return round(((income - expenses) / income) * 100);
}

export function calculateSavingsRateLevel(
  rate: number
): "excellent" | "good" | "attention" | "critical" {
  if (rate >= 20) return "excellent";
  if (rate >= 10) return "good";
  if (rate > 0) return "attention";
  return "critical";
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
