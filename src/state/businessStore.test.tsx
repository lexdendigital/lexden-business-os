import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BusinessStoreProvider, useBusinessStore } from './businessStore';

function wrapper({ children }: { children: React.ReactNode }) {
  return <BusinessStoreProvider>{children}</BusinessStoreProvider>;
}

describe('useBusinessStore', () => {
  it('creates a business and records a sale with a deterministic balance', () => {
    const { result } = renderHook(() => useBusinessStore(), { wrapper });

    act(() => {
      result.current.createBusiness({ name: 'Test Biz', type: 'Fashion', goal: 'Make More Sales' });
    });

    act(() => {
      result.current.recordSale({
        customerName: 'Chioma',
        itemDescription: '2 shirts',
        totalNaira: 12000,
        paidNaira: 7000,
      });
    });

    expect(result.current.sales).toHaveLength(1);
    expect(result.current.sales[0].balanceKobo).toBe(500000);
    expect(result.current.customers).toHaveLength(1);
    expect(result.current.customers[0].totalOwedKobo).toBe(500000);
    expect(result.current.metrics.moneyOwedKobo).toBe(500000);
    expect(result.current.metrics.todaySalesKobo).toBe(700000);
  });

  it('flags low stock products', () => {
    const { result } = renderHook(() => useBusinessStore(), { wrapper });

    act(() => {
      result.current.createBusiness({ name: 'Test Biz', type: 'Fashion', goal: 'Make More Sales' });
    });

    act(() => {
      result.current.addProduct({ name: 'Shirt', qty: 2, costPriceNaira: 2000, sellPriceNaira: 5000 });
    });

    expect(result.current.metrics.lowStockCount).toBe(1);
  });
});
