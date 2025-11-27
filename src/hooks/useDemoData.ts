import { useEffect, useRef } from 'react';
import { useCalendarStore } from '@/state/calendarStore';
import { demoEvents } from '@/data/sampleEvents';

/**
 * Hook to load demo data for development/testing purposes.
 * Only loads data in development mode or when explicitly enabled.
 */
export const useDemoData = (enabled: boolean = __DEV__) => {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only load demo data once in development mode
    if (enabled && !hasInitialized.current) {
      hasInitialized.current = true;
      const events = useCalendarStore.getState().events;
      if (Object.keys(events).length === 0) {
        upsertEvents(demoEvents);
      }
    }
  }, [enabled, upsertEvents]);
};
