import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import { getMonthlyReports } from "@/services/reportsService";

export function useReports(months: number = 6) {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? "ambos"
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["reports", profileId, months],
    queryFn: () => getMonthlyReports(profileId, months),
    enabled: true,
  });

  return { ...query, profileId };
}
