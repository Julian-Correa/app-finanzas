import { NavLink } from "react-router-dom";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTranslation } from "@/lib/translations";
import { mobileNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("bottomNav.label")}
      className="fixed inset-x-3 bottom-3 z-30 rounded-panel border border-slate-200/80 bg-white/90 px-2 py-2 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/85 lg:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white",
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.labels[language]}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
