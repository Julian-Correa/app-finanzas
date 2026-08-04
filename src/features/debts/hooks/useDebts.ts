import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  getDebts,
  addDebt,
  editDebt,
  removeDebt,
  addDebtPayment,
  removeDebtPayment,
  type DebtInput,
  type DebtPaymentInput,
} from "@/services/debtsService";

export function useDebts() {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["debts", profileId],
    queryFn: () => getDebts(profileId),
    enabled: true,
  });

  return { ...query, profileId };
}

export function useDebtMutations(profileId: string | undefined) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["debts"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["timeline"] });
    queryClient.invalidateQueries({ queryKey: ["calendar"] });
  };

  const create = useMutation({
    mutationFn: (input: DebtInput) => addDebt(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof editDebt>[1] }) =>
      editDebt(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeDebt(id),
    onSuccess: invalidate,
  });

  const addPayment = useMutation({
    mutationFn: ({ input, debtId }: { input: DebtPaymentInput; debtId: string }) =>
      addDebtPayment(input, debtId),
    onSuccess: invalidate,
  });

  const removePayment = useMutation({
    mutationFn: (id: string) => removeDebtPayment(id),
    onSuccess: invalidate,
  });

  return { create, update, remove, addPayment, removePayment };
}
