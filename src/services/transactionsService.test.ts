import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockTransactions, mockCategories, mockAccounts } from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchTransactions: vi.fn(),
  mockFetchCategories: vi.fn(),
  mockFetchAccounts: vi.fn(),
  mockCreateTransaction: vi.fn(),
  mockUpdateTransaction: vi.fn(),
  mockSoftDeleteTransaction: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchTransactions: mocks.mockFetchTransactions,
  fetchCategories: mocks.mockFetchCategories,
  fetchAccounts: mocks.mockFetchAccounts,
  createTransaction: mocks.mockCreateTransaction,
  updateTransaction: mocks.mockUpdateTransaction,
  softDeleteTransaction: mocks.mockSoftDeleteTransaction,
}));

const { getTransactions, addTransaction, editTransaction, removeTransaction } = await import("./transactionsService");

describe("transactionsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("should fetch and enrich transactions with category and account", async () => {
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
      mocks.mockFetchCategories.mockResolvedValue(mockCategories);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);

      const result = await getTransactions(mockProfileId, 7, 2026);

      expect(mocks.mockFetchTransactions).toHaveBeenCalledWith(mockProfileId, 7, 2026);
      expect(result.transactions).toHaveLength(3);
      expect(result.transactions[0].category?.name).toBe("Comida");
      expect(result.transactions[0].account?.name).toBe("Banco Nación");
    });

    it("should handle missing category gracefully", async () => {
      mocks.mockFetchTransactions.mockResolvedValue([{ ...mockTransactions[0], category_id: "nonexistent" }]);
      mocks.mockFetchCategories.mockResolvedValue(mockCategories);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);

      const result = await getTransactions(mockProfileId);
      expect(result.transactions[0].category).toBeNull();
    });
  });

  describe("addTransaction", () => {
    it("should call createTransaction with input", async () => {
      const input = { profile_id: mockProfileId, account_id: "acc-1", category_id: "cat-1", transaction_type: "expense" as const, amount: 100, description: "Test", date: "2026-07-20", is_recurring: false, recurring_frequency: null, notes: null };
      mocks.mockCreateTransaction.mockResolvedValue({ id: "tx-new", ...input });

      const result = await addTransaction(input);
      expect(mocks.mockCreateTransaction).toHaveBeenCalledWith(input);
      expect(result.id).toBe("tx-new");
    });
  });

  describe("editTransaction", () => {
    it("should call updateTransaction with id and updates", async () => {
      mocks.mockUpdateTransaction.mockResolvedValue({ id: "tx-1", amount: 3000 });

      const result = await editTransaction("tx-1", { amount: 3000 });
      expect(mocks.mockUpdateTransaction).toHaveBeenCalledWith("tx-1", { amount: 3000 });
      expect(result.amount).toBe(3000);
    });
  });

  describe("removeTransaction", () => {
    it("should call softDeleteTransaction with id", async () => {
      await removeTransaction("tx-1");
      expect(mocks.mockSoftDeleteTransaction).toHaveBeenCalledWith("tx-1");
    });
  });
});
