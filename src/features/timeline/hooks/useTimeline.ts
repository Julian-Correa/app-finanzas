import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  fetchTransactions,
  fetchBudgets,
  fetchDebts,
  fetchCategories,
} from "@/supabase/queries";

export function useTimeline(month: number, year: number) {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["timeline", profileId, month, year],
    queryFn: async () => {
      const [transactions, budgets, debts, categories] = await Promise.all([
        fetchTransactions(profileId, month, year),
        fetchBudgets(profileId, month, year),
        fetchDebts(profileId),
        fetchCategories(),
      ]);

      const catMap = new Map(categories.map((c) => [c.id, c]));

      return {
        transactions: transactions.map((t) => ({
          ...t,
          category: catMap.get(t.category_id) ?? null,
        })),
        budgets: budgets.map((b) => ({
          ...b,
          category: catMap.get(b.category_id) ?? null,
        })),
        debts,
      };
    },
    enabled: true,
  });

  return query;
}
