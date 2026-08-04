import {
  fetchDebts,
  fetchDebtPayments,
  createDebt,
  updateDebt,
  softDeleteDebt,
  createDebtPayment,
  softDeleteDebtPayment,
} from "@/supabase/queries";
import type { Tables } from "@/types/database";

export async function getDebts(profileId: string | undefined) {
  const debts = await fetchDebts(profileId);
  const withPayments = await Promise.all(
    debts.map(async (d) => {
      const payments = await fetchDebtPayments(d.id);
      return { ...d, payments };
    })
  );

  return withPayments;
}

export type DebtInput = Omit<Tables<"debts">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id">;

export async function addDebt(input: DebtInput) {
  return createDebt(input);
}

export async function editDebt(
  id: string,
  updates: Partial<Omit<DebtInput, "profile_id">>
) {
  return updateDebt(id, updates);
}

export async function removeDebt(id: string) {
  return softDeleteDebt(id);
}

export type DebtPaymentInput = Omit<Tables<"debt_payments">, "id" | "created_at" | "updated_at" | "deleted_at" | "created_by_profile_id" | "updated_by_profile_id">;

export async function addDebtPayment(input: DebtPaymentInput, _debtId: string) {
  return createDebtPayment(input);
}

export async function removeDebtPayment(id: string) {
  return softDeleteDebtPayment(id);
}
