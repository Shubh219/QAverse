import React, { useState } from 'react';
import {
  Globe,
  Target,
  Sparkles,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import TestPlanResults from './TestPlanResults';

const BACKEND_PLANNER_ENDPOINT =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api/test-planner/plan';

export default function TestStarter() {
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [clientError, setClientError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testPlan, setTestPlan] = useState(null);

  const validateUrl = (urlString) => {
    if (!urlString || !urlString.trim()) {
      return 'Please enter a website URL.';
    }

    try {
      const parsed = new URL(urlString.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      if (!parsed.hostname || parsed.hostname.length < 3) {
        return 'Please enter a valid domain name.';
      }
      return null;
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com).';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setClientError('');
    setServerError('');

    const validationError = validateUrl(url);
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(BACKEND_PLANNER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl: url.trim(),
          testingGoal: goal.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const errorMsg =
          data?.message ||
          data?.error ||
          `Backend returned error status ${response.status}.`;
        throw new Error(errorMsg);
      }

      // Successfully received real generated test plan
      setTestPlan(data);
    } catch (err) {
      console.error('Test planner submission error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setServerError(
          'Unable to reach QAverse backend at http://localhost:3001. Please verify the Express backend server is running.'
        );
      } else {
        setServerError(err.message || 'An unexpected error occurred while planning tests.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearPlan = () => {
    setTestPlan(null);
    setServerError('');
    setClientError('');
  };

  return (
    <div className="test-starter-section">
      <section className="card test-starter-card" aria-labelledby="start-test-heading">
        <div className="card-header-group">
          <div className="card-badge">New Test Session</div>
          <h2 id="start-test-heading" className="card-title">Start a new test</h2>
          <p className="card-description">
            Enter any web application address. Playwright headlessly inspects the DOM and the Gemini Test Planner Agent generates tailored test cases.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="test-form" noValidate>
          {/* URL Input */}
          <div className="form-group">
            <label htmlFor="target-url" className="form-label">
              Website URL <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${clientError ? 'input-error' : ''}`}>
              <Globe className="input-icon" size={18} />
              <input
                id="target-url"
                type="url"
                value={url}
                disabled={isLoading}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (clientError) setClientError('');
                }}
                placeholder="https://example.com"
                className="form-input"
                autoComplete="off"
              />
            </div>
            {clientError && (
              <div className="error-message" role="alert">
                <AlertCircle size={15} />
                <span>{clientError}</span>
              </div>
            )}
          </div>

          {/* Optional Testing Goal */}
          <div className="form-group">
            <div className="label-with-tag">
              <label htmlFor="testing-goal" className="form-label">
                Testing Goal
              </label>
              <span className="optional-tag">Optional</span>
            </div>
            <div className="input-wrapper">
              <Target className="input-icon" size={18} />
              <input
                id="testing-goal"
                type="text"
                value={goal}
                disabled={isLoading}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Check navigation links, login modal, and responsive layout"
                className="form-input"
              />
            </div>
            <span className="input-hint">
              Guide the Test Planner Agent toward specific user journeys, components, or edge cases.
            </span>
          </div>

          {/* Action Button & Loading Indicator */}
          <div className="form-actions">
            <button
              type="submit"
              className={`primary-btn ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Inspecting & Planning Tests...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Plan Tests</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress Feedback */}
        {isLoading && (
          <div className="planning-progress-banner" role="status" aria-live="polite">
            <Loader2 size={20} className="spinner-icon spinner-accent" />
            <div className="progress-content">
              <div className="progress-title">Playwright & Gemini Agent Working</div>
              <p className="progress-desc">
                Inspecting target website headlessly, analyzing visible DOM controls, and formulating structured test specifications...
              </p>
            </div>
          </div>
        )}

        {/* Server / Network Error Alert */}
        {serverError && (
          <div className="error-alert-banner" role="alert">
            <div className="error-icon-col">
              <AlertCircle size={20} className="alert-error-icon" />
            </div>
            <div className="error-content">
              <div className="error-title">Test Planning Failed</div>
              <p className="error-desc">{serverError}</p>
            </div>
            <button
              type="button"
              className="error-dismiss-btn"
              onClick={() => setServerError('')}
              aria-label="Dismiss error message"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </section>

      {/* Render Real Generated Test Plan when available */}
      {testPlan && (
        <TestPlanResults plan={testPlan} onClear={handleClearPlan} />
      )}
    </div>
  );
}
