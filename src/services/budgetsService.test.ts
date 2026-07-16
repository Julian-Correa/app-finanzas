import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockBudgets, mockCategories } from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchBudgets: vi.fn(),
  mockFetchCategories: vi.fn(),
  mockCreateBudget: vi.fn(),
  mockUpdateBudget: vi.fn(),
  mockSoftDeleteBudget: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchBudgets: mocks.mockFetchBudgets,
  fetchCategories: mocks.mockFetchCategories,
  createBudget: mocks.mockCreateBudget,
  updateBudget: mocks.mockUpdateBudget,
  softDeleteBudget: mocks.mockSoftDeleteBudget,
}));

const { getBudgets, addBudget, editBudget, removeBudget } = await import("./budgetsService");

describe("budgetsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBudgets", () => {
    it("should fetch budgets, enrich with category, and compute usage", async () => {
      mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
      mocks.mockFetchCategories.mockResolvedValue(mockCategories);

      const result = await getBudgets(mockProfileId, 7, 2026);

      expect(mocks.mockFetchBudgets).toHaveBeenCalledWith(mockProfileId, 7, 2026);
      expect(result.budgets).toHaveLength(2);
      expect(result.budgets[0].category?.name).toBe("Comida");
      expect(result.categories.every((c: { type: string }) => c.type === "expense")).toBe(true);
    });
  });

  describe("addBudget", () => {
    it("should create budget with default spent_amount and status", async () => {
      const input = { profile_id: mockProfileId, category_id: "cat-1", month: 7, year: 2026, limit_amount: 20000 };
      mocks.mockCreateBudget.mockResolvedValue({ id: "bud-new", ...input, spent_amount: 0, remaining_amount: 20000, status: "on_track" });

      const result = await addBudget(input);
      expect(mocks.mockCreateBudget).toHaveBeenCalledWith({ ...input, spent_amount: 0, remaining_amount: 20000, status: "on_track" });
      expect(result.status).toBe("on_track");
    });
  });

  describe("editBudget", () => {
    it("should call updateBudget", async () => {
      mocks.mockUpdateBudget.mockResolvedValue({ id: "bud-1", limit_amount: 35000 });
      const result = await editBudget("bud-1", { limit_amount: 35000 });
      expect(mocks.mockUpdateBudget).toHaveBeenCalledWith("bud-1", { limit_amount: 35000 });
    });
  });

  describe("removeBudget", () => {
    it("should call softDeleteBudget", async () => {
      await removeBudget("bud-1");
      expect(mocks.mockSoftDeleteBudget).toHaveBeenCalledWith("bud-1");
    });
  });
});
