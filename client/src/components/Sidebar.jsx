import React from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  CheckSquare,
  Bug,
  Settings,
  Layers,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'test-runs', label: 'Test Runs', icon: PlayCircle, active: false },
  { id: 'test-cases', label: 'Test Cases', icon: CheckSquare, active: false },
  { id: 'bug-reports', label: 'Bug Reports', icon: Bug, active: false },
  { id: 'settings', label: 'Settings', icon: Settings, active: false },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`dashboard-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Layers className="brand-icon" size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-name">QAverse</span>
            <span className="brand-badge">BETA</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          <div className="nav-section-title">PLATFORM</div>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
                    aria-current={item.active ? 'page' : undefined}
                    onClick={() => {
                      if (!item.active) {
                        // Inform user gently for unlinked mock tabs
                        alert(`${item.label} section will be available in an upcoming update.`);
                      }
                      if (onClose) onClose();
                    }}
                  >
                    <Icon size={18} className="nav-icon" />
                    <span>{item.label}</span>
                    {item.active && <span className="active-pill-dot" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Workspace info footer */}
        <div className="sidebar-footer">
          <div className="workspace-card">
            <div className="workspace-header">
              <span className="workspace-name">QA Testing Workspace</span>
            </div>
            <p className="workspace-desc">Frontend Dashboard v0.1</p>
          </div>
        </div>
      </aside>
    </>
  );
}
