import { describe, it, expect } from 'vitest';
import { calculateProjectedExpenses, calculateProjectedIncome, calculateMonthlyPrediction } from './predictions';

describe('predictions engine', () => {
  describe('calculateProjectedExpenses', () => {
    it('should project full month expenses based on burn rate', () => {
      expect(calculateProjectedExpenses(15000, 15, 30)).toBe(30000);
    });

    it('should return 0 when daysElapsed is 0 or negative', () => {
      expect(calculateProjectedExpenses(1000, 0, 30)).toBe(0);
      expect(calculateProjectedExpenses(1000, -5, 30)).toBe(0);
    });
  });

  describe('calculateProjectedIncome', () => {
    it('should project full month income based on daily rate', () => {
      expect(calculateProjectedIncome(10000, 10, 30)).toBe(30000);
    });

    it('should return 0 when daysElapsed is 0 or negative', () => {
      expect(calculateProjectedIncome(1000, 0, 30)).toBe(0);
      expect(calculateProjectedIncome(1000, -5, 30)).toBe(0);
    });
  });

  describe('calculateMonthlyPrediction', () => {
    it('should generate prediction data for past month', () => {
      const transactions = [
        { amount: 50000, transaction_type: 'income' as const, date: '2026-01-05' },
        { amount: 10000, transaction_type: 'expense' as const, date: '2026-01-10' },
        { amount: 5000, transaction_type: 'expense' as const, date: '2026-01-15' },
      ];
      const result = calculateMonthlyPrediction(transactions, 1, 2026);
      expect(result.projectedIncome).toBe(50000);
      expect(result.projectedExpenses).toBe(15000);
      expect(result.projectedCashflow).toBe(35000);
    });

    it('should return zeros when no transactions match', () => {
      const result = calculateMonthlyPrediction([], 7, 2026);
      expect(result.projectedIncome).toBe(0);
      expect(result.projectedExpenses).toBe(0);
      expect(result.projectedCashflow).toBe(0);
    });
  });
});
