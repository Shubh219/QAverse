import React from 'react';
import { Compass, Bot, ShieldAlert } from 'lucide-react';

const AGENTS = [
  {
    id: 'planner',
    name: 'Test Planner',
    role: 'Creates structured test cases',
    description: 'Scans target web pages to formulate comprehensive functional, UI, and edge-case testing matrices.',
    icon: Compass,
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    capabilities: ['User journey discovery', 'Test matrix generation', 'Edge case mapping'],
  },
  {
    id: 'executor',
    name: 'Test Executor',
    role: 'Runs browser checks',
    description: 'Controls automated browser sessions to execute test cases, simulating real user actions across viewport sizes.',
    icon: Bot,
    accentColor: '#0284c7',
    accentBg: '#f0f9ff',
    capabilities: ['Browser navigation', 'Interactive element checks', 'Visual validation'],
  },
  {
    id: 'analyst',
    name: 'Bug Analyst',
    role: 'Analyzes failures and evidence',
    description: 'Diagnoses test anomalies, inspects browser logs, and packages actionable reproducible defect summaries.',
    icon: ShieldAlert,
    accentColor: '#4f46e5',
    accentBg: '#eef2ff',
    capabilities: ['Failure root-cause triage', 'DOM & console diffs', 'Defect reporting'],
  },
];

export default function AgentOverview() {
  return (
    <section className="dashboard-section" aria-labelledby="agent-overview-heading">
      <div className="section-header">
        <div>
          <h2 id="agent-overview-heading" className="section-title">
            Agent Overview
          </h2>
          <p className="section-subtitle">
            Autonomous specialized agents collaborate during testing workflows.
          </p>
        </div>
      </div>

      <div className="agent-grid">
        {AGENTS.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <div key={agent.id} className="card agent-card">
              <div className="agent-card-top">
                <div
                  className="agent-icon-wrapper"
                  style={{ backgroundColor: agent.accentBg, color: agent.accentColor }}
                >
                  <IconComponent size={22} />
                </div>
                {/* Clearly marked as Not connected */}
                <span className="badge-not-connected">
                  <span className="badge-dot" />
                  Not connected
                </span>
              </div>

              <div className="agent-card-body">
                <h3 className="agent-name">{agent.name}</h3>
                <p className="agent-role">{agent.role}</p>
                <p className="agent-description">{agent.description}</p>
              </div>

              <div className="agent-card-footer">
                <span className="capabilities-label">Capabilities</span>
                <ul className="capabilities-list">
                  {agent.capabilities.map((cap, idx) => (
                    <li key={idx} className="capability-tag">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
