import { NavLink } from "react-router-dom";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTranslation } from "@/lib/translations";
import { ProfileSwitcher } from "@/components/navigation/ProfileSwitcher";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { primaryNavigation, secondaryNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { t, language } = useTranslation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] overflow-hidden border-r border-slate-200/70 bg-white/80 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/75 lg:flex lg:flex-col">
      <div className="shrink-0 flex items-center gap-3 px-2 py-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white shadow-soft">
          F
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">FinOS</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{t("app.tagline")}</p>
        </div>
      </div>

      <div className="mt-7 min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
        <ProfileSwitcher />

        <nav aria-label="Primary navigation" className="space-y-1">
          {primaryNavigation.map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
        </nav>

        <div className="h-px bg-slate-200 dark:bg-white/10" />

        <nav aria-label="Secondary navigation" className="space-y-1">
          {secondaryNavigation.map((item) => (
            <NavigationLink key={item.path} item={item} />
          ))}
        </nav>
      </div>

      <div className="mt-5 shrink-0 space-y-4 rounded-card border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <div>
          <p className="text-sm font-medium">{t("sidebar.preferences")}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">
{t("sidebar.preferencesDesc")}
          </p>
        </div>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </aside>
  );
}

interface NavigationLinkProps {
  item: (typeof primaryNavigation)[number];
}

function NavigationLink({ item }: NavigationLinkProps) {
  const { language } = useLanguage();
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isActive
            ? "bg-primary text-white shadow-soft"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white",
        )
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {item.labels[language]}
    </NavLink>
  );
}
