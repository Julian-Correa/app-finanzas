import { useState } from "react";
import { WalletCards, Plus, X, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/translations";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard, SkeletonForm } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { useBudgets, useBudgetMutations } from "@/features/budgets/hooks/useBudgets";
import type { BudgetInput } from "@/services/budgetsService";
import type { Tables } from "@/types/database";
import { cn } from "@/lib/utils";

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "on_track": return "bg-emerald-500";
    case "warning": return "bg-amber-500";
    case "high": return "bg-orange-500";
    case "critical": return "bg-red-500";
    case "exceeded": return "bg-red-600";
    default: return "bg-slate-300 dark:bg-zinc-600";
  }
}

function getUsageColor(percent: number): string {
  if (percent >= 100) return "bg-red-600";
  if (percent >= 90) return "bg-red-500";
  if (percent >= 75) return "bg-amber-500";
  if (percent >= 50) return "bg-blue-500";
  return "bg-emerald-500";
}

export function BudgetsPage() {
  const { t, language } = useTranslation();
  const { data, isLoading, error, month, year, profileId } = useBudgets();
  const mutations = useBudgetMutations(profileId ?? "", month, year);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
        <PageShell eyebrow={`${monthNames[month - 1]} ${year}`} title={t("budgets.title")} description={t("budgets.loadingDesc")} icon={WalletCards}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
        <PageShell eyebrow={`${monthNames[month - 1]} ${year}`} title={t("budgets.title")} description={t("budgets.errorDesc")} icon={WalletCards}>
          <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
            <p>{(error as Error)?.message ?? t("budgets.errorUnknown")}</p>
          </div>
      </PageShell>
    );
  }

  const { budgets, categories } = data;

  const editingBudget = editingId ? budgets.find((b) => b.id === editingId) ?? null : null;
  const editingInitial = editingBudget
    ? { category_id: editingBudget.category_id, limit_amount: editingBudget.limit_amount, month: editingBudget.month, year: editingBudget.year, profile_id: editingBudget.profile_id }
    : null;

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent_amount), 0);
  const overallUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <PageTransition>
      <PageShell
        eyebrow={`${monthNames[month - 1]} ${year}`}
        title={t("budgets.title")}
        description={t("budgets.description")}
        icon={WalletCards}
      >
        <MotionCard hover="none">
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-zinc-400">{t("budgets.totalBudget")}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{formatARS(totalBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-zinc-400">{t("budgets.spent")}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-red-500">{formatARS(totalSpent)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-zinc-400">{t("budgets.available")}</p>
                <p className={cn("mt-1 text-2xl font-semibold tracking-tight", totalBudget - totalSpent >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {formatARS(totalBudget - totalSpent)}
                </p>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className={cn("h-full rounded-full transition-all", getUsageColor(overallUsage))}
                style={{ width: `${Math.min(overallUsage, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-zinc-500">{overallUsage.toFixed(1)}% {t("budgets.pctUsed")}</p>
          </div>
        </MotionCard>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t("budgets.add")}
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <WalletCards className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">{t("budgets.empty")}</p>
        </div>
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((b) => {
            const pct = b.usagePercent;
            return (
              <MotionCard key={b.id}>
                <article className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.category?.name ?? t("budgets.uncategorized")}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-zinc-500">
                      {formatARS(b.spent_amount)} / {formatARS(b.limit_amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {pct >= 90 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" aria-label={t("budgets.alert")} />
                    )}
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        pct >= 100 ? "text-red-600 dark:text-red-400" : pct >= 75 ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-zinc-400"
                      )}
                    >
                      {pct.toFixed(0)}%
                    </span>
                    <button
                      onClick={() => setEditingId(b.id)}
                      className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300"
                      aria-label={t("budgets.editLabel")}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className={cn("h-full rounded-full transition-all", getUsageColor(pct))}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    b.status === "on_track" ? "bg-emerald-500" : b.status === "exceeded" ? "bg-red-500" : "bg-amber-500"
                  )} />
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
                    {b.status === "on_track" ? t("budgetStatus.onTrack") : b.status === "exceeded" ? t("budgetStatus.exceeded") : b.status === "warning" ? t("budgetStatus.warning") : b.status === "high" ? t("budgetStatus.high") : t("budgetStatus.critical")}
                  </span>
                </div>
              </article>
              </MotionCard>
            );
          })}
        </StaggerContainer>
      )}

      <ModalWrapper
        open={showForm || !!editingInitial}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      >
        <BudgetFormModal
          initial={editingInitial}
          categories={categories}
          budgets={budgets}
          profileId={profileId}
          month={month}
          year={year}
          mutations={mutations}
          editId={editingId}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      </ModalWrapper>
    </PageShell>
    </PageTransition>
  );
}

interface BudgetFormModalProps {
  initial: { category_id: string; limit_amount: number; month: number; year: number; profile_id: string } | null;
  categories: Tables<"categories">[];
  budgets: Tables<"budgets">[];
  profileId: string | undefined;
  month: number;
  year: number;
  mutations: ReturnType<typeof useBudgetMutations>;
  editId: string | null;
  onClose: () => void;
}

function BudgetFormModal({
  initial,
  categories,
  budgets,
  profileId,
  month,
  year,
  mutations,
  editId,
  onClose,
}: BudgetFormModalProps) {
  const { t, language } = useTranslation();
  const isEditing = !!initial && !!editId;

  const [selectedProfileId, setSelectedProfileId] = useState(initial?.profile_id ?? "11111111-1111-4111-8111-111111111111");
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [limitAmount, setLimitAmount] = useState(initial ? String(initial.limit_amount) : "");

  const finalProfileId = profileId && profileId !== "ambos" ? profileId : selectedProfileId;

  const availableCategories = categories.filter((c) => {
    // Only expense categories can have budgets
    if (c.type !== "expense") return false;
    const alreadyBudgeted = budgets.some((b) => b.profile_id === finalProfileId && b.category_id === c.id);
    const isEditingCurrent = initial && c.id === initial.category_id;
    return !alreadyBudgeted || isEditingCurrent;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      profile_id: finalProfileId,
      category_id: categoryId,
      limit_amount: Number(limitAmount),
      month,
      year,
    };

    try {
      if (isEditing && editId) {
        await mutations.update.mutateAsync({ id: editId, data: base });
      } else {
        await mutations.create.mutateAsync(base as BudgetInput);
      }
      onClose();
    } catch {
    }
  };

  const isPending = mutations.create.isPending || mutations.update.isPending;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isEditing ? t("budgets.form.editTitle") : t("budgets.form.newTitle")}</h3>
        {!isPending && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isPending ? (
        <SkeletonForm rows={2} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!profileId && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Perfil</label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <option value="11111111-1111-4111-8111-111111111111">Julian</option>
                <option value="22222222-2222-4222-8222-222222222222">Pareja</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("budgets.form.category")}</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <option value="">{t("budgets.form.select")}</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("budgets.form.monthlyLimit")}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
            >
              {t("budgets.form.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? t("budgets.form.saving") : isEditing ? t("budgets.form.saveChanges") : t("budgets.form.create")}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
