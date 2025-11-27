import { useCalendarStore } from '@/state/calendarStore';
import { CalendarEvent } from '@/types';

describe('calendarStore', () => {
  beforeEach(() => {
    const { reset } = useCalendarStore.getState();
    reset();
  });

  it('upserts events', () => {
    const event: CalendarEvent = {
      id: 'evt-1',
      calendarId: 'family',
      title: 'Practice',
      category: '⚽ Sports',
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      approvalState: 'approved',
      privacyMode: 'family',
      creatorId: 'm-ava',
      attendees: [],
      allDay: false,
      multiDay: false,
    };

    useCalendarStore.getState().upsertEvents([event]);

    expect(useCalendarStore.getState().events['evt-1']).toBeDefined();
  });
});
