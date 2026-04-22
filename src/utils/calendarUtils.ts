import type { ActionItem } from '../types/actions';

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

export function downloadICS(action: ActionItem): void {
  const uid = `${action.id}-${Date.now()}@ecc.lupindiagnostics.com`;
  const dtstart = toICSDate(action.dueDateIso);
  const dtend = nextDayICS(action.dueDateIso);
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

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

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ECC Lupin Diagnostics//ECC Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:[ECC] ${action.id}: ${action.title}`,
    `DESCRIPTION:${description}`,
    `CATEGORIES:ECC Action Item,${action.department}`,
    `PRIORITY:${action.priority === 'high' ? 1 : action.priority === 'medium' ? 5 : 9}`,
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due in 7 days: ${action.title}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P3D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due in 3 days: ${action.title}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:PT0S',
    'ACTION:DISPLAY',
    `DESCRIPTION:Due today: ${action.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ECC-${action.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openGoogleCalendar(action: ActionItem): void {
  const startDate = action.dueDateIso.replace(/-/g, '');
  const endDate = nextDayICS(action.dueDateIso);

  const details = [
    `Action ID: ${action.id}`,
    `Meeting: ${action.meetingTitle}`,
    `Priority: ${action.priority.toUpperCase()}`,
    `Department: ${action.department}`,
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
