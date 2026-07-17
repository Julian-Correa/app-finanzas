import { History } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PageTransition } from "@/components/common/PageTransition";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { useTranslation } from "@/lib/translations";

export function HistoryPage() {
  const { t } = useTranslation();
  return (
    <PageTransition>
    <PageShell
      eyebrow={t("history.eyebrow")}
      title={t("history.title")}
      description={t("history.description")}
      icon={History}
    >
      <PlaceholderCard title={t("history.snapshotTitle")} description={t("history.snapshotDesc")} />
    </PageShell>
    </PageTransition>
  );
}
