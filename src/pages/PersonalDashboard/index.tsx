import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import StatusBadge from '../../components/ui/StatusBadge';
import StatusUpdateModal from '../../components/actions/StatusUpdateModal';
import AddToCalendarButton from '../../components/ui/AddToCalendarButton';
import CalendarSyncToast from '../../components/ui/CalendarSyncToast';
import { getActionsByOwner } from '../../data/mockActions';
import type { Role } from '../../types/auth';
import type { ActionItem, ActionStatus } from '../../types/actions';
import { ACTION_STATUS_LABELS, PRIORITY_LABELS } from '../../types/actions';
import './PersonalDashboard.css';
 
const STATUS_FILL: Record<string, string> = {
  open: '#94a3b8',
  'in-progress': '#1e40af',
  overdue: '#dc2626',
  completed: '#16a34a',
  blocked: '#d97706',
};
 
const STATUS_OPTIONS: ActionStatus[] = [
  'open',
  'in-progress',
  'overdue',
  'blocked',
  'completed',
];
 
function getRowState(action: ActionItem) {
  if (action.status === 'completed') return 'completed';
  if (action.status === 'overdue' || action.daysLeft < 0) return 'overdue';
  if (action.daysLeft <= 7) return 'upcoming';
  return action.status;
}
 
function getUpdatedProgress(action: ActionItem, status: ActionStatus) {
  if (status === 'completed') return 100;
  if (status === 'in-progress') return Math.max(action.progress, 40);
  if (status === 'open') return Math.min(action.progress, 20);
  return action.progress;
}
 
export default function PersonalDashboard() {
  const { user } = useAuth();

  const [actions, setActions] = useState<ActionItem[]>(() =>
    user ? getActionsByOwner(user.role) : []
  );
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [syncedAction, setSyncedAction] = useState<ActionItem | null>(null);

  const counts = useMemo(() => {
    const total = actions.length;
    const open = actions.filter((a) => a.status === 'open').length;
    const inProgress = actions.filter((a) => a.status === 'in-progress').length;
    const overdue = actions.filter((a) => a.status === 'overdue' || a.daysLeft < 0).length;
    const dueThisWeek = actions.filter(
      (a) => a.status !== 'completed' && a.daysLeft >= 0 && a.daysLeft <= 7
    ).length;
    const completed = actions.filter((a) => a.status === 'completed').length;
    const meetings = new Set(actions.map((a) => a.meetingId)).size;

    return { total, open, inProgress, overdue, dueThisWeek, completed, meetings };
  }, [actions]);

  const sortedActions = useMemo(
    () =>
      [...actions].sort((a, b) => {
        const aState = getRowState(a);
        const bState = getRowState(b);
        const rank: Record<string, number> = {
          overdue: 0,
          upcoming: 1,
          blocked: 2,
          'in-progress': 3,
          open: 4,
          completed: 5,
        };

        if (rank[aState] !== rank[bState]) return rank[aState] - rank[bState];
        return a.daysLeft - b.daysLeft;
      }),
    [actions]
  );

  if (!user) return null;
  const firstName = user.name.split(' ')[0];
 
  const handleStatusUpdate = (actionId: string, status: ActionStatus) => {
    let synced: ActionItem | null = null;
    setActions((current) =>
      current.map((action) => {
        if (action.id !== actionId) return action;
        const updated = {
          ...action,
          status,
          progress: getUpdatedProgress(action, status),
          lastUpdated: '2026-04-22',
          calendarSynced: true,
          lastCalendarSync: '2026-04-22',
        };
        synced = updated;
        return updated;
      })
    );
    if (synced) setSyncedAction(synced);
  };
 
  return (
    <div className="pd-root">
      <Navbar />
 
      <div className="pd-body">
        <div className="pd-header">
          <div className="pd-header-copy">
            <span className="pd-eyebrow">Action Owner Dashboard</span>
            <h1 className="pd-title">Single view for every action {firstName} owns</h1>
            <p className="pd-subtitle">
              {user.name} is tracking {counts.total} action items across {counts.meetings} meetings with inline updates from one screen.
            </p>
          </div>
          <div className="pd-date">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.2" />
              <path d="M4 1v2M10 1v2M1 6h12" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            22 Apr 2026
          </div>
        </div>
 
        <div className="pd-hero">
          <div className="pd-hero-card primary">
            <p className="pd-hero-label">Primary Owner</p>
            <h2 className="pd-hero-name">{user.name}</h2>
            <p className="pd-hero-copy">{ROLE_COPY[user.role] ?? user.department}</p>
          </div>
          <div className="pd-hero-card">
            <p className="pd-hero-label">Action Mix</p>
            <p className="pd-hero-metric">{counts.open + counts.inProgress}</p>
            <p className="pd-hero-copy">Open or in progress</p>
          </div>
          <div className="pd-hero-card danger">
            <p className="pd-hero-label">Overdue</p>
            <p className="pd-hero-metric">{counts.overdue}</p>
            <p className="pd-hero-copy">Needs immediate follow-up</p>
          </div>
          <div className="pd-hero-card warning">
            <p className="pd-hero-label">Due This Week</p>
            <p className="pd-hero-metric">{counts.dueThisWeek}</p>
            <p className="pd-hero-copy">Upcoming deadlines flagged below</p>
          </div>
        </div>
 
        <div className="pd-stats">
          <div className="pd-stat-card">
            <div className="pd-stat-icon open">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="5.5" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>
            <div>
              <p className="pd-stat-num-lg">{counts.open}</p>
              <p className="pd-stat-label">Open</p>
            </div>
          </div>
 
          <div className="pd-stat-card">
            <div className="pd-stat-icon progress">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10h10M10 5v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="pd-stat-num-lg">{counts.inProgress}</p>
              <p className="pd-stat-label">In Progress</p>
            </div>
          </div>
 
          <div className="pd-stat-card">
            <div className="pd-stat-icon overdue">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="pd-stat-num-lg">{counts.overdue}</p>
              <p className="pd-stat-label">Overdue</p>
            </div>
          </div>
 
          <div className="pd-stat-card">
            <div className="pd-stat-icon due-soon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5v5l3 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="10" r="6.5" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>
            <div>
              <p className="pd-stat-num-lg">{counts.dueThisWeek}</p>
              <p className="pd-stat-label">Due This Week</p>
            </div>
          </div>
 
          <div className="pd-stat-card">
            <div className="pd-stat-icon completed">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="6" stroke="white" strokeWidth="1.8" />
                <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="pd-stat-num-lg">{counts.completed}</p>
              <p className="pd-stat-label">Completed</p>
            </div>
          </div>
        </div>
 
        {/* Actions table */}
        <div className="pd-table-card">
          <div className="pd-table-header">
            <h2>My Action Items</h2>
            <span className="pd-table-count">{counts.total} total</span>
            <span className="pd-table-hint">Update status directly from the list</span>
          </div>
 
          <div className="pd-table-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Department</th>
                  <th>Source Meeting</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Deadline Signal</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Update</th>
                  <th>Calendar</th>
                </tr>
              </thead>
              <tbody>
                {sortedActions.map((action) => (
                  <tr
                    key={action.id}
                    className={`pd-row-${getRowState(action)}`}
                    onClick={() => setSelectedAction(action)}
                  >
                    <td>
                      <span className="pd-action-id">{action.id}</span>
                    </td>
                    <td className="pd-action-title-cell">
                      <span className="pd-action-title">{action.title}</span>
                    </td>
                    <td>
                      <span className="pd-category">{action.department}</span>
                    </td>
                    <td className="pd-meeting-cell">
                      <span className="pd-meeting-title" title={action.meetingTitle}>
                        {action.meetingTitle.length > 30
                          ? action.meetingTitle.slice(0, 30) + '…'
                          : action.meetingTitle}
                      </span>
                    </td>
                    <td>
                      <span className={`pd-priority pd-priority-${action.priority}`}>
                        {PRIORITY_LABELS[action.priority]}
                      </span>
                    </td>
                    <td>
                      <div className="pd-due">
                        <span className="pd-due-date">{action.dueDate}</span>
                        <span className={`pd-days ${action.daysLeft < 0 ? 'neg' : action.daysLeft <= 7 ? 'warn' : ''}`}>
                          {action.status === 'completed'
                            ? 'Closed'
                            : action.daysLeft < 0
                            ? `${Math.abs(action.daysLeft)}d overdue`
                            : action.daysLeft === 0
                            ? 'Due today'
                            : `${action.daysLeft}d left`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`pd-signal pd-signal-${getRowState(action)}`}>
                        {getRowState(action) === 'overdue'
                          ? 'Escalate now'
                          : getRowState(action) === 'upcoming'
                          ? 'Due this week'
                          : getRowState(action) === 'completed'
                          ? 'Closed'
                          : 'On watch'}
                      </span>
                    </td>
                    <td className="pd-progress-cell">
                      <div className="pd-progress-wrap">
                        <div className="pd-progress-bar">
                          <div
                            className="pd-progress-fill"
                            style={{
                              width: `${action.progress}%`,
                              background: STATUS_FILL[action.status] ?? '#94a3b8',
                            }}
                          />
                        </div>
                        <span className="pd-progress-pct">{action.progress}%</span>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={action.status} />
                    </td>
                    <td>
                    <select
                      className={`pd-status-select pd-status-select-${getRowState(action)}`}
                      value={action.status}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        handleStatusUpdate(action.id, event.target.value as ActionStatus)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {ACTION_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {action.calendarSynced ? (
                        <span
                          title={`Auto-synced on ${action.lastCalendarSync ?? 'unknown'}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '4px 8px', borderRadius: 999,
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                            fontSize: 11, fontWeight: 700, color: '#16a34a',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <circle cx="5" cy="5" r="4" fill="#16a34a" />
                            <path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Synced
                        </span>
                      ) : (
                        <AddToCalendarButton action={action} compact />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
 
      <StatusUpdateModal
        action={selectedAction}
        open={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        onSave={(updated) => {
          const synced = { ...updated, calendarSynced: true, lastCalendarSync: '2026-04-22' };
          setActions((current) =>
            current.map((item) => (item.id === updated.id ? synced : item))
          );
          setSyncedAction(synced);
          setSelectedAction(null);
        }}
      />

      <CalendarSyncToast action={syncedAction} onDismiss={() => setSyncedAction(null)} />
    </div>
  );
}
 
const ROLE_COPY: Partial<Record<Role, string>> = {
  'head-of-it': 'Head of IT · Cross-meeting action visibility',
  'head-of-finance': 'Head of Finance · Compliance and closure tracking',
  'head-of-operations': 'Head of Operations · Execution and risk follow-up',
};