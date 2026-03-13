import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { storage } from '@/services/storage';
import type { CalendarEvent, CalendarEventRecord } from '@/types/models';
import { toCalendarEvent } from '@/types/models';

interface CalendarStore {
  events: CalendarEventRecord[];
  selectedMode: 'week' | 'month';
  setSelectedMode: (mode: 'week' | 'month') => void;
  setEvents: (events: CalendarEvent[]) => void;
  clearEvents: () => void;
  getEvents: () => CalendarEvent[];
}

const toRecord = (event: CalendarEvent): CalendarEventRecord => ({
  id: event.id,
  title: event.title,
  startDateIso: event.startDate.toISOString(),
  endDateIso: event.endDate.toISOString(),
  googleCalendarId: event.googleCalendarId,
  color: event.color,
});

export const useCalendarStore = create<CalendarStore>()(
  persist(
    immer((set, get) => ({
      events: [],
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
      getEvents: () => get().events.map(toCalendarEvent),
    })),
    {
      name: 'calendar-store',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        selectedMode: state.selectedMode,
        events: state.events,
      }),
    },
  ),
);
