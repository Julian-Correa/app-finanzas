import { useState } from "react";
import { Target, Plus, X, PiggyBank, ChevronDown, ChevronUp } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { ModalWrapper } from "@/components/common/ModalWrapper";
import { useGoals, useGoalMutations } from "@/features/goals/hooks/useGoals";
import type { GoalInput, GoalContributionInput } from "@/services/goalsService";
import { cn } from "@/lib/utils";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

const priorityLabels: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const priorityColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-500",
  low: "bg-slate-400",
};

const statusLabels: Record<string, string> = {
  active: "Activa",
  completed: "Completada",
  paused: "En pausa",
  archived: "Archivada",
};

export function GoalsPage() {
  const { data: goals, isLoading, error, profileId } = useGoals();
  const mutations = useGoalMutations(profileId ?? "");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageShell eyebrow="Metas" title="Cargando..." description="Obteniendo tus metas..." icon={Target}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-card animate-pulse border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !goals) {
    return (
      <PageShell eyebrow="Metas" title="Error" description="No se pudieron cargar las metas." icon={Target}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  const editingGoal = editingId ? goals.find((g) => g.id === editingId) ?? null : null;
  const formInitial = editingGoal
    ? {
        profile_id: editingGoal.profile_id,
        name: editingGoal.name,
        target_amount: editingGoal.target_amount,
        current_amount: editingGoal.current_amount,
        monthly_target: editingGoal.monthly_target,
        priority: editingGoal.priority,
        deadline: editingGoal.deadline,
        status: editingGoal.status,
        icon: editingGoal.icon,
        color: editingGoal.color,
      }
    : null;

  const activeGoals = goals.filter((g) => g.status === "active");
  const totalTarget = activeGoals.reduce((s, g) => s + Number(g.target_amount), 0);
  const totalCurrent = activeGoals.reduce((s, g) => s + Number(g.current_amount), 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <PageTransition>
      <PageShell
        eyebrow="Metas"
        title="Metas financieras"
        description="Seguí el progreso de tus objetivos"
        icon={Target}
      >
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Meta total</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{formatARS(totalTarget)}</p>
            </div>
          </MotionCard>
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Ahorrado</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-500">{formatARS(totalCurrent)}</p>
            </div>
          </MotionCard>
          <MotionCard>
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-zinc-400">Progreso global</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{overallProgress.toFixed(0)}%</p>
            </div>
          </MotionCard>
        </StaggerContainer>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva meta
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <Target className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">No hay metas financieras. ¡Creá una!</p>
        </div>
      ) : (
        <StaggerContainer className="space-y-3">
          {goals.map((g) => {
            const progress = g.progress;
            const isExpanded = expandedId === g.id;

            return (
              <MotionCard key={g.id} hover="none">
                <div className="rounded-card border border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : g.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={cn("h-3 w-3 shrink-0 rounded-full", priorityColors[g.priority] ?? "bg-slate-400")} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">
                        {statusLabels[g.status] ?? g.status} · {priorityLabels[g.priority] ?? g.priority}
                        {g.deadline && ` · Meta: ${new Date(g.deadline).toLocaleDateString("es-AR")}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatARS(Number(g.current_amount))}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-500">de {formatARS(Number(g.target_amount))}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>

                <div className="px-5 pb-2">
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className={cn("h-full rounded-full transition-all", progress >= 75 ? "bg-emerald-500" : progress >= 50 ? "bg-blue-500" : progress >= 25 ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                    {progress.toFixed(1)}% completado
                    {g.eta !== null && ` · ${g.eta > 0 ? `${g.eta} meses restantes` : "Completado"}`}
                  </p>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200/50 px-5 py-4 dark:border-white/5">
                    <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-400 dark:text-zinc-500">Ahorro mensual: </span>{formatARS(Number(g.monthly_target))}</div>
                      {g.deadline && <div><span className="text-slate-400 dark:text-zinc-500">Fecha límite: </span>{new Date(g.deadline).toLocaleDateString("es-AR")}</div>}
                    </div>

                    <div className="mb-3 flex gap-2">
                      <button
                        onClick={() => { setContributeGoalId(g.id); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <PiggyBank className="h-3.5 w-3.5" />
                        Aportar
                      </button>
                      <button
                        onClick={() => setEditingId(g.id)}
                        className="rounded-lg border border-slate-200/70 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]"
                      >
                        Editar
                      </button>
                    </div>

                    {g.contributions.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-medium text-slate-500 dark:text-zinc-400">Aportes registrados</p>
                        <div className="space-y-1.5">
                          {g.contributions.map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-white/[0.03]">
                              <span>{new Date(c.date).toLocaleDateString("es-AR")}</span>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatARS(Number(c.amount))}</span>
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
        <GoalFormModal
          initial={formInitial}
          profileId={profileId ?? ""}
          mutations={mutations}
          editId={editingId}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      </ModalWrapper>

      <ModalWrapper
        open={!!contributeGoalId}
        onClose={() => setContributeGoalId(null)}
      >
        <ContributionFormModal
          goalId={contributeGoalId ?? ""}
          mutations={mutations}
          onClose={() => setContributeGoalId(null)}
        />
      </ModalWrapper>
    </PageShell>
    </PageTransition>
  );
}

interface GoalFormModalProps {
  initial: {
    profile_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    monthly_target: number;
    priority: string;
    deadline: string | null;
    status: string;
    icon: string | null;
    color: string | null;
  } | null;
  profileId: string;
  mutations: ReturnType<typeof useGoalMutations>;
  editId: string | null;
  onClose: () => void;
}

function GoalFormModal({ initial, profileId, mutations, editId, onClose }: GoalFormModalProps) {
  const isEditing = !!initial && !!editId;

  const [name, setName] = useState(initial?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(initial ? String(initial.target_amount) : "");
  const [currentAmount, setCurrentAmount] = useState(initial ? String(initial.current_amount) : "0");
  const [monthlyTarget, setMonthlyTarget] = useState(initial ? String(initial.monthly_target) : "0");
  const [priority, setPriority] = useState(initial?.priority ?? "medium");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      profile_id: profileId,
      name,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      monthly_target: Number(monthlyTarget),
      priority,
      deadline: deadline || null,
      status: "active",
      icon: null,
      color: null,
    };

    try {
      if (isEditing && editId) {
        await mutations.update.mutateAsync({ id: editId, data: base });
      } else {
        await mutations.create.mutateAsync(base as GoalInput);
      }
      onClose();
    } catch {
    }
  };

  const isPending = mutations.create.isPending || mutations.update.isPending;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isEditing ? "Editar meta" : "Nueva meta"}</h3>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ej: Fondo de emergencia"
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Meta total ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Ahorrado ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Ahorro mensual ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Fecha límite</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
              {isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear meta"}
            </button>
          </div>
      </form>
    </>
  );
}

interface ContributionFormModalProps {
  goalId: string;
  mutations: ReturnType<typeof useGoalMutations>;
  onClose: () => void;
}

function ContributionFormModal({ goalId, mutations, onClose }: ContributionFormModalProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await mutations.addContribution.mutateAsync({
        goal_id: goalId,
        amount: Number(amount),
        date,
        notes: notes || null,
      } as GoalContributionInput);
      onClose();
    } catch {
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Aportar a meta</h3>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-zinc-300">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Ahorro semanal"
              className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-3 py-2.5 text-sm backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200/70 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]">
              Cancelar
            </button>
            <button type="submit" disabled={mutations.addContribution.isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50">
              {mutations.addContribution.isPending ? "Guardando..." : "Aportar"}
            </button>
          </div>
      </form>
    </>
  );
}
