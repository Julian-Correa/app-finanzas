import { useRef, useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Wallet, Download } from "lucide-react";
import { Chart, registerables } from "chart.js";

import { PageShell } from "@/components/common/PageShell";
import { MotionCard } from "@/components/common/MotionCard";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { PageTransition } from "@/components/common/PageTransition";
import { SkeletonCard } from "@/components/common/Skeleton";
import { useReports } from "@/features/reports/hooks/useReports";
import { downloadCsv, printAsPdf, type CsvColumn } from "@/services/exportService";
import { useTranslation } from "@/lib/translations";

Chart.register(...registerables);

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatARS(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-AR")}`;
}

export function ReportsPage() {
  const { data, isLoading, error } = useReports(6);
  const [chartPeriods, setChartPeriods] = useState(6);
  const { t, language } = useTranslation();

  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const doughnutCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<Chart | null>(null);
  const doughnutChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);

  const reportQuery = useReports(chartPeriods);
  const reportData = reportQuery.data;

  useEffect(() => {
    if (!reportData || !barCanvasRef.current) return;

    if (barChartRef.current) barChartRef.current.destroy();

    const ctx = barCanvasRef.current.getContext("2d");
    if (!ctx) return;

    const months = reportData.monthlyData.map((d) => `${monthNames[d.month - 1]} ${d.year}`);
    const incomes = reportData.monthlyData.map((d) => d.income);
    const expenses = reportData.monthlyData.map((d) => Math.abs(d.expenses));

    barChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: t("reports.tableIncome"),
            data: incomes,
            backgroundColor: "rgba(22, 163, 74, 0.7)",
            borderColor: "rgb(22, 163, 74)",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: t("reports.tableExpenses"),
            data: expenses,
            backgroundColor: "rgba(220, 38, 38, 0.7)",
            borderColor: "rgb(220, 38, 38)",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 12 }, usePointStyle: true, padding: 16 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatARS(Number(value)),
              font: { size: 11 },
            },
          },
          x: {
            ticks: { font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [reportData]);

  useEffect(() => {
    if (!reportData || !doughnutCanvasRef.current) return;

    if (doughnutChartRef.current) doughnutChartRef.current.destroy();

    const ctx = doughnutCanvasRef.current.getContext("2d");
    if (!ctx) return;

    const topCategories = reportData.categorySummary.slice(0, 8);
    const labels = topCategories.map((c) => c.categoryName);
    const values = topCategories.map((c) => c.total);
    const colors = [
      "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#0ea5e9",
      "#8b5cf6", "#ec4899", "#64748b",
    ];

    doughnutChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: { size: 11 },
              usePointStyle: true,
              padding: 12,
              generateLabels: () => {
                const total = values.reduce((a, b) => a + b, 0);
                return labels.map((label, i) => ({
                  text: `${label} (${total > 0 ? ((values[i] / total) * 100).toFixed(0) : 0}%)`,
                  fillStyle: colors[i],
                  strokeStyle: colors[i],
                  pointStyle: "circle" as const,
                  index: i,
                }));
              },
            },
          },
        },
      },
    });

    return () => {
      if (doughnutChartRef.current) doughnutChartRef.current.destroy();
    };
  }, [reportData]);

  useEffect(() => {
    if (!reportData || !lineCanvasRef.current) return;

    if (lineChartRef.current) lineChartRef.current.destroy();

    const ctx = lineCanvasRef.current.getContext("2d");
    if (!ctx) return;

    const months = reportData.monthlyData.map((d) => `${monthNames[d.month - 1]} ${d.year}`);
    const cashflows = reportData.monthlyData.map((d) => d.cashflow);

    lineChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: t("reports.cashflow"),
            data: cashflows,
            borderColor: "rgb(37, 99, 235)",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: cashflows.map((v) => v >= 0 ? "rgb(22, 163, 74)" : "rgb(220, 38, 38)"),
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 12 }, usePointStyle: true, padding: 16 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatARS(Number(value)),
              font: { size: 11 },
            },
          },
          x: {
            ticks: { font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
    };
  }, [reportData]);

  if (isLoading || reportQuery.isLoading) {
    return (
      <PageShell eyebrow={t("reports.eyebrow")} title={t("dashboard.loading")} description={t("reports.loadingDesc")} icon={BarChart3}>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-[300px] p-6" />
          ))}
        </div>
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell eyebrow={t("reports.eyebrow")} title={t("dashboard.error")} description={t("reports.errorDesc")} icon={BarChart3}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  const lastMonth = data.monthlyData[data.monthlyData.length - 1];
  const prevMonth = data.monthlyData[data.monthlyData.length - 2];

  const cashflowTrend = prevMonth
    ? ((lastMonth.cashflow - prevMonth.cashflow) / Math.abs(prevMonth.cashflow || 1)) * 100
    : 0;

  return (
    <PageTransition>
      <PageShell
        eyebrow={t("reports.eyebrow")}
        title={t("reports.title")}
        description={t("reports.description")}
        icon={BarChart3}
      >
        <div className="flex items-center gap-2">
          {[3, 6, 12].map((p) => (
          <button
            key={p}
            onClick={() => setChartPeriods(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              chartPeriods === p
                ? "bg-primary text-white"
                : "border border-slate-200/70 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]"
            }`}
          >
            {p} {t("reports.months")}
          </button>
        ))}
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-3">
        <MotionCard>
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <TrendingUp className="h-5 w-5 text-emerald-500" aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{t("reports.lastMonthIncome")}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{formatARS(lastMonth.income)}</p>
          </div>
        </MotionCard>
        <MotionCard>
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <TrendingDown className="h-5 w-5 text-red-500" aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{t("reports.lastMonthExpenses")}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{formatARS(Math.abs(lastMonth.expenses))}</p>
          </div>
        </MotionCard>
        <MotionCard>
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <Wallet className={`h-5 w-5 ${lastMonth.cashflow >= 0 ? "text-emerald-500" : "text-red-500"}`} aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{t("reports.cashflow")}</p>
            <p className={`mt-1 text-2xl font-semibold tracking-tight ${lastMonth.cashflow >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {formatARS(lastMonth.cashflow)}
            </p>
            {prevMonth && (
              <p className={`mt-0.5 text-xs ${cashflowTrend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {cashflowTrend >= 0 ? "↑" : "↓"} {Math.abs(cashflowTrend).toFixed(1)}% {t("reports.vsPreviousMonth")}
              </p>
            )}
          </div>
        </MotionCard>
      </StaggerContainer>

      <div className="grid gap-6 lg:grid-cols-2">
        <MotionCard hover="none">
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-zinc-300">{t("reports.chartIncomeVsExpenses")}</h3>
            <div style={{ height: "280px" }}>
              <canvas ref={barCanvasRef} />
            </div>
          </div>
        </MotionCard>

        <MotionCard hover="none">
          <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-zinc-300">{t("reports.chartExpensesByCategory")}</h3>
            <div style={{ height: "280px" }}>
              <canvas ref={doughnutCanvasRef} />
            </div>
          </div>
        </MotionCard>
      </div>

      <MotionCard hover="none">
        <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-zinc-300">{t("reports.chartCashflowTrend")}</h3>
          <div style={{ height: "280px" }}>
            <canvas ref={lineCanvasRef} />
          </div>
        </div>
      </MotionCard>

      <MotionCard hover="none">
        <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t("reports.monthlySummary")}</h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                const exportData = data.monthlyData.map((d) => ({
                  month: `${monthNames[d.month - 1]} ${d.year}`,
                  income: d.income,
                  expenses: Math.abs(d.expenses),
                  cashflow: d.cashflow,
                }));
                const columns: CsvColumn<typeof exportData[number]>[] = [
                  { key: "month", header: "Month" },
                  { key: "income", header: "Income ($)" },
                  { key: "expenses", header: "Expenses ($)" },
                  { key: "cashflow", header: "Cashflow ($)" },
                ];
                downloadCsv(exportData, columns, `reports-monthly-summary.csv`);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200/70 bg-white/50 px-2 py-1 text-[10px] font-medium text-slate-500 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
            >
              <Download className="h-3 w-3" />
              {t("reports.exportCsv")}
            </button>
            <button
              type="button"
              onClick={() => {
                const rows = data.monthlyData.map((d) => {
                  const cfClass = d.cashflow >= 0 ? "text-success" : "text-danger";
                  return `<tr><td>${monthNames[d.month - 1]} ${d.year}</td><td class="text-right">$${Math.round(d.income).toLocaleString("es-AR")}</td><td class="text-right">$${Math.round(Math.abs(d.expenses)).toLocaleString("es-AR")}</td><td class="text-right ${cfClass}">$${Math.round(d.cashflow).toLocaleString("es-AR")}</td></tr>`;
                }).join("");
                printAsPdf(
                  "Monthly Summary",
                  `<h1>${t("reports.monthlySummary")}</h1>
                  <p class="subtitle">${data.monthlyData.length} months</p>
                  <table><thead><tr><th>${t("reports.tableMonth")}</th><th class="text-right">${t("reports.tableIncome")}</th><th class="text-right">${t("reports.tableExpenses")}</th><th class="text-right">${t("reports.tableCashflow")}</th></tr></thead><tbody>${rows}</tbody></table>`
                );
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200/70 bg-white/50 px-2 py-1 text-[10px] font-medium text-slate-500 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:border-white/20"
            >
              <Download className="h-3 w-3" />
              {t("reports.exportPdf")}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/70 text-left text-xs text-slate-500 dark:border-white/10 dark:text-zinc-400">
                <th className="pb-2 pr-4 font-medium">{t("reports.tableMonth")}</th>
                <th className="pb-2 pr-4 font-medium">{t("reports.tableIncome")}</th>
                <th className="pb-2 pr-4 font-medium">{t("reports.tableExpenses")}</th>
                <th className="pb-2 font-medium">{t("reports.tableCashflow")}</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyData.map((d, i) => (
                <tr key={i} className="border-b border-slate-100 text-slate-700 last:border-0 dark:border-white/5 dark:text-zinc-300">
                  <td className="py-2.5 pr-4">{monthNames[d.month - 1]} {d.year}</td>
                  <td className="py-2.5 pr-4 text-emerald-600 dark:text-emerald-400">{formatARS(d.income)}</td>
                  <td className="py-2.5 pr-4 text-red-600 dark:text-red-400">{formatARS(Math.abs(d.expenses))}</td>
                  <td className={`py-2.5 font-medium ${d.cashflow >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {formatARS(d.cashflow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </MotionCard>
    </PageShell>
    </PageTransition>
  );
}
