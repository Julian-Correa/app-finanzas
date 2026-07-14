import { ShieldQuestion } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function PurchaseAdvisorPage() {
  return (
    <PageShell
      eyebrow="Purchase Advisor"
      title="Can I buy this?"
      description="Purchases will be evaluated against available cash, cash flow, debt ratio, goals, budget impact and financial health."
      icon={ShieldQuestion}
    >
      <PlaceholderCard title="Decision engine" description="YES, WAIT and NO outputs will be added once the financial engine exists." />
    </PageShell>
  );
}
