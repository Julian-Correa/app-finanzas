import { CreditCard } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function DebtsPage() {
  return (
    <PageShell
      eyebrow="Debts"
      title="Debt payoff tracking"
      description="Debts will track remaining balance, installments, priority, due dates, payments and payoff projections."
      icon={CreditCard}
    >
      <PlaceholderCard title="Debt cards" description="Register payment and simulate payoff actions will be added in the debts phase." />
    </PageShell>
  );
}
