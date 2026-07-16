import { Laptop, Moon, Sun } from "lucide-react";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { type ThemeMode, useTheme } from "@/app/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  compact?: boolean;
}

const themeOptions: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();

  const labels = {
    selector: language === "es" ? "Selector de tema" : "Theme selector",
    light: language === "es" ? "Claro" : "Light",
    dark: language === "es" ? "Oscuro" : "Dark",
    system: language === "es" ? "Sistema" : "System",
    switchTo: language === "es" ? "Cambiar tema a" : "Switch theme to",
  };

  if (compact) {
    const currentIndex = themeOptions.findIndex((option) => option.value === theme);
    const nextTheme = themeOptions[(currentIndex + 1) % themeOptions.length];
    const CurrentIcon = themeOptions[currentIndex]?.icon ?? Laptop;
    const nextLabel = nextTheme.value === "light" ? labels.light : nextTheme.value === "dark" ? labels.dark : labels.system;

    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme.value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:text-white"
        aria-label={`${labels.switchTo} ${nextLabel}`}
      >
        <CurrentIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/10" aria-label={labels.selector}>
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = option.value === theme;
        const optionLabel = option.value === "light" ? labels.light : option.value === "dark" ? labels.dark : labels.system;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              isActive
                ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-900 dark:text-white"
                : "text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only xl:not-sr-only">{optionLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
