import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBusinessStore } from '@/state/businessStore';
import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';
import { formatKobo } from '@/lib/format/money';
import { parseSaleText } from '@/lib/agent';
import { freeTextSaleParseSchema, saleSchema, safeValidate } from '@/lib/validation/schemas';

export function Sales() {
  const { sales, recordSale } = useBusinessStore();
  const { showToast } = useToast();

  const [quickText, setQuickText] = useState('');
  const [quickError, setQuickError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [totalNaira, setTotalNaira] = useState('');
  const [paidNaira, setPaidNaira] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleQuickParse(e: React.FormEvent) {
    e.preventDefault();
    const result = safeValidate(freeTextSaleParseSchema, { text: quickText });
    if (!result.success) {
      setQuickError(result.errors.text || 'Enter a short description of the sale');
      return;
    }
    setQuickError('');
    const parsed = parseSaleText(quickText);
    recordSale({
      customerName: parsed.customerName,
      itemDescription: parsed.itemDescription,
      totalNaira: parsed.totalNaira,
      paidNaira: parsed.paidNaira,
    });
    showToast('Sale saved');
    setQuickText('');
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = safeValidate(saleSchema, { customerName, itemDescription, totalNaira, paidNaira });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    recordSale(result.data);
    showToast('Sale saved');
    setCustomerName('');
    setItemDescription('');
    setTotalNaira('');
    setPaidNaira('');
  }

  return (
    <main className="screen">
      <div className="card">
        <h2>Record a sale</h2>
        <p className="sub">Type it naturally, or use the form below.</p>

        <form onSubmit={handleQuickParse} noValidate>
          <label className="field">
            <span>Quick entry</span>
            <textarea
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              placeholder="Sold 2 shirts to Chioma for 12000, she paid 7000"
            />
            {quickError && <span className="field-error">{quickError}</span>}
          </label>
          <button type="submit" className="btn btn-secondary">
            Parse &amp; Save
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Or fill the form</h3>
        <form onSubmit={handleFormSubmit} noValidate>
          <label className="field">
            <span>Customer name</span>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Chioma" />
            {errors.customerName && <span className="field-error">{errors.customerName}</span>}
          </label>
          <label className="field">
            <span>What did they buy?</span>
            <input
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="e.g. 2 shirts"
            />
            {errors.itemDescription && <span className="field-error">{errors.itemDescription}</span>}
          </label>
          <div className="grid grid-2">
            <label className="field">
              <span>Total price (₦)</span>
              <input
                type="number"
                min="0"
                value={totalNaira}
                onChange={(e) => setTotalNaira(e.target.value)}
                placeholder="12000"
              />
              {errors.totalNaira && <span className="field-error">{errors.totalNaira}</span>}
            </label>
            <label className="field">
              <span>Amount paid (₦)</span>
              <input
                type="number"
                min="0"
                value={paidNaira}
                onChange={(e) => setPaidNaira(e.target.value)}
                placeholder="7000"
              />
              {errors.paidNaira && <span className="field-error">{errors.paidNaira}</span>}
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Sale
          </button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ margin: 0 }}>Transactions</h3>
          <Link to="/customers" className="small">
            View customers →
          </Link>
        </div>

        {sales.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="No sales yet"
            description="Record your first sale above - it will show up here instantly."
          />
        ) : (
          sales.map((s) => (
            <div className="list-item" key={s.id}>
              <div>
                <b>{s.customerName}</b>
                <div className="small" style={{ color: 'var(--muted)' }}>
                  {s.itemDescription} · {formatKobo(s.totalKobo)}
                </div>
              </div>
              <span className={s.balanceKobo > 0 ? 'stat-red' : 'stat-green'}>
                {s.balanceKobo > 0 ? `Owes ${formatKobo(s.balanceKobo)}` : 'Paid'}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
