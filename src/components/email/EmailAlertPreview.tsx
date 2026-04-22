/**
 * TODO — Feature 5: Simulated Email Alert Preview
 *
 * Renders a realistic email preview inside a Modal to show clients
 * what the automated T-3 day alert looks like.
 *
 * Props: action (ActionItem), open (bool), onClose
 * No backend needed — purely visual, mocked data.
 *
 * Layout: email client chrome (From/To/Subject) + branded email body
 * CTA button: "Update Status" (deep link simulation, opens StatusUpdateModal)
 *
 * Maps to BRD requirement: Automated email alerts at T-7, T-3, T-0, overdue
 */

import type { ActionItem } from '../../types/actions';
import Modal from '../ui/Modal';

interface Props {
  action: ActionItem | null;
  open: boolean;
  onClose: () => void;
}

export default function EmailAlertPreview({ action, open, onClose }: Props) {
  if (!action) return null;

  const isOverdue = action.daysLeft < 0;
  const alertType = isOverdue ? 'OVERDUE ALERT' : action.daysLeft <= 3 ? 'T-3 DAY REMINDER' : 'UPCOMING DEADLINE';
  const alertColor = isOverdue ? '#dc2626' : action.daysLeft <= 3 ? '#d97706' : '#1e40af';

  return (
    <Modal open={open} onClose={onClose} title="Email Alert Preview" width={600}>
      <div style={{ fontFamily: 'inherit' }}>
        {/* Email metadata */}
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><span style={{ color: '#94a3b8', width: 60, display: 'inline-block' }}>From:</span> <span style={{ color: '#0f172a', fontWeight: 500 }}>ecc-alerts@lupindiagnostics.com</span></div>
          <div><span style={{ color: '#94a3b8', width: 60, display: 'inline-block' }}>To:</span> <span style={{ color: '#0f172a', fontWeight: 500 }}>{action.assignedTo.toLowerCase().replace(' ', '.')}@lupindiagnostics.com</span></div>
          <div><span style={{ color: '#94a3b8', width: 60, display: 'inline-block' }}>Subject:</span> <span style={{ color: '#0f172a', fontWeight: 600 }}>[ECC] {alertType}: {action.id} — {action.title.slice(0, 50)}{action.title.length > 50 ? '...' : ''}</span></div>
        </div>

        {/* Email body */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: alertColor, padding: '20px 24px', color: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', opacity: 0.8, marginBottom: 8 }}>LUPIN DIAGNOSTICS · ECC PLATFORM</div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>{alertType}</div>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#0f172a' }}>Hi <strong>{action.assignedTo.split(' ')[0]}</strong>,</p>
            <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
              {isOverdue
                ? `Your action item below is now <strong>${Math.abs(action.daysLeft)} day(s) overdue</strong>. Please update its status immediately.`
                : `Your action item below is due in <strong>${action.daysLeft} day(s)</strong>. Please review and update the status.`}
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{action.id} · {action.department}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{action.title}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b', marginTop: 4 }}>
                <span>Due: <strong style={{ color: isOverdue ? '#dc2626' : '#0f172a' }}>{action.dueDate}</strong></span>
                <span>Priority: <strong>{action.priority.toUpperCase()}</strong></span>
                <span>From: {action.meetingTitle}</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <button
                onClick={onClose}
                style={{
                  background: alertColor, color: 'white', border: 'none', borderRadius: 8,
                  padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: `0 4px 14px ${alertColor}55`,
                }}
              >
                Update Status Now →
              </button>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>
              This is an automated alert from ECC Platform.<br />
              Sent by CEO Office · Lupin Diagnostics
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
