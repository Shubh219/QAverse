import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-titles">
          <h1 className="header-title">Testing Dashboard</h1>
          <p className="header-subtitle">Plan, execute, and analyze your website tests.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="status-indicator" title="All local dashboard subsystems are operational">
          <span className="status-dot"></span>
          <span className="status-text">System ready</span>
        </div>
      </div>
    </header>
  );
}
