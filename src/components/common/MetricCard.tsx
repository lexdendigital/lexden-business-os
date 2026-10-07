import React from 'react';

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

/** Visible label used anywhere AI/demo content is shown, per
 * "Do not implement fake AI claims" - always disclose placeholder output. */
export function DemoFlag({ label = 'Demo preview - not live AI yet' }: { label?: string }) {
  return (
    <span className="demo-flag">
      <span aria-hidden="true">🧪</span> {label}
    </span>
  );
}
