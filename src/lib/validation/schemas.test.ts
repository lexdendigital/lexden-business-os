import { describe, expect, it } from 'vitest';
import { onboardingSchema, productSchema, saleSchema, safeValidate } from './schemas';

describe('safeValidate', () => {
  it('returns success for valid onboarding input', () => {
    const result = safeValidate(onboardingSchema, {
      fullName: 'Chioma Okafor',
      businessName: "Chioma's Thrift Corner",
      businessType: 'Fashion',
      goal: 'Make More Sales',
    });
    expect(result.success).toBe(true);
  });

  it('returns field-level errors for invalid onboarding input', () => {
    const result = safeValidate(onboardingSchema, {
      fullName: 'C',
      businessName: '',
      businessType: 'Fashion',
      goal: 'Make More Sales',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.fullName).toBeTruthy();
      expect(result.errors.businessName).toBeTruthy();
    }
  });

  it('rejects negative product prices', () => {
    const result = safeValidate(productSchema, {
      name: 'Shirt',
      qty: 10,
      costPriceNaira: -100,
      sellPriceNaira: 5000,
    });
    expect(result.success).toBe(false);
  });

  it('coerces numeric strings for sale input', () => {
    const result = safeValidate(saleSchema, {
      customerName: 'Chioma',
      itemDescription: '2 shirts',
      totalNaira: '12000',
      paidNaira: '7000',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalNaira).toBe(12000);
    }
  });
});
