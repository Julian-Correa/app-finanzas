import { BarChart3 } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function ReportsPage() {
  return (
    <PageShell
      eyebrow="Reports"
      title="Period-based reporting"
      description="Reports will export selected periods to PDF, Excel, JSON and GPT markdown prompts using one shared reporting service."
      icon={BarChart3}
    >
      <PlaceholderCard title="Exports" description="Exact export formats remain an open decision before implementation." />
    </PageShell>
  );
}
