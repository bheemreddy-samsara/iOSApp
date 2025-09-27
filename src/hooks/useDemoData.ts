import { useEffect } from 'react';
import { useCalendarStore } from '@/state/calendarStore';
import { demoEvents } from '@/data/sampleEvents';

export const useDemoData = () => {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);

  useEffect(() => {
    upsertEvents(demoEvents);
  }, [upsertEvents]);
};
