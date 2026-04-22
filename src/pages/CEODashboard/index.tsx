import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ACTIONS, getActionStats } from '../../data/mockActions';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import './CEODashboard.css';

const DEPARTMENTS = ['IT', 'Finance', 'Operations', 'HR', 'Marketing'] as const;
const BAR_COLORS = ['#1e40af', '#059669', '#d97706', '#7c3aed', '#be123c'];

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
    return {
      department: dept,
      total: items.length,
      completed,
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
  payload?: Array<{ payload: { department: string; total: number; overdue: number; closureRate: number } }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="ceo-tooltip">
      <p className="ceo-tooltip-title">{row.department}</p>
      <p>Total Actions: {row.total}</p>
      <p>Overdue: {row.overdue}</p>
      <p>Closure Rate: {row.closureRate}%</p>
    </div>
  );
}

export default function CEODashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const departmentData = buildDepartmentData();
  const kpis = buildKpis();
  const topOverdue = [...MOCK_ACTIONS]
    .filter((item) => item.status === 'overdue')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div className="ceo-root">
      <Navbar />

      <main className="ceo-body">
        <header className="ceo-header">
          <div>
            <span className="ceo-eyebrow">Phase 6 · Analytics Dashboard</span>
            <h1 className="ceo-title">Executive analytics view for CEO decision making</h1>
            <p className="ceo-subtitle">
              Snapshot of action volume, closure performance, and department-level risk.
            </p>
          </div>
          <div className="ceo-date-chip">22 Apr 2026</div>
        </header>

        <section className="ceo-kpi-grid">
          <article className="ceo-kpi-card active">
            <p>Total Active</p>
            <h2>{kpis.totalActive}</h2>
          </article>
          <article className="ceo-kpi-card closure">
            <p>Closure Rate</p>
            <h2>{kpis.closureRate}%</h2>
          </article>
          <article className="ceo-kpi-card overdue">
            <p>Overdue Count</p>
            <h2>{kpis.overdueCount}</h2>
          </article>
          <article className="ceo-kpi-card avg">
            <p>Avg Days to Close</p>
            <h2>{kpis.avgDaysToClose}d</h2>
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
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {departmentData.map((entry) => (
                    <Cell key={entry.department} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
