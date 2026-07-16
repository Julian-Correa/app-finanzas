import { describe, it, expect } from 'vitest';
import { calculateGoalEta, calculateGoalProgress, calculateGoalScore } from './goalEta';

describe('goalEta engine', () => {
  describe('calculateGoalEta', () => {
    it('should return 0 for completed goals', () => {
      const goal = { target_amount: 10000, current_amount: 10000, monthly_target: 500, status: 'completed' as const };
      expect(calculateGoalEta(goal)).toBe(0);
    });

    it('should return null when monthly_target is 0 or negative', () => {
      const goal = { target_amount: 10000, current_amount: 5000, monthly_target: 0, status: 'active' as const };
      expect(calculateGoalEta(goal)).toBeNull();
    });

    it('should return 0 when remaining <= 0', () => {
      const goal = { target_amount: 5000, current_amount: 6000, monthly_target: 500, status: 'active' as const };
      expect(calculateGoalEta(goal)).toBe(0);
    });

    it('should compute months remaining (rounded up)', () => {
      const goal = { target_amount: 10000, current_amount: 2500, monthly_target: 500, status: 'active' as const };
      expect(calculateGoalEta(goal)).toBe(15);
    });

    it('should handle exact remaining months', () => {
      const goal = { target_amount: 10000, current_amount: 5000, monthly_target: 500, status: 'active' as const };
      expect(calculateGoalEta(goal)).toBe(10);
    });
  });

  describe('calculateGoalProgress', () => {
    it('should compute percentage', () => {
      expect(calculateGoalProgress(5000, 10000)).toBe(50);
    });

    it('should return 0 when target is 0 or negative', () => {
      expect(calculateGoalProgress(100, 0)).toBe(0);
      expect(calculateGoalProgress(100, -100)).toBe(0);
    });

    it('should allow progress over 100%', () => {
      expect(calculateGoalProgress(1200, 1000)).toBe(120);
    });
  });

  describe('calculateGoalScore', () => {
    it('should compute average progress score (capped at 100 * 0.1)', () => {
      const goals = [
        { target_amount: 10000, current_amount: 5000 },
        { target_amount: 5000, current_amount: 5000 },
      ];
      expect(calculateGoalScore(goals)).toBe(7.5);
    });

    it('should return 0 for empty goals array', () => {
      expect(calculateGoalScore([])).toBe(0);
    });

    it('should cap at 100% progress per goal', () => {
      const goals = [
        { target_amount: 1000, current_amount: 2000 },
      ];
      expect(calculateGoalScore(goals)).toBe(10);
    });
  });
});
