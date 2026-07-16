import { describe, it, expect } from 'vitest';
import { evaluatePurchase } from './purchaseAdvisor';

describe('purchaseAdvisor engine', () => {
  const goodParams = {
    price: 500,
    availableCash: 5000,
    cashflow: 2000,
    income: 5000,
    expenses: 3000,
    liquidity: 10000,
    monthlyExpenses: 3000,
    debtRatio: 10,
    budgetUsage: 30,
    financialScore: 85,
    emergencyFund: 10000,
  };

  it('should recommend yes for affordable purchase', () => {
    const result = evaluatePurchase(goodParams);
    expect(result.decision).toBe('yes');
    expect(result.risk).toBe('low');
  });

  it('should recommend no when purchase causes negative cashflow', () => {
    const params = { ...goodParams, cashflow: 200, price: 1000, installments: 1 };
    const result = evaluatePurchase(params);
    expect(result.decision).toBe('no');
    expect(result.risk).toBe('high');
  });

  it('should recommend wait when debt impact is high', () => {
    const params = { ...goodParams, debtRatio: 45, income: 2000, price: 2000 };
    const result = evaluatePurchase(params);
    expect(result.decision).toBe('wait');
    expect(result.risk).toBe('medium');
  });

  it('should recommend no when purchase consumes emergency fund and causes negative cashflow', () => {
    const params = { ...goodParams, price: 15000, emergencyFund: 10000, cashflow: 2000 };
    const result = evaluatePurchase(params);
    expect(result.decision).toBe('no');
    expect(result.risk).toBe('high');
  });

  it('should include reasons for the decision', () => {
    const result = evaluatePurchase(goodParams);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('should return numeric impacts', () => {
    const result = evaluatePurchase(goodParams);
    expect(typeof result.cashflowImpact).toBe('number');
    expect(typeof result.budgetImpact).toBe('number');
    expect(typeof result.debtImpact).toBe('number');
    expect(typeof result.financialScoreImpact).toBe('number');
    expect(typeof result.goalDelay).toBe('number');
  });

  it('should recommend wait when installment price exceeds available cash', () => {
    const params = { ...goodParams, price: 12000, installments: 12 };
    const result = evaluatePurchase(params);
    expect(result.decision).toBe('wait');
    expect(result.risk).toBe('medium');
  });
});
