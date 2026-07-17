import { Settings } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PageTransition } from "@/components/common/PageTransition";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { useTranslation } from "@/lib/translations";

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <PageTransition>
    <PageShell
      eyebrow={t("settings.eyebrow")}
      title={t("settings.title")}
      description={t("settings.description")}
      icon={Settings}
    >
      <PlaceholderCard
        title={t("settings.preferencesTitle")}
        description={t("settings.preferencesDesc")}
      />
    </PageShell>
    </PageTransition>
  );
}
