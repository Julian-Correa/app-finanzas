import { NavLink } from "react-router-dom";

import { ProfileSwitcher } from "@/components/navigation/ProfileSwitcher";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { primaryNavigation, secondaryNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-slate-200/70 bg-white/80 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/75 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2 py-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-white shadow-soft">
          F
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">FinOS</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Personal finance OS</p>
        </div>
      </div>

      <div className="mt-7 space-y-6">
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

      <div className="mt-auto space-y-4 rounded-card border border-slate-200/70 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/[0.04]">
        <div>
          <p className="text-sm font-medium">Phase 1</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">
            Foundation, layout, routing and configuration are active.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

interface NavigationLinkProps {
  item: (typeof primaryNavigation)[number];
}

function NavigationLink({ item }: NavigationLinkProps) {
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
      {item.label}
    </NavLink>
  );
}
