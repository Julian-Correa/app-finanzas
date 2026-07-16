import { Settings } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PageTransition } from "@/components/common/PageTransition";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function SettingsPage() {
  return (
    <PageTransition>
    <PageShell
      eyebrow="Settings"
      title="Application preferences"
      description="Theme, default profile, animations, notifications, backups and import/export settings will be configured here."
      icon={Settings}
    >
      <PlaceholderCard title="Preferences" description="Theme and profile are already available in the Phase 1 shell." />
    </PageShell>
    </PageTransition>
  );
}
