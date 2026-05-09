import { format, formatDistanceToNow, isToday, isTomorrow, isPast, isSameDay } from 'date-fns';
import type { Priority } from '../types';

export function formatDueDate(dateString: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';

  return format(date, 'MMM d');
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  return isPast(new Date(dateString)) && !isSameDay(new Date(), new Date(dateString));
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    case 'medium':
      return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
    case 'low':
      return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
    default:
      return 'text-slate-500 bg-slate-50 dark:bg-slate-800';
  }
}

export function getPriorityBgColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-amber-500';
    case 'low':
      return 'border-l-emerald-500';
    default:
      return 'border-l-slate-300';
  }
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function exportToJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function importFromJson<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}