import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  getTransactions,
  addTransaction,
  editTransaction,
  removeTransaction,
  type TransactionInput,
} from "@/services/transactionsService";
import { useMemo } from "react";

export function useTransactions(month?: number, year?: number) {
  const { currentProfile } = useProfile();
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const profileId = currentProfile === "ambos"
    ? "ambos"
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["transactions", profileId, m, y],
    queryFn: () => getTransactions(profileId, m, y),
    enabled: true,
  });

  return { ...query, month: m, year: y, profileId };
}

export function useTransactionMutations(profileId: string | undefined, month: number, year: number) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["timeline"] });
    queryClient.invalidateQueries({ queryKey: ["calendar"] });
  };

  const create = useMutation({
    mutationFn: (input: TransactionInput) => addTransaction(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof editTransaction>[1] }) =>
      editTransaction(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeTransaction(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}

export function useTransactionFilters(transactions: TransactionInput[]) {
  return useMemo(() => {
    const types = new Set(transactions.map((t) => t.transaction_type));
    const categories = new Set(transactions.map((t) => t.category_id));
    return { types: [...types], categories: [...categories] };
  }, [transactions]);
}
