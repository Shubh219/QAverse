import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TestStarter from './components/TestStarter';
import AgentOverview from './components/AgentOverview';
import RecentActivity from './components/RecentActivity';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Dashboard Content Container */}
        <main className="dashboard-content">
          <div className="content-container">
            {/* Website Testing Panel */}
            <TestStarter />

            {/* AI Agent Overview */}
            <AgentOverview />

            {/* Recent Activity / Empty State */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
