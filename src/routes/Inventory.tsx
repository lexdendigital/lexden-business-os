import React, { useState } from 'react';
import { useBusinessStore } from '@/state/businessStore';
import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';
import { formatKobo, computeMarginKobo, computeMarginPercent } from '@/lib/format/money';
import { productSchema, safeValidate } from '@/lib/validation/schemas';

export function Inventory() {
  const { products, addProduct } = useBusinessStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  const [sell, setSell] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = safeValidate(productSchema, { name, qty, costPriceNaira: cost, sellPriceNaira: sell });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    addProduct(result.data);
    showToast('Product added');
    setName('');
    setQty('');
    setCost('');
    setSell('');
  }

  return (
    <main className="screen">
      <div className="card">
        <h2>Add a product</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Product name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Campus Thrift Shirt" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <div className="grid grid-2">
            <label className="field">
              <span>Stock quantity</span>
              <input type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="12" />
              {errors.qty && <span className="field-error">{errors.qty}</span>}
            </label>
            <label className="field">
              <span>Cost price (₦)</span>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="2500"
              />
              {errors.costPriceNaira && <span className="field-error">{errors.costPriceNaira}</span>}
            </label>
          </div>
          <label className="field">
            <span>Selling price (₦)</span>
            <input type="number" min="0" value={sell} onChange={(e) => setSell(e.target.value)} placeholder="5000" />
            {errors.sellPriceNaira && <span className="field-error">{errors.sellPriceNaira}</span>}
          </label>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Your stock</h3>
        {products.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No products yet"
            description="Add your first product above to start tracking stock and profit margin."
          />
        ) : (
          products.map((p) => {
            const marginKobo = computeMarginKobo(p.sellPriceKobo, p.costPriceKobo);
            const marginPercent = computeMarginPercent(p.sellPriceKobo, p.costPriceKobo);
            const lowStock = p.qty <= p.lowStockThreshold;
            return (
              <div className="list-item" key={p.id}>
                <div>
                  <b>{p.name}</b>
                  <div className="small" style={{ color: 'var(--muted)' }}>
                    Stock: {p.qty} {lowStock && <span className="badge">Low stock</span>}
                  </div>
                </div>
                <div className="small" style={{ textAlign: 'right' }}>
                  <div>{formatKobo(p.sellPriceKobo)}</div>
                  <div className="stat-green">
                    +{formatKobo(marginKobo)} ({marginPercent}%)
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
