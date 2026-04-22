import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import StatusUpdateModal from '../../components/actions/StatusUpdateModal';
import { MOCK_ACTIONS } from '../../data/mockActions';
import type { ActionItem } from '../../types/actions';
import './EmailPreviewPage.css';

const EMAIL_SCENARIOS: Array<{
  id: string;
  label: string;
  helper: string;
}> = [
  { id: 'IT-003', label: 'Overdue Alert', helper: 'Escalation email for overdue items' },
  { id: 'IT-004', label: 'T-3 Reminder', helper: 'Reminder email before deadline' },
  { id: 'IT-001', label: 'Upcoming Deadline', helper: 'Early warning follow-up' },
];

function getEmailMeta(action: ActionItem) {
  const isOverdue = action.daysLeft < 0;
  const isT3 = !isOverdue && action.daysLeft <= 3;
  const alertType = isOverdue
    ? 'OVERDUE ALERT'
    : isT3
    ? 'T-3 DAY REMINDER'
    : 'UPCOMING DEADLINE';
  const alertColor = isOverdue ? '#dc2626' : isT3 ? '#d97706' : '#1e40af';

  return { isOverdue, alertType, alertColor };
}

function ownerEmail(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, '.')}@lupindiagnostics.com`;
}

export default function EmailPreviewPage() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>(MOCK_ACTIONS);
  const [activeScenarioId, setActiveScenarioId] = useState(EMAIL_SCENARIOS[1].id);
  const [statusModalAction, setStatusModalAction] = useState<ActionItem | null>(null);
  const [deepLink, setDeepLink] = useState('');
  const [toast, setToast] = useState('');

  const activeAction = useMemo(
    () => actions.find((item) => item.id === activeScenarioId) ?? null,
    [actions, activeScenarioId]
  );

  const emailMeta = activeAction ? getEmailMeta(activeAction) : null;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openStatusUpdate = () => {
    if (!activeAction) return;
    const link = `ecc://actions/${activeAction.id}?source=email-alert&tier=t-3`;
    setDeepLink(link);
    setStatusModalAction(activeAction);
  };

  const handleSaveStatus = (updated: ActionItem) => {
    setActions((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
    setStatusModalAction(null);
    setToast(`Status updated for ${updated.id}`);
  };

  return (
    <div className="ep-root">
      <Navbar />

      <main className="ep-body">
        <button
          type="button"
          className="ep-back-btn"
          onClick={() => navigate('/admin-dashboard')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Dashboard
        </button>

        <header className="ep-header">
          <div>
            <span className="ep-eyebrow">System Alerts & Reminders</span>
            <h1 className="ep-title">Automated email alert preview with deep-link status update</h1>
            <p className="ep-subtitle">
              This screen demonstrates how ECC automatically nudges action owners and routes them
              directly into a status update flow.
            </p>
          </div>
        </header>

        <section className="ep-scenario-row">
          {EMAIL_SCENARIOS.map((scenario) => {
            const active = scenario.id === activeScenarioId;
            const scenarioAction = actions.find((item) => item.id === scenario.id);
            const scenarioMeta = scenarioAction ? getEmailMeta(scenarioAction) : null;

            return (
              <button
                key={scenario.id}
                type="button"
                className={`ep-scenario-card ${active ? 'active' : ''}`}
                onClick={() => setActiveScenarioId(scenario.id)}
              >
                <span
                  className="ep-scenario-badge"
                  style={{ background: scenarioMeta?.alertColor ?? '#1e40af' }}
                />
                <span className="ep-scenario-title">{scenario.label}</span>
                <span className="ep-scenario-helper">{scenario.helper}</span>
                <span className="ep-scenario-id">{scenario.id}</span>
              </button>
            );
          })}
        </section>

        {activeAction && emailMeta && (
          <section className="ep-email-wrap">
            <div className="ep-client-bar">
              <div>
                <span>From:</span>
                <strong>ecc-alerts@lupindiagnostics.com</strong>
              </div>
              <div>
                <span>To:</span>
                <strong>{ownerEmail(activeAction.assignedTo)}</strong>
              </div>
              <div>
                <span>Subject:</span>
                <strong>
                  [ECC] {emailMeta.alertType}: {activeAction.id} -{' '}
                  {activeAction.title.length > 56
                    ? `${activeAction.title.slice(0, 56)}...`
                    : activeAction.title}
                </strong>
              </div>
            </div>

            <article className="ep-email-card">
              <div
                className="ep-email-banner"
                style={{ background: emailMeta.alertColor }}
              >
                <p>Lupin Diagnostics · Executive Command Centre</p>
                <h2>{emailMeta.alertType}</h2>
              </div>

              <div className="ep-email-content">
                <p className="ep-greeting">
                  Hi <strong>{activeAction.assignedTo.split(' ')[0]}</strong>,
                </p>
                <p className="ep-copy">
                  {emailMeta.isOverdue
                    ? `This action is now ${Math.abs(
                        activeAction.daysLeft
                      )} day(s) overdue. Please update the status immediately to prevent escalation.`
                    : `This action is due in ${activeAction.daysLeft} day(s). Please review progress and update the status now.`}
                </p>

                <div className="ep-action-card">
                  <p className="ep-action-meta">
                    {activeAction.id} · {activeAction.department}
                  </p>
                  <h3>{activeAction.title}</h3>
                  <div className="ep-action-stats">
                    <span>Due: <strong>{activeAction.dueDate}</strong></span>
                    <span>Priority: <strong>{activeAction.priority.toUpperCase()}</strong></span>
                    <span>Progress: <strong>{activeAction.progress}%</strong></span>
                  </div>
                  <div className="ep-progress-track">
                    <div
                      className="ep-progress-fill"
                      style={{
                        width: `${activeAction.progress}%`,
                        background: emailMeta.alertColor,
                      }}
                    />
                  </div>
                  <p className="ep-meeting-link">Source meeting: {activeAction.meetingTitle}</p>
                </div>

                <button
                  type="button"
                  className="ep-update-btn"
                  style={{ background: emailMeta.alertColor }}
                  onClick={openStatusUpdate}
                >
                  Update Status
                </button>

                <p className="ep-footer-note">
                  This is a simulated automated email from ECC Platform.
                </p>
              </div>
            </article>
          </section>
        )}

        <section className="ep-deeplink-card">
          <p className="ep-deeplink-label">Deep link simulation</p>
          <code>{deepLink || 'Click "Update Status" to generate a deep-link route.'}</code>
        </section>
      </main>

      <StatusUpdateModal
        action={statusModalAction}
        open={!!statusModalAction}
        onClose={() => setStatusModalAction(null)}
        onSave={handleSaveStatus}
      />

      {toast && <div className="ep-toast">{toast}</div>}
    </div>
  );
}
