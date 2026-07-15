import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useProfile } from "@/app/providers/ProfileProvider";
import { getSimulatorBaseline, runSimulation, type SimulatorScenario, type SimulatorResult } from "@/services/simulatorService";

export function useSimulator() {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["simulator", profileId],
    queryFn: () => getSimulatorBaseline(profileId!),
    enabled: !!profileId,
  });

  return { ...query, profileId };
}

export function useSimulation(baseline: SimulatorResult["baseline"] | undefined) {
  const [scenario, setScenario] = useState<SimulatorScenario>({
    label: "Escenario personalizado",
    incomeChange: 0,
    expensesChange: 0,
    oneTimeExpense: 0,
    newRecurringExpense: 0,
    liquidityChange: 0,
    debtChange: 0,
  });

  const result = useMemo(() => {
    if (!baseline) return null;
    return runSimulation(baseline, scenario);
  }, [baseline, scenario]);

  return { scenario, setScenario, result };
}
