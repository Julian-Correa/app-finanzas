import { describe, it, expect } from 'vitest';
import { calculateBurnRate, calculateMonthlyPrediction } from './burnRate';

describe('burnRate engine', () => {
  describe('calculateBurnRate', () => {
    it('should compute daily burn rate', () => {
      expect(calculateBurnRate(30000, 30)).toBe(1000);
    });

    it('should return 0 when daysElapsed is 0 or negative', () => {
      expect(calculateBurnRate(1000, 0)).toBe(0);
      expect(calculateBurnRate(1000, -5)).toBe(0);
    });

    it('should handle fractional burn rate', () => {
      expect(calculateBurnRate(1000, 3)).toBeCloseTo(333.33);
    });
  });

  describe('calculateMonthlyPrediction', () => {
    it('should compute prediction for a past month (full month data)', () => {
      const result = calculateMonthlyPrediction(30000, 50000, 1, 2025);
      expect(result.daysElapsed).toBe(31);
      expect(result.daysRemaining).toBe(0);
      expect(result.projectedExpenses).toBe(29999.94);
      expect(result.projectedBalance).toBe(20000.06);
    });

    it('should compute burnRate from given parameters', () => {
      const result = calculateMonthlyPrediction(15000, 20000, 1, 2025);
      expect(result.burnRate).toBeCloseTo(483.87, 1);
    });
  });
});
