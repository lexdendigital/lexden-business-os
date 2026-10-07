import React, { useState } from 'react';
import { useTheme } from '@/lib/flags/theme';
import { getDefaultFlags, isProUnlocked } from '@/lib/flags';
import { useBusinessStore } from '@/state/businessStore';
import { useToast } from '@/components/common/Toast';
import { isDemoMode } from '@/lib/api';

export function Settings() {
  const [theme, toggleTheme] = useTheme();
  const { business, products, sales, customers } = useBusinessStore();
  const { showToast } = useToast();
  const [flags] = useState(getDefaultFlags());

  function exportData() {
    const payload = { business, products, sales, customers, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lexden-forge-demo-data.json';
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Exported');
  }

  return (
    <main className="screen">
      <div className="card">
        <h2>Settings</h2>

        <div className="list-item">
          <span>Theme</span>
          <button className="btn btn-outline btn-sm" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        <div className="list-item">
          <span>Plan</span>
          <span className={isProUnlocked(flags) ? 'badge badge-pro' : 'badge badge-muted'}>
            {isProUnlocked(flags) ? 'Pro (dev mode)' : 'Free'}
          </span>
        </div>

        <div className="list-item">
          <span>Backend connection</span>
          <span className="badge badge-muted">{isDemoMode() ? 'Demo mode' : 'Live'}</span>
        </div>
      </div>

      <div className="card">
        <h3>Your data</h3>
        <p className="sub">
          This build stores your business data in memory only (not persisted) until Supabase is connected on Day 2.
          Export it any time to keep a copy.
        </p>
        <button className="btn btn-outline" onClick={exportData}>
          Export JSON
        </button>
      </div>

      <div className="card">
        <h3>About this build</h3>
        <p className="sub" style={{ marginBottom: 0 }}>
          LEXDEN FORGE Day 1 scaffold. AI Generator, Marketing Studio and Coach content shown in this build are
          clearly-labelled demo placeholders - no live AI provider is connected yet.
        </p>
      </div>
    </main>
  );
}
