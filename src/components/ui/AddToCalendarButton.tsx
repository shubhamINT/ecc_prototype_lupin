import { useState, useRef, useEffect } from 'react';
import type { ActionItem } from '../../types/actions';
import { downloadICS, openGoogleCalendar, openOutlookWeb } from '../../utils/calendarUtils';
import {
  DropdownItem,
  CalendarIcon,
  ChevronIcon,
  OutlookDesktopIcon,
  GoogleCalendarIcon,
  OutlookWebIcon,
} from './CalendarDropdown';

interface Props {
  action: ActionItem;
  compact?: boolean;
}

export default function AddToCalendarButton({ action, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title="Add to Calendar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: compact ? '5px 8px' : '8px 14px',
          borderRadius: 7,
          border: '1.5px solid #e2e8f0',
          background: open ? '#f1f5f9' : 'white',
          cursor: 'pointer',
          fontSize: compact ? 12 : 13,
          fontWeight: 600,
          color: '#475569',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s',
        }}
      >
        <CalendarIcon size={compact ? 13 : 15} />
        {!compact && 'Add to Calendar'}
        {!compact && <ChevronIcon open={open} />}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: compact ? 'auto' : 0,
            right: compact ? 0 : 'auto',
            background: 'white',
            borderRadius: 10,
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 200,
            minWidth: 210,
            overflow: 'hidden',
          }}
        >
          <DropdownItem
            icon={<OutlookDesktopIcon />}
            label="Outlook / .ics"
            sub="Desktop · Apple Calendar"
            onClick={() => { downloadICS(action); setOpen(false); }}
          />
          <DropdownItem
            icon={<GoogleCalendarIcon />}
            label="Google Calendar"
            sub="Opens in new tab"
            onClick={() => { openGoogleCalendar(action); setOpen(false); }}
          />
          <DropdownItem
            icon={<OutlookWebIcon />}
            label="Outlook.com"
            sub="Opens in new tab"
            last
            onClick={() => { openOutlookWeb(action); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}
