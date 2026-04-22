import type { ActionStatus } from '../types/actions';

export const STATUS_BG: Record<ActionStatus, string> = {
  open: '#f1f5f9',
  'in-progress': '#eff6ff',
  overdue: '#fef2f2',
  completed: '#f0fdf4',
  blocked: '#fffbeb',
};

export const STATUS_TEXT: Record<ActionStatus, string> = {
  open: '#475569',
  'in-progress': '#1e40af',
  overdue: '#dc2626',
  completed: '#16a34a',
  blocked: '#d97706',
};

export const STATUS_BORDER: Record<ActionStatus, string> = {
  open: '#e2e8f0',
  'in-progress': '#bfdbfe',
  overdue: '#fecaca',
  completed: '#bbf7d0',
  blocked: '#fde68a',
};

export const PRIORITY_BG = { high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' };
export const PRIORITY_TEXT = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };
