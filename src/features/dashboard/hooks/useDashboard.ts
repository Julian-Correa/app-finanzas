import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/dashboardService";
import { useProfile } from "@/app/providers/ProfileProvider";

export function useDashboard(month?: number, year?: number) {
  const { currentProfile } = useProfile();
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  return useQuery({
    queryKey: ["dashboard", profileId, m, y],
    queryFn: () => getDashboardData(profileId!, m, y),
    enabled: !!profileId,
    staleTime: 30_000,
  });
}
