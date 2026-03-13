import type { CalendarEvent } from '@/types/models';

export interface GoogleCalendarInfo {
  id: string;
  summary: string;
  backgroundColor?: string;
}

export interface GoogleAuthResult {
  accessToken: string;
  expiresAt: number;
}

export const signInGoogle = async (): Promise<GoogleAuthResult | null> => {
  // Calendar integration is intentionally deferred to v2.
  return null;
};

export const fetchCalendars = async (_accessToken: string): Promise<GoogleCalendarInfo[]> => {
  return [];
};

export const fetchEventsByRange = async (
  _accessToken: string,
  _start: Date,
  _end: Date,
): Promise<CalendarEvent[]> => {
  return [];
};
