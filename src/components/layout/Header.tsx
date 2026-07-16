import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { LanguageToggle } from "@/components/navigation/LanguageToggle";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { primaryNavigation, secondaryNavigation } from "@/constants/navigation";

const allNavigation = [...primaryNavigation, ...secondaryNavigation];

export function Header() {
  const location = useLocation();
  const { language, locale } = useLanguage();
  const currentItem = allNavigation.find((item) => item.path === location.pathname);
  const title = currentItem?.labels[language] ?? (language === "es" ? "Panel" : "Dashboard");
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date());

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-surface-light/80 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-surface-dark/75 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-400">
            {monthLabel}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="relative w-full max-w-md">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={language === "es" ? "Buscar transacciones, metas, deudas..." : "Search transactions, goals, debts..."}
              className="h-11 w-full rounded-2xl border border-slate-200/70 bg-white/80 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-zinc-500"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle compact />
          <ThemeToggle compact />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-600 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:text-white"
            aria-label={language === "es" ? "Notificaciones" : "Notifications"}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
