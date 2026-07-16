import { describe, it, expect } from 'vitest';
import { calculateBudgetUsage, calculateBudgetStatus, calculateBudgetDiscipline } from './budgetUsage';

describe('budgetUsage engine', () => {
  describe('calculateBudgetUsage', () => {
    it('should calculate usage as percentage', () => {
      expect(calculateBudgetUsage(500, 1000)).toBe(50);
    });

    it('should return 0 when limit is 0 or negative', () => {
      expect(calculateBudgetUsage(100, 0)).toBe(0);
      expect(calculateBudgetUsage(100, -100)).toBe(0);
    });

    it('should handle values over 100%', () => {
      expect(calculateBudgetUsage(1200, 1000)).toBe(120);
    });
  });

  describe('calculateBudgetStatus', () => {
    it('should return on_track for usage < 50', () => {
      expect(calculateBudgetStatus(30)).toBe('on_track');
      expect(calculateBudgetStatus(49)).toBe('on_track');
    });

    it('should return warning for usage >= 50', () => {
      expect(calculateBudgetStatus(50)).toBe('warning');
      expect(calculateBudgetStatus(60)).toBe('warning');
    });

    it('should return high for usage >= 75', () => {
      expect(calculateBudgetStatus(75)).toBe('high');
      expect(calculateBudgetStatus(80)).toBe('high');
    });

    it('should return critical for usage >= 90', () => {
      expect(calculateBudgetStatus(90)).toBe('critical');
      expect(calculateBudgetStatus(95)).toBe('critical');
    });

    it('should return exceeded for usage >= 100', () => {
      expect(calculateBudgetStatus(100)).toBe('exceeded');
      expect(calculateBudgetStatus(150)).toBe('exceeded');
    });
  });

  describe('calculateBudgetDiscipline', () => {
    it('should return 10 when avg usage <= 50', () => {
      const budgets = [
        { spent_amount: 300, limit_amount: 1000 },
        { spent_amount: 500, limit_amount: 1000 },
      ];
      expect(calculateBudgetDiscipline(budgets)).toBe(10);
    });

    it('should return 7 when avg usage <= 75', () => {
      const budgets = [
        { spent_amount: 700, limit_amount: 1000 },
        { spent_amount: 600, limit_amount: 1000 },
      ];
      expect(calculateBudgetDiscipline(budgets)).toBe(7);
    });

    it('should return 4 when avg usage <= 90', () => {
      const budgets = [
        { spent_amount: 850, limit_amount: 1000 },
        { spent_amount: 800, limit_amount: 1000 },
      ];
      expect(calculateBudgetDiscipline(budgets)).toBe(4);
    });

    it('should return 2 when avg usage <= 100', () => {
      const budgets = [
        { spent_amount: 990, limit_amount: 1000 },
        { spent_amount: 900, limit_amount: 1000 },
      ];
      expect(calculateBudgetDiscipline(budgets)).toBe(2);
    });

    it('should return 0 when avg usage > 100', () => {
      const budgets = [
        { spent_amount: 1200, limit_amount: 1000 },
        { spent_amount: 1100, limit_amount: 1000 },
      ];
      expect(calculateBudgetDiscipline(budgets)).toBe(0);
    });

    it('should return 100 for empty budgets array', () => {
      expect(calculateBudgetDiscipline([])).toBe(100);
    });
  });
});
