import { CalendarDays } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function CalendarPage() {
  return (
    <PageShell
      eyebrow="Calendar"
      title="Financial calendar"
      description="Bills, installments, subscriptions, goals and recurring transactions will be shown by due date."
      icon={CalendarDays}
    >
      <PlaceholderCard title="Calendar view" description="Month and agenda views will be implemented after recurring transaction rules are defined." />
    </PageShell>
  );
}
