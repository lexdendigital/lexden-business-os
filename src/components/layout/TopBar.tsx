import React from 'react';
import { useTheme } from '@/lib/flags/theme';

export function TopBar() {
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="top-bar">
      <span className="brand">LEXDEN FORGE</span>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
      </button>
    </header>
  );
}
