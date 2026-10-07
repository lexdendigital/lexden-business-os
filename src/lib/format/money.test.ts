import { describe, expect, it } from 'vitest';
import {
  nairaToKobo,
  koboToNaira,
  formatKobo,
  formatNaira,
  sumKobo,
  computeBalanceKobo,
  computeMarginKobo,
  computeMarginPercent,
} from './money';

describe('money', () => {
  it('converts naira to kobo without float drift', () => {
    expect(nairaToKobo(12000)).toBe(1200000);
    expect(nairaToKobo(99.99)).toBe(9999);
  });

  it('converts kobo back to naira', () => {
    expect(koboToNaira(1200000)).toBe(12000);
  });

  it('formats kobo as a localized NGN string', () => {
    expect(formatKobo(1200000)).toContain('12,000');
    expect(formatKobo(1200000)).toContain('₦');
  });

  it('formats naira directly', () => {
    expect(formatNaira(5000)).toContain('5,000');
  });

  it('handles non-finite input defensively', () => {
    expect(formatKobo(NaN)).toContain('0');
    expect(nairaToKobo(NaN)).toBe(0);
  });

  it('sums an array of kobo amounts', () => {
    expect(sumKobo([100, 200, 300])).toBe(600);
  });

  it('computes balance as total minus paid, never negative', () => {
    expect(computeBalanceKobo(1200000, 700000)).toBe(500000);
    expect(computeBalanceKobo(500000, 900000)).toBe(0);
  });

  it('computes margin and margin percent', () => {
    expect(computeMarginKobo(500000, 250000)).toBe(250000);
    expect(computeMarginPercent(500000, 250000)).toBe(50);
    expect(computeMarginPercent(0, 250000)).toBe(0);
  });
});
