import { useState, useRef, useEffect } from 'react';
import type { Meeting } from '../../types/meetings';
import {
  downloadMeetingICS,
  openMeetingGoogleCalendar,
  openMeetingOutlookWeb,
} from '../../utils/calendarUtils';
import { PARTICIPANT_EMAIL_MAP } from '../../types/auth';

interface Props {
  meeting: Meeting;
  onSync?: () => void;
}

export default function AddMeetingToCalendarButton({ meeting, onSync }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Count how many participants have mapped emails (for the tooltip)
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
        <CalendarIcon />
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
          {/* Participant pill strip */}
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
            onClick={() => {
              downloadMeetingICS(meeting);
              setOpen(false);
              onSync?.();
            }}
          />
          <DropdownItem
            icon={<GoogleCalendarIcon />}
            label="Google Calendar"
            sub="Opens in new tab"
            onClick={() => {
              openMeetingGoogleCalendar(meeting);
              setOpen(false);
              onSync?.();
            }}
          />
          <DropdownItem
            icon={<OutlookWebIcon />}
            label="Outlook.com"
            sub="Opens in new tab"
            last
            onClick={() => {
              openMeetingOutlookWeb(meeting);
              setOpen(false);
              onSync?.();
            }}
          />
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  sub,
  last = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  last?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        border: 'none',
        borderBottom: last ? 'none' : '1px solid #f1f5f9',
        background: hovered ? '#f8fafc' : 'white',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      {icon}
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{label}</p>
        <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{sub}</p>
      </div>
    </button>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="#475569" strokeWidth="1.3" />
      <path d="M5 1v3M11 1v3M1 7h14" stroke="#475569" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="4" y="9" width="3" height="2.5" rx="0.5" fill="#475569" opacity="0.4" />
      <rect x="9" y="9" width="3" height="2.5" rx="0.5" fill="#475569" opacity="0.4" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
    >
      <path
        d="M2 3.5l3 3 3-3"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OutlookDesktopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="5" fill="#0078D4" />
      <rect x="4" y="5" width="8" height="12" rx="1" fill="white" opacity="0.95" />
      <rect x="10" y="7" width="8" height="9" rx="1" fill="#50C8FF" opacity="0.9" />
      <circle cx="8" cy="11" r="2.5" fill="#0078D4" />
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="5" fill="white" />
      <rect width="22" height="22" rx="5" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="3" y="3" width="16" height="16" rx="2" fill="white" />
      <rect x="3" y="3" width="16" height="5" rx="2" fill="#4285F4" />
      <rect x="3" y="6" width="16" height="2" fill="#4285F4" />
      <text x="11" y="17" textAnchor="middle" fontSize="7" fontWeight="800" fill="#0F9D58" fontFamily="sans-serif">
        G
      </text>
      <path d="M7 11h8M7 14h5" stroke="#dadce0" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function OutlookWebIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect width="22" height="22" rx="5" fill="#0F6CBD" />
      <rect x="4" y="6" width="14" height="10" rx="1.5" stroke="white" strokeWidth="1.2" fill="none" />
      <path d="M4 9.5l7 4 7-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
