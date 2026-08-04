import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/app/providers/ProfileProvider";
import {
  fetchTransactions,
  fetchDebts,
  fetchGoals,
  fetchCategories,
} from "@/supabase/queries";

export interface CalendarEvent {
  date: string;
  day: number;
  type: "transaction_income" | "transaction_expense" | "debt_due" | "goal_deadline";
  label: string;
  amount: number;
}

export function useCalendar(month: number, year: number) {
  const { currentProfile } = useProfile();

  const profileId = currentProfile === "ambos"
    ? undefined
    : currentProfile === "julian"
      ? "11111111-1111-4111-8111-111111111111"
      : "22222222-2222-4222-8222-222222222222";

  const query = useQuery({
    queryKey: ["calendar", profileId, month, year],
    queryFn: async () => {
      const [transactions, debts, goals, categories] = await Promise.all([
        fetchTransactions(profileId, month, year),
        fetchDebts(profileId),
        fetchGoals(profileId),
        fetchCategories(),
      ]);

      const catMap = new Map(categories.map((c) => [c.id, c]));
      const events: CalendarEvent[] = [];

      for (const t of transactions) {
        events.push({
          date: t.date,
          day: new Date(t.date).getDate(),
          type: t.transaction_type === "income" ? "transaction_income" : "transaction_expense",
          label: t.description,
          amount: Number(t.amount),
        });
      }

      for (const d of debts) {
        if (d.due_day && d.status === "active") {
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d.due_day).padStart(2, "0")}`;
          events.push({
            date: dateStr,
            day: d.due_day,
            type: "debt_due",
            label: d.name,
            amount: Number(d.installment_amount),
          });
        }
      }

      for (const g of goals) {
        if (g.deadline) {
          const d = new Date(g.deadline);
          if (d.getMonth() + 1 === month && d.getFullYear() === year) {
            events.push({
              date: g.deadline,
              day: d.getDate(),
              type: "goal_deadline",
              label: `Meta: ${g.name}`,
              amount: Number(g.target_amount),
            });
          }
        }
      }

      events.sort((a, b) => a.day - b.day);

      return { events, transactions, categoryMap: catMap };
    },
    enabled: true,
  });

  return query;
}
