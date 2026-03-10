import { useCallback, useMemo, useState } from 'react';

import { fetchEventsByRange } from '@/services/googleCalendar';
import { useCalendarStore } from '@/store/useCalendarStore';
import { toCalendarEvent, type CalendarEvent } from '@/types/models';

export const useCalendarEvents = (accessToken?: string | null) => {
  const setEvents = useCalendarStore((state) => state.setEvents);
  const clearEvents = useCalendarStore((state) => state.clearEvents);
  const eventRecords = useCalendarStore((state) => state.events);

  const [isLoading, setIsLoading] = useState(false);
  const events = useMemo(() => eventRecords.map(toCalendarEvent), [eventRecords]);

  const refresh = useCallback(
    async (start: Date, end: Date) => {
      if (!accessToken) {
        clearEvents();
        return [] as CalendarEvent[];
      }

      setIsLoading(true);

      try {
        const fetched = await fetchEventsByRange(accessToken, start, end);
        setEvents(fetched);
        return fetched;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, clearEvents, setEvents],
  );

  return {
    events,
    isLoading,
    refresh,
  };
};
