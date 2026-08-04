import { useState, useMemo, useEffect } from "react";
import {
  History,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Camera,
  BarChart3,
} from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { useHistory } from "@/features/history/hooks/useHistory";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import type { SnapshotData } from "@/services/historyService";

const MONTH_NAMES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MONTH_NAMES_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatARS(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = `$${Math.round(abs).toLocaleString("es-AR")}`;
  return amount < 0 ? `-${formatted}` : formatted;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getDeltaColor(delta: number, invert = false): string {
  const positive = invert ? delta < 0 : delta > 0;
  if (delta === 0) return "text-slate-400 dark:text-zinc-500";
  return positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
}

function getMonthName(m: number, language: string): string {
  return language === "es" ? MONTH_NAMES_ES[m - 1] : MONTH_NAMES_EN[m - 1];
}

export function HistoryPage() {
  const { t, language } = useTranslation();
  const { data, isLoading, error, generateSnapshot, generateOutcome, isGenerating, generateError, profileId } = useHistory();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [notice, setNotice] = useState<{ kind: "created" | "already_exists" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (!generateOutcome) return;
    if (generateOutcome.status === "created") {
      setNotice({ kind: "created", msg: t("history.generated") });
    } else {
      setNotice({ kind: "already_exists", msg: t("history.alreadyExists") });
    }
    const id = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(id);
  }, [generateOutcome, t]);

  useEffect(() => {
    if (!generateError) return;
    setNotice({ kind: "error", msg: (generateError as Error)?.message ?? t("history.errorUnknown") });
    const id = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(id);
  }, [generateError, t]);

  const sorted = useMemo(() => {
    if (!data?.snapshots) return [];
    return [...data.snapshots].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [data?.snapshots]);

  const current = sorted[selectedIndex] ?? null;
  const comparisonTarget = compareIndex !== null ? sorted[compareIndex] ?? null : null;

  const diff = useMemo(() => {
    if (!current || !comparisonTarget) return null;
    return {
      income: current.income - comparisonTarget.income,
      expenses: current.expenses - comparisonTarget.expenses,
      cashflow: current.cashflow - comparisonTarget.cashflow,
      debt: current.debt - comparisonTarget.debt,
      savings: current.savings - comparisonTarget.savings,
      financialScore: current.financialScore - comparisonTarget.financialScore,
    };
  }, [current, comparisonTarget]);

  if (isLoading) {
    return (
      <PageShell eyebrow={t("history.eyebrow")} title={t("dashboard.loading")} description={t("history.loadingDesc")} icon={History}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="p-6" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell eyebrow={t("history.eyebrow")} title={t("dashboard.error")} description={t("history.errorDesc")} icon={History}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? t("history.errorUnknown")}</p>
        </div>
      </PageShell>
    );
  }

  const metrics: Array<{
    key: string;
    label: string;
    icon: typeof Wallet;
    value: number;
    format: (v: number) => string;
    invert?: boolean;
    color?: string;
  }> = current
    ? [
        {
          key: "income",
          label: t("history.income"),
          icon: TrendingUp,
          value: current.income,
          format: formatARS,
        },
        {
          key: "expenses",
          label: t("history.expenses"),
          icon: TrendingDown,
          value: current.expenses,
          format: formatARS,
          invert: true,
          color: "text-red-500",
        },
        {
          key: "cashflow",
          label: t("history.cashflow"),
          icon: Wallet,
          value: current.cashflow,
          format: formatARS,
          color: current.cashflow >= 0 ? "text-emerald-600" : "text-red-600",
        },
        {
          key: "debt",
          label: t("history.debt"),
          icon: CreditCard,
          value: current.debt,
          format: formatARS,
          invert: true,
        },
        {
          key: "savings",
          label: t("history.savings"),
          icon: PiggyBank,
          value: current.savings,
          format: formatARS,
        },
        {
          key: "score",
          label: t("history.score"),
          icon: Gauge,
          value: current.financialScore,
          format: (v) => `${Math.round(v)}/100`,
          color: getScoreColor(current.financialScore),
        },
      ]
    : [];

  return (
    <PageTransition>
      <PageShell
        eyebrow={t("history.eyebrow")}
        title={t("history.title")}
        description={t("history.description")}
        icon={History}
      >
        {sorted.length === 0 ? (
          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <History className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-zinc-600" />
              <p className="text-sm text-slate-500 dark:text-zinc-400">{t("history.empty")}</p>
            </div>
          </MotionCard>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(Math.min(selectedIndex + 1, sorted.length - 1))}
                  disabled={selectedIndex >= sorted.length - 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:text-slate-800 disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-[140px] text-center text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  {getMonthName(current!.month, language)} {current!.year}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(Math.max(selectedIndex - 1, 0))}
                  disabled={selectedIndex <= 0}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-500 transition hover:text-slate-800 disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompare(!showCompare);
                    if (!showCompare) {
                      setCompareIndex(Math.min(selectedIndex + 1, sorted.length - 1));
                    } else {
                      setCompareIndex(null);
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                    showCompare
                      ? "border-primary/30 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/10"
                      : "border-slate-200/70 bg-white/80 text-slate-500 hover:text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-white"
                  )}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  {t("history.comparing")}
                </button>

                {profileId && (
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      generateSnapshot({ month: now.getMonth() + 1, year: now.getFullYear() });
                    }}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Camera className="h-3.5 w-3.5" />
                    )}
                    {isGenerating ? t("history.generating") : t("history.generate")}
                  </button>
                )}
              </div>
            </div>

            {notice && (
              <div
                className={cn(
                  "rounded-card border p-3 text-xs",
                  notice.kind === "created" && "border-emerald-400/30 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-950/30 dark:text-emerald-400",
                  notice.kind === "already_exists" && "border-amber-400/30 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-400",
                  notice.kind === "error" && "border-red-400/30 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400"
                )}
                role="status"
              >
                {notice.msg}
              </div>
            )}

            {showCompare && (
              <div className="flex items-center gap-3 rounded-card border border-primary/20 bg-primary/[0.03] p-3 dark:border-primary/10">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">{t("history.comparing")}</span>
                <select
                  value={compareIndex ?? 0}
                  onChange={(e) => setCompareIndex(Number(e.target.value))}
                  className="rounded-lg border border-slate-200/70 bg-white/75 px-2 py-1 text-xs backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  {sorted.map((s, i) => (
                    <option key={`${s.year}-${s.month}`} value={i} disabled={i === selectedIndex}>
                      {getMonthName(s.month, language)} {s.year}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 dark:text-zinc-500">{t("history.vsPrevious")}</span>
              </div>
            )}

            <div className={cn("grid gap-4", showCompare ? "grid-cols-1 lg:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
              <StaggerContainer className={cn("space-y-3", showCompare ? "contents" : "")}>
                {metrics.map((m) => {
                  const compareVal = showCompare && comparisonTarget
                    ? comparisonTarget[m.key as keyof typeof comparisonTarget] as number
                    : undefined;
                  const delta = showCompare && comparisonTarget && diff
                    ? diff[m.key as keyof typeof diff]
                    : undefined;

                  return (
                    <MotionCard key={m.key} hover="none">
                      <div className="rounded-card border border-slate-200/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <m.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            <span className="text-xs text-slate-500 dark:text-zinc-400">{m.label}</span>
                          </div>
                          {showCompare && compareVal !== undefined && delta !== undefined && (
                            <span className={cn("text-xs font-medium", getDeltaColor(delta as number, m.invert))}>
                              {(delta as number) >= 0 ? "↑" : "↓"} {formatARS(Math.abs(Math.round(delta as number)))}
                            </span>
                          )}
                        </div>
                        <p className={cn("mt-1 text-lg font-bold", m.color ?? "text-slate-800 dark:text-zinc-100")}>
                          {m.format(m.value)}
                        </p>
                        {showCompare && compareVal !== undefined && (
                          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-zinc-500">
                            {t("history.baseline")}: {m.format(compareVal)}
                          </p>
                        )}
                      </div>
                    </MotionCard>
                  );
                })}
              </StaggerContainer>

              {showCompare && comparisonTarget && diff && (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                    {t("history.diff")}
                  </p>
                  <StaggerContainer className="space-y-3">
                    {metrics.map((m) => {
                      const delta = diff[m.key as keyof typeof diff];
                      if (typeof delta !== "number") return null;
                      const pct = comparisonTarget[m.key as keyof typeof comparisonTarget] as number;
                      const pctChange = pct !== 0 ? ((delta as number) / Math.abs(pct)) * 100 : 0;

                      return (
                        <MotionCard key={`diff-${m.key}`} hover="none">
                          <div className="rounded-card border border-slate-200/70 bg-white/75 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <m.icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                <span className="text-xs text-slate-500 dark:text-zinc-400">{m.label}</span>
                              </div>
                              <span className={cn("text-xs font-semibold", getDeltaColor(delta as number, m.invert))}>
                                {(delta as number) >= 0 ? "+" : ""}{formatARS(Math.round(delta as number))}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    (delta as number) >= 0
                                      ? m.invert
                                        ? "bg-red-400"
                                        : "bg-emerald-400"
                                      : m.invert
                                        ? "bg-emerald-400"
                                        : "bg-red-400"
                                  )}
                                  style={{ width: `${Math.min(Math.abs(pctChange), 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                {pctChange >= 0 ? "+" : ""}{pctChange.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </MotionCard>
                      );
                    })}
                  </StaggerContainer>
                </div>
              )}
            </div>

            <div className="rounded-card border border-slate-200/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {t("history.monthsWithData")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sorted.map((s, i) => (
                  <button
                    key={`${s.year}-${s.month}`}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                      i === selectedIndex
                        ? "border-primary/30 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/10"
                        : "border-slate-200/70 bg-white/50 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
                    )}
                  >
                    {getMonthName(s.month, language)} {s.year}
                  </button>
                ))}
                {profileId && (
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      generateSnapshot({ month: now.getMonth() + 1, year: now.getFullYear() });
                    }}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-400 transition hover:border-primary/50 hover:text-primary dark:border-zinc-600 dark:text-zinc-500 dark:hover:border-primary/30"
                  >
                    <Camera className="h-3 w-3" />
                    {isGenerating ? t("history.generating") : t("history.generateCurrent")}
                  </button>
                )}
              </div>
            </div>

            {current && (
              <div className="rounded-card border border-slate-200/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      {t("history.snapshotTitle")}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">{t("history.snapshotDesc")}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {new Date(current.createdAt).toLocaleDateString(language === "es" ? "es-AR" : "en-US")} · {t("history.immutable")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center text-xs sm:grid-cols-5">
                  {[
                    { label: t("budgets.title"), value: String(current.jsonSnapshot.budgets) },
                    { label: t("transactions.title"), value: String(current.jsonSnapshot.transactions) },
                    { label: t("goals.title"), value: String(current.jsonSnapshot.goals) },
                    { label: t("debts.title"), value: String(current.jsonSnapshot.debts) },
                    { label: t("header.search"), value: String(current.jsonSnapshot.accounts) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.03]">
                      <span className="text-slate-400 dark:text-zinc-500">{item.label}</span>
                      <p className="mt-0.5 font-medium text-slate-700 dark:text-zinc-300">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </PageShell>
    </PageTransition>
  );
}
