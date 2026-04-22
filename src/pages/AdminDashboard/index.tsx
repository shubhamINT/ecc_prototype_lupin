import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ACTIONS } from '../../data/mockActions';
import type { ActionItem, Department } from '../../types/actions';
import ActionsByDepartmentBar from '../../components/charts/ActionsByDepartmentBar';
import StatusBadge from '../../components/ui/StatusBadge';
import StatusUpdateModal from '../../components/actions/StatusUpdateModal';
import Navbar from '../../components/layout/Navbar';
import './AdminDashboard.css';

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  IT: { bg: '#eff6ff', text: '#1e40af' },
  Finance: { bg: '#f0fdf4', text: '#15803d' },
  Operations: { bg: '#fffbeb', text: '#b45309' },
  HR: { bg: '#fdf4ff', text: '#7e22ce' },
  Marketing: { bg: '#fff1f2', text: '#be123c' },
};

const AVATAR_COLORS: Record<string, string> = {
  'head-of-it': '#1e40af',
  'head-of-finance': '#059669',
  'head-of-operations': '#d97706',
  'ceo-office-admin': '#0891b2',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getRowClass(action: ActionItem): string {
  if (action.status === 'overdue') return 'admin-row-overdue';
  if (action.daysLeft >= 0 && action.daysLeft <= 3 && action.status !== 'completed') {
    return 'admin-row-at-risk';
  }
  return '';
}

function getDaysLeftClass(daysLeft: number, status: ActionItem['status']): string {
  if (status === 'completed') return 'admin-days-left ok';
  if (daysLeft < 0) return 'admin-days-left neg';
  if (daysLeft <= 3) return 'admin-days-left warn';
  return 'admin-days-left ok';
}

function formatDaysLeft(daysLeft: number, status: ActionItem['status']): string {
  if (status === 'completed') return '—';
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
  if (daysLeft === 0) return 'Due today';
  return `${daysLeft}d left`;
}

const DEPT_OPTIONS: Array<Department | 'All'> = [
  'All',
  'IT',
  'Finance',
  'Operations',
  'HR',
  'Marketing',
];
const STATUS_OPTIONS = ['All', 'open', 'in-progress', 'overdue', 'completed', 'blocked'] as const;
const STATUS_DISPLAY: Record<string, string> = {
  All: 'All Statuses',
  open: 'Open',
  'in-progress': 'In Progress',
  overdue: 'Overdue',
  completed: 'Completed',
  blocked: 'Blocked',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>(MOCK_ACTIONS);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(
    () =>
      actions.filter((a) => {
        if (deptFilter !== 'All' && a.department !== deptFilter) return false;
        if (statusFilter !== 'All' && a.status !== statusFilter) return false;
        if (
          searchQuery &&
          !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [actions, deptFilter, searchQuery, statusFilter]
  );

  const summary = useMemo(() => {
    const total = filtered.length;
    const open = filtered.filter((a) => a.status === 'open').length;
    const overdue = filtered.filter((a) => a.status === 'overdue').length;
    const dueThisWeek = filtered.filter(
      (a) => a.status !== 'completed' && a.daysLeft >= 0 && a.daysLeft <= 7
    ).length;
    const completed = filtered.filter((a) => a.status === 'completed').length;
    const owners = new Set(filtered.map((a) => a.assignedToId)).size;
    const meetings = new Set(filtered.map((a) => a.meetingId)).size;

    return { total, open, overdue, dueThisWeek, completed, owners, meetings };
  }, [filtered]);

  return (
    <div className="admin-root">
      <Navbar />

      <div className="admin-body">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <span className="admin-eyebrow">CEO Office Admin Dashboard</span>
            <h1 className="admin-title">Command center for every action, owner, and meeting</h1>
            <p className="admin-subtitle">
              Priya Sharma can monitor {summary.total} visible actions across {summary.owners} owners and {summary.meetings} meetings from one screen.
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              className="admin-btn-secondary"
              onClick={() => navigate('/email-preview')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M1 5l6.5 4L14 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Email Alerts
            </button>
            <button
              className="admin-btn-primary"
              onClick={() => navigate('/create-meeting')}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Create Meeting
            </button>
          </div>
        </div>

        <div className="admin-summary-grid">
          <div className="admin-summary-card open">
            <p className="admin-summary-label">Open</p>
            <p className="admin-summary-value">{summary.open}</p>
            <p className="admin-summary-copy">Awaiting owner progress</p>
          </div>
          <div className="admin-summary-card overdue">
            <p className="admin-summary-label">Overdue</p>
            <p className="admin-summary-value">{summary.overdue}</p>
            <p className="admin-summary-copy">Immediate escalation list</p>
          </div>
          <div className="admin-summary-card due">
            <p className="admin-summary-label">Due This Week</p>
            <p className="admin-summary-value">{summary.dueThisWeek}</p>
            <p className="admin-summary-copy">Amber watchlist</p>
          </div>
          <div className="admin-summary-card completed">
            <p className="admin-summary-label">Completed</p>
            <p className="admin-summary-value">{summary.completed}</p>
            <p className="admin-summary-copy">Closed in the current view</p>
          </div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-toolbar-search">
            <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="#94a3b8" strokeWidth="1.4" />
              <path d="M10 10l3.5 3.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search actions or assignees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="admin-toolbar-filters">
            <select
              className="admin-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {DEPT_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>

            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_DISPLAY[s]}
                </option>
              ))}
            </select>

            <span className="admin-result-count">
              {filtered.length} of {actions.length} actions
            </span>

            {(deptFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
              <button
                className="admin-clear-btn"
                onClick={() => {
                  setDeptFilter('All');
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2 className="admin-table-title">All Action Items</h2>
            <span className="admin-table-badge">{filtered.length} results</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Assignee</th>
                  <th>Department</th>
                  <th>Meeting</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="admin-empty-row">
                      No actions match the current filters.
                    </td>
                  </tr>
                )}
                {filtered.map((action) => {
                  const deptStyle = DEPT_COLORS[action.department] ?? {
                    bg: '#f1f5f9',
                    text: '#475569',
                  };
                  const avatarColor = AVATAR_COLORS[action.assignedToId] ?? '#475569';

                  return (
                    <tr
                      key={action.id}
                      className={`admin-table-row ${getRowClass(action)}`}
                      onClick={() => setSelectedAction(action)}
                    >
                      <td>
                        <span className="admin-action-id">{action.id}</span>
                      </td>

                      <td className="admin-action-title-cell">
                        <span className="admin-action-title">{action.title}</span>
                      </td>

                      <td>
                        <div className="admin-assignee">
                          <div
                            className="admin-avatar"
                            style={{ background: avatarColor }}
                          >
                            {getInitials(action.assignedTo)}
                          </div>
                          <span className="admin-assignee-name">{action.assignedTo}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className="admin-dept-pill"
                          style={{
                            background: deptStyle.bg,
                            color: deptStyle.text,
                          }}
                        >
                          {action.department}
                        </span>
                      </td>

                      <td>
                        <span className="admin-meeting-name">{action.meetingTitle}</span>
                      </td>

                      <td>
                        <span className={`admin-priority-pill admin-priority-${action.priority}`}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                        </span>
                      </td>

                      <td>
                        <div className="admin-due-cell">
                          <span className="admin-due-date">{action.dueDate}</span>
                          {action.status !== 'completed' && (
                            <span
                              className={
                                action.daysLeft < 0
                                  ? 'admin-due-label neg'
                                  : action.daysLeft <= 3
                                  ? 'admin-due-label warn'
                                  : 'admin-due-label'
                              }
                            >
                              {action.daysLeft < 0
                                ? `${Math.abs(action.daysLeft)}d overdue`
                                : action.daysLeft === 0
                                ? 'Due today'
                                : `${action.daysLeft}d left`}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={getDaysLeftClass(action.daysLeft, action.status)}>
                          {formatDaysLeft(action.daysLeft, action.status)}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={action.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="admin-chart-section">
          <ActionsByDepartmentBar />
        </div>
      </div>

      <StatusUpdateModal
        action={selectedAction}
        open={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        onSave={(updated) => {
          setActions((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
          );
          setSelectedAction(null);
        }}
      />
    </div>
  );
}
