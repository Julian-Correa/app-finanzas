import { describe, it, expect } from 'vitest';
import { calculateFinancialScore, calculateScoreLevel } from './financialScore';

describe('financialScore engine', () => {
  describe('calculateFinancialScore', () => {
    it('should compute maximum score when all metrics are perfect', () => {
      const result = calculateFinancialScore({
        cashflow: 1000,
        liquidity: 5000,
        monthlyExpenses: 2000,
        debtRatio: 10,
        income: 5000,
        budgetDiscipline: 10,
        goalProgressScore: 10,
      });
      expect(result.cashflowScore).toBe(25);
      expect(result.liquidityScore).toBe(20);
      expect(result.debtScore).toBe(20);
      expect(result.budgetScore).toBe(10);
      expect(result.goalScore).toBe(10);
      expect(result.total).toBe(100);
    });

    it('should apply cashflow scoring correctly', () => {
      const positive = calculateFinancialScore({ cashflow: 100, liquidity: 1000, monthlyExpenses: 500, debtRatio: 10, income: 1000, budgetDiscipline: 10, goalProgressScore: 0 });
      expect(positive.cashflowScore).toBe(25);

      const zero = calculateFinancialScore({ cashflow: 0, liquidity: 1000, monthlyExpenses: 500, debtRatio: 10, income: 1000, budgetDiscipline: 10, goalProgressScore: 0 });
      expect(zero.cashflowScore).toBe(12);

      const negative = calculateFinancialScore({ cashflow: -100, liquidity: 1000, monthlyExpenses: 500, debtRatio: 10, income: 1000, budgetDiscipline: 10, goalProgressScore: 0 });
      expect(negative.cashflowScore).toBe(0);
    });

    it('should clamp total between 0 and 100', () => {
      const low = calculateFinancialScore({ cashflow: -100, liquidity: 0, monthlyExpenses: 500, debtRatio: 80, income: 0, budgetDiscipline: 0, goalProgressScore: 0 });
      expect(low.total).toBe(0);

      const high = calculateFinancialScore({ cashflow: 1000, liquidity: 5000, monthlyExpenses: 1000, debtRatio: 5, income: 3000, budgetDiscipline: 10, goalProgressScore: 10 });
      expect(high.total).toBe(100);
    });

    it('should handle no monthly expenses for liquidity', () => {
      const result = calculateFinancialScore({ cashflow: 500, liquidity: 0, monthlyExpenses: 0, debtRatio: 10, income: 2000, budgetDiscipline: 10, goalProgressScore: 0 });
      expect(result.liquidityScore).toBe(20);
    });
  });

  describe('calculateScoreLevel', () => {
    it('should return excellent for score >= 90', () => {
      expect(calculateScoreLevel(95)).toBe('excellent');
      expect(calculateScoreLevel(90)).toBe('excellent');
    });

    it('should return good for score >= 70', () => {
      expect(calculateScoreLevel(80)).toBe('good');
      expect(calculateScoreLevel(70)).toBe('good');
    });

    it('should return warning for score >= 40', () => {
      expect(calculateScoreLevel(55)).toBe('warning');
      expect(calculateScoreLevel(40)).toBe('warning');
    });

    it('should return critical for score < 40', () => {
      expect(calculateScoreLevel(30)).toBe('critical');
      expect(calculateScoreLevel(0)).toBe('critical');
    });
  });
});
