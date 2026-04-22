/**
 * TODO — Feature 7: Status Update Modal
 *
 * When an action item row is clicked, show this modal allowing the owner to:
 *   - Change status to: In Progress / Completed / Blocked
 *   - If Blocked: enter blockedReason (textarea, required)
 *   - If Completed: enter completionNotes and optionally upload evidence
 *   - Shows action ID, title, current status, due date as context
 *
 * Props: action (ActionItem), open (bool), onClose, onSave(updated: ActionItem)
 * Mock: onSave updates local state in the parent page (no backend)
 *
 * Maps to BRD user stories: US-03 (update own status), US-06 (flag blocked)
 */

import type { ActionItem, ActionStatus } from '../../types/actions';
import { useState } from 'react';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  action: ActionItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: ActionItem) => void;
}

const UPDATABLE_STATUSES: ActionStatus[] = ['in-progress', 'completed', 'blocked'];

export default function StatusUpdateModal({ action, open, onClose, onSave }: Props) {
  const [status, setStatus] = useState<ActionStatus>('in-progress');
  const [note, setNote] = useState('');

  if (!action) return null;

  const handleSave = () => {
    onSave({
      ...action,
      status,
      blockedReason: status === 'blocked' ? note : action.blockedReason,
      completionNotes: status === 'completed' ? note : action.completionNotes,
      lastUpdated: '2026-04-22',
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Action Status">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{action.id} — {action.title}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Due: {action.dueDate} · <StatusBadge status={action.status} /></p>
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Status</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {UPDATABLE_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: status === s ? '2px solid #1e40af' : '2px solid #e2e8f0',
                  background: status === s ? '#eff6ff' : 'white',
                  color: status === s ? '#1e40af' : '#475569',
                }}
              >
                {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {(status === 'blocked' || status === 'completed') && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {status === 'blocked' ? 'Reason for Blocker *' : 'Completion Notes'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={status === 'blocked' ? 'Describe what is blocking progress...' : 'Add notes or evidence details...'}
              style={{
                width: '100%', marginTop: 8, padding: '10px 12px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', fontSize: 14, resize: 'vertical',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#475569' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1e40af', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Save Update</button>
        </div>
      </div>
    </Modal>
  );
}
