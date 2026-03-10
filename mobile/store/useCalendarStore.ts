import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { storage } from '@/services/storage';
import type { CalendarEvent, CalendarEventRecord, CalendarLink } from '@/types/models';
import { toCalendarEvent } from '@/types/models';

interface CalendarStore {
  events: CalendarEventRecord[];
  links: CalendarLink[];
  selectedMode: 'week' | 'month';
  setSelectedMode: (mode: 'week' | 'month') => void;
  setEvents: (events: CalendarEvent[]) => void;
  clearEvents: () => void;
  linkCalendarToProject: (calendarId: string, projectId: string, color?: string) => void;
  getEvents: () => CalendarEvent[];
  getLinkedProjectByCalendarId: (calendarId: string) => CalendarLink | undefined;
}

const toRecord = (event: CalendarEvent): CalendarEventRecord => ({
  id: event.id,
  title: event.title,
  startDateIso: event.startDate.toISOString(),
  endDateIso: event.endDate.toISOString(),
  googleCalendarId: event.googleCalendarId,
  projectId: event.projectId,
  color: event.color,
});

export const useCalendarStore = create<CalendarStore>()(
  persist(
    immer((set, get) => ({
      events: [],
      links: [],
      selectedMode: 'week',
      setSelectedMode: (mode) => {
        set((state) => {
          state.selectedMode = mode;
        });
      },
      setEvents: (events) => {
        set((state) => {
          state.events = events.map(toRecord);
        });
      },
      clearEvents: () => {
        set((state) => {
          state.events = [];
        });
      },
      linkCalendarToProject: (calendarId, projectId, color) => {
        set((state) => {
          const existing = state.links.find((link) => link.googleCalendarId === calendarId);

          if (existing) {
            existing.projectId = projectId;
            existing.color = color;
            return;
          }

          state.links.push({
            googleCalendarId: calendarId,
            projectId,
            color,
          });
        });
      },
      getEvents: () => get().events.map(toCalendarEvent),
      getLinkedProjectByCalendarId: (calendarId) => {
        return get().links.find((link) => link.googleCalendarId === calendarId);
      },
    })),
    {
      name: 'calendar-store',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        links: state.links,
        selectedMode: state.selectedMode,
        events: state.events,
      }),
    },
  ),
);
