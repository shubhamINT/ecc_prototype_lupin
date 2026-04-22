export interface Meeting {
  id: string;
  title: string;
  date: string;
  dateIso: string;
  organizer: string;
  participants: string[];
  department: string;
  momText: string;
  actionItemIds: string[];
  createdAt: string;
  calendarSynced?: boolean;
  keyPoints?: string[];
}

export interface MOMEntry {
  meetingId: string;
  section: string;
  content: string;
}
