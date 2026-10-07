import React from 'react';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Empty states should teach - always say what to do next (UX principle). */
export function EmptyState({ icon = '✨', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction} style={{ maxWidth: 260, margin: '0 auto' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
