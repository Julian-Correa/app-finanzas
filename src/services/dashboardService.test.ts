import { describe, it, expect, vi, beforeEach } from "vitest";

const mockProfileId = "profile-001";

const mockOverview = {
  cashflow: {
    income: 150000,
    expenses: 3700,
    cashflow: 146300,
  },
  liquidity: 65000,
  debt_ratio: 3.33,
};

const mockBudgets = [
  { spent_amount: 12000, limit_amount: 30000, status: "on_track" as const },
  { spent_amount: 14000, limit_amount: 15000, status: "critical" as const },
];

const mockGoals = [
  { target_amount: 500000, current_amount: 150000, monthly_target: 25000, status: "active" as const, deadline: "2026-12-31", name: "Vacaciones" },
  { target_amount: 1000000, current_amount: 100000, monthly_target: 50000, status: "active" as const, deadline: "2027-06-30", name: "Auto" },
];

const mockAlerts = [
  { severity: "warning" as const, type: "budget" as const, title: "test", description: "test" },
];

const mocks = vi.hoisted(() => ({
  mockFetchDashboardOverview: vi.fn(),
  mockFetchBudgets: vi.fn(),
  mockFetchGoals: vi.fn(),
  mockFetchAlerts: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchDashboardOverview: mocks.mockFetchDashboardOverview,
  fetchBudgets: mocks.mockFetchBudgets,
  fetchGoals: mocks.mockFetchGoals,
  fetchAlerts: mocks.mockFetchAlerts,
}));

import { getDashboardData } from "./dashboardService";

describe("dashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchDashboardOverview.mockResolvedValue(mockOverview);
    mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
    mocks.mockFetchGoals.mockResolvedValue(mockGoals);
    mocks.mockFetchAlerts.mockResolvedValue(mockAlerts);
  });

  it("should compute full dashboard data", async () => {
    const result = await getDashboardData(mockProfileId, 7, 2026);

    expect(mocks.mockFetchDashboardOverview).toHaveBeenCalledWith(mockProfileId, 7, 2026);
    expect(mocks.mockFetchAlerts).toHaveBeenCalledWith(mockProfileId, 3);
    expect(result.cashflow.income).toBe(150000);
    expect(result.cashflow.expenses).toBe(3700);
    expect(result.cashflow.cashflow).toBe(146300);
    expect(result.liquidity).toBe(65000);
    expect(result.debtRatio).toBe(3.33);
    expect(result.financialScore.total).toBeGreaterThan(0);
    expect(result.alerts.length).toBeGreaterThan(0);
  });

  it("should handle empty data", async () => {
    mocks.mockFetchDashboardOverview.mockResolvedValue({
      cashflow: { income: 0, expenses: 0, cashflow: 0 },
      liquidity: 100,
      debt_ratio: 0,
    });
    mocks.mockFetchBudgets.mockResolvedValue([]);
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
