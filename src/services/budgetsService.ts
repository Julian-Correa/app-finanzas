import {
  fetchBudgets,
  createBudget,
  updateBudget,
  softDeleteBudget,
  fetchCategories,
} from "@/supabase/queries";
import { calculateBudgetUsage } from "@/engine";
import type { Tables } from "@/types/database";

export async function getBudgets(profileId: string | undefined, month: number, year: number) {
  const [budgets, categories] = await Promise.all([
    fetchBudgets(profileId, month, year),
    fetchCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return {
    budgets: budgets.map((b) => ({
      ...b,
      category: categoryMap.get(b.category_id) ?? null,
      usagePercent: calculateBudgetUsage(b.limit_amount, b.spent_amount),
    })),
    categories: categories.filter((c) => c.type === "expense"),
  };
}

export type BudgetInput = Omit<Tables<"budgets">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id" | "spent_amount" | "remaining_amount" | "status">;

export async function addBudget(input: BudgetInput) {
  return createBudget({
    ...input,
    spent_amount: 0,
    remaining_amount: input.limit_amount,
    status: "on_track",
  });
}

export async function editBudget(
  id: string,
  updates: Partial<Omit<BudgetInput, "profile_id">>
) {
  return updateBudget(id, updates);
}

export async function removeBudget(id: string) {
  return softDeleteBudget(id);
}
