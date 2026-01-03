import { Event } from '../types';

export function createEvent(
  type: Event['type'],
  message: string
): Event {
  const now = new Date();
  const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS format
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp,
    type,
    message,
  };
}

export function formatTimestamp(date: Date): string {
  return date.toTimeString().split(' ')[0];
}

