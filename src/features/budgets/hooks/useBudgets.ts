import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  getBudgets,
  addBudget,
  editBudget,
  removeBudget,
  type BudgetInput,
} from "@/services/budgetsService";

export function useBudgets(month?: number, year?: number) {
  const { currentProfile } = useProfile();
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["budgets", profileId, m, y],
    queryFn: () => getBudgets(profileId, m, y),
    enabled: true,
  });

  return { ...query, month: m, year: y, profileId };
}

export function useBudgetMutations(profileId: string, month: number, year: number) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["budgets", profileId, month, year] });

  const create = useMutation({
    mutationFn: (input: BudgetInput) => addBudget(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof editBudget>[1] }) =>
      editBudget(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeBudget(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
