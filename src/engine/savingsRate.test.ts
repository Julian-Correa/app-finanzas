import { describe, it, expect } from 'vitest';
import { calculateSavingsRate, calculateSavingsRateLevel } from './savingsRate';

describe('savingsRate engine', () => {
  describe('calculateSavingsRate', () => {
    it('should calculate correct savings rate', () => {
      expect(calculateSavingsRate(1000, 800)).toBe(20);
      expect(calculateSavingsRate(1000, 900)).toBe(10);
      expect(calculateSavingsRate(1000, 1000)).toBe(0);
      expect(calculateSavingsRate(1000, 1100)).toBe(-10);
    });

    it('should handle zero or negative income', () => {
      expect(calculateSavingsRate(0, 500)).toBe(0);
      expect(calculateSavingsRate(-100, 500)).toBe(0);
    });
  });

  describe('calculateSavingsRateLevel', () => {
    it('should return correct levels', () => {
      expect(calculateSavingsRateLevel(25)).toBe('excellent');
      expect(calculateSavingsRateLevel(20)).toBe('excellent');
      expect(calculateSavingsRateLevel(15)).toBe('good');
      expect(calculateSavingsRateLevel(10)).toBe('good');
      expect(calculateSavingsRateLevel(5)).toBe('attention');
      expect(calculateSavingsRateLevel(0)).toBe('critical');
      expect(calculateSavingsRateLevel(-10)).toBe('critical');
    });
  });
});
