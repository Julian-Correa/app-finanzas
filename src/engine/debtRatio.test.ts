import { describe, it, expect } from 'vitest';
import { calculateDebtRatio, calculateDebtRatioLevel, calculateTotalDebt } from './debtRatio';

describe('debtRatio engine', () => {
  describe('calculateDebtRatio', () => {
    it('should calculate debt ratio as percentage', () => {
      const payments = [
        { amount: 200, date: '2026-07-10' },
        { amount: 300, date: '2026-07-15' },
      ];
      expect(calculateDebtRatio(payments, 2000, 7, 2026)).toBe(25);
    });

    it('should filter payments by month/year', () => {
      const payments = [
        { amount: 500, date: '2026-07-10' },
        { amount: 500, date: '2026-06-10' },
      ];
      expect(calculateDebtRatio(payments, 2000, 7, 2026)).toBe(25);
    });

    it('should return 0 when income is 0 or negative', () => {
      expect(calculateDebtRatio([{ amount: 100, date: '2026-07-10' }], 0, 7, 2026)).toBe(0);
      expect(calculateDebtRatio([{ amount: 100, date: '2026-07-10' }], -100, 7, 2026)).toBe(0);
    });

    it('should return 0 when no payments match', () => {
      expect(calculateDebtRatio([{ amount: 100, date: '2026-06-10' }], 2000, 7, 2026)).toBe(0);
    });
  });

  describe('calculateDebtRatioLevel', () => {
    it('should return excellent for ratio <= 20', () => {
      expect(calculateDebtRatioLevel(15)).toBe('excellent');
      expect(calculateDebtRatioLevel(20)).toBe('excellent');
    });

    it('should return good for ratio <= 35', () => {
      expect(calculateDebtRatioLevel(25)).toBe('good');
      expect(calculateDebtRatioLevel(35)).toBe('good');
    });

    it('should return warning for ratio <= 50', () => {
      expect(calculateDebtRatioLevel(40)).toBe('warning');
      expect(calculateDebtRatioLevel(50)).toBe('warning');
    });

    it('should return critical for ratio > 50', () => {
      expect(calculateDebtRatioLevel(60)).toBe('critical');
    });
  });

  describe('calculateTotalDebt', () => {
    it('should sum remaining amounts', () => {
      const debts = [
        { remaining_amount: 50000 },
        { remaining_amount: 15000 },
      ];
      expect(calculateTotalDebt(debts)).toBe(65000);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalDebt([])).toBe(0);
    });
  });
});
