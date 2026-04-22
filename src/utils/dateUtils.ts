export const formatDate = (isoDate: string): string => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getDaysLeft = (dueDateIso: string): number => {
  const today = new Date('2026-04-22');
  const due = new Date(dueDateIso);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const isOverdue = (daysLeft: number): boolean => daysLeft < 0;

export const isDueSoon = (daysLeft: number): boolean => daysLeft >= 0 && daysLeft <= 3;

export const isDueThisWeek = (daysLeft: number): boolean => daysLeft >= 0 && daysLeft <= 7;
