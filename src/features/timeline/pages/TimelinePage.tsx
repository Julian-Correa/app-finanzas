import { useState } from "react";
import { ListTodo, TrendingUp, TrendingDown, DollarSign, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { useTimeline } from "@/features/timeline/hooks/useTimeline";
import { useTranslation } from "@/lib/translations";
import { cn } from "@/lib/utils";

function formatARS(amount: number, locale: string): string {
  return `$${Math.round(amount).toLocaleString(locale)}`;
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export function TimelinePage() {
  const { t, language } = useTranslation();
  const locale = language === "en" ? "en-US" : "es-AR";
  const now = new Date();
  const [offset, setOffset] = useState(0);
  const m = now.getMonth() + 1 + offset;
  const year = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
  const month = ((m - 1) % 12 + 12) % 12 + 1;

  const { data, isLoading, error } = useTimeline(month, year);

  const goBack = () => setOffset((p) => p - 1);
  const goForward = () => setOffset((p) => Math.min(p + 1, 0));

  if (isLoading) {
    return (
      <PageShell eyebrow={t("timeline.eyebrow")} title={t("dashboard.loading")} description={t("timeline.loadingDesc")} icon={ListTodo}>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell eyebrow={t("timeline.eyebrow")} title={t("timeline.errorUnknown")} description={t("timeline.errorDesc")} icon={ListTodo}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? t("timeline.errorUnknown")}</p>
        </div>
      </PageShell>
    );
  }

  const { transactions, budgets, debts } = data;

  const events: { date: string; type: "income" | "expense" | "budget" | "debt"; label: string; amount: number; detail: string }[] = [];

  for (const t of transactions) {
    events.push({
      date: t.date,
      type: t.transaction_type,
      label: t.description,
      amount: Number(t.amount),
      detail: t.category?.name ?? "",
    });
  }

  for (const b of budgets) {
    events.push({
      date: `${year}-${String(month).padStart(2, "0")}-01`,
      type: "budget",
      label: `${t("timeline.budget")}${b.category?.name ?? ""}`,
      amount: Number(b.limit_amount),
      detail: `${formatARS(b.spent_amount, locale)} de ${formatARS(b.limit_amount, locale)}`,
    });
  }

  for (const d of debts) {
    if (d.due_day) {
      const day = String(d.due_day).padStart(2, "0");
      events.push({
        date: `${year}-${String(month).padStart(2, "0")}-${day}`,
        type: "debt",
        label: `${t("timeline.debtDue")}${d.name}`,
        amount: Number(d.installment_amount),
        detail: `${d.creditor ?? ""} · ${formatARS(d.remaining_amount, locale)} ${t("timeline.remaining")}`,
      });
    }
  }

  events.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PageTransition>
      <PageShell
        eyebrow={`${monthNames[month - 1]} ${year}`}
        title={t("timeline.title")}
        description={t("timeline.description")}
        icon={ListTodo}
      >
        <div className="flex items-center justify-center gap-4">
          <button onClick={goBack} className="rounded-xl border border-slate-200/70 p-2 text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold">{monthNames[month - 1]} {year}</span>
          <button onClick={goForward} disabled={offset >= 0} className="rounded-xl border border-slate-200/70 p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {events.length === 0 ? (
          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <CalendarDays className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">{t("timeline.empty")}</p>
            </div>
          </MotionCard>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
            <StaggerContainer className="space-y-4">
              {events.map((ev, i) => {
                const day = new Date(ev.date).getDate();
                const isIncome = ev.type === "income";
                const isExpense = ev.type === "expense";
                const isBudget = ev.type === "budget";
                const isDebt = ev.type === "debt";

                return (
                  <MotionCard key={i} hover="none">
                    <div className="relative flex gap-4 pl-14">
                      <div
                        className={cn(
                          "absolute left-3.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900",
                          isIncome ? "border-emerald-500" : isExpense ? "border-red-500" : isBudget ? "border-blue-500" : "border-amber-500"
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isIncome ? "bg-emerald-500" : isExpense ? "bg-red-500" : isBudget ? "bg-blue-500" : "bg-amber-500"
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1 rounded-card border border-slate-200/70 bg-white/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{ev.label}</p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500">{ev.detail}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className={cn("text-sm font-semibold", isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                              {isIncome ? "+" : "-"}{formatARS(Math.abs(ev.amount), locale)}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500">{t("timeline.day")} {day}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionCard>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </PageShell>
    </PageTransition>
  );
}
