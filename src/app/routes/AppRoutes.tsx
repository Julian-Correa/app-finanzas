import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { BudgetsPage } from "@/features/budgets/pages/BudgetsPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { DebtsPage } from "@/features/debts/pages/DebtsPage";
import { GoalsPage } from "@/features/goals/pages/GoalsPage";
import { HistoryPage } from "@/features/history/pages/HistoryPage";
import { PurchaseAdvisorPage } from "@/features/purchase-advisor/pages/PurchaseAdvisorPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { SimulatorPage } from "@/features/simulator/pages/SimulatorPage";
import { TimelinePage } from "@/features/timeline/pages/TimelinePage";
import { TransactionsPage } from "@/features/transactions/pages/TransactionsPage";

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
