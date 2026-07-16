import { Beaker, TrendingUp, TrendingDown, Wallet, Gauge, PiggyBank, BarChart3, CalendarClock } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { useSimulator, useSimulation } from "@/features/simulator/hooks/useSimulator";
import { cn } from "@/lib/utils";

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

function formatSigned(value: number, suffix = ""): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${formatARS(Math.abs(value))}${suffix}`;
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

export function SimulatorPage() {
  const { data: baseline, isLoading, error } = useSimulator();
  const { scenario, setScenario, result } = useSimulation(baseline);

  if (isLoading) {
    return (
      <PageShell eyebrow="Simulador" title="Cargando..." description="Preparando simulador..." icon={Beaker}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-card animate-pulse border border-slate-200/70 bg-white/75 p-6 dark:border-white/10 dark:bg-white/[0.04]" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !baseline || !result) {
    return (
      <PageShell eyebrow="Simulador" title="Error" description="No se pudieron cargar los datos base." icon={Beaker}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  const handleChange = (field: keyof typeof scenario, value: number) => {
    setScenario((prev) => ({ ...prev, [field]: value }));
  };

  const metrics: {
    label: string;
    icon: typeof Wallet;
    baseline: string;
    projected: string;
    delta: number;
    invert?: boolean;
    color?: string;
  }[] = [
    {
      label: "Flujo de caja",
      icon: TrendingUp,
      baseline: formatARS(result.baseline.cashflow.cashflow),
      projected: formatARS(result.projected.cashflow.cashflow),
      delta: result.differences.cashflowDelta,
      color: result.projected.cashflow.cashflow >= 0 ? "text-emerald-600" : "text-red-600",
    },
    {
      label: "Ingresos",
      icon: TrendingUp,
      baseline: formatARS(result.baseline.cashflow.income),
      projected: formatARS(result.projected.cashflow.income),
      delta: scenario.incomeChange,
    },
    {
      label: "Gastos",
      icon: TrendingDown,
      baseline: formatARS(Math.abs(result.baseline.cashflow.expenses)),
      projected: formatARS(Math.abs(result.projected.cashflow.expenses)),
      delta: result.projected.cashflow.expenses - result.baseline.cashflow.expenses,
      invert: true,
      color: "text-red-500",
    },
    {
      label: "Score financiero",
      icon: Gauge,
      baseline: `${result.baseline.financialScore.total}/100`,
      projected: `${result.projected.financialScore.total}/100`,
      delta: result.differences.scoreDelta,
      color: getScoreColor(result.projected.financialScore.total),
    },
    {
      label: "Liquidez",
      icon: Wallet,
      baseline: formatARS(result.baseline.liquidity),
      projected: formatARS(result.projected.liquidity),
      delta: result.differences.liquidityDelta,
    },
    {
      label: "Endeudamiento",
      icon: BarChart3,
      baseline: `${result.baseline.debtRatio.toFixed(1)}%`,
      projected: `${result.projected.debtRatio.toFixed(1)}%`,
      delta: result.differences.debtRatioDelta,
      invert: true,
    },
    {
      label: "Tasa de ahorro",
      icon: PiggyBank,
      baseline: `${result.baseline.savingsRate.toFixed(1)}%`,
      projected: `${result.projected.savingsRate.toFixed(1)}%`,
      delta: result.differences.savingsRateDelta,
    },
    {
      label: "Burn rate",
      icon: CalendarClock,
      baseline: `${formatARS(result.baseline.burnRate)}/día`,
      projected: `${formatARS(result.projected.burnRate)}/día`,
      delta: result.differences.burnRateDelta,
      invert: true,
    },
  ];

  return (
    <PageTransition>
      <PageShell
        eyebrow="Simulador"
        title="Simulador financiero"
        description="Proyectá escenarios hipotéticos sin afectar tus datos reales"
        icon={Beaker}
      >
        <MotionCard hover="none">
          <div className="rounded-card border border-amber-400/30 bg-amber-50 p-4 text-xs text-amber-700 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-400">
            <strong>⚠ Modo simulación</strong> — Los cambios solo afectan esta pantalla. Nunca se guardan en la base de datos.
          </div>
        </MotionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <MotionCard hover="none">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="mb-5 text-sm font-medium text-slate-700 dark:text-zinc-300">Ajustar escenario</h3>
          <div className="space-y-5">
            <SliderField
              label="Cambio en ingresos"
              value={scenario.incomeChange}
              onChange={(v) => handleChange("incomeChange", v)}
              min={-500000}
              max={500000}
              step={1000}
            />
            <SliderField
              label="Cambio en gastos"
              value={scenario.expensesChange}
              onChange={(v) => handleChange("expensesChange", v)}
              min={-500000}
              max={500000}
              step={1000}
            />
            <SliderField
              label="Gasto único"
              value={scenario.oneTimeExpense}
              onChange={(v) => handleChange("oneTimeExpense", v)}
              min={0}
              max={500000}
              step={1000}
            />
            <SliderField
              label="Nuevo gasto recurrente/mes"
              value={scenario.newRecurringExpense}
              onChange={(v) => handleChange("newRecurringExpense", v)}
              min={0}
              max={200000}
              step={500}
            />
            <SliderField
              label="Cambio en liquidez"
              value={scenario.liquidityChange}
              onChange={(v) => handleChange("liquidityChange", v)}
              min={-500000}
              max={500000}
              step={1000}
            />
            <SliderField
              label="Cambio en deuda (%)"
              value={scenario.debtChange}
              onChange={(v) => handleChange("debtChange", v)}
              min={-50}
              max={50}
              step={1}
            />
          </div>
        </div>
            </MotionCard>

        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Actual <span className="mx-2">→</span> Proyectado
          </p>
          <StaggerContainer className="space-y-3">
            {metrics.map((m) => (
              <MotionCard key={m.label} hover="none">
                <div className="rounded-card border border-slate-200/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <m.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span className="text-sm text-slate-600 dark:text-zinc-300">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400 dark:text-zinc-500">{m.baseline}</span>
                      <span className="text-slate-300 dark:text-zinc-600">→</span>
                      <span className={cn("font-semibold", m.color ?? "text-slate-800 dark:text-zinc-100")}>{m.projected}</span>
                      <span className={cn("text-xs", getDeltaColor(m.delta, m.invert))}>
                        {m.delta >= 0 ? "↑" : "↓"} {formatARS(Math.abs(Math.round(m.delta)))}
                      </span>
                    </div>
                  </div>
                </div>
              </MotionCard>
            ))}
          </StaggerContainer>
        </div>
      </div>

      <MotionCard hover="none">
        <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-zinc-300">Proyección del score financiero</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400">Actual: {result.baseline.financialScore.total}</span>
              <span className="text-slate-500 dark:text-zinc-400">Proyectado: {result.projected.financialScore.total}</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${result.baseline.financialScore.total}%` }}
              />
              <div
                className="absolute top-0 h-full rounded-full bg-primary/60 transition-all"
                style={{ width: `${result.projected.financialScore.total}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-white shadow-sm"
                style={{ left: `${result.projected.financialScore.total}%` }}
              />
            </div>
          </div>
          <span className={cn("text-2xl font-bold", getScoreColor(result.projected.financialScore.total))}>
            {result.projected.financialScore.total}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
          {(["cashflowScore", "liquidityScore", "debtScore", "savingsScore", "goalScore", "budgetScore"] as const).map((key) => (
            <div key={key} className="rounded-lg bg-slate-50 p-2 dark:bg-white/[0.03]">
              <span className="text-slate-400 dark:text-zinc-500">
                {key === "cashflowScore" ? "Flujo" : key === "liquidityScore" ? "Liquidez" : key === "debtScore" ? "Deuda" : key === "savingsScore" ? "Ahorro" : key === "goalScore" ? "Metas" : "Presupuesto"}
              </span>
              <p className="font-medium text-slate-700 dark:text-zinc-300">
                {result.baseline.financialScore[key]} → {result.projected.financialScore[key]}
              </p>
            </div>
          ))}
        </div>
        </div>
      </MotionCard>
    </PageShell>
    </PageTransition>
  );
}

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function SliderField({ label, value, onChange, min, max, step }: SliderFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500 dark:text-zinc-400">{label}</label>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 dark:text-zinc-500">$</span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-28 rounded-lg border border-slate-200/70 bg-white/75 px-2 py-1 text-right text-xs backdrop-blur-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-white/[0.04]"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400 dark:text-zinc-500">
        <span>{min >= 0 ? `$${(min / 1000).toFixed(0)}k` : `-$${(Math.abs(min) / 1000).toFixed(0)}k`}</span>
        <span>{max >= 0 ? `$${(max / 1000).toFixed(0)}k` : `-$${(Math.abs(max) / 1000).toFixed(0)}k`}</span>
      </div>
    </div>
  );
}
