/**
 * TODO — Feature 6: Bar Chart — Action Items by Department
 *
 * Renders a horizontal or vertical bar chart showing action item counts
 * broken down by department and color-coded by status.
 *
 * Data source: MOCK_ACTIONS from src/data/mockActions.ts
 * Library: Use inline SVG bars (no external chart lib needed for prototype)
 *          OR install recharts: pnpm add recharts
 *
 * Departments to show: IT, Finance, Operations, HR, Marketing
 * Bars: stacked by status (open / in-progress / overdue / completed)
 */

import { MOCK_ACTIONS } from '../../data/mockActions';
import type { Department } from '../../types/actions';

const DEPARTMENTS: Department[] = ['IT', 'Finance', 'Operations', 'HR'];
const STATUS_COLORS = {
  completed: '#16a34a',
  'in-progress': '#1e40af',
  open: '#94a3b8',
  overdue: '#dc2626',
  blocked: '#d97706',
};

export default function ActionsByDepartmentBar() {
  const data = DEPARTMENTS.map((dept) => {
    const items = MOCK_ACTIONS.filter((a) => a.department === dept);
    return {
      dept,
      total: items.length,
      completed: items.filter((a) => a.status === 'completed').length,
      inProgress: items.filter((a) => a.status === 'in-progress').length,
      open: items.filter((a) => a.status === 'open').length,
      overdue: items.filter((a) => a.status === 'overdue').length,
    };
  });

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px' }}>
      <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Action Items by Department</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.map((d) => (
          <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 80, fontSize: 13, fontWeight: 600, color: '#475569', textAlign: 'right', flexShrink: 0 }}>{d.dept}</div>
            <div style={{ flex: 1, height: 28, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
              {(['completed', 'inProgress', 'open', 'overdue'] as const).map((key) => {
                const statusKey = key === 'inProgress' ? 'in-progress' : key;
                const count = key === 'inProgress' ? d.inProgress : d[key as keyof typeof d] as number;
                const width = (count / maxTotal) * 100;
                return width > 0 ? (
                  <div
                    key={key}
                    title={`${statusKey}: ${count}`}
                    style={{ width: `${width}%`, background: STATUS_COLORS[statusKey as keyof typeof STATUS_COLORS], transition: 'width 0.3s' }}
                  />
                ) : null;
              })}
            </div>
            <div style={{ width: 24, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{d.total}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_COLORS).map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}
