import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  softDeleteTransaction,
  fetchCategories,
  fetchAccounts,
} from "@/supabase/queries";
import type { Tables } from "@/types/database";

export async function getTransactions(
  profileId: string,
  month?: number,
  year?: number
) {
  const [transactions, categories, accounts] = await Promise.all([
    fetchTransactions(profileId, month, year),
    fetchCategories(),
    fetchAccounts(profileId),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  return {
    transactions: transactions.map((t) => ({
      ...t,
      category: categoryMap.get(t.category_id) ?? null,
      account: accountMap.get(t.account_id) ?? null,
    })),
    categories,
    accounts,
  };
}

export type TransactionInput = Omit<Tables<"transactions">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id">;

export async function addTransaction(input: TransactionInput) {
  return createTransaction(input);
}

export async function editTransaction(
  id: string,
  updates: Partial<Omit<TransactionInput, "profile_id">>
) {
  return updateTransaction(id, updates);
}

export async function removeTransaction(id: string) {
  return softDeleteTransaction(id);
}
