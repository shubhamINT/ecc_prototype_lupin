import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { MOCK_ACTIONS } from '../../data/mockActions';

const DEMO_IDS = ['IT-003', 'IT-004', 'IT-001'];
const TABS = ['Overdue Alert', 'T-3 Reminder', 'Upcoming Deadline'];

export default function EmailPreviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);

  const action = MOCK_ACTIONS.find((a) => a.id === DEMO_IDS[activeTab]) ?? null;

  const isOverdue = action ? action.daysLeft < 0 : false;
  const alertType = action
    ? isOverdue
      ? 'OVERDUE ALERT'
      : action.daysLeft <= 3
      ? 'T-3 DAY REMINDER'
      : 'UPCOMING DEADLINE'
    : '';
  const alertColor = action
    ? isOverdue
      ? '#dc2626'
      : action.daysLeft <= 3
      ? '#d97706'
      : '#1e40af'
    : '#1e40af';

  const handleUpdateStatus = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div style={{ padding: '40px 32px 64px', maxWidth: 760, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 6px',
              letterSpacing: '-0.6px',
            }}
          >
            Email Alert Preview
          </h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
            Preview automated alert emails sent by ECC Platform to action owners.
          </p>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            const tabColor = i === 0 ? '#dc2626' : i === 1 ? '#d97706' : '#1e40af';
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '9px 22px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: isActive ? `2px solid ${tabColor}` : '2px solid #e2e8f0',
                  background: isActive
                    ? i === 0
                      ? '#fef2f2'
                      : i === 1
                      ? '#fffbeb'
                      : '#eff6ff'
                    : 'white',
                  color: isActive ? tabColor : '#475569',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Inline email card */}
        {action && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Email client metadata bar */}
            <div
              style={{
                background: '#f8fafc',
                borderBottom: '1px solid #f1f5f9',
                padding: '14px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                fontSize: 13,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#94a3b8', minWidth: 60 }}>From:</span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>
                  ecc-alerts@lupindiagnostics.com
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#94a3b8', minWidth: 60 }}>To:</span>
                <span style={{ color: '#0f172a', fontWeight: 500 }}>
                  {action.assignedTo.toLowerCase().replace(' ', '.')}@lupindiagnostics.com
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#94a3b8', minWidth: 60 }}>Subject:</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                  [ECC] {alertType}: {action.id} —{' '}
                  {action.title.length > 50 ? action.title.slice(0, 50) + '…' : action.title}
                </span>
              </div>
            </div>

            {/* Email body */}
            <div>
              {/* Alert header banner */}
              <div
                style={{
                  background: alertColor,
                  padding: '22px 28px',
                  color: 'white',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    opacity: 0.8,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  Lupin Diagnostics · ECC Platform
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {alertType}
                </div>
              </div>

              {/* Body content */}
              <div
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <p style={{ margin: 0, fontSize: 14, color: '#0f172a' }}>
                  Hi <strong>{action.assignedTo.split(' ')[0]}</strong>,
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
                  {isOverdue ? (
                    <>
                      Your action item below is now{' '}
                      <strong style={{ color: '#dc2626' }}>
                        {Math.abs(action.daysLeft)} day(s) overdue
                      </strong>
                      . Please update its status immediately to avoid escalation to the CEO Office.
                    </>
                  ) : (
                    <>
                      Your action item below is due in{' '}
                      <strong style={{ color: alertColor }}>
                        {action.daysLeft} day(s)
                      </strong>
                      . Please review progress and update the status.
                    </>
                  )}
                </p>

                {/* Action details card */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    {action.id} · {action.department}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.4,
                    }}
                  >
                    {action.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 16,
                      fontSize: 13,
                      color: '#64748b',
                    }}
                  >
                    <span>
                      Due:{' '}
                      <strong style={{ color: isOverdue ? '#dc2626' : '#0f172a' }}>
                        {action.dueDate}
                      </strong>
                    </span>
                    <span>
                      Priority: <strong>{action.priority.toUpperCase()}</strong>
                    </span>
                    <span>
                      Progress: <strong>{action.progress}%</strong>
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 6,
                      background: '#e2e8f0',
                      borderRadius: 99,
                      overflow: 'hidden',
                      marginTop: 2,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${action.progress}%`,
                        background: alertColor,
                        borderRadius: 99,
                        transition: 'width 0.4s',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>
                    Meeting: {action.meetingTitle}
                  </div>
                </div>

                {/* CTA button */}
                <div style={{ textAlign: 'center', paddingTop: 4 }}>
                  <button
                    onClick={handleUpdateStatus}
                    style={{
                      background: alertColor,
                      color: 'white',
                      border: 'none',
                      borderRadius: 9,
                      padding: '14px 36px',
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: `0 4px 16px ${alertColor}44`,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    Update Status Now →
                  </button>
                </div>

                {/* Footer note */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: '#94a3b8',
                    textAlign: 'center',
                    lineHeight: 1.6,
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 16,
                  }}
                >
                  This is an automated alert from ECC Platform.
                  <br />
                  Sent by CEO Office · Lupin Diagnostics
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contextual note below email */}
        <p
          style={{
            marginTop: 20,
            fontSize: 13,
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          This preview shows actual emails sent by ECC Platform for this action item.
        </p>
      </div>

      {/* Toast notification */}
      {toastVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: '#16a34a',
            color: 'white',
            padding: '14px 22px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(22,163,74,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 9999,
            animation: 'fadeSlideIn 0.2s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" fill="white" fillOpacity="0.25" />
            <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Status update request sent!
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
