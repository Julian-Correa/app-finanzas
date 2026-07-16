import { useState } from "react";
import { ReceiptText, Plus, ArrowUpRight, ArrowDownRight, X, Search } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { useTransactions, useTransactionMutations } from "@/features/transactions/hooks/useTransactions";
import type { TransactionInput } from "@/services/transactionsService";
import type { Tables } from "@/types/database";
import { cn } from "@/lib/utils";

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export function TransactionsPage() {
  const { data, isLoading, error, month, year, profileId } = useTransactions();
  const mutations = useTransactionMutations(profileId ?? "", month, year);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageShell eyebrow="Transacciones" title="Cargando..." description="Obteniendo movimientos..." icon={ReceiptText}>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} className="p-4" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell eyebrow="Transacciones" title="Error" description="No se pudieron cargar los movimientos." icon={ReceiptText}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  const { transactions, categories, accounts } = data;

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.transaction_type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchCat = t.category?.name.toLowerCase().includes(q);
      const matchAcc = t.account?.name.toLowerCase().includes(q);
      if (!matchDesc && !matchCat && !matchAcc) return false;
    }
    return true;
  });

  const catMap = new Map(categories.map((c) => [c.id, c]));

  const editingTx = editingId ? transactions.find((t) => t.id === editingId) ?? null : null;
  const formInitial = editingTx
    ? {
        profile_id: editingTx.profile_id,
        account_id: editingTx.account_id,
        category_id: editingTx.category_id,
        amount: editingTx.amount,
        transaction_type: editingTx.transaction_type as "income" | "expense",
        description: editingTx.description,
        date: editingTx.date,
        notes: editingTx.notes,
        is_recurring: editingTx.is_recurring,
        attachment_url: editingTx.attachment_url,
      }
    : null;

  return (
    <PageTransition>
      <PageShell
        eyebrow={`${monthNames[month - 1]} ${year}`}
        title="Transacciones"
        description="Tus ingresos y gastos mensuales"
        icon={ReceiptText}
      >
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200/70 bg-white/75 py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04] dark:placeholder-zinc-500"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-200/70 bg-white/75 p-1 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          {(["all", "income", "expense"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTypeFilter(opt)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                typeFilter === opt
                  ? "bg-primary text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {opt === "all" ? "Todas" : opt === "income" ? "Ingresos" : "Gastos"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <ReceiptText className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
            {search || typeFilter !== "all"
              ? "No hay transacciones que coincidan con los filtros."
              : "Todavía no hay transacciones este mes. ¡Creá la primera!"}
          </p>
        </div>
      ) : (
        <StaggerContainer className="space-y-2">
          {filtered.map((tx) => (
            <MotionCard key={tx.id} hover="none">
              <article className="rounded-card border border-slate-200/70 bg-white/70 p-4 backdrop-blur-xl transition-colors hover:bg-white/90 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        tx.transaction_type === "income"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                      )}
                    >
                      {tx.transaction_type === "income" ? (
                        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">
                        {tx.category?.name ?? "Sin categoría"}
                        {tx.account ? ` · ${tx.account.name}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          tx.transaction_type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {tx.transaction_type === "income" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(tx.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingId(tx.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300"
                      aria-label="Editar transacción"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </MotionCard>
          ))}
        </StaggerContainer>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 dark:text-zinc-500">
          {filtered.length} de {transactions.length} transacciones
        </p>
      )}

      <ModalWrapper
        open={showForm || !!formInitial}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      >
        <TransactionFormModal
          initial={formInitial}
          categories={categories}
          accounts={accounts}
          profileId={profileId ?? ""}
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

interface TransactionFormModalProps {
  initial: {
    profile_id: string;
    account_id: string;
    category_id: string;
    amount: number;
    transaction_type: "income" | "expense";
    description: string;
    date: string;
    notes: string | null;
    is_recurring: boolean;
    attachment_url: string | null;
  } | null;
  categories: Tables<"categories">[];
  accounts: Tables<"accounts">[];
  profileId: string;
  mutations: ReturnType<typeof useTransactionMutations>;
  editId: string | null;
  onClose: () => void;
}

function TransactionFormModal({
  initial,
  categories,
  accounts,
  profileId,
  mutations,
  editId,
  onClose,
}: TransactionFormModalProps) {
  const isEditing = !!initial && !!editId;
  const incomeCats = categories.filter((c) => c.type === "income");
  const expenseCats = categories.filter((c) => c.type === "expense");

  const [type, setType] = useState<"income" | "expense">(initial?.transaction_type ?? "expense");
  const [accountId, setAccountId] = useState(initial?.account_id ?? accounts[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [amount, setAmount] = useState(initial ? String(Math.abs(initial.amount)) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const catOptions = type === "income" ? incomeCats : expenseCats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      profile_id: profileId,
      account_id: accountId,
      category_id: categoryId,
      amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      transaction_type: type,
      description,
      date,
      notes: notes || null,
      is_recurring: false,
      attachment_url: null,
    };

    try {
      if (isEditing && editId) {
        await mutations.update.mutateAsync({ id: editId, data: base });
      } else {
        await mutations.create.mutateAsync(base as TransactionInput);
      }
      onClose();
    } catch {
    }
  };

  const isPending = mutations.create.isPending || mutations.update.isPending;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isEditing ? "Editar transacción" : "Nueva transacción"}</h3>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 rounded-xl border border-slate-200/70 bg-slate-50 p-1 dark:border-white/10 dark:bg-zinc-800/50">
            {(["expense", "income"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setType(opt);
                  setCategoryId("");
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  type === opt
                    ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {opt === "income" ? "Ingreso" : "Gasto"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <option value="">Seleccionar</option>
                {catOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Cuenta</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Monto ($)</label>
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
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Ej: Supermercado"
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Notas adicionales..."
              className="w-full resize-none rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear transacción"}
            </button>
          </div>
      </form>
    </>
  );
}
