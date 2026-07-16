import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockDebts, mockDebtPayments } from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchDebts: vi.fn(),
  mockFetchDebtPayments: vi.fn(),
  mockCreateDebt: vi.fn(),
  mockUpdateDebt: vi.fn(),
  mockSoftDeleteDebt: vi.fn(),
  mockCreateDebtPayment: vi.fn(),
  mockSoftDeleteDebtPayment: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchDebts: mocks.mockFetchDebts,
  fetchDebtPayments: mocks.mockFetchDebtPayments,
  createDebt: mocks.mockCreateDebt,
  updateDebt: mocks.mockUpdateDebt,
  softDeleteDebt: mocks.mockSoftDeleteDebt,
  createDebtPayment: mocks.mockCreateDebtPayment,
  softDeleteDebtPayment: mocks.mockSoftDeleteDebtPayment,
}));

const { getDebts, addDebt, editDebt, removeDebt, addDebtPayment, removeDebtPayment } = await import("./debtsService");

describe("debtsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDebts", () => {
    it("should fetch debts and their payments", async () => {
      mocks.mockFetchDebts.mockResolvedValue(mockDebts);
      mocks.mockFetchDebtPayments.mockImplementation((debtId: string) =>
        Promise.resolve(mockDebtPayments.filter((dp) => dp.debt_id === debtId))
      );

      const result = await getDebts(mockProfileId);

      expect(mocks.mockFetchDebts).toHaveBeenCalledWith(mockProfileId);
      expect(result).toHaveLength(2);
      expect(result[0].payments).toHaveLength(2);
      expect(result[1].payments).toHaveLength(0);
    });

    it("should return empty array when no debts", async () => {
      mocks.mockFetchDebts.mockResolvedValue([]);
      const result = await getDebts(mockProfileId);
      expect(result).toEqual([]);
    });
  });

  describe("addDebt", () => {
    it("should call createDebt with input", async () => {
      const input = { profile_id: mockProfileId, name: "Nueva deuda", type: "credit_card" as const, total_amount: 50000, remaining_amount: 50000, interest_rate: 40, min_payment: 3000, due_date: "2026-10-01", status: "active" as const, priority: 3, notes: null };
      mocks.mockCreateDebt.mockResolvedValue({ id: "debt-new", ...input });

      const result = await addDebt(input);
      expect(mocks.mockCreateDebt).toHaveBeenCalledWith(input);
      expect(result.id).toBe("debt-new");
    });
  });

  describe("editDebt", () => {
    it("should call updateDebt", async () => {
      mocks.mockUpdateDebt.mockResolvedValue({ id: "debt-1", remaining_amount: 40000 });
      const result = await editDebt("debt-1", { remaining_amount: 40000 });
      expect(mocks.mockUpdateDebt).toHaveBeenCalledWith("debt-1", { remaining_amount: 40000 });
    });
  });

  describe("removeDebt", () => {
    it("should call softDeleteDebt", async () => {
      await removeDebt("debt-1");
      expect(mocks.mockSoftDeleteDebt).toHaveBeenCalledWith("debt-1");
    });
  });

  describe("addDebtPayment", () => {
    it("should call createDebtPayment", async () => {
      const input = { debt_id: "debt-1", amount: 5000, date: "2026-08-01", notes: null };
      mocks.mockCreateDebtPayment.mockResolvedValue({ id: "dp-new", ...input });
      await addDebtPayment(input, "debt-1");
      expect(mocks.mockCreateDebtPayment).toHaveBeenCalledWith(input);
    });
  });

  describe("removeDebtPayment", () => {
    it("should call softDeleteDebtPayment", async () => {
      await removeDebtPayment("dp-1");
      expect(mocks.mockSoftDeleteDebtPayment).toHaveBeenCalledWith("dp-1");
    });
  });
});
