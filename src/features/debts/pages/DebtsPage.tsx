import { useState } from "react";
import { CreditCard, Plus, X, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation, type TranslationKey } from "@/lib/translations";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard, SkeletonForm } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { useDebts, useDebtMutations } from "@/features/debts/hooks/useDebts";
import type { DebtInput, DebtPaymentInput } from "@/services/debtsService";
import type { Tables } from "@/types/database";
import { cn } from "@/lib/utils";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

const priorityColors: Record<string, string> = {
  essential: "bg-red-500",
  housing: "bg-orange-500",
  credit_card: "bg-amber-500",
  personal_loan: "bg-blue-500",
  installment_purchase: "bg-violet-500",
  other: "bg-slate-400",
};

function getPriorityLabel(p: string, t: (key: TranslationKey) => string): string {
  const map: Record<string, TranslationKey> = {
    essential: "priority.essential",
    housing: "priority.housing",
    credit_card: "priority.creditCard",
    personal_loan: "priority.personalLoan",
    installment_purchase: "priority.installmentPurchase",
    other: "priority.other",
  };
  return t(map[p] ?? "priority.other");
}

export function DebtsPage() {
  const { t, language } = useTranslation();
  const { data: debts, isLoading, error, profileId } = useDebts();
  const mutations = useDebtMutations(profileId ?? "");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payDebtId, setPayDebtId] = useState<string | null>(null);

  if (isLoading) {
    return (
        <PageShell eyebrow={t("debts.eyebrow")} title="Cargando..." description={t("debts.loadingDesc")} icon={CreditCard}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !debts) {
    return (
        <PageShell eyebrow={t("debts.eyebrow")} title="Error" description={t("debts.errorDesc")} icon={CreditCard}>
          <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
            <p>{(error as Error)?.message ?? t("debts.errorUnknown")}</p>
          </div>
      </PageShell>
    );
  }

  const editingDebt = editingId ? debts.find((d) => d.id === editingId) ?? null : null;
  const formInitial = editingDebt
    ? {
        profile_id: editingDebt.profile_id,
        name: editingDebt.name,
        creditor: editingDebt.creditor,
        original_amount: editingDebt.original_amount,
        remaining_amount: editingDebt.remaining_amount,
        installment_amount: editingDebt.installment_amount,
        installments_total: editingDebt.installments_total,
        installments_left: editingDebt.installments_left,
        interest_rate: editingDebt.interest_rate,
        priority: editingDebt.priority,
        due_day: editingDebt.due_day,
        status: editingDebt.status,
      }
    : null;

  const activeDebts = debts.filter((d) => d.status === "active");
  const totalRemaining = activeDebts.reduce((s, d) => s + Number(d.remaining_amount), 0);
  const totalOriginal = activeDebts.reduce((s, d) => s + Number(d.original_amount), 0);

  return (
    <PageTransition>
      <PageShell
        eyebrow={t("debts.eyebrow")}
        title={t("debts.title")}
        description={t("debts.description")}
        icon={CreditCard}
      >
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">{t("debts.totalDebt")}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-red-500">{formatARS(totalRemaining)}</p>
            </div>
          </MotionCard>
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">{t("debts.original")}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{formatARS(totalOriginal)}</p>
            </div>
          </MotionCard>
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">{t("debts.paid")}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-500">{formatARS(totalOriginal - totalRemaining)}</p>
            </div>
          </MotionCard>
        </StaggerContainer>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          {t("debts.add")}
        </button>
      </div>

      {debts.length === 0 ? (
        <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <CreditCard className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">{t("debts.empty")}</p>
        </div>
      ) : (
        <StaggerContainer className="space-y-3">
          {debts.map((d) => {
            const progress = Number(d.original_amount) > 0
              ? ((Number(d.original_amount) - Number(d.remaining_amount)) / Number(d.original_amount)) * 100
              : 0;
            const isExpanded = expandedId === d.id;

            return (
              <MotionCard key={d.id} hover="none">
                <div className="rounded-card border border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={cn("h-3 w-3 shrink-0 rounded-full", priorityColors[d.priority] ?? "bg-slate-400")} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">
                        {d.creditor ?? getPriorityLabel(d.priority, t) ?? d.priority}
                        {d.installments_total > 0 && ` · ${d.installments_left}/${d.installments_total} ${t("debts.installments")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-500">{formatARS(Number(d.remaining_amount))}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">{formatARS(Number(d.installment_amount))}{t("debts.perMonth")}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>

                <div className="px-5 pb-2">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className={cn("h-full rounded-full transition-all", progress >= 75 ? "bg-emerald-500" : progress >= 50 ? "bg-blue-500" : progress >= 25 ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{progress.toFixed(0)}% {t("debts.pctPaid")}</p>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200/50 px-5 py-4 dark:border-white/5">
                    <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-400 dark:text-zinc-500">{t("debts.originalLabel")} </span>{formatARS(Number(d.original_amount))}</div>
                      <div><span className="text-slate-400 dark:text-zinc-500">{t("debts.remainingLabel")} </span>{formatARS(Number(d.remaining_amount))}</div>
                      <div><span className="text-slate-400 dark:text-zinc-500">{t("debts.installmentLabel")} </span>{formatARS(Number(d.installment_amount))}{t("debts.perMonth")}</div>
                      <div><span className="text-slate-400 dark:text-zinc-500">{t("debts.interestLabel")} </span>{d.interest_rate}%</div>
                    </div>

                    <div className="mb-3 flex gap-2">
                      <button
                        onClick={() => { setPayDebtId(d.id); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        {t("debts.pay")}
                      </button>
                      <button
                        onClick={() => setEditingId(d.id)}
                        className="rounded-lg border border-slate-200/70 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]"
                      >
                        {t("debts.edit")}
                      </button>
                    </div>

                    {d.payments.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.registeredPayments")}</p>
                        <div className="space-y-1.5">
                          {d.payments.map((p) => (
                            <div key={p.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-white/[0.03]">
                              <span>{new Date(p.date).toLocaleDateString(language === "en" ? "en-US" : "es-AR")}</span>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">-{formatARS(Number(p.amount))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </MotionCard>
            );
          })}
        </StaggerContainer>
      )}

      <ModalWrapper
        open={showForm || !!formInitial}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      >
        <DebtFormModal
          initial={formInitial}
          profileId={profileId}
          mutations={mutations}
          editId={editingId}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      </ModalWrapper>

      <ModalWrapper
        open={!!payDebtId}
        onClose={() => setPayDebtId(null)}
      >
        <PaymentFormModal
          debtId={payDebtId ?? ""}
          profileId={profileId ?? ""}
          mutations={mutations}
          onClose={() => setPayDebtId(null)}
        />
      </ModalWrapper>
    </PageShell>
    </PageTransition>
  );
}

interface DebtFormModalProps {
  initial: {
    profile_id: string;
    name: string;
    creditor: string | null;
    original_amount: number;
    remaining_amount: number;
    installment_amount: number;
    installments_total: number;
    installments_left: number;
    interest_rate: number;
    priority: string;
    due_day: number | null;
    status: string;
  } | null;
  profileId: string | undefined;
  mutations: ReturnType<typeof useDebtMutations>;
  editId: string | null;
  onClose: () => void;
}

function DebtFormModal({ initial, profileId, mutations, editId, onClose }: DebtFormModalProps) {
  const { t, language } = useTranslation();
  const isEditing = !!initial && !!editId;

  const [selectedProfileId, setSelectedProfileId] = useState(initial?.profile_id ?? "11111111-1111-4111-8111-111111111111");
  const [name, setName] = useState(initial?.name ?? "");
  const [creditor, setCreditor] = useState(initial?.creditor ?? "");
  const [originalAmount, setOriginalAmount] = useState(initial ? String(initial.original_amount) : "");
  const [remainingAmount, setRemainingAmount] = useState(initial ? String(initial.remaining_amount) : "");
  const [installmentAmount, setInstallmentAmount] = useState(initial ? String(initial.installment_amount) : "0");
  const [installmentsTotal, setInstallmentsTotal] = useState(initial ? String(initial.installments_total) : "0");
  const [installmentsLeft, setInstallmentsLeft] = useState(initial ? String(initial.installments_left) : "0");
  const [interestRate, setInterestRate] = useState(initial ? String(initial.interest_rate) : "0");
  const [priority, setPriority] = useState(initial?.priority ?? "other");
  const [dueDay, setDueDay] = useState(initial?.due_day ? String(initial.due_day) : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalProfileId = profileId || selectedProfileId;

    const base = {
      profile_id: finalProfileId,
      name,
      creditor: creditor || null,
      original_amount: Number(originalAmount),
      remaining_amount: Number(remainingAmount),
      installment_amount: Number(installmentAmount),
      installments_total: Number(installmentsTotal),
      installments_left: Number(installmentsLeft),
      interest_rate: Number(interestRate),
      priority,
      due_day: dueDay ? Number(dueDay) : null,
      status: "active",
    };

    try {
      if (isEditing && editId) {
        await mutations.update.mutateAsync({ id: editId, data: base });
      } else {
        await mutations.create.mutateAsync(base as DebtInput);
      }
      onClose();
    } catch {
    }
  };

  const isPending = mutations.create.isPending || mutations.update.isPending;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isEditing ? t("debts.form.editTitle") : t("debts.form.newTitle")}</h3>
        {!isPending && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isPending ? (
        <SkeletonForm rows={5} />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t("debts.form.namePlaceholder")}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.creditor")}</label>
              <input
                type="text"
                value={creditor}
                onChange={(e) => setCreditor(e.target.value)}
                placeholder={t("debts.form.creditorPlaceholder")}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.originalAmount")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.remainingBalance")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={remainingAmount}
                onChange={(e) => setRemainingAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.monthlyInstallment")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.totalInstallments")}</label>
                <input
                  type="number"
                  min="0"
                  value={installmentsTotal}
                  onChange={(e) => setInstallmentsTotal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.remainingInstallments")}</label>
                <input
                  type="number"
                  min="0"
                  value={installmentsLeft}
                  onChange={(e) => setInstallmentsLeft(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.interestRate")}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.dueDay")}</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.form.priority")}</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <option value="essential">{t("priority.essential")}</option>
              <option value="housing">{t("priority.housing")}</option>
              <option value="credit_card">{t("priority.creditCard")}</option>
              <option value="personal_loan">{t("priority.personalLoan")}</option>
              <option value="installment_purchase">{t("priority.installmentPurchase")}</option>
              <option value="other">{t("priority.other")}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]">
              {t("debts.form.cancel")}
            </button>
            <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
              {isPending ? t("debts.form.saving") : isEditing ? t("debts.form.saveChanges") : t("debts.form.create")}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

interface PaymentFormModalProps {
  debtId: string;
  profileId: string;
  mutations: ReturnType<typeof useDebtMutations>;
  onClose: () => void;
}

function PaymentFormModal({ debtId, profileId, mutations, onClose }: PaymentFormModalProps) {
  const { t, language } = useTranslation();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await mutations.addPayment.mutateAsync({
        input: {
          debt_id: debtId,
          amount: Number(amount),
          date,
          notes: notes || null,
        } as DebtPaymentInput,
        debtId,
      });
      onClose();
    } catch {
    }
  };

  const isPending = mutations.addPayment.isPending;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("debts.payForm.title")}</h3>
        {!isPending && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isPending ? (
        <SkeletonForm rows={3} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.payForm.amount")}</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.payForm.date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">{t("debts.payForm.notes")}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("debts.payForm.notesPlaceholder")}
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]">
              {t("debts.payForm.cancel")}
            </button>
            <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
              {isPending ? t("debts.payForm.saving") : t("debts.payForm.register")}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
