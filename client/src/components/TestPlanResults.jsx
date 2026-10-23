import React from 'react';
import {
  Globe,
  ExternalLink,
  ListOrdered,
  Tag,
  Sparkles,
  Info,
  RotateCcw,
  Check
} from 'lucide-react';

export default function TestPlanResults({ plan, onClear }) {
  if (!plan) return null;

  const { website = {}, summary, testCases = [] } = plan;

  return (
    <section className="test-plan-results-section" aria-labelledby="plan-results-heading">
      {/* 1. Website Overview Header Card */}
      <div className="card plan-overview-card">
        <div className="plan-overview-top">
          <div className="plan-title-group">
            <span className="card-badge">Inspection Verified</span>
            <h2 id="plan-results-heading" className="plan-website-title">
              {website.title || 'Inspected Website'}
            </h2>
            <div className="plan-meta-row">
              <a
                href={website.finalUrl || website.url}
                target="_blank"
                rel="noreferrer noopener"
                className="plan-url-link"
                title="Open inspected URL in a new tab"
              >
                <Globe size={15} />
                <span>{website.finalUrl || website.url}</span>
                <ExternalLink size={13} />
              </a>

              {website.statusCode && (
                <span className={`status-pill ${website.statusCode >= 200 && website.statusCode < 300 ? 'status-pill-success' : 'status-pill-warning'}`}>
                  HTTP {website.statusCode}
                </span>
              )}

              <span className="count-pill">
                {testCases.length} Test Case{testCases.length === 1 ? '' : 's'} Planned
              </span>
            </div>
          </div>

          {onClear && (
            <button
              type="button"
              className="secondary-btn btn-plan-another"
              onClick={onClear}
              title="Clear current plan and test another website"
            >
              <RotateCcw size={15} />
              <span>Plan Another Website</span>
            </button>
          )}
        </div>

        {/* AI Agent Summary */}
        {summary && (
          <div className="plan-summary-box">
            <div className="summary-icon-box">
              <Sparkles size={18} className="summary-icon" />
            </div>
            <div className="summary-text-content">
              <span className="summary-label">Test Planner Agent Summary</span>
              <p className="summary-text">{summary}</p>
            </div>
          </div>
        )}

        {/* Honest Planning Disclaimer Banner */}
        <div className="plan-disclaimer-banner">
          <Info size={16} className="disclaimer-icon" />
          <p className="disclaimer-text">
            <strong>Plan Specification Only:</strong> These automated test cases were synthesized from live DOM elements by the Test Planner Agent. Browser execution will be handled in a subsequent step when the Test Executor is connected.
          </p>
        </div>
      </div>

      {/* 2. Test Cases List */}
      <div className="test-cases-container">
        <div className="test-cases-header">
          <h3 className="section-title">
            Generated Test Cases ({testCases.length})
          </h3>
          <span className="test-cases-subtitle">
            Structured functional, navigation, and validation tests ready for Playwright execution.
          </span>
        </div>

        <div className="test-cases-list">
          {testCases.map((tc, index) => {
            const priorityClass = `badge-priority-${(tc.priority || 'medium').toLowerCase()}`;
            return (
              <article key={tc.id || index} className="card test-case-card">
                {/* Test Case Top Header */}
                <div className="test-case-header">
                  <div className="test-case-identity">
                    <span className="test-case-id">{tc.id || `TC-${index + 1}`}</span>
                    <h4 className="test-case-title">{tc.title}</h4>
                  </div>
                  <div className="test-case-badges">
                    <span className={`badge-priority ${priorityClass}`}>
                      {tc.priority || 'medium'} priority
                    </span>
                    <span className="badge-type">
                      {tc.type || 'functional'}
                    </span>
                  </div>
                </div>

                {/* Test Case Body */}
                <div className="test-case-body">
                  {/* Preconditions */}
                  {tc.preconditions && (
                    <div className="test-detail-row">
                      <span className="detail-label">Preconditions:</span>
                      <span className="detail-value">{tc.preconditions}</span>
                    </div>
                  )}

                  {/* Test Steps */}
                  {Array.isArray(tc.steps) && tc.steps.length > 0 && (
                    <div className="test-steps-group">
                      <div className="steps-header">
                        <ListOrdered size={16} />
                        <span className="detail-label">Execution Steps</span>
                      </div>
                      <ol className="steps-ordered-list">
                        {tc.steps.map((step, sIdx) => (
                          <li key={sIdx} className="step-item">
                            <span className="step-counter">{sIdx + 1}</span>
                            <span className="step-text">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Expected Result */}
                  {tc.expectedResult && (
                    <div className="expected-result-box">
                      <div className="expected-result-header">
                        <Check size={16} className="expected-icon" />
                        <span className="expected-label">Expected Result</span>
                      </div>
                      <p className="expected-text">{tc.expectedResult}</p>
                    </div>
                  )}

                  {/* Observed Source Elements */}
                  {Array.isArray(tc.sourceElements) && tc.sourceElements.length > 0 && (
                    <div className="source-elements-group">
                      <div className="sources-header">
                        <Tag size={14} />
                        <span className="detail-label">Observed Page Elements:</span>
                      </div>
                      <div className="source-tags-wrapper">
                        {tc.sourceElements.map((el, elIdx) => (
                          <span key={elIdx} className="source-element-tag">
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
