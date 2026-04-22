import { MOCK_ACTIONS, getActionStats } from '../../data/mockActions';
import KPISummaryTiles from '../../components/charts/KPISummaryTiles';
import ActionsByDepartmentBar from '../../components/charts/ActionsByDepartmentBar';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import './CEODashboard.css';

const DEPARTMENTS = ['IT', 'Finance', 'Operations', 'HR', 'Marketing'] as const;

type DeptName = (typeof DEPARTMENTS)[number];

interface DeptStat {
  dept: DeptName;
  total: number;
  open: number;
  inProgress: number;
  overdue: number;
  completed: number;
  completionPct: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildDeptStats(): DeptStat[] {
  return DEPARTMENTS.map((dept) => {
    const items = MOCK_ACTIONS.filter((a) => a.department === dept);
    const completed = items.filter((a) => a.status === 'completed').length;
    return {
      dept,
      total: items.length,
      open: items.filter((a) => a.status === 'open').length,
      inProgress: items.filter((a) => a.status === 'in-progress').length,
      overdue: items.filter((a) => a.status === 'overdue').length,
      completed,
      completionPct: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
    };
  });
}

// ── Donut chart helpers ──────────────────────────────────────────────────────

interface DonutSegment {
  label: string;
  count: number;
  color: string;
  pct: number;
}

/**
 * Build SVG strokeDasharray / strokeDashoffset for a donut ring.
 * Each circle occupies `pct`% of the circumference and is offset
 * by the cumulative percentage of all preceding segments.
 */
function buildDonutSegments(stats: ReturnType<typeof getActionStats>): DonutSegment[] {
  const total = stats.total || 1;
  return [
    { label: 'In Progress', count: stats.inProgress, color: '#1e40af', pct: (stats.inProgress / total) * 100 },
    { label: 'Completed',   count: stats.completed,  color: '#16a34a', pct: (stats.completed  / total) * 100 },
    { label: 'Open',        count: stats.open,        color: '#94a3b8', pct: (stats.open       / total) * 100 },
    { label: 'Overdue',     count: stats.overdue,     color: '#dc2626', pct: (stats.overdue    / total) * 100 },
  ];
}

// ── Score ring SVG ───────────────────────────────────────────────────────────

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

function ScoreRing({ score, size = 120, strokeColor = '#7c3aed', strokeWidth = 9 }: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="ceo-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="ceo-score-num" style={{ color: strokeColor }}>
        {score}
      </span>
    </div>
  );
}

// ── Donut chart component ─────────────────────────────────────────────────────

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
}

function DonutChart({ segments, size = 160 }: DonutChartProps) {
  const strokeWidth = 24;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <div className="ceo-donut-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        {segments.map((seg) => {
          const dashArray = (seg.pct / 100) * circ;
          const dashOffset = circ - cumulative * circ / 100;
          cumulative += seg.pct;
          if (seg.pct <= 0) return null;
          return (
            <circle
              key={seg.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circ - dashArray}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ── Completion bar ────────────────────────────────────────────────────────────

function completionColor(pct: number): string {
  if (pct >= 80) return '#16a34a';
  if (pct >= 40) return '#d97706';
  return '#dc2626';
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CEODashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = getActionStats();
  const eccScore = Math.round(((stats.completed + stats.inProgress) / stats.total) * 100);
  const deptStats = buildDeptStats();
  const donutSegments = buildDonutSegments(stats);

  const topOverdue = MOCK_ACTIONS
    .filter((a) => a.status === 'overdue')
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="ceo-root">
      <Navbar />

      <div className="ceo-body">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="ceo-header">
          <div className="ceo-header-left">
            <h1 className="ceo-title">Executive Dashboard</h1>
            <div className="ceo-subtitle">
              <span className="ceo-role-dot" aria-hidden="true" />
              CEO &middot; Organization-wide View
            </div>
          </div>
          <div className="ceo-date-chip">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="#94a3b8" strokeWidth="1.2" />
              <path d="M4 1v2M10 1v2M1 6h12" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            22 Apr 2026
          </div>
        </div>

        {/* ── KPI row ───────────────────────────────────────────────────── */}
        <div className="ceo-kpi-row">
          <div className="ceo-kpi-tiles">
            <KPISummaryTiles />
          </div>

          <div className="ceo-score-card">
            <ScoreRing score={eccScore} size={120} strokeColor="#7c3aed" strokeWidth={9} />
            <div className="ceo-score-meta">
              <p className="ceo-score-label">ECC Compliance Score</p>
              <p className="ceo-score-period">Q1 FY2026 &middot; All departments</p>
              <span className="ceo-score-badge">{eccScore >= 70 ? 'On Track' : 'At Risk'}</span>
            </div>
          </div>
        </div>

        {/* ── Charts row ───────────────────────────────────────────────── */}
        <div className="ceo-charts-row">
          {/* Left: bar chart by department */}
          <div className="ceo-bar-section">
            <ActionsByDepartmentBar />
          </div>

          {/* Right: status donut */}
          <div className="ceo-donut-section">
            <div className="ceo-donut-header">
              <h3 className="ceo-section-title">Status Breakdown</h3>
              <span className="ceo-section-count">{stats.total} total</span>
            </div>

            <div className="ceo-donut-body">
              <DonutChart segments={donutSegments} size={160} />
            </div>

            <div className="ceo-donut-legend">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="ceo-legend-item">
                  <span className="ceo-legend-dot" style={{ background: seg.color }} />
                  <span className="ceo-legend-label">{seg.label}</span>
                  <span className="ceo-legend-count">{seg.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom row ───────────────────────────────────────────────── */}
        <div className="ceo-bottom-row">

          {/* Left: department breakdown table */}
          <div className="ceo-dept-table-card">
            <div className="ceo-card-header">
              <h3 className="ceo-section-title">Department Summary</h3>
              <span className="ceo-section-count">{DEPARTMENTS.length} departments</span>
            </div>

            <div className="ceo-table-wrap">
              <table className="ceo-dept-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total</th>
                    <th>Open</th>
                    <th>In Progress</th>
                    <th>Overdue</th>
                    <th>Completed</th>
                    <th>Completion %</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map((d) => (
                    <tr key={d.dept}>
                      <td>
                        <span className="ceo-dept-name">{d.dept}</span>
                      </td>
                      <td>
                        <span className="ceo-num-cell">{d.total}</span>
                      </td>
                      <td>
                        <span className="ceo-num-cell">{d.open}</span>
                      </td>
                      <td>
                        <span className="ceo-num-cell ceo-num-inprogress">{d.inProgress}</span>
                      </td>
                      <td>
                        <span className={`ceo-num-cell${d.overdue > 0 ? ' ceo-num-overdue' : ''}`}>
                          {d.overdue}
                        </span>
                      </td>
                      <td>
                        <span className="ceo-num-cell ceo-num-completed">{d.completed}</span>
                      </td>
                      <td>
                        <div className="ceo-completion-wrap">
                          <div className="ceo-completion-bar">
                            <div
                              className="ceo-completion-fill"
                              style={{
                                width: `${d.completionPct}%`,
                                background: completionColor(d.completionPct),
                              }}
                            />
                          </div>
                          <span
                            className="ceo-completion-pct"
                            style={{ color: completionColor(d.completionPct) }}
                          >
                            {d.completionPct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: top overdue list */}
          <div className="ceo-overdue-card">
            <div className="ceo-card-header">
              <div className="ceo-overdue-title-row">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2L14.5 13H1.5L8 2Z" stroke="#dc2626" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M8 6v3.5M8 11v.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <h3 className="ceo-section-title ceo-overdue-heading">Overdue Actions</h3>
              </div>
              <span className="ceo-overdue-count">{topOverdue.length}</span>
            </div>

            <div className="ceo-overdue-list">
              {topOverdue.map((item) => (
                <div key={item.id} className="ceo-overdue-item">
                  <div className="ceo-overdue-item-top">
                    <span className="ceo-overdue-id">{item.id}</span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <p className="ceo-overdue-item-title">{item.title}</p>
                  <div className="ceo-overdue-item-meta">
                    <span className="ceo-overdue-assignee">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <circle cx="6" cy="4" r="2.2" stroke="#94a3b8" strokeWidth="1.1" />
                        <path d="M1.5 10.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4" stroke="#94a3b8" strokeWidth="1.1" strokeLinecap="round" />
                      </svg>
                      {item.assignedTo}
                    </span>
                    <span className="ceo-overdue-days">
                      {Math.abs(item.daysLeft)}d overdue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
