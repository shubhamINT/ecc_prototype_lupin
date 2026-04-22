import type { ActionItem } from '../../types/actions';
import './GanttTimeline.css';

const STATUS_COLORS: Record<ActionItem['status'], string> = {
  open: '#94a3b8',
  'in-progress': '#1e40af',
  overdue: '#dc2626',
  completed: '#16a34a',
  blocked: '#d97706',
};

function dateValue(iso: string) {
  return new Date(iso).getTime();
}

interface Props {
  actions: ActionItem[];
  title?: string;
}

export default function GanttTimeline({ actions, title = 'Action Timeline' }: Props) {
  if (!actions.length) {
    return (
      <section className="gt-card">
        <div className="gt-head">
          <h3>{title}</h3>
        </div>
        <p className="gt-empty">No actions match the current filters.</p>
      </section>
    );
  }

  const timelineActions = [...actions]
    .sort((a, b) => dateValue(a.dueDateIso) - dateValue(b.dueDateIso))
    .slice(0, 10);

  const minStart = Math.min(...timelineActions.map((a) => dateValue(a.createdAt)));
  const maxEnd = Math.max(...timelineActions.map((a) => dateValue(a.dueDateIso)));
  const span = Math.max(maxEnd - minStart, 1);
  const today = dateValue('2026-04-22');
  const todayPct = ((today - minStart) / span) * 100;

  return (
    <section className="gt-card">
      <div className="gt-head">
        <h3>{title}</h3>
        <span>{timelineActions.length} actions shown</span>
      </div>

      <div className="gt-rail-wrap">
        <div className="gt-rail" />
        <div
          className="gt-today"
          style={{ left: `${Math.min(100, Math.max(0, todayPct))}%` }}
        >
          <span>Today</span>
        </div>

        <div className="gt-list">
          {timelineActions.map((action) => {
            const startPct = ((dateValue(action.createdAt) - minStart) / span) * 100;
            const endPct = ((dateValue(action.dueDateIso) - minStart) / span) * 100;
            const widthPct = Math.max(endPct - startPct, 2.4);

            return (
              <div key={action.id} className="gt-row">
                <div className="gt-meta">
                  <p className="gt-id">{action.id}</p>
                  <p className="gt-title">{action.title}</p>
                </div>
                <div className="gt-bar-zone">
                  <div
                    className="gt-bar"
                    style={{
                      left: `${Math.max(0, startPct)}%`,
                      width: `${Math.min(100, widthPct)}%`,
                      background: STATUS_COLORS[action.status],
                    }}
                  >
                    <span>{action.dueDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
