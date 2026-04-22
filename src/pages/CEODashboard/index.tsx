import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ACTIONS, getActionStats } from '../../data/mockActions';
import { MOCK_MEETINGS } from '../../data/mockMeetings';
import AddMeetingToCalendarButton from '../../components/ui/AddMeetingToCalendarButton';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import './CEODashboard.css';

const TODAY_ISO = '2026-04-22';

const DEPARTMENTS = ['IT', 'Finance', 'Operations', 'HR', 'Marketing'] as const;
const BAR_COLORS = ['#1e40af', '#059669', '#d97706', '#7c3aed', '#be123c'];

function toCsvCell(value: string | number) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

function dayDiff(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function buildDepartmentData() {
  return DEPARTMENTS.map((dept, index) => {
    const items = MOCK_ACTIONS.filter((item) => item.department === dept);
    const completed = items.filter((item) => item.status === 'completed').length;
    const overdue = items.filter((item) => item.status === 'overdue').length;
    const inProgress = items.filter((item) => ['in-progress', 'open', 'blocked'].includes(item.status)).length;
    return {
      department: dept,
      total: items.length,
      completed,
      inProgress,
      overdue,
      closureRate: items.length ? Math.round((completed / items.length) * 100) : 0,
      color: BAR_COLORS[index],
    };
  });
}

function buildKpis() {
  const stats = getActionStats();
  const totalActive = stats.total - stats.completed;
  const closureRate = Math.round((stats.completed / stats.total) * 100);
  const completedItems = MOCK_ACTIONS.filter((item) => item.status === 'completed');
  const avgDaysToClose = completedItems.length
    ? Math.round(
        completedItems.reduce(
          (sum, item) => sum + dayDiff(item.createdAt, item.lastUpdated),
          0
        ) / completedItems.length
      )
    : 0;

  return { totalActive, closureRate, overdueCount: stats.overdue, avgDaysToClose };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { department: string; total: number; completed: number; inProgress: number; overdue: number; closureRate: number } }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="ceo-tooltip">
      <p className="ceo-tooltip-title">{row.department}</p>
      <p>Total Actions: {row.total}</p>
      <p style={{color: '#10b981'}}>Completed: {row.completed}</p>
      <p style={{color: 'var(--color-primary)'}}>In Progress: {row.inProgress}</p>
      <p style={{color: '#ef4444'}}>Overdue: {row.overdue}</p>
      <p>Closure Rate: {row.closureRate}%</p>
    </div>
  );
}

export default function CEODashboard() {
  const { user } = useAuth();
  const [syncedMeetings, setSyncedMeetings] = useState<Set<string>>(new Set());
  const [expandedBrief, setExpandedBrief] = useState<string | null>(null);

  if (!user) return null;

  const departmentData = buildDepartmentData();
  const kpis = buildKpis();

  const upcomingMeetings = MOCK_MEETINGS
    .map((m) => ({
      ...m,
      daysUntil: Math.round(
        (new Date(m.dateIso).getTime() - new Date(TODAY_ISO).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }))
    .filter((m) => m.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const topOverdue = [...MOCK_ACTIONS]
    .filter((item) => item.status === 'overdue')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const exportExecutiveView = () => {
    const rows: Array<Array<string | number>> = [
      ['Section', 'Metric', 'Value'],
      ['KPI', 'Total Active', kpis.totalActive],
      ['KPI', 'Closure Rate', `${kpis.closureRate}%`],
      ['KPI', 'Overdue Count', kpis.overdueCount],
      ['KPI', 'Avg Days to Close', kpis.avgDaysToClose],
    ];

    departmentData.forEach((row) => {
      rows.push(['Department', `${row.department} Total`, row.total]);
      rows.push(['Department', `${row.department} Completed`, row.completed]);
      rows.push(['Department', `${row.department} In Progress`, row.inProgress]);
      rows.push(['Department', `${row.department} Overdue`, row.overdue]);
      rows.push(['Department', `${row.department} Closure Rate`, `${row.closureRate}%`]);
    });

    topOverdue.forEach((item) => {
      rows.push(['Top Overdue', item.id, `${item.title} | ${item.assignedTo} | ${Math.abs(item.daysLeft)}d overdue`]);
    });

    const csvContent = rows
      .map((row) => row.map((cell) => toCsvCell(cell)).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecc-ceo-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="ceo-root">
      <Navbar />

      <main className="ceo-body">
        <header className="ceo-header">
          <div>
            <span className="ceo-eyebrow">Executive Overview</span>
            <h1 className="ceo-title">Executive analytics view for CEO decision making</h1>
            <p className="ceo-subtitle">
              Snapshot of action volume, closure performance, and department-level risk.
            </p>
          </div>
          <div className="ceo-header-right">
            <button className="ceo-export-btn" onClick={exportExecutiveView}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 2.5v7M4.5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.5 11.5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Export CSV
            </button>
            <div className="ceo-date-chip">22 Apr 2026</div>
          </div>
        </header>

        <section className="ceo-kpi-grid">
          <article className="ceo-kpi-card active">
            <div className="ceo-kpi-header">
              <p>Total Active</p>
            </div>
            <h2>{kpis.totalActive}</h2>
            <div className="ceo-trend" style={{ color: '#059669', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>↑ 8% from last month</div>
          </article>
          <article className="ceo-kpi-card closure">
            <div className="ceo-kpi-header">
              <p>Closure Rate</p>
            </div>
            <h2>{kpis.closureRate}%</h2>
            <div className="ceo-trend" style={{ color: '#059669', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>↑ 4% from last month</div>
          </article>
          <article className="ceo-kpi-card overdue">
            <div className="ceo-kpi-header">
              <p>Overdue Count</p>
            </div>
            <h2>{kpis.overdueCount}</h2>
            <div className="ceo-trend" style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>↑ 12% from last month</div>
          </article>
          <article className="ceo-kpi-card avg">
            <div className="ceo-kpi-header">
              <p>Avg Days to Close</p>
            </div>
            <h2>{kpis.avgDaysToClose}d</h2>
            <div className="ceo-trend" style={{ color: '#059669', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>↓ 2.5d from last month</div>
          </article>
        </section>

        <section className="ceo-chart-card">
          <div className="ceo-card-head">
            <h3>Action Items by Department</h3>
            <span>{departmentData.reduce((sum, row) => sum + row.total, 0)} total</span>
          </div>
          <div className="ceo-chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={departmentData}
                margin={{ top: 16, right: 16, left: -10, bottom: 6 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill="var(--color-primary)" name="In Progress" />
                <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Overdue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Upcoming Meetings from Calendar */}
        <section className="ceo-chart-card" style={{ marginTop: 0 }}>
          <div className="ceo-card-head">
            <h3>Upcoming Meetings — Calendar View</h3>
            <span>{upcomingMeetings.length} scheduled · {syncedMeetings.size} added to calendar</span>
          </div>
          {upcomingMeetings.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 13, padding: '16px 0' }}>No upcoming meetings scheduled.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {upcomingMeetings.map((m, idx) => {
                const isToday = m.daysUntil === 0;
                const isSoon = m.daysUntil <= 7;
                const urgencyColor = isToday ? '#dc2626' : isSoon ? '#d97706' : '#1e40af';
                const urgencyBg = isToday ? '#fef2f2' : isSoon ? '#fffbeb' : '#eff6ff';
                const isSynced = syncedMeetings.has(m.id);
                const isOpen = expandedBrief === m.id;
                const relatedActions = MOCK_ACTIONS.filter((a) => m.actionItemIds.includes(a.id));
                const overdueActions = relatedActions.filter((a) => a.status === 'overdue' || a.daysLeft < 0);
                const pendingActions = relatedActions.filter((a) => !['completed'].includes(a.status));

                return (
                  <div
                    key={m.id}
                    style={{
                      borderBottom: idx < upcomingMeetings.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    {/* Meeting row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '16px 0',
                      flexWrap: 'wrap',
                    }}>
                      {/* Left: date badge + info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                        <div style={{
                          width: 50, height: 50, borderRadius: 10,
                          background: urgencyBg, border: `1.5px solid ${urgencyColor}33`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 17, fontWeight: 800, color: urgencyColor, lineHeight: 1 }}>
                            {new Date(m.dateIso).getDate()}
                          </span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: urgencyColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {new Date(m.dateIso).toLocaleString('en', { month: 'short' })}
                          </span>
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                            {m.title}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, color: '#64748b' }}>
                              {m.department} · {m.participants.length} participants
                            </span>
                            {overdueActions.length > 0 && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '1px 6px', borderRadius: 4 }}>
                                {overdueActions.length} overdue item{overdueActions.length > 1 ? 's' : ''}
                              </span>
                            )}
                            {pendingActions.length > 0 && (
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                {pendingActions.length} pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: countdown + sync badge + buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                          background: urgencyBg, color: urgencyColor,
                          border: `1px solid ${urgencyColor}33`,
                          whiteSpace: 'nowrap',
                        }}>
                          {isToday ? 'Today' : `In ${m.daysUntil}d`}
                        </span>

                        {isSynced ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '5px 10px', borderRadius: 7,
                            background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                            fontSize: 12, fontWeight: 700, color: '#16a34a',
                            whiteSpace: 'nowrap',
                          }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <circle cx="6" cy="6" r="5" fill="#16a34a" />
                              <path d="M3.5 6l2 2 3-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Added to Calendar
                          </span>
                        ) : (
                          <AddMeetingToCalendarButton
                            meeting={m}
                            onSync={() => setSyncedMeetings((prev) => new Set([...prev, m.id]))}
                          />
                        )}

                        {/* Brief toggle */}
                        {m.keyPoints && m.keyPoints.length > 0 && (
                          <button
                            onClick={() => setExpandedBrief(isOpen ? null : m.id)}
                            title="Meeting preparation brief"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 5,
                              padding: '5px 10px', borderRadius: 7,
                              border: `1.5px solid ${isOpen ? '#1e40af' : '#e2e8f0'}`,
                              background: isOpen ? '#eff6ff' : 'white',
                              cursor: 'pointer', fontSize: 12, fontWeight: 600,
                              color: isOpen ? '#1e40af' : '#475569',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                              <path d="M6.5 5.5v4M6.5 4h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            Prep Brief
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                              <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Meeting Brief */}
                    {isOpen && m.keyPoints && (
                      <div style={{
                        margin: '0 0 16px 64px',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 12,
                        overflow: 'hidden',
                      }}>
                        {/* Brief header */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9' }}>
                          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                            CEO Preparation Brief · {m.title}
                          </p>
                        </div>

                        {/* Action status strip */}
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {relatedActions.map((a) => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: a.status === 'completed' ? '#16a34a' : a.status === 'overdue' ? '#dc2626' : a.status === 'blocked' ? '#d97706' : '#1e40af',
                              }} />
                              <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>{a.id}</span>
                              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                {a.status === 'overdue' ? `${Math.abs(a.daysLeft)}d overdue` : a.status === 'completed' ? 'Done' : `${a.daysLeft}d left`}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Key points */}
                        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {m.keyPoints.map((point, i) => {
                            const isRisk = point.toLowerCase().startsWith('risk:');
                            const isAsk = point.toLowerCase().startsWith('ask');
                            const isPrepare = point.toLowerCase().startsWith('prepare');
                            const icon = isRisk ? '⚠' : isAsk ? '?' : isPrepare ? '📋' : '•';
                            const color = isRisk ? '#dc2626' : isAsk ? '#1e40af' : '#0f172a';
                            const bg = isRisk ? '#fef2f2' : isAsk ? '#eff6ff' : 'transparent';
                            return (
                              <div key={i} style={{
                                display: 'flex', gap: 10, padding: isRisk || isAsk ? '8px 10px' : '0',
                                borderRadius: isRisk || isAsk ? 8 : 0,
                                background: bg,
                                border: isRisk ? '1px solid #fecaca' : isAsk ? '1px solid #bfdbfe' : 'none',
                              }}>
                                <span style={{ fontSize: 13, color, flexShrink: 0, fontWeight: 700, width: 16, textAlign: 'center' }}>
                                  {icon}
                                </span>
                                <p style={{ margin: 0, fontSize: 13, color, lineHeight: 1.6 }}>{point}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Participants */}
                        <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4 }}>Attendees</span>
                          {m.participants.map((name) => (
                            <span key={name} style={{
                              padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                              background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe',
                            }}>{name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="ceo-bottom-grid">
          <article className="ceo-table-card">
            <div className="ceo-card-head">
              <h3>Department Breakdown</h3>
              <span>{DEPARTMENTS.length} departments</span>
            </div>
            <div className="ceo-table-wrap">
              <table className="ceo-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total</th>
                    <th>Overdue</th>
                    <th>Closure Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentData.map((row) => (
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{row.total}</td>
                      <td className={row.overdue > 0 ? 'warn' : ''}>{row.overdue}</td>
                      <td>{row.closureRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="ceo-risk-card">
            <div className="ceo-card-head">
              <h3>Top 5 Overdue</h3>
              <span>{topOverdue.length} items</span>
            </div>
            <div className="ceo-risk-list">
              {topOverdue.map((item) => (
                <div key={item.id} className="ceo-risk-item">
                  <p className="ceo-risk-id">{item.id}</p>
                  <p className="ceo-risk-title">{item.title}</p>
                  <p className="ceo-risk-meta">
                    {item.assignedTo} · {Math.abs(item.daysLeft)}d overdue
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
