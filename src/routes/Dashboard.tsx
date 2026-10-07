import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessStore } from '@/state/businessStore';
import { formatKobo } from '@/lib/format/money';
import { MetricCard } from '@/components/common/MetricCard';
import { EmptyState } from '@/components/common/EmptyState';

export function Dashboard() {
  const navigate = useNavigate();
  const { business, products, sales, metrics } = useBusinessStore();

  const nextAction = !sales.length
    ? "Record your first sale - it's the fastest way to see your dashboard come alive."
    : metrics.lowStockCount > 0
      ? `${metrics.lowStockCount} product(s) are running low - plan a restock.`
      : metrics.moneyOwedKobo > 0
        ? `₦${(metrics.moneyOwedKobo / 100).toLocaleString()} is still owed to you - follow up with customers.`
        : 'Post a WhatsApp promo today to bring in new buyers.';

  return (
    <main className="screen">
      <div className="hero">
        <div className="eyebrow">{business?.type}</div>
        <h1>{business?.name}</h1>
        <p>Track. Sell. Grow.</p>
      </div>

      <div className="grid grid-2">
        <MetricCard label="Total Collected" value={formatKobo(metrics.todaySalesKobo)} />
        <MetricCard label="Profit Estimate" value={formatKobo(metrics.profitEstimateKobo)} />
        <MetricCard label="Money Owed" value={formatKobo(metrics.moneyOwedKobo)} />
        <MetricCard label="Low Stock" value={String(metrics.lowStockCount)} />
      </div>

      <div className="card">
        <div className="section-title">Quick Actions</div>
        <div className="quick">
          <button onClick={() => navigate('/grow')}>
            <span className="icon" aria-hidden="true">
              🚀
            </span>
            Idea
          </button>
          <button onClick={() => navigate('/sales')}>
            <span className="icon" aria-hidden="true">
              💰
            </span>
            Sale
          </button>
          <button onClick={() => navigate('/grow')}>
            <span className="icon" aria-hidden="true">
              📢
            </span>
            Promo
          </button>
          <button onClick={() => navigate('/grow')}>
            <span className="icon" aria-hidden="true">
              🧠
            </span>
            Coach
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">What should I do next?</div>
        <p className="sub" style={{ marginBottom: 0 }}>
          {nextAction}
        </p>
      </div>

      {!products.length && !sales.length && (
        <div className="card">
          <EmptyState
            icon="📊"
            title="Your dashboard is empty for now"
            description="Add a product and record a sale to start seeing real numbers here."
            actionLabel="Add your first product"
            onAction={() => navigate('/inventory')}
          />
        </div>
      )}
    </main>
  );
}
