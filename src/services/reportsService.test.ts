import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockTransactions, mockCategories } from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchTransactions: vi.fn(),
  mockFetchCategories: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchTransactions: mocks.mockFetchTransactions,
  fetchCategories: mocks.mockFetchCategories,
}));

const { getMonthlyReports, getCategoryExpenses } = await import("./reportsService");

describe("reportsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockFetchCategories.mockResolvedValue(mockCategories);
  });

  describe("getMonthlyReports", () => {
    it("should aggregate monthly data across months", async () => {
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);

      const result = await getMonthlyReports(mockProfileId, 2);

      expect(mocks.mockFetchTransactions).toHaveBeenCalledTimes(2);
      expect(result.monthlyData).toHaveLength(2);
      expect(result.categorySummary.length).toBeGreaterThan(0);
    });
  });

  describe("getCategoryExpenses", () => {
    it("should aggregate expenses by category for a given month", async () => {
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);

      const result = await getCategoryExpenses(mockProfileId, 7, 2026);

      expect(result).toHaveLength(2);
      const comida = result.find((c: { name: string }) => c.name === "Comida");
      expect(comida?.total).toBe(2500);
    });

    it("should return empty when no expenses match", async () => {
      mocks.mockFetchTransactions.mockResolvedValue([]);
      const result = await getCategoryExpenses(mockProfileId, 1, 2025);
      expect(result).toEqual([]);
    });
  });
});
