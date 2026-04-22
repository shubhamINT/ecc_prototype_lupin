import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ACTIONS } from '../../data/mockActions';
import type { ActionItem, Department } from '../../types/actions';
import ActionsByDepartmentBar from '../../components/charts/ActionsByDepartmentBar';
import GanttTimeline from '../../components/charts/GanttTimeline';
import StatusBadge from '../../components/ui/StatusBadge';
import StatusUpdateModal from '../../components/actions/StatusUpdateModal';
import Modal from '../../components/ui/Modal';
import AddMeetingToCalendarButton from '../../components/ui/AddMeetingToCalendarButton';
import CalendarSyncToast from '../../components/ui/CalendarSyncToast';
import { MOCK_MEETINGS } from '../../data/mockMeetings';
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
 
function toCsvCell(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}
 
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>(MOCK_ACTIONS);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMeetingsModalOpen, setIsMeetingsModalOpen] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null);
  const [syncedAction, setSyncedAction] = useState<ActionItem | null>(null);
 
  const applyQuickView = (mode: 'all' | 'it' | 'rajesh') => {
    if (mode === 'all') {
      setDeptFilter('All');
      setStatusFilter('All');
      setSearchQuery('');
      return;
    }
    if (mode === 'it') {
      setDeptFilter('IT');
      setStatusFilter('All');
      setSearchQuery('');
      return;
    }
    setDeptFilter('IT');
    setStatusFilter('All');
    setSearchQuery('Rajesh Satope');
  };
 
  const filtered = useMemo(
    () =>
      actions.filter((a) => {
        if (deptFilter !== 'All' && a.department !== deptFilter) return false;
        if (statusFilter !== 'All' && a.status !== statusFilter) return false;
        if (
          searchQuery &&
          !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !a.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !a.id.toLowerCase().includes(searchQuery.toLowerCase())
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
 
  const exportFilteredActions = () => {
    if (filtered.length === 0) return;
    const headers = [
      'Action ID',
      'Title',
      'Assignee',
      'Department',
      'Meeting',
      'Priority',
      'Due Date',
      'Status',
      'Days Left',
      'Last Updated',
    ];
    const rows = filtered.map((action) => [
      action.id,
      action.title,
      action.assignedTo,
      action.department,
      action.meetingTitle,
      action.priority,
      action.dueDate,
      action.status,
      action.daysLeft,
      action.lastUpdated,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => toCsvCell(cell)).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecc-actions-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
 
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
              onClick={() => setIsMeetingsModalOpen(true)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 4.5h10M2.5 7.5h10M2.5 10.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {MOCK_MEETINGS.length} Meetings
            </button>
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
              className="admin-btn-secondary"
              onClick={exportFilteredActions}
              disabled={filtered.length === 0}
              title={filtered.length === 0 ? 'No rows available for export' : 'Export visible rows'}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 2.5v7M4.5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.5 11.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Export CSV
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
          <div className="admin-summary-card in-progress" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
            <p className="admin-summary-label" style={{ color: '#0369a1' }}>In Progress</p>
            <p className="admin-summary-value" style={{ color: '#0369a1' }}>{filtered.filter(a => a.status === 'in-progress').length}</p>
            <p className="admin-summary-copy" style={{ color: '#0284c7' }}>Currently being worked on</p>
          </div>
          <div className="admin-summary-card blocked" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
            <p className="admin-summary-label" style={{ color: '#7e22ce' }}>Blocked</p>
            <p className="admin-summary-value" style={{ color: '#7e22ce' }}>{filtered.filter(a => a.status === 'blocked').length}</p>
            <p className="admin-summary-copy" style={{ color: '#9333ea' }}>Requires immediate unblocking</p>
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
          <div className="admin-quick-filters">
            <button
              className={`admin-quick-btn ${deptFilter === 'All' && statusFilter === 'All' && !searchQuery ? 'active' : ''}`}
              onClick={() => applyQuickView('all')}
            >
              All Departments
            </button>
            <button
              className={`admin-quick-btn ${deptFilter === 'IT' && !searchQuery ? 'active' : ''}`}
              onClick={() => applyQuickView('it')}
            >
              IT Focus
            </button>
            <button
              className={`admin-quick-btn ${deptFilter === 'IT' && searchQuery.toLowerCase() === 'rajesh satope'.toLowerCase() ? 'active' : ''}`}
              onClick={() => applyQuickView('rajesh')}
            >
              Rajesh Drilldown
            </button>
          </div>
 
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="admin-empty-row">
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
                      onClick={(e) => {setSelectedAction(action); e.stopPropagation();}}
                    >
                      <td onClick ={(e) => e.stopPropagation()}>
                        <span className="admin-action-id">{action.id}</span>
                      </td>
 
                      <td className="admin-action-title-cell" onClick={(e) => e.stopPropagation()}>
                        <span className="admin-action-title">{action.title}</span>
                      </td>
 
                      <td onClick={(e) => e.stopPropagation()}>
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
 
                      <td onClick={(e) => e.stopPropagation()}>
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
 
                      <td onClick={(e) => e.stopPropagation()}>
                        <span className="admin-meeting-name">{action.meetingTitle}</span>
                      </td>
 
                      <td onClick ={(e) => e.stopPropagation()}>
                        <span className={`admin-priority-pill admin-priority-${action.priority}`}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                        </span>
                      </td>
 
                      <td onClick={(e) => e.stopPropagation()}>
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
 
                     <td onClick={(e) => e.stopPropagation()}>
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
 
        <div className="admin-timeline-section">
          <GanttTimeline actions={filtered} title="Gantt-Style Action Timeline" />
        </div>
      </div>
 
      <Modal
        open={isMeetingsModalOpen}
        onClose={() => setIsMeetingsModalOpen(false)}
        title="Meeting Records & MOM Viewer"
        width={700}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '65vh', overflowY: 'auto' }}>
          {MOCK_MEETINGS.map((m) => (
            <div
              key={m.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                cursor: 'pointer',
                background: expandedMeetingId === m.id ? '#f8fafc' : 'white',
              }}
              onClick={() => setExpandedMeetingId(expandedMeetingId === m.id ? null : m.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <span style={{ margin: 0, color: '#0f172a', fontSize: '15px', fontWeight: 700 }}>{m.title}</span>
                  <div style={{ marginTop: 4, fontSize: '12px', color: '#64748b' }}>
                    {m.date} · {m.actionItemIds.length} actions · {m.department}
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <AddMeetingToCalendarButton meeting={m} />
                </div>
              </div>
              {expandedMeetingId === m.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>PARTICIPANTS</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {m.participants.map((name) => (
                        <span
                          key={name}
                          style={{
                            padding: '3px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>MINUTES OF MEETING</p>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '13px', color: '#334155', background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                    {m.momText}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
 
      <StatusUpdateModal
        action={selectedAction}
        open={!!selectedAction}
        onClose={() => setSelectedAction(null)}
        onSave={(updated) => {
          const synced = { ...updated, calendarSynced: true, lastCalendarSync: '2026-04-22' };
          setActions((prev) =>
            prev.map((a) => (a.id === updated.id ? synced : a))
          );
          setSyncedAction(synced);
          setSelectedAction(null);
        }}
      />

      <CalendarSyncToast action={syncedAction} onDismiss={() => setSyncedAction(null)} />
    </div>
  );
}