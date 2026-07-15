import { ShoppingCart, TrendingUp, TrendingDown, Wallet, Gauge, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { usePurchaseAdvisor, useEvaluation } from "@/features/purchase-advisor/hooks/usePurchaseAdvisor";
import { cn } from "@/lib/utils";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

const decisionConfig = {
  yes: { icon: CheckCircle, label: "Compra recomendada", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 border-emerald-400/30 dark:bg-emerald-950/30 dark:border-emerald-400/20" },
  wait: { icon: HelpCircle, label: "Esperá un poco", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 border-amber-400/30 dark:bg-amber-950/30 dark:border-amber-400/20" },
  no: { icon: AlertTriangle, label: "No es recomendable", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 border-red-400/30 dark:bg-red-950/30 dark:border-red-400/20" },
};

const riskConfig = {
  low: { label: "Bajo riesgo", color: "text-emerald-600 dark:text-emerald-400" },
  medium: { label: "Riesgo medio", color: "text-amber-600 dark:text-amber-400" },
  high: { label: "Alto riesgo", color: "text-red-600 dark:text-red-400" },
};

function formatSigned(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatARS(Math.abs(value))}`;
}

export function PurchaseAdvisorPage() {
  const { data: dashboard, isLoading, error } = usePurchaseAdvisor();
  const { price, setPrice, installments, setInstallments, evaluation } = useEvaluation(dashboard);

  if (isLoading) {
    return (
      <PageShell eyebrow="Purchase Advisor" title="Cargando..." description="Analizando tus finanzas..." icon={ShoppingCart}>
        <div className="rounded-card animate-pulse border border-slate-200/70 bg-white/75 p-8 dark:border-white/10 dark:bg-white/[0.04]" style={{ height: "300px" }} />
      </PageShell>
    );
  }

  if (error || !dashboard) {
    return (
      <PageShell eyebrow="Purchase Advisor" title="Error" description="No se pudieron cargar los datos financieros." icon={ShoppingCart}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Purchase Advisor"
      title="¿Puedo comprar esto?"
      description="Evaluá una compra antes de hacerla"
      icon={ShoppingCart}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="mb-5 text-sm font-medium text-slate-700 dark:text-zinc-300">Detalles de la compra</h3>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Precio ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200/70 bg-white/75 px-4 py-3 text-lg backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">Cuotas</label>
              <div className="flex gap-1 rounded-xl border border-slate-200/70 bg-slate-50 p-1 dark:border-white/10 dark:bg-zinc-800/50">
                {[1, 3, 6, 12, 18, 24].map((n) => (
                  <button
                    key={n}
                    onClick={() => setInstallments(n)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
                      installments === n
                        ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                        : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {dashboard && (
            <div className="mt-6 space-y-2 border-t border-slate-200/50 pt-4 dark:border-white/5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">Finanzas actuales</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400">Efectivo disponible</span>
                <span className="font-medium">{formatARS(dashboard.liquidity)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400">Flujo de caja</span>
                <span className={cn("font-medium", dashboard.cashflow.cashflow >= 0 ? "text-emerald-600" : "text-red-600")}>
                  {formatARS(dashboard.cashflow.cashflow)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400">Score financiero</span>
                <span className="font-medium">{dashboard.financialScore.total}/100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-zinc-400">Endeudamiento</span>
                <span className="font-medium">{dashboard.debtRatio.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {!evaluation ? (
            <div className="rounded-card border border-slate-200/70 bg-white/70 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <ShoppingCart className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
              <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">Ingresá un precio para evaluar la compra</p>
            </div>
          ) : (() => {
            const DecisionIcon = decisionConfig[evaluation.decision].icon;
            return (
            <>
              <div className={cn("rounded-card border p-6", decisionConfig[evaluation.decision].bg)}>
                <div className="flex items-center gap-3">
                  <DecisionIcon className={cn("h-8 w-8", decisionConfig[evaluation.decision].color)} aria-hidden="true" />
                  <div>
                    <p className={cn("text-lg font-semibold", decisionConfig[evaluation.decision].color)}>
                      {decisionConfig[evaluation.decision].label}
                    </p>
                    <p className={cn("text-sm", riskConfig[evaluation.risk].color)}>
                      {riskConfig[evaluation.risk].label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-zinc-300">Impacto financiero</h3>
                <div className="space-y-3">
                  <ImpactRow
                    icon={TrendingUp}
                    label="Flujo de caja"
                    value={formatSigned(evaluation.cashflowImpact)}
                    positive={evaluation.cashflowImpact >= 0}
                  />
                  <ImpactRow
                    icon={Gauge}
                    label="Score financiero"
                    value={`${evaluation.financialScoreImpact >= 0 ? "+" : ""}${evaluation.financialScoreImpact.toFixed(1)} pts`}
                    positive={evaluation.financialScoreImpact >= 0}
                  />
                  <ImpactRow
                    icon={Wallet}
                    label="Impacto en presupuesto"
                    value={`+${evaluation.budgetImpact.toFixed(1)}%`}
                    positive={false}
                    invert
                  />
                  <ImpactRow
                    icon={TrendingDown}
                    label="Endeudamiento"
                    value={`+${evaluation.debtImpact.toFixed(1)}%`}
                    positive={false}
                    invert
                  />
                  {installments > 1 && (
                    <ImpactRow
                      icon={ShoppingCart}
                      label="Cuota mensual"
                      value={formatARS(price / installments)}
                      positive={false}
                    />
                  )}
                  {evaluation.goalDelay > 0 && (
                    <ImpactRow
                      icon={AlertTriangle}
                      label="Retraso en metas"
                      value={`~${evaluation.goalDelay} meses`}
                      positive={false}
                      invert
                    />
                  )}
                </div>
              </div>

              <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-zinc-300">Razones</h3>
                <ul className="space-y-2">
                  {evaluation.reasons.map((reason, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-zinc-300">
                      <span className="mt-0.5 shrink-0 text-primary">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </>
            );
          })()}
        </div>
      </div>
    </PageShell>
  );
}

interface ImpactRowProps {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  positive: boolean;
  invert?: boolean;
}

function ImpactRow({ icon: Icon, label, value, positive, invert }: ImpactRowProps) {
  const isGood = invert ? !positive : positive;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <span className="text-xs text-slate-500 dark:text-zinc-400">{label}</span>
      </div>
      <span className={cn("text-xs font-medium", isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
        {value}
      </span>
    </div>
  );
}
