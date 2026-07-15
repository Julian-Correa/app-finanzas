import type { Tables } from "@/types/database";
import type { CashflowResult } from "./types";

export function calculateCashflow(
  transactions: Pick<Tables<"transactions">, "amount" | "transaction_type" | "date">[],
  month: number,
  year: number
): CashflowResult {
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const income = filtered
    .filter((t) => t.transaction_type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = filtered
    .filter((t) => t.transaction_type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    income: round(income),
    expenses: round(expenses),
    cashflow: round(income - expenses),
  };
}

export function calculateCashflowStatus(cashflow: number): "healthy" | "attention" | "critical" {
  if (cashflow > 0) return "healthy";
  if (cashflow === 0) return "attention";
  return "critical";
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
