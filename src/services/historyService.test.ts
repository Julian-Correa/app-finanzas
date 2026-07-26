import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mockProfileId,
  mockTransactions,
  mockAccounts,
  mockDebts,
  mockGoals,
  mockBudgets,
} from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchSnapshots: vi.fn(),
  mockFetchTransactions: vi.fn(),
  mockFetchAccounts: vi.fn(),
  mockFetchDebts: vi.fn(),
  mockFetchGoals: vi.fn(),
  mockFetchBudgets: vi.fn(),
  mockInsertSnapshotIfAbsent: vi.fn(),
  mockFetchSnapshot: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchSnapshots: mocks.mockFetchSnapshots,
  fetchTransactions: mocks.mockFetchTransactions,
  fetchAccounts: mocks.mockFetchAccounts,
  fetchDebts: mocks.mockFetchDebts,
  fetchGoals: mocks.mockFetchGoals,
  fetchBudgets: mocks.mockFetchBudgets,
  insertSnapshotIfAbsent: mocks.mockInsertSnapshotIfAbsent,
  fetchSnapshot: mocks.mockFetchSnapshot,
}));

const {
  getHistorySnapshots,
  computeSnapshot,
  saveSnapshot,
  diffSnapshots,
  toSnapshotData,
} = await import("./historyService");

const baseRow = {
  id: "snap-1",
  profile_id: mockProfileId,
  month: 7,
  year: 2026,
  income: 150000,
  expenses: 3700,
  cashflow: 146300,
  debt: 195000,
  savings: 146300,
  financial_score: 72,
  json_snapshot: { transactions: 3, accounts: 2, debts: 2, goals: 2, budgets: 2 },
  created_at: "2026-07-31T23:59:59Z",
  updated_at: "2026-07-31T23:59:59Z",
  deleted_at: null,
  created_by_profile_id: null,
  updated_by_profile_id: null,
};

describe("historyService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getHistorySnapshots", () => {
    it("returns persisted snapshots without computing live fallback", async () => {
      mocks.mockFetchSnapshots.mockResolvedValue([baseRow]);

      const result = await getHistorySnapshots(mockProfileId);

      expect(mocks.mockFetchSnapshots).toHaveBeenCalledWith(mockProfileId);
      expect(mocks.mockFetchTransactions).not.toHaveBeenCalled();
      expect(result.snapshots).toHaveLength(1);
      expect(result.snapshots[0].income).toBe(150000);
      expect(result.snapshots[0].jsonSnapshot).toEqual({
        transactions: 3,
        accounts: 2,
        debts: 2,
        goals: 2,
        budgets: 2,
      });
      expect(result.monthsWithData).toEqual([{ month: 7, year: 2026 }]);
    });

    it("returns empty list when no snapshots persisted (no live fallback)", async () => {
      mocks.mockFetchSnapshots.mockResolvedValue([]);

      const result = await getHistorySnapshots(mockProfileId);

      expect(result.snapshots).toEqual([]);
      expect(result.monthsWithData).toEqual([]);
      expect(mocks.mockFetchTransactions).not.toHaveBeenCalled();
    });

    it("coerces missing json_snapshot fields to zeros", async () => {
      mocks.mockFetchSnapshots.mockResolvedValue([{ ...baseRow, json_snapshot: {} }]);

      const result = await getHistorySnapshots(mockProfileId);

      expect(result.snapshots[0].jsonSnapshot).toEqual({
        transactions: 0,
        accounts: 0,
        debts: 0,
        goals: 0,
        budgets: 0,
      });
    });
  });

  describe("computeSnapshot", () => {
    it("aggregates engine calculations from fetched data", async () => {
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
      mocks.mockFetchDebts.mockResolvedValue(mockDebts);
      mocks.mockFetchGoals.mockResolvedValue(mockGoals);
      mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);

      const snapshot = await computeSnapshot(mockProfileId, 7, 2026);

      expect(mocks.mockFetchTransactions).toHaveBeenCalledWith(mockProfileId, 7, 2026);
      expect(snapshot.month).toBe(7);
      expect(snapshot.year).toBe(2026);
      expect(snapshot.income).toBe(150000);
      expect(snapshot.expenses).toBe(3700);
      expect(snapshot.cashflow).toBe(146300);
      expect(snapshot.jsonSnapshot).toEqual({
        transactions: 3,
        accounts: 2,
        debts: 2,
        goals: 2,
        budgets: 2,
      });
      expect((snapshot as Record<string, unknown>).id).toBeUndefined();
      expect((snapshot as Record<string, unknown>).createdAt).toBeUndefined();
    });
  });

  describe("saveSnapshot", () => {
    it("returns already_exists when snapshot exists for period", async () => {
      mocks.mockFetchSnapshot.mockResolvedValue(baseRow);

      const outcome = await saveSnapshot(mockProfileId, 7, 2026);

      expect(mocks.mockFetchSnapshot).toHaveBeenCalledWith(mockProfileId, 7, 2026);
      expect(mocks.mockInsertSnapshotIfAbsent).not.toHaveBeenCalled();
      expect(outcome.status).toBe("already_exists");
      expect(outcome.snapshot.id).toBe("snap-1");
    });

    it("creates a new snapshot when none exists", async () => {
      mocks.mockFetchSnapshot.mockReset();
      mocks.mockFetchSnapshot.mockResolvedValue(null);
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
      mocks.mockFetchDebts.mockResolvedValue(mockDebts);
      mocks.mockFetchGoals.mockResolvedValue(mockGoals);
      mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
      mocks.mockInsertSnapshotIfAbsent.mockResolvedValue(baseRow);

      const outcome = await saveSnapshot(mockProfileId, 7, 2026);

      expect(mocks.mockInsertSnapshotIfAbsent).toHaveBeenCalledTimes(1);
      expect(outcome.status).toBe("created");
      expect(outcome.snapshot.id).toBe("snap-1");
    });

    it("returns already_exists when concurrent insert happened", async () => {
      mocks.mockFetchSnapshot.mockReset();
      mocks.mockFetchSnapshot
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(baseRow);
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
      mocks.mockFetchDebts.mockResolvedValue(mockDebts);
      mocks.mockFetchGoals.mockResolvedValue(mockGoals);
      mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
      mocks.mockInsertSnapshotIfAbsent.mockResolvedValue(null);

      const outcome = await saveSnapshot(mockProfileId, 7, 2026);

      expect(outcome.status).toBe("already_exists");
      expect(outcome.snapshot.id).toBe("snap-1");
    });

    it("throws when insert returns null and no concurrent snapshot found", async () => {
      mocks.mockFetchSnapshot.mockReset();
      mocks.mockFetchSnapshot.mockResolvedValue(null);
      mocks.mockFetchTransactions.mockResolvedValue(mockTransactions);
      mocks.mockFetchAccounts.mockResolvedValue(mockAccounts);
      mocks.mockFetchDebts.mockResolvedValue(mockDebts);
      mocks.mockFetchGoals.mockResolvedValue(mockGoals);
      mocks.mockFetchBudgets.mockResolvedValue(mockBudgets);
      mocks.mockInsertSnapshotIfAbsent.mockResolvedValue(null);

      await expect(saveSnapshot(mockProfileId, 7, 2026)).rejects.toThrow(
        /Snapshot insert returned null/
      );
    });
  });

  describe("diffSnapshots", () => {
    it("computes target - baseline for all metrics", () => {
      const a = toSnapshotData(baseRow);
      const b = toSnapshotData({
        ...baseRow,
        income: 160000,
        expenses: 4000,
        cashflow: 156000,
        debt: 180000,
        savings: 156000,
        financial_score: 80,
      });

      const diff = diffSnapshots(a, b);

      expect(diff).toEqual({
        income: 10000,
        expenses: 300,
        cashflow: 9700,
        debt: -15000,
        savings: 9700,
        financialScore: 8,
      });
    });
  });
});
