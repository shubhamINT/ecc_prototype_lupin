import { useState, useRef, useEffect } from 'react';
import type { Meeting } from '../../types/meetings';
import {
  downloadMeetingICS,
  openMeetingGoogleCalendar,
  openMeetingOutlookWeb,
} from '../../utils/calendarUtils';
import { PARTICIPANT_EMAIL_MAP } from '../../types/auth';
import {
  DropdownItem,
  CalendarIcon,
  ChevronIcon,
  OutlookDesktopIcon,
  GoogleCalendarIcon,
  OutlookWebIcon,
} from './CalendarDropdown';

interface Props {
  meeting: Meeting;
  onSync?: () => void;
}

export default function AddMeetingToCalendarButton({ meeting, onSync }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mappedCount = meeting.participants.filter((p) => PARTICIPANT_EMAIL_MAP[p]).length;
  const totalCount = meeting.participants.length;

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
        title={`Add meeting to calendar · ${mappedCount}/${totalCount} participants mapped`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 7,
          border: '1.5px solid #e2e8f0',
          background: open ? '#f1f5f9' : 'white',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          color: '#475569',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s',
        }}
      >
        <CalendarIcon size={14} />
        Add to Calendar
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            background: 'white',
            borderRadius: 10,
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 300,
            minWidth: 230,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '8px 14px',
              borderBottom: '1px solid #f1f5f9',
              background: '#f8fafc',
            }}
          >
            <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Participants ({mappedCount}/{totalCount} synced)
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {meeting.participants.map((name) => {
                const mapped = !!PARTICIPANT_EMAIL_MAP[name];
                return (
                  <span
                    key={name}
                    title={mapped ? PARTICIPANT_EMAIL_MAP[name] : 'No email mapping — will be skipped in .ics'}
                    style={{
                      padding: '2px 7px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 600,
                      background: mapped ? '#eff6ff' : '#f1f5f9',
                      color: mapped ? '#1e40af' : '#94a3b8',
                      border: `1px solid ${mapped ? '#bfdbfe' : '#e2e8f0'}`,
                    }}
                  >
                    {mapped ? '✓ ' : ''}{name.split(' ')[0]}
                  </span>
                );
              })}
            </div>
          </div>

          <DropdownItem
            icon={<OutlookDesktopIcon />}
            label="Outlook / .ics"
            sub={`Desktop · ${mappedCount} attendees embedded`}
            onClick={() => { downloadMeetingICS(meeting); setOpen(false); onSync?.(); }}
          />
          <DropdownItem
            icon={<GoogleCalendarIcon />}
            label="Google Calendar"
            sub="Opens in new tab"
            onClick={() => { openMeetingGoogleCalendar(meeting); setOpen(false); onSync?.(); }}
          />
          <DropdownItem
            icon={<OutlookWebIcon />}
            label="Outlook.com"
            sub="Opens in new tab"
            last
            onClick={() => { openMeetingOutlookWeb(meeting); setOpen(false); onSync?.(); }}
          />
        </div>
      )}
    </div>
  );
}
