import { describe, it, expect } from 'vitest';
import { calculateLiquidity, calculateLiquidityRatio, calculateLiquidityLevel } from './liquidity';

describe('liquidity engine', () => {
  describe('calculateLiquidity', () => {
    it('should sum non-archived account balances', () => {
      const accounts = [
        { current_balance: 1000, is_archived: false },
        { current_balance: 500, is_archived: false },
        { current_balance: 300, is_archived: true },
      ];
      expect(calculateLiquidity(accounts)).toBe(1500);
    });

    it('should return 0 for empty accounts', () => {
      expect(calculateLiquidity([])).toBe(0);
    });

    it('should return 0 when all accounts are archived', () => {
      const accounts = [
        { current_balance: 1000, is_archived: true },
      ];
      expect(calculateLiquidity(accounts)).toBe(0);
    });
  });

  describe('calculateLiquidityRatio', () => {
    it('should calculate ratio correctly', () => {
      expect(calculateLiquidityRatio(3000, 1500)).toBe(2);
    });

    it('should return 999 when monthly expenses are 0', () => {
      expect(calculateLiquidityRatio(1000, 0)).toBe(999);
    });

    it('should return 0 when monthly expenses are negative', () => {
      expect(calculateLiquidityRatio(1000, -100)).toBe(0);
    });

    it('should handle fractional ratios', () => {
      expect(calculateLiquidityRatio(1500, 2000)).toBe(0.75);
    });
  });

  describe('calculateLiquidityLevel', () => {
    it('should return excellent for ratio >= 1', () => {
      expect(calculateLiquidityLevel(1)).toBe('excellent');
      expect(calculateLiquidityLevel(3)).toBe('excellent');
    });

    it('should return attention for ratio >= 0.5', () => {
      expect(calculateLiquidityLevel(0.75)).toBe('attention');
      expect(calculateLiquidityLevel(0.5)).toBe('attention');
    });

    it('should return critical for ratio < 0.5', () => {
      expect(calculateLiquidityLevel(0.25)).toBe('critical');
      expect(calculateLiquidityLevel(0)).toBe('critical');
    });
  });
});
