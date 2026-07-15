import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, CreditCard, Target } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { useCalendar, type CalendarEvent } from "@/features/calendar/hooks/useCalendar";
import { cn } from "@/lib/utils";

function formatARS(amount: number): string {
  return `$${Math.round(Math.abs(amount)).toLocaleString("es-AR")}`;
}

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const eventIcons: Record<CalendarEvent["type"], typeof TrendingUp> = {
  transaction_income: TrendingUp,
  transaction_expense: TrendingDown,
  debt_due: CreditCard,
  goal_deadline: Target,
};

const eventColors: Record<CalendarEvent["type"], string> = {
  transaction_income: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/40",
  transaction_expense: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950/40",
  debt_due: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/40",
  goal_deadline: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/40",
};

export function CalendarPage() {
  const now = new Date();
  const [offset, setOffset] = useState(0);
  const m = now.getMonth() + 1 + offset;
  const year = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
  const month = ((m - 1) % 12 + 12) % 12 + 1;

  const { data, isLoading, error } = useCalendar(month, year);

  const goBack = () => setOffset((p) => p - 1);
  const goForward = () => setOffset((p) => Math.min(p + 1, 0));

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const today = new Date();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  if (data) {
    for (const ev of data.events) {
      if (!eventsByDay[ev.day]) eventsByDay[ev.day] = [];
      eventsByDay[ev.day].push(ev);
    }
  }

  if (isLoading) {
    return (
      <PageShell eyebrow="Calendario" title="Cargando..." description="Preparando calendario financiero..." icon={CalendarDays}>
        <div className="rounded-card animate-pulse border border-slate-200/70 bg-white/75 p-6 dark:border-white/10 dark:bg-white/[0.04]" style={{ height: "500px" }} />
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell eyebrow="Calendario" title="Error" description="No se pudieron cargar los eventos." icon={CalendarDays}>
        <div className="rounded-card border border-red-400/30 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-400">
          <p>{(error as Error)?.message ?? "Error desconocido"}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={`${monthNames[month - 1]} ${year}`}
      title="Calendario financiero"
      description="Vencimientos, cuotas y eventos del mes"
      icon={CalendarDays}
    >
      <div className="flex items-center justify-center gap-4">
        <button onClick={goBack} className="rounded-xl border border-slate-200/70 p-2 text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold">{monthNames[month - 1]} {year}</span>
        <button onClick={goForward} disabled={offset >= 0} className="rounded-xl border border-slate-200/70 p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-card border border-slate-200/70 bg-white/75 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        <div className="grid grid-cols-7 gap-px">
          {dayNames.map((d) => (
            <div key={d} className="p-2 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;

            const dayEvents = eventsByDay[day] ?? [];
            const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
            const hasIncome = dayEvents.some((e) => e.type === "transaction_income");
            const hasExpense = dayEvents.some((e) => e.type === "transaction_expense" || e.type === "debt_due");

            return (
              <div
                key={day}
                className={cn(
                  "min-h-[80px] rounded-lg p-1.5 transition-colors",
                  isToday ? "bg-primary/5 ring-1 ring-primary/30" : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday ? "bg-primary text-white" : "text-slate-600 dark:text-zinc-300"
                  )}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 3).map((ev, j) => {
                    const Icon = eventIcons[ev.type];
                    return (
                      <div
                        key={j}
                        className={cn(
                          "flex items-center gap-1 rounded px-1 py-0.5",
                          eventColors[ev.type]
                        )}
                        title={`${ev.label}: ${formatARS(ev.amount)}`}
                      >
                        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                        <span className="truncate text-[10px] leading-tight">{ev.label}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <p className="px-1 text-[10px] text-slate-400 dark:text-zinc-500">+{dayEvents.length - 3} más</p>
                  )}
                </div>
                {hasIncome && hasExpense && (
                  <div className="mt-0.5 flex gap-0.5 px-1">
                    <span className="inline-block h-1 w-1 rounded-full bg-emerald-500" />
                    <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Ingreso
        </span>
        <span className="flex items-center gap-1.5">
          <TrendingDown className="h-3.5 w-3.5 text-red-500" /> Gasto
        </span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-amber-500" /> Vencimiento
        </span>
        <span className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-blue-500" /> Meta
        </span>
      </div>

      <div className="rounded-card border border-slate-200/70 bg-white/75 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-zinc-300">Eventos del mes</h3>
        {data && data.events.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-zinc-500">No hay eventos este mes.</p>
        ) : (
          <div className="space-y-2">
            {data?.events.map((ev, i) => {
              const Icon = eventIcons[ev.type];
              return (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={cn("h-4 w-4 shrink-0", eventColors[ev.type].split(" ")[0])} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{ev.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">Día {ev.day}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "shrink-0 text-xs font-semibold",
                    ev.type === "transaction_income" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {ev.type === "transaction_income" ? "+" : "-"}{formatARS(ev.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
