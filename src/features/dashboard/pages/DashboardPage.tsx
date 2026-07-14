import { AlertTriangle, Banknote, CalendarClock, LineChart, ShieldCheck, Wallet } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

const dashboardCards = [
  { title: "Financial Health", description: "Score, risk status and explanation will be calculated by the financial engine." },
  { title: "Cash Flow", description: "Income, expenses and monthly balance will update after every mutation." },
  { title: "Upcoming Bills", description: "Debts, subscriptions and recurring payments will appear here." },
  { title: "Goal Progress", description: "Emergency fund, baby, Edesur and payoff goals will be tracked here." },
  { title: "Alerts", description: "Critical and warning alerts will surface financial risks instantly." },
  { title: "Charts", description: "Category, income, debt and cash flow charts will be powered by Chart.js." },
];

export function DashboardPage() {
  return (
    <PageShell
      eyebrow="Dashboard"
      title="Your financial operating system"
      description="Phase 1 establishes the production app shell. Financial widgets are intentionally placeholders until the database and deterministic engine are implemented."
      icon={LineChart}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map((card) => (
          <PlaceholderCard key={card.title} title={card.title} description={card.description} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricPreview icon={Banknote} label="Income" value="ARS 0.00" />
        <MetricPreview icon={Wallet} label="Available Cash" value="ARS 0.00" />
        <MetricPreview icon={ShieldCheck} label="Health Score" value="0 / 100" />
        <MetricPreview icon={CalendarClock} label="Upcoming" value="0 bills" />
      </div>

      <div className="rounded-card border border-warning/30 bg-warning/10 p-5 text-warning dark:bg-warning/15">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6">
            Supabase is scaffolded, but the authentication/RLS model must be approved before database implementation.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

interface MetricPreviewProps {
  icon: typeof Banknote;
  label: string;
  value: string;
}

function MetricPreview({ icon: Icon, label, value }: MetricPreviewProps) {
  return (
    <article className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
