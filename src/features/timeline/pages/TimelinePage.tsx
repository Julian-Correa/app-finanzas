import { Gauge } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function TimelinePage() {
  return (
    <PageShell
      eyebrow="Timeline"
      title="Monthly financial flow"
      description="The timeline will show salary, bills, subscriptions, purchases, remaining balance and warnings chronologically."
      icon={Gauge}
    >
      <PlaceholderCard title="Flow builder" description="Timeline events will be generated from transactions, debts, recurring payments and alerts." />
    </PageShell>
  );
}
