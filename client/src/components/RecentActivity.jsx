import React from 'react';
import { Inbox } from 'lucide-react';

export default function RecentActivity() {
  return (
    <section className="dashboard-section" aria-labelledby="recent-activity-heading">
      <div className="section-header">
        <div>
          <h2 id="recent-activity-heading" className="section-title">
            Recent Activity
          </h2>
          <p className="section-subtitle">
            Historical logs of executed tests, status summaries, and generated reports.
          </p>
        </div>
      </div>

      {/* Honest Empty State */}
      <div className="card empty-activity-card">
        <div className="empty-state-icon-box">
          <Inbox size={32} className="empty-state-icon" />
        </div>
        <h3 className="empty-state-title">No test runs yet</h3>
        <p className="empty-state-description">
          When test planning and execution workflows are connected in an upcoming step,
          your website test runs, pass/fail status, and detected bugs will appear here.
        </p>
        <div className="empty-state-badge">
          <span>Ready for agent execution setup</span>
        </div>
      </div>
    </section>
  );
}
