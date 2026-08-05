import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { X } from "lucide-react";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTranslation } from "@/lib/translations";
import { mobileNavigation, primaryNavigation, secondaryNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const allLinks = [...primaryNavigation, ...secondaryNavigation];
  // Filter out the ones already in the bottom nav to avoid duplication
  const extraLinks = allLinks.filter(
    (link) => !mobileNavigation.some((m) => m.path === link.path && m.path !== "#menu")
  );

  return (
    <>
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-slate-900/40 backdrop-blur-sm lg:hidden">
          <div className="animate-slide-up rounded-t-[32px] bg-white p-6 pb-32 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Menú</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
              {extraLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(item.path, { viewTransition: true });
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl p-2 transition hover:bg-slate-50 active:scale-95 dark:hover:bg-white/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-center text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                      {item.labels[language]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label={t("bottomNav.label")}
        className="fixed inset-x-3 bottom-3 z-50 rounded-panel border border-slate-200/80 bg-white/90 px-2 py-2 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/85 lg:hidden"
      >
        <div className="grid grid-cols-5 gap-1">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;

            if (item.path === "#menu") {
              return (
                <button
                  key={item.path}
                  onClick={() => setMenuOpen(true)}
                  className={cn(
                    "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    menuOpen
                      ? "bg-primary text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.labels[language]}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                viewTransition
                onClick={() => setMenuOpen(false)}
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
    </>
  );
}
