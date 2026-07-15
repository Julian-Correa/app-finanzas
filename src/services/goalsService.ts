import {
  fetchGoals,
  fetchGoalContributions,
  createGoal,
  updateGoal,
  softDeleteGoal,
  createGoalContribution,
} from "@/supabase/queries";
import { calculateGoalEta, calculateGoalProgress } from "@/engine";
import type { Tables } from "@/types/database";

export async function getGoals(profileId: string) {
  const goals = await fetchGoals(profileId);
  const withDetails = await Promise.all(
    goals.map(async (g) => {
      const contributions = await fetchGoalContributions(g.id);
      return {
        ...g,
        contributions,
        progress: calculateGoalProgress(Number(g.current_amount), Number(g.target_amount)),
        eta: calculateGoalEta(g),
      };
    })
  );

  return withDetails;
}

export type GoalInput = Omit<Tables<"goals">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id">;

export async function addGoal(input: GoalInput) {
  return createGoal(input);
}

export async function editGoal(
  id: string,
  updates: Partial<Omit<GoalInput, "profile_id">>
) {
  return updateGoal(id, updates);
}

export async function removeGoal(id: string) {
  return softDeleteGoal(id);
}

export type GoalContributionInput = Omit<Tables<"goal_contributions">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id">;

export async function addGoalContribution(input: GoalContributionInput) {
  return createGoalContribution(input);
}
