import { PiggyBank } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function SimulatorPage() {
  return (
    <PageShell
      eyebrow="Simulator"
      title="What-if projections"
      description="Simulator scenarios must never write production data. They will run against in-memory projections only."
      icon={PiggyBank}
    >
      <PlaceholderCard title="Scenario panel" description="Salary changes, new debt, baby, bonus, vacation and purchase scenarios will be added later." />
    </PageShell>
  );
}
