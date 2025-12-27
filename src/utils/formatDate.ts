import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}