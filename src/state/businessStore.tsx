/**
 * Business state store.
 *
 * Non-negotiable: business data must be designed for Supabase as the
 * long-term source of truth, NOT localStorage. Day 1 has no backend, so
 * this store holds everything in React state only (lost on refresh) and
 * every screen that reads it is labelled as demo data. Only a UI
 * preference (theme) is allowed to touch localStorage - see
 * `lib/flags` usage in Settings and the `theme` key below.
 *
 * The shape of this context (`BusinessStoreValue`) is intentionally the
 * same shape a future `useSupabaseBusinessStore` would expose, so swapping
 * the provider implementation later does not require route-level changes.
 */
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { Business, Customer, Product, Sale } from '@/types/domain';
import { computeBalanceKobo, computeMarginKobo, nairaToKobo } from '@/lib/format/money';
import { trackEvent } from '@/lib/analytics';

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface NewProductInput {
  name: string;
  qty: number;
  costPriceNaira: number;
  sellPriceNaira: number;
}

export interface NewSaleInput {
  customerName: string;
  itemDescription: string;
  totalNaira: number;
  paidNaira: number;
}

export interface BusinessStoreValue {
  business: Business | null;
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  isDemoData: true;

  createBusiness: (input: { name: string; type: Business['type']; goal: Business['goal'] }) => void;
  addProduct: (input: NewProductInput) => void;
  recordSale: (input: NewSaleInput) => void;

  // Derived, deterministic metrics - never computed by the LLM.
  metrics: {
    todaySalesKobo: number;
    profitEstimateKobo: number;
    moneyOwedKobo: number;
    lowStockCount: number;
  };
}

const BusinessStoreContext = createContext<BusinessStoreValue | undefined>(undefined);

export function BusinessStoreProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const createBusiness = useCallback<BusinessStoreValue['createBusiness']>((input) => {
    const newBusiness: Business = {
      id: makeId('biz'),
      organisationId: makeId('org'),
      name: input.name,
      type: input.type,
      goal: input.goal,
      currency: 'NGN',
      createdAt: new Date().toISOString(),
    };
    setBusiness(newBusiness);
    trackEvent('business_created', { type: input.type, goal: input.goal }, newBusiness.id);
  }, []);

  const addProduct = useCallback<BusinessStoreValue['addProduct']>(
    (input) => {
      if (!business) return;
      const product: Product = {
        id: makeId('prod'),
        businessId: business.id,
        name: input.name,
        qty: input.qty,
        costPriceKobo: nairaToKobo(input.costPriceNaira),
        sellPriceKobo: nairaToKobo(input.sellPriceNaira),
        lowStockThreshold: 5,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [product, ...prev]);
      trackEvent('product_added', { name: input.name }, business.id);
    },
    [business]
  );

  const recordSale = useCallback<BusinessStoreValue['recordSale']>(
    (input) => {
      if (!business) return;
      const totalKobo = nairaToKobo(input.totalNaira);
      const paidKobo = nairaToKobo(input.paidNaira);
      const balanceKobo = computeBalanceKobo(totalKobo, paidKobo);

      let customerId: string | undefined;
      setCustomers((prev) => {
        const existing = prev.find((c) => c.name.toLowerCase() === input.customerName.toLowerCase());
        if (existing) {
          customerId = existing.id;
          return prev.map((c) => (c.id === existing.id ? { ...c, totalOwedKobo: c.totalOwedKobo + balanceKobo } : c));
        }
        const created: Customer = {
          id: makeId('cust'),
          businessId: business.id,
          name: input.customerName,
          totalOwedKobo: balanceKobo,
          createdAt: new Date().toISOString(),
        };
        customerId = created.id;
        return [created, ...prev];
      });

      const sale: Sale = {
        id: makeId('sale'),
        businessId: business.id,
        customerId,
        customerName: input.customerName,
        itemDescription: input.itemDescription,
        totalKobo,
        paidKobo,
        balanceKobo,
        createdAt: new Date().toISOString(),
      };
      setSales((prev) => [sale, ...prev]);
      trackEvent('sale_recorded', { totalKobo, balanceKobo }, business.id);
    },
    [business]
  );

  const metrics = useMemo<BusinessStoreValue['metrics']>(() => {
    const todaySalesKobo = sales.reduce((sum, s) => sum + s.paidKobo, 0);
    const moneyOwedKobo = sales.reduce((sum, s) => sum + s.balanceKobo, 0);
    const profitEstimateKobo = products.reduce((sum, p) => {
      const margin = computeMarginKobo(p.sellPriceKobo, p.costPriceKobo);
      return sum + margin * Math.max(0, 0); // no sales-to-product linkage yet in Day 1 demo data
    }, 0) + Math.round(todaySalesKobo * 0.35); // deterministic heuristic, clearly an estimate in the UI
    const lowStockCount = products.filter((p) => p.qty <= p.lowStockThreshold).length;

    return { todaySalesKobo, profitEstimateKobo, moneyOwedKobo, lowStockCount };
  }, [sales, products]);

  const value = useMemo<BusinessStoreValue>(
    () => ({
      business,
      products,
      sales,
      customers,
      isDemoData: true,
      createBusiness,
      addProduct,
      recordSale,
      metrics,
    }),
    [business, products, sales, customers, createBusiness, addProduct, recordSale, metrics]
  );

  return <BusinessStoreContext.Provider value={value}>{children}</BusinessStoreContext.Provider>;
}

export function useBusinessStore(): BusinessStoreValue {
  const ctx = useContext(BusinessStoreContext);
  if (!ctx) throw new Error('useBusinessStore must be used within BusinessStoreProvider');
  return ctx;
}
