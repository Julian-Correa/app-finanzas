import { Target } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function GoalsPage() {
  return (
    <PageShell
      eyebrow="Goals"
      title="Priority financial goals"
      description="Recover Edesur, emergency fund, baby, credit card payoff and notebook payoff will use deterministic goal calculations."
      icon={Target}
    >
      <PlaceholderCard title="Goal progress" description="Progress, ETA, priority and monthly contribution recommendations will appear here." />
    </PageShell>
  );
}
