import { Languages } from "lucide-react";

import { type AppLanguage, useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  compact?: boolean;
}

const languageOptions: Array<{ value: AppLanguage; label: Record<AppLanguage, string>; shortLabel: string }> = [
  { value: "es", label: { es: "Español", en: "Spanish" }, shortLabel: "ES" },
  { value: "en", label: { es: "Inglés", en: "English" }, shortLabel: "EN" },
];

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  if (compact) {
    const currentIndex = languageOptions.findIndex((option) => option.value === language);
    const nextLanguage = languageOptions[(currentIndex + 1) % languageOptions.length];
    const currentLanguage = languageOptions[currentIndex] ?? languageOptions[0];

    return (
      <button
        type="button"
        onClick={() => setLanguage(nextLanguage.value)}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:text-white"
        aria-label={language === "es" ? `Cambiar idioma a ${nextLanguage.label.es}` : `Switch language to ${nextLanguage.label.en}`}
      >
        <Languages className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold">{currentLanguage.shortLabel}</span>
      </button>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/10" aria-label={language === "es" ? "Selector de idioma" : "Language selector"}>
      {languageOptions.map((option) => {
        const isActive = option.value === language;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive
                ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-900 dark:text-white"
                : "text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white",
            )}
          >
            <span>{option.shortLabel}</span>
            <span className="sr-only xl:not-sr-only">{option.label[language]}</span>
          </button>
        );
      })}
    </div>
  );
}
