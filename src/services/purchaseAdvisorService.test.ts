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

const { getPurchaseBaseline, evaluateAdvisedPurchase } = await import("./purchaseAdvisorService");
const { getDashboardData } = await import("./dashboardService");

describe("purchaseAdvisorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchDashboardOverview.mockResolvedValue(mockOverview);
    mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
    mocks.mockFetchGoals.mockResolvedValue(mockGoals);
    mocks.mockFetchAlerts.mockResolvedValue(mockAlerts);
  });

  describe("getPurchaseBaseline", () => {
    it("should fetch current dashboard data", async () => {
      const baseline = await getPurchaseBaseline(mockProfileId);
      expect(baseline.cashflow).toBeDefined();
      expect(baseline.liquidity).toBeGreaterThan(0);
    });
  });

  describe("evaluateAdvisedPurchase", () => {
    it("should evaluate a purchase decision", async () => {
      const dashboard = await getDashboardData(mockProfileId, 7, 2026);
      const result = evaluateAdvisedPurchase(dashboard, 50000, 6);

      expect(result.decision).toMatch(/^(yes|wait|no)$/);
      expect(result.risk).toMatch(/^(low|medium|high)$/);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });
});
