/**
 * TODO — Feature 6: KPI Summary Tiles
 *
 * Renders a row of 4-5 stat cards at the top of AdminDashboard and CEODashboard.
 * Cards: Total Active, Overdue Count, Due This Week, Closure Rate, Avg Days to Close
 *
 * Props: stats (return type of getActionStats() from mockActions.ts)
 * Use getActionStats() from src/data/mockActions.ts to get live counts.
 *
 * Style: match the pd-stat-card pattern from PersonalDashboard for consistency.
 */

import { getActionStats } from '../../data/mockActions';

export default function KPISummaryTiles() {
  const stats = getActionStats();

  const tiles = [
    { label: 'Total Actions', value: stats.total, color: 'var(--color-primary)', bg: '#eff6ff' },
    { label: 'Open', value: stats.open, color: '#475569', bg: '#f1f5f9' },
    { label: 'In Progress', value: stats.inProgress, color: 'var(--color-primary)', bg: '#eff6ff' },
    { label: 'Blocked', value: stats.blocked, color: '#9333ea', bg: '#f3e8ff' },
    { label: 'Overdue', value: stats.overdue, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Completed', value: stats.completed, color: '#16a34a', bg: '#f0fdf4' },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {tiles.map((t) => (
        <div
          key={t.label}
          style={{
            flex: '1 1 160px', background: t.bg, border: `1px solid ${t.color}22`,
            borderRadius: 12, padding: '20px 24px',
          }}
        >
          <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.label}</p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: t.color, letterSpacing: '-1px' }}>{t.value}</p>
        </div>
      ))}
    </div>
  );
}
