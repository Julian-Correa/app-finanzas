import { Settings } from "lucide-react";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { PageShell } from "@/components/common/PageShell";
import { PageTransition } from "@/components/common/PageTransition";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function SettingsPage() {
  const { language } = useLanguage();

  return (
    <PageTransition>
    <PageShell
      eyebrow={language === "es" ? "Ajustes" : "Settings"}
      title={language === "es" ? "Preferencias de la aplicación" : "Application preferences"}
      description={language === "es"
        ? "Acá vas a configurar tema, idioma, perfil por defecto, animaciones, notificaciones y opciones de respaldo."
        : "Theme, language, default profile, animations, notifications, backups and import/export settings will be configured here."}
      icon={Settings}
    >
      <PlaceholderCard
        title={language === "es" ? "Preferencias" : "Preferences"}
        description={language === "es" ? "Tema, idioma y perfil ya están disponibles en el shell principal." : "Theme, language, and profile are already available in the main shell."}
      />
    </PageShell>
    </PageTransition>
  );
}
