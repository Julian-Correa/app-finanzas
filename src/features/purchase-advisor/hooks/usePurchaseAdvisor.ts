import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useProfile } from "@/app/providers/ProfileProvider";
import { getPurchaseBaseline, evaluateAdvisedPurchase } from "@/services/purchaseAdvisorService";
import type { PurchaseEvaluation } from "@/engine/types";

export function usePurchaseAdvisor() {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["purchase-advisor", profileId],
    queryFn: () => getPurchaseBaseline(profileId),
    enabled: true,
  });

  return { ...query, profileId };
}

export function useEvaluation(dashboard: ReturnType<typeof usePurchaseAdvisor>["data"]) {
  const [price, setPrice] = useState(0);
  const [installments, setInstallments] = useState(1);

  const evaluation = useMemo<PurchaseEvaluation | null>(() => {
    if (!dashboard || price <= 0) return null;
    return evaluateAdvisedPurchase(dashboard, price, installments);
  }, [dashboard, price, installments]);

  return { price, setPrice, installments, setInstallments, evaluation };
}
