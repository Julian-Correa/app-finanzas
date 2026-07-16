import { describe, it, expect, vi, beforeEach } from "vitest";

const mockProfileId = "profile-001";

const mockAccounts = [
  { id: "acc-1", current_balance: 50000, is_archived: false },
  { id: "acc-2", current_balance: 15000, is_archived: false },
];

const mockTransactions = [
  { amount: 2500, transaction_type: "expense" as const, date: "2026-07-10" },
  { amount: 150000, transaction_type: "income" as const, date: "2026-07-01" },
  { amount: 1200, transaction_type: "expense" as const, date: "2026-07-15" },
];

const mockBudgets = [
  { spent_amount: 12000, limit_amount: 30000, status: "on_track" as const },
  { spent_amount: 14000, limit_amount: 15000, status: "critical" as const },
];

const mockDebtPayments = [
  { amount: 5000, date: "2026-07-10" },
  { amount: 5000, date: "2026-06-10" },
];

const mockGoals = [
  { target_amount: 500000, current_amount: 150000, monthly_target: 25000, status: "active" as const, deadline: "2026-12-31", name: "Vacaciones" },
  { target_amount: 1000000, current_amount: 100000, monthly_target: 50000, status: "active" as const, deadline: "2027-06-30", name: "Auto" },
];

const mockAlerts = [
  { severity: "warning" as const, type: "budget" as const, title: "test", description: "test" },
];

const mocks = vi.hoisted(() => ({
  mockFetchAccounts: vi.fn(),
  mockFetchTransactions: vi.fn(),
  mockFetchBudgets: vi.fn(),
  mockFetchDebts: vi.fn(),
  mockFetchDebtPayments: vi.fn(),
  mockFetchGoals: vi.fn(),
  mockFetchAlerts: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchAccounts: mocks.mockFetchAccounts,
  fetchTransactions: mocks.mockFetchTransactions,
  fetchBudgets: mocks.mockFetchBudgets,
  fetchDebts: mocks.mockFetchDebts,
  fetchDebtPayments: mocks.mockFetchDebtPayments,
  fetchGoals: mocks.mockFetchGoals,
  fetchAlerts: mocks.mockFetchAlerts,
}));

import { getDashboardData } from "./dashboardService";

describe("dashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
    mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
    mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
    mocks.mockFetchDebts.mockResolvedValue([]);
    mocks.mockFetchDebtPayments.mockResolvedValue(mockDebtPayments);
    mocks.mockFetchGoals.mockResolvedValue(mockGoals);
    mocks.mockFetchAlerts.mockResolvedValue(mockAlerts);
  });

  it("should compute full dashboard data", async () => {
    const result = await getDashboardData(mockProfileId, 7, 2026);

    expect(mocks.mockFetchTransactions).toHaveBeenCalledWith(mockProfileId, 7, 2026);
    expect(result.cashflow.income).toBe(150000);
    expect(result.cashflow.expenses).toBe(3700);
    expect(result.cashflow.cashflow).toBe(146300);
    expect(result.liquidity).toBe(65000);
    expect(result.financialScore.total).toBeGreaterThan(0);
    expect(result.alerts.length).toBeGreaterThan(0);
  });

  it("should handle empty data", async () => {
    mocks.mockFetchAccounts.mockResolvedValue([{ current_balance: 100, is_archived: false }]);
    mocks.mockFetchTransactions.mockResolvedValue([]);
    mocks.mockFetchBudgets.mockResolvedValue([]);
    mocks.mockFetchDebts.mockResolvedValue([]);
    mocks.mockFetchDebtPayments.mockResolvedValue([]);
    mocks.mockFetchGoals.mockResolvedValue([]);
    mocks.mockFetchAlerts.mockResolvedValue([]);

    const result = await getDashboardData(mockProfileId, 7, 2026);

    expect(result.cashflow.income).toBe(0);
    expect(result.cashflow.expenses).toBe(0);
    expect(result.cashflow.cashflow).toBe(0);
    expect(result.liquidity).toBe(100);
    expect(result.alerts).toHaveLength(0);
  });
});
