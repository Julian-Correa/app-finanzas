import { WalletCards } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function BudgetsPage() {
  return (
    <PageShell
      eyebrow="Budgets"
      title="Monthly budget control"
      description="Budget limits, usage, remaining amounts and alert thresholds will be implemented after transactions and the financial engine."
      icon={WalletCards}
    >
      <PlaceholderCard title="Budget editor" description="Category budget cards will support 50%, 75%, 90% and 100% alert states." />
    </PageShell>
  );
}
