import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface PageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
}

export function PageShell({ eyebrow, title, description, icon: Icon, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-panel border border-slate-200/70 bg-white/80 p-6 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/75 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-zinc-300 sm:text-base">
              {description}
            </p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary dark:bg-primary/20">
            <Icon className="h-8 w-8" aria-hidden="true" />
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
