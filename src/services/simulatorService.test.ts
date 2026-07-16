import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockBudgets, mockGoals, mockAlerts } from "./__mocks__/data";

const mockOverview = {
  cashflow: {
    income: 150000,
    expenses: 3700,
    cashflow: 146300,
  },
  liquidity: 65000,
  debt_ratio: 3.33,
};

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

const { getSimulatorBaseline, runSimulation } = await import("./simulatorService");
const { getDashboardData } = await import("./dashboardService");

describe("simulatorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchDashboardOverview.mockResolvedValue(mockOverview);
    mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
    mocks.mockFetchGoals.mockResolvedValue(mockGoals);
    mocks.mockFetchAlerts.mockResolvedValue(mockAlerts);
  });

  describe("getSimulatorBaseline", () => {
    it("should fetch dashboard data as baseline", async () => {
      const baseline = await getSimulatorBaseline(mockProfileId);

      expect(baseline.cashflow).toBeDefined();
      expect(baseline.financialScore).toBeDefined();
      expect(baseline.liquidity).toBe(65000);
    });
  });

  describe("runSimulation", () => {
    it("should compute projected values from scenario changes", async () => {
      const dashboard = await getDashboardData(mockProfileId, 7, 2026);
      const baseline = {
        cashflow: dashboard.cashflow,
        financialScore: dashboard.financialScore,
        liquidity: dashboard.liquidity,
        debtRatio: dashboard.debtRatio,
        burnRate: dashboard.burnRate,
        savingsRate: dashboard.savingsRate,
      };

      const result = runSimulation(baseline, {
        label: "Test",
        incomeChange: 50000,
        expensesChange: 10000,
        oneTimeExpense: 0,
        newRecurringExpense: 0,
        liquidityChange: 0,
        debtChange: 0,
      });

      expect(result.projected.cashflow.income).toBe(200000);
      expect(result.differences.cashflowDelta).toBeGreaterThan(0);
    });
  });
});
