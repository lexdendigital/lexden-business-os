import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/sales', label: 'Sales', icon: '💰', end: false },
  { to: '/inventory', label: 'Stock', icon: '📦', end: false },
  { to: '/grow', label: 'Grow', icon: '🚀', end: false },
  { to: '/settings', label: 'Settings', icon: '⚙️', end: false },
];

/**
 * React Router's NavLink sets `aria-current="page"` on the active link
 * automatically - global.css styles `.nav-btn[aria-current='page']`.
 */
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className="nav-btn">
          <span className="icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
