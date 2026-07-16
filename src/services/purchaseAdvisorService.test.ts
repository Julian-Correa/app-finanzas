import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockAccounts, mockTransactions, mockBudgets, mockDebts, mockDebtPayments, mockGoals, mockAlerts } from "./__mocks__/data";

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

const { getPurchaseBaseline, evaluateAdvisedPurchase } = await import("./purchaseAdvisorService");
const { getDashboardData } = await import("./dashboardService");

describe("purchaseAdvisorService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
    mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
    mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
    mocks.mockFetchDebts.mockResolvedValue(mockDebts);
    mocks.mockFetchDebtPayments.mockResolvedValue(mockDebtPayments);
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
