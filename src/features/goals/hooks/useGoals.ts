import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  getGoals,
  addGoal,
  editGoal,
  removeGoal,
  addGoalContribution,
  type GoalInput,
  type GoalContributionInput,
} from "@/services/goalsService";

export function useGoals() {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["goals", profileId],
    queryFn: () => getGoals(profileId!),
    enabled: !!profileId,
  });

  return { ...query, profileId };
}

export function useGoalMutations(profileId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["goals", profileId] });

  const create = useMutation({
    mutationFn: (input: GoalInput) => addGoal(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof editGoal>[1] }) =>
      editGoal(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeGoal(id),
    onSuccess: invalidate,
  });

  const addContribution = useMutation({
    mutationFn: (input: GoalContributionInput) => addGoalContribution(input),
    onSuccess: invalidate,
  });

  return { create, update, remove, addContribution };
}
