import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";

const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const TransactionsPage = lazy(() =>
  import("@/features/transactions/pages/TransactionsPage").then((m) => ({ default: m.TransactionsPage }))
);
const BudgetsPage = lazy(() =>
  import("@/features/budgets/pages/BudgetsPage").then((m) => ({ default: m.BudgetsPage }))
);
const DebtsPage = lazy(() =>
  import("@/features/debts/pages/DebtsPage").then((m) => ({ default: m.DebtsPage }))
);
const GoalsPage = lazy(() =>
  import("@/features/goals/pages/GoalsPage").then((m) => ({ default: m.GoalsPage }))
);
const TimelinePage = lazy(() =>
  import("@/features/timeline/pages/TimelinePage").then((m) => ({ default: m.TimelinePage }))
);
const CalendarPage = lazy(() =>
  import("@/features/calendar/pages/CalendarPage").then((m) => ({ default: m.CalendarPage }))
);
const ReportsPage = lazy(() =>
  import("@/features/reports/pages/ReportsPage").then((m) => ({ default: m.ReportsPage }))
);
const SimulatorPage = lazy(() =>
  import("@/features/simulator/pages/SimulatorPage").then((m) => ({ default: m.SimulatorPage }))
);
const PurchaseAdvisorPage = lazy(() =>
  import("@/features/purchase-advisor/pages/PurchaseAdvisorPage").then((m) => ({ default: m.PurchaseAdvisorPage }))
);
const HistoryPage = lazy(() =>
  import("@/features/history/pages/HistoryPage").then((m) => ({ default: m.HistoryPage }))
);
const SettingsPage = lazy(() =>
  import("@/features/settings/pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="debts" element={<DebtsPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="purchase-advisor" element={<PurchaseAdvisorPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
