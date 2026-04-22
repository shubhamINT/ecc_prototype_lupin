import { useEffect, useState } from 'react';
import type { ActionItem } from '../../types/actions';

interface Props {
  action: ActionItem | null;
  onDismiss: () => void;
}

export default function CalendarSyncToast({ action, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!action) { setVisible(false); return; }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [action, onDismiss]);

  if (!action) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        background: 'white',
        border: '1.5px solid #bbf7d0',
        borderRadius: 12,
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
        minWidth: 300,
        maxWidth: 380,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="2.5" width="16" height="14" rx="2.5" stroke="#16a34a" strokeWidth="1.4" />
          <path d="M5.5 1v3M12.5 1v3M1 7.5h16" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6 11l2 2 4-4" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          Calendar auto-synced
        </p>
        <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
          <strong style={{ color: '#0f172a' }}>{action.id}</strong> pushed to{' '}
          <strong style={{ color: '#0f172a' }}>{action.assignedTo.split(' ')[0]}</strong>'s Outlook &amp; Google Calendar
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>
          Deadline: {action.dueDate} · T-7, T-3, T-0 reminders set
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          color: '#94a3b8',
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Progress bar — drains over 4 seconds */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          borderRadius: '0 0 12px 12px',
          background: '#16a34a',
          width: visible ? '0%' : '100%',
          transition: visible ? 'width 4s linear' : 'none',
        }}
      />
    </div>
  );
}
