export type ActionStatus = 'open' | 'in-progress' | 'overdue' | 'completed' | 'blocked';
export type Priority = 'high' | 'medium' | 'low';
export type Department = 'IT' | 'Finance' | 'Operations' | 'HR' | 'Quality' | 'Legal' | 'Supply Chain' | 'Marketing';

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedToId: string;
  department: Department;
  meetingId: string;
  meetingTitle: string;
  dueDate: string;
  dueDateIso: string;
  daysLeft: number;
  status: ActionStatus;
  priority: Priority;
  progress: number;
  blockedReason?: string;
  completionNotes?: string;
  createdAt: string;
  lastUpdated: string;
}

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  overdue: 'Overdue',
  completed: 'Completed',
  blocked: 'Blocked',
};

export const ACTION_STATUS_COLORS: Record<ActionStatus, string> = {
  open: '#64748b',
  'in-progress': '#1e40af',
  overdue: '#dc2626',
  completed: '#16a34a',
  blocked: '#d97706',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
