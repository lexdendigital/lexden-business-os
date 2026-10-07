import { describe, expect, it } from 'vitest';
import { generateBusinessIdeaPlan, generateMarketingContent, parseSaleText } from './index';

describe('generateBusinessIdeaPlan', () => {
  it('always marks output as demo content', () => {
    const plan = generateBusinessIdeaPlan('thrift clothes');
    expect(plan.isDemoContent).toBe(true);
    expect(plan.nameIdeas.length).toBeGreaterThan(0);
  });
});

describe('generateMarketingContent', () => {
  it('includes the product name in generated copy', () => {
    const content = generateMarketingContent('thrift jackets', 'promo');
    expect(content.short.toLowerCase()).toContain('thrift jackets');
    expect(content.isDemoContent).toBe(true);
  });
});

describe('parseSaleText', () => {
  it('extracts customer, item, total and paid from a natural sentence', () => {
    const parsed = parseSaleText('Sold 2 shirts to Chioma for 12000, she paid 7000 and owes 5000');
    expect(parsed.customerName).toBe('Chioma');
    expect(parsed.itemDescription).toBe('2 shirts');
    expect(parsed.totalNaira).toBe(12000);
    expect(parsed.paidNaira).toBe(7000);
  });

  it('falls back to safe defaults when the sentence is unparseable', () => {
    const parsed = parseSaleText('something happened');
    expect(parsed.customerName).toBe('Customer');
    expect(parsed.itemDescription).toBe('Item');
    expect(parsed.totalNaira).toBe(0);
    expect(parsed.paidNaira).toBe(0);
  });
});
