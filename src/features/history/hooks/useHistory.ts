import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  getHistorySnapshots,
  saveSnapshot,
  diffSnapshots,
  type SnapshotData,
  type SnapshotDiff,
  type SaveSnapshotOutcome,
} from "@/services/historyService";

function getProfileId(currentProfile: string): string | undefined {
  if (currentProfile === "ambos") return undefined;
  if (currentProfile === "julian") return "11111111-1111-4111-8111-111111111111";
  return "22222222-2222-4222-8222-222222222222";
}

export function useHistory() {
  const { currentProfile } = useProfile();
  const profileId = getProfileId(currentProfile);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["history", profileId],
    queryFn: () => getHistorySnapshots(profileId!),
    enabled: !!profileId,
    staleTime: 30_000,
  });

  const generateMutation = useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) =>
      saveSnapshot(profileId!, month, year),
    onSuccess: (outcome: SaveSnapshotOutcome) => {
      queryClient.invalidateQueries({ queryKey: ["history", profileId] });
      return outcome;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    generateSnapshot: generateMutation.mutate,
    generateOutcome: generateMutation.data,
    isGenerating: generateMutation.isPending,
    generateError: generateMutation.error,
  };
}

export function useSnapshotComparison(baseline: SnapshotData | null, target: SnapshotData | null) {
  if (!baseline || !target) return null;

  const diff: SnapshotDiff = diffSnapshots(baseline, target);

  return {
    baseline,
    target,
    diff,
  };
}
