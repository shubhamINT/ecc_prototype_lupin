import type { ActionItem } from '../types/actions';
import type { Meeting } from '../types/meetings';
import { PARTICIPANT_EMAIL_MAP } from '../types/auth';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toICSDate(isoDate: string): string {
  return isoDate.replace(/-/g, '');
}

function nextDayICS(isoDate: string): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0].replace(/-/g, '');
}

function nextDayISO(isoDate: string): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function nowStamp(): string {
  return new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
}

/** Resolves participant names to ATTENDEE lines. Unknown names (externals, groups) are skipped. */
function buildAttendeeLines(names: string[]): string[] {
  return names
    .filter((name) => PARTICIPANT_EMAIL_MAP[name])
    .map(
      (name) =>
        `ATTENDEE;CN=${name};ROLE=REQ-PARTICIPANT;RSVP=FALSE:mailto:${PARTICIPANT_EMAIL_MAP[name]}`
    );
}

function triggerDownload(icsLines: string[], filename: string): void {
  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Action Item Calendar ────────────────────────────────────────────────────

/**
 * Downloads a .ics file for an action item deadline.
 * Includes the assigned owner as ATTENDEE + T-7/T-3/T-0 reminders.
 * Compatible with Outlook desktop and Apple Calendar.
 */
export function downloadICS(action: ActionItem): void {
  const uid = `${action.id}-${Date.now()}@ecc.lupindiagnostics.com`;
  const dtstart = toICSDate(action.dueDateIso);
  const dtend = nextDayICS(action.dueDateIso);

  const description = [
    `Action ID: ${action.id}`,
    `Meeting: ${action.meetingTitle}`,
    `Priority: ${action.priority.toUpperCase()}`,
    `Status: ${action.status}`,
    `Department: ${action.department}`,
    action.description ? `Details: ${action.description}` : '',
  ]
    .filter(Boolean)
    .join('\\n');

  const attendeeLines = buildAttendeeLines([action.assignedTo]);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ECC Lupin Diagnostics//ECC Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp()}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:[ECC] ${action.id}: ${action.title}`,
    `DESCRIPTION:${description}`,
    `CATEGORIES:ECC Action Item,${action.department}`,
    `PRIORITY:${action.priority === 'high' ? 1 : action.priority === 'medium' ? 5 : 9}`,
    ...attendeeLines,
    // T-7 reminder
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due in 7 days: ${action.title}`,
    'END:VALARM',
    // T-3 reminder
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due in 3 days: ${action.title}`,
    'END:VALARM',
    // T-0 reminder
    'BEGIN:VALARM',
    'TRIGGER:PT0S',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due today: ${action.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  triggerDownload(lines, `ECC-${action.id}.ics`);
}

/** Opens Google Calendar pre-filled with action deadline event. */
export function openGoogleCalendar(action: ActionItem): void {
  const startDate = toICSDate(action.dueDateIso);
  const endDate = nextDayICS(action.dueDateIso);

  const details = [
    `Action ID: ${action.id}`,
    `Meeting: ${action.meetingTitle}`,
    `Priority: ${action.priority.toUpperCase()}`,
    `Department: ${action.department}`,
    `Assigned To: ${action.assignedTo}`,
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[ECC] ${action.id}: ${action.title}`,
    dates: `${startDate}/${endDate}`,
    details,
    sf: 'true',
    output: 'xml',
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

/** Opens Outlook.com calendar compose pre-filled with action deadline event. */
export function openOutlookWeb(action: ActionItem): void {
  const params = new URLSearchParams({
    subject: `[ECC] ${action.id}: ${action.title}`,
    startdt: action.dueDateIso,
    enddt: nextDayISO(action.dueDateIso),
    body: [
      `Action ID: ${action.id}`,
      `Meeting: ${action.meetingTitle}`,
      `Priority: ${action.priority.toUpperCase()}`,
      `Department: ${action.department}`,
      `Assigned To: ${action.assignedTo}`,
    ].join('\n'),
    allday: 'true',
    path: '/calendar/action/compose',
    rru: 'addevent',
  });

  window.open(
    `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`,
    '_blank'
  );
}

// ─── Meeting Calendar ────────────────────────────────────────────────────────

/**
 * Downloads a .ics file for a meeting.
 * Includes all known internal participants as ATTENDEEs.
 * External/group participant names (e.g. "Plant Managers") are skipped —
 * they have no email mapping in PARTICIPANT_EMAIL_MAP.
 */
export function downloadMeetingICS(meeting: Meeting): void {
  const uid = `${meeting.id}-${Date.now()}@ecc.lupindiagnostics.com`;
  const dtstart = toICSDate(meeting.dateIso);
  const dtend = nextDayICS(meeting.dateIso);

  const description = [
    `Meeting ID: ${meeting.id}`,
    `Organizer: ${meeting.organizer}`,
    `Department: ${meeting.department}`,
    `Participants: ${meeting.participants.join(', ')}`,
    `Action Items: ${meeting.actionItemIds.join(', ')}`,
  ].join('\\n');

  const attendeeLines = buildAttendeeLines(meeting.participants);

  const organizerEmail = PARTICIPANT_EMAIL_MAP[meeting.organizer] ?? '';
  const organizerLine = organizerEmail
    ? `ORGANIZER;CN=${meeting.organizer}:mailto:${organizerEmail}`
    : '';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ECC Lupin Diagnostics//ECC Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStamp()}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:[ECC Meeting] ${meeting.title}`,
    `DESCRIPTION:${description}`,
    `CATEGORIES:ECC Meeting,${meeting.department}`,
    organizerLine,
    ...attendeeLines,
    // Day-before reminder for the meeting
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Tomorrow: ${meeting.title}`,
    'END:VALARM',
    // Morning-of reminder
    'BEGIN:VALARM',
    'TRIGGER:PT0S',
    'ACTION:DISPLAY',
    `DESCRIPTION:Today: ${meeting.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  triggerDownload(lines, `ECC-${meeting.id}.ics`);
}

/** Opens Google Calendar pre-filled with meeting event + all participants. */
export function openMeetingGoogleCalendar(meeting: Meeting): void {
  const startDate = toICSDate(meeting.dateIso);
  const endDate = nextDayICS(meeting.dateIso);

  const details = [
    `Meeting ID: ${meeting.id}`,
    `Organizer: ${meeting.organizer}`,
    `Department: ${meeting.department}`,
    `Participants: ${meeting.participants.join(', ')}`,
    `Actions: ${meeting.actionItemIds.join(', ')}`,
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[ECC Meeting] ${meeting.title}`,
    dates: `${startDate}/${endDate}`,
    details,
    sf: 'true',
    output: 'xml',
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

/** Opens Outlook.com calendar compose pre-filled with meeting event. */
export function openMeetingOutlookWeb(meeting: Meeting): void {
  const params = new URLSearchParams({
    subject: `[ECC Meeting] ${meeting.title}`,
    startdt: meeting.dateIso,
    enddt: nextDayISO(meeting.dateIso),
    body: [
      `Meeting ID: ${meeting.id}`,
      `Organizer: ${meeting.organizer}`,
      `Department: ${meeting.department}`,
      `Participants: ${meeting.participants.join(', ')}`,
      `Actions: ${meeting.actionItemIds.join(', ')}`,
    ].join('\n'),
    allday: 'true',
    path: '/calendar/action/compose',
    rru: 'addevent',
  });

  window.open(
    `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`,
    '_blank'
  );
}
