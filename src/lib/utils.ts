import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: Timestamp): string {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatMileage(mileage: number): string {
  if (!mileage) return '0 miles';
  return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
} 

export function formatTimestamp(timestamp: Date): string {
  return new Date(timestamp).toLocaleString();
} 