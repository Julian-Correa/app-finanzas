import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockProfileId, mockGoals, mockGoalContributions } from "./__mocks__/data";

const mocks = vi.hoisted(() => ({
  mockFetchGoals: vi.fn(),
  mockFetchGoalContributions: vi.fn(),
  mockCreateGoal: vi.fn(),
  mockUpdateGoal: vi.fn(),
  mockSoftDeleteGoal: vi.fn(),
  mockCreateGoalContribution: vi.fn(),
}));

vi.mock("@/supabase/queries", () => ({
  fetchGoals: mocks.mockFetchGoals,
  fetchGoalContributions: mocks.mockFetchGoalContributions,
  createGoal: mocks.mockCreateGoal,
  updateGoal: mocks.mockUpdateGoal,
  softDeleteGoal: mocks.mockSoftDeleteGoal,
  createGoalContribution: mocks.mockCreateGoalContribution,
}));

const { getGoals, addGoal, editGoal, removeGoal, addGoalContribution } = await import("./goalsService");

describe("goalsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGoals", () => {
    it("should fetch goals with contributions and computed fields", async () => {
      mocks.mockFetchGoals.mockResolvedValue(mockGoals);
      mocks.mockFetchGoalContributions.mockImplementation((goalId: string) =>
        Promise.resolve(mockGoalContributions.filter((gc) => gc.goal_id === goalId))
      );

      const result = await getGoals(mockProfileId);

      expect(mocks.mockFetchGoals).toHaveBeenCalledWith(mockProfileId);
      expect(result).toHaveLength(2);
      expect(result[0].contributions).toHaveLength(1);
      expect(result[0].progress).toBe(30);
      expect(result[0].eta).toBe(14);
    });
  });

  describe("addGoal", () => {
    it("should call createGoal with input", async () => {
      const input = { profile_id: mockProfileId, name: "Nueva meta", target_amount: 100000, current_amount: 0, monthly_target: 10000, status: "active" as const, priority: 3, deadline: null, notes: null };
      mocks.mockCreateGoal.mockResolvedValue({ id: "goal-new", ...input });

      const result = await addGoal(input);
      expect(mocks.mockCreateGoal).toHaveBeenCalledWith(input);
    });
  });

  describe("editGoal", () => {
    it("should call updateGoal", async () => {
      mocks.mockUpdateGoal.mockResolvedValue({ id: "goal-1", monthly_target: 30000 });
      const result = await editGoal("goal-1", { monthly_target: 30000 });
      expect(mocks.mockUpdateGoal).toHaveBeenCalledWith("goal-1", { monthly_target: 30000 });
    });
  });

  describe("removeGoal", () => {
    it("should call softDeleteGoal", async () => {
      await removeGoal("goal-1");
      expect(mocks.mockSoftDeleteGoal).toHaveBeenCalledWith("goal-1");
    });
  });

  describe("addGoalContribution", () => {
    it("should call createGoalContribution", async () => {
      const input = { goal_id: "goal-1", amount: 10000, date: "2026-08-01", notes: null };
      mocks.mockCreateGoalContribution.mockResolvedValue({ id: "gc-new", ...input });
      await addGoalContribution(input);
      expect(mocks.mockCreateGoalContribution).toHaveBeenCalledWith(input);
    });
  });
});
