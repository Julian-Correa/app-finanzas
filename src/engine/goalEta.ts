import type { Tables } from "@/types/database";

export function calculateGoalEta(
  goal: Pick<
    Tables<"goals">,
    "target_amount" | "current_amount" | "monthly_target" | "status"
  >
): number | null {
  if (goal.status === "completed") return 0;
  if (Number(goal.monthly_target) <= 0) return null;

  const remaining = Number(goal.target_amount) - Number(goal.current_amount);
  if (remaining <= 0) return 0;

  return Math.ceil(remaining / Number(goal.monthly_target));
}

export function calculateGoalProgress(
  current: number,
  target: number
): number {
  if (target <= 0) return 0;
  return round((current / target) * 100);
}

export function calculateGoalScore(
  goals: Pick<Tables<"goals">, "target_amount" | "current_amount">[]
): number {
  if (goals.length === 0) return 0;

  const avgProgress =
    goals.reduce((sum, g) => {
      return sum + calculateGoalProgress(Number(g.current_amount), Number(g.target_amount));
    }, 0) / goals.length;

  return Math.min(avgProgress, 100) * 0.1;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
