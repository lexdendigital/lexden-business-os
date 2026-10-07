import React from 'react';
import { useBusinessStore } from '@/state/businessStore';
import { useToast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';
import { formatKobo } from '@/lib/format/money';

export function Customers() {
  const { customers } = useBusinessStore();
  const { showToast } = useToast();

  function copyReminder(name: string) {
    const text = `Hello ${name}, kindly remember your outstanding balance with us. Thank you for your patronage!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast('Reminder copied'));
    } else {
      showToast('Copy not supported on this device');
    }
  }

  return (
    <main className="screen">
      <div className="card">
        <h2>Customers</h2>
        <p className="sub">Built automatically from your recorded sales.</p>

        {customers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No customers yet"
            description="Record a sale with a customer name and they'll appear here automatically."
          />
        ) : (
          customers.map((c) => (
            <div className="card" key={c.id} style={{ boxShadow: 'none' }}>
              <b>{c.name}</b>
              <p className="sub" style={{ margin: '4px 0 10px' }}>
                Money owed: <span className={c.totalOwedKobo > 0 ? 'stat-red' : 'stat-green'}>{formatKobo(c.totalOwedKobo)}</span>
              </p>
              {c.totalOwedKobo > 0 && (
                <button className="btn btn-outline btn-sm" onClick={() => copyReminder(c.name)}>
                  Copy reminder message
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
