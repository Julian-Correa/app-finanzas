import { History } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function HistoryPage() {
  return (
    <PageShell
      eyebrow="History"
      title="Immutable monthly snapshots"
      description="History will browse year and month snapshots, compare periods and export archived views."
      icon={History}
    >
      <PlaceholderCard title="Snapshot browser" description="Snapshot generation depends on the database and financial engine phases." />
    </PageShell>
  );
}
