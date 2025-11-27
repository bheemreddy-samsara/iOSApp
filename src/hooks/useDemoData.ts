import { useEffect } from 'react';
import { useCalendarStore } from '@/state/calendarStore';
import { demoEvents } from '@/data/sampleEvents';

/**
 * Hook to load demo data for development/testing purposes.
 * Only loads data in development mode or when explicitly enabled.
 */
export const useDemoData = (enabled: boolean = __DEV__) => {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);
  const events = useCalendarStore((state) => state.events);

  useEffect(() => {
    // Only load demo data in development mode and if no real events exist
    if (enabled && Object.keys(events).length === 0) {
      upsertEvents(demoEvents);
    }
  }, [enabled, upsertEvents, events]);
};
