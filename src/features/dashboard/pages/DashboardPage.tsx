import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Banknote, CalendarClock, LineChart, Wallet, TrendingUp, TrendingDown, PiggyBank, Gauge, Bell, BarChart3 } from "lucide-react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { SkeletonCard } from "@/components/common/Skeleton";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { useDashboard } from "../hooks/useDashboard";
import { calculateCashflowStatus, calculateLiquidityLevel, calculateDebtRatioLevel, calculateSavingsRateLevel, calculateScoreLevel } from "@/engine";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  const now = new Date();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const monthName = monthNames[now.getMonth()];

  if (isLoading) {
    return (
      <PageShell eyebrow="Dashboard" title="Cargando..." description="Obteniendo datos financieros..." icon={LineChart}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="p-6" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell eyebrow="Dashboard" title="Error" description="No se pudieron cargar los datos. Verificá la conexión con Supabase." icon={LineChart}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  const { cashflow, liquidity, debtRatio, financialScore, burnRate, savingsRate, alerts } = data;
  const liquidityLevel = calculateLiquidityLevel(cashflow.expenses <= 0 ? 999 : liquidity / cashflow.expenses);

  return (
    <PageTransition>
      <PageShell
        eyebrow={`${monthName} ${now.getFullYear()}`}
        title="Panel financiero"
        description="Resumen de tu salud financiera"
        icon={LineChart}
      >
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MotionCard>
            <MetricPreview
              icon={TrendingUp}
              label="Ingresos"
              value={<CountUpNumber value={cashflow.income} prefix="ARS " />}
              sub={`${cashflow.expenses > 0 ? `${((cashflow.income / (cashflow.income + cashflow.expenses)) * 100).toFixed(0)}%` : ""}`}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={TrendingDown}
              label="Gastos"
              value={<CountUpNumber value={cashflow.expenses} prefix="ARS " />}
              sub={cashflow.expenses > 0 ? `${((cashflow.expenses / cashflow.income) * 100).toFixed(0)}% de ingresos` : ""}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={Wallet}
              label="Flujo de caja"
              value={<CountUpNumber value={cashflow.cashflow} prefix="ARS " />}
              sub={calculateCashflowStatus(cashflow.cashflow) === "healthy" ? "Positivo ✓" : calculateCashflowStatus(cashflow.cashflow) === "attention" ? "En equilibrio" : "Negativo ⚠"}
              variant={cashflow.cashflow >= 0 ? "positive" : "negative"}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={Banknote}
              label="Efectivo disponible"
              value={<CountUpNumber value={liquidity} prefix="ARS " />}
              sub={liquidityLevel.replace("_", " ")}
            />
          </MotionCard>
        </StaggerContainer>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MotionCard>
            <MetricPreview
              icon={Gauge}
              label="Score financiero"
              value={<><CountUpNumber value={financialScore.total} /> / 100</>}
              sub={calculateScoreLevel(financialScore.total).replace("_", " ")}
              variant={financialScore.total >= 70 ? "positive" : financialScore.total >= 40 ? "warning" : "negative"}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={PiggyBank}
              label="Tasa de ahorro"
              value={<CountUpNumber value={savingsRate} decimals={1} suffix="%" />}
              sub={calculateSavingsRateLevel(savingsRate).replace("_", " ")}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={BarChart3}
              label="Endeudamiento"
              value={<CountUpNumber value={debtRatio} decimals={1} suffix="%" />}
              sub={calculateDebtRatioLevel(debtRatio).replace("_", " ")}
              variant={debtRatio <= 35 ? "positive" : debtRatio <= 50 ? "warning" : "negative"}
            />
          </MotionCard>
          <MotionCard>
            <MetricPreview
              icon={CalendarClock}
              label="Burn rate"
              value={<CountUpNumber value={burnRate} prefix="ARS " />}
              sub="/ día"
            />
          </MotionCard>
        </StaggerContainer>

        <MotionCard hover="none" reveal="scroll">
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
              <BarChart3 className="h-4 w-4" />
              Desglose del score ({financialScore.total}/100)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ScoreBar label="Flujo de caja" score={financialScore.cashflowScore} max={25} color="bg-emerald-500" />
              <ScoreBar label="Liquidez" score={financialScore.liquidityScore} max={20} color="bg-blue-500" />
              <ScoreBar label="Endeudamiento" score={financialScore.debtScore} max={20} color="bg-violet-500" />
              <ScoreBar label="Ahorro" score={financialScore.savingsScore} max={15} color="bg-amber-500" />
              <ScoreBar label="Metas" score={financialScore.goalScore} max={10} color="bg-rose-500" />
              <ScoreBar label="Presupuesto" score={financialScore.budgetScore} max={10} color="bg-cyan-500" />
            </div>
          </div>
        </MotionCard>

        {alerts.length > 0 && (
          <MotionCard hover="none" reveal="scroll">
            <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                <Bell className="h-4 w-4" />
                Alertas ({alerts.length})
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 rounded-lg border p-3 text-sm ${
                      alert.severity === "critical"
                        ? "border-red-400/30 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400"
                        : alert.severity === "high" || alert.severity === "warning"
                          ? "border-amber-400/30 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-400"
                          : "border-blue-400/30 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-950/30 dark:text-blue-400"
                    }`}
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      {alert.description && <p className="mt-0.5 opacity-80">{alert.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionCard>
        )}

        <p className="text-xs text-slate-400 dark:text-zinc-500">
          Los datos se actualizan cada 30 segundos. Configurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env para conectar con Supabase.
        </p>
      </PageShell>
    </PageTransition>
  );
}

interface MetricPreviewProps {
  icon: typeof Banknote;
  label: string;
  value: ReactNode;
  sub?: string;
  variant?: "default" | "positive" | "warning" | "negative";
}

function MetricPreview({ icon: Icon, label, value, sub, variant = "default" }: MetricPreviewProps) {
  const variantStyles = {
    default: "",
    positive: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    negative: "text-red-600 dark:text-red-400",
  };

  return (
    <article className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <Icon className={`h-5 w-5 ${variantStyles[variant] || "text-primary"}`} aria-hidden="true" />
      <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${variantStyles[variant]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400 dark:text-zinc-500">{sub}</p>}
    </article>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
  color: string;
}

function ScoreBar({ label, score, max, color }: ScoreBarProps) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-500 dark:text-zinc-400">{label}</span>
        <span className="font-medium text-slate-700 dark:text-zinc-300">{score}/{max}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

interface CountUpNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function CountUpNumber({ value, decimals = 0, prefix = "", suffix = "" }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 110,
    damping: 24,
    mass: 0.9,
  });
  const [display, setDisplay] = useState(() => formatCountUp(0, decimals, prefix, suffix));

  useEffect(() => {
    if (!isInView) return;
    motionValue.set(value);
  }, [isInView, motionValue, value]);

  useMotionValueEvent(springValue, "change", (latest) => {
    setDisplay(formatCountUp(latest, decimals, prefix, suffix));
  });

  return <span ref={ref}>{display}</span>;
}

function formatCountUp(value: number, decimals: number, prefix: string, suffix: string) {
  const rounded = decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
  return `${prefix}${rounded.toLocaleString("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}
