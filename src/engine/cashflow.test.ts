import { describe, it, expect } from 'vitest';
import { calculateCashflow, calculateCashflowStatus } from './cashflow';

describe('cashflow engine', () => {
  const transactions = [
    { amount: 1000, transaction_type: 'income' as const, date: '2026-07-10' },
    { amount: 500, transaction_type: 'expense' as const, date: '2026-07-15' },
    { amount: 300, transaction_type: 'expense' as const, date: '2026-07-20' },
    { amount: 2000, transaction_type: 'income' as const, date: '2026-06-01' },
  ];

  describe('calculateCashflow', () => {
    it('should filter by month/year and sum income/expenses', () => {
      const result = calculateCashflow(transactions, 7, 2026);
      expect(result.income).toBe(1000);
      expect(result.expenses).toBe(800);
      expect(result.cashflow).toBe(200);
    });

    it('should return zeros when no transactions match', () => {
      const result = calculateCashflow(transactions, 1, 2025);
      expect(result.income).toBe(0);
      expect(result.expenses).toBe(0);
      expect(result.cashflow).toBe(0);
    });

    it('should handle empty transactions array', () => {
      const result = calculateCashflow([], 7, 2026);
      expect(result.income).toBe(0);
      expect(result.expenses).toBe(0);
      expect(result.cashflow).toBe(0);
    });
  });

  describe('calculateCashflowStatus', () => {
    it('should return healthy for positive cashflow', () => {
      expect(calculateCashflowStatus(100)).toBe('healthy');
    });

    it('should return attention for zero cashflow', () => {
      expect(calculateCashflowStatus(0)).toBe('attention');
    });

    it('should return critical for negative cashflow', () => {
      expect(calculateCashflowStatus(-50)).toBe('critical');
    });
  });
});
