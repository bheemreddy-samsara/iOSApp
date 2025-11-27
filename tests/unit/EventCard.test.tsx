import { CalendarEvent } from '@/types';

const baseEvent: CalendarEvent = {
  id: 'evt-test',
  calendarId: 'family-main',
  title: 'Jam Session',
  category: '🎵 Creatives',
  start: new Date().toISOString(),
  end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  approvalState: 'approved',
  privacyMode: 'family',
  creatorId: 'm-ava',
  attendees: ['m-ava'],
  allDay: false,
  multiDay: false,
};

describe('EventCard', () => {
  it('creates event object correctly', () => {
    expect(baseEvent.title).toBe('Jam Session');
    expect(baseEvent.privacyMode).toBe('family');
    expect(baseEvent.approvalState).toBe('approved');
  });

  it('handles busy-only events', () => {
    const busyEvent: CalendarEvent = {
      ...baseEvent,
      title: 'Product Sync',
      isBusyOnly: true,
      privacyMode: 'busy-only',
    };

    expect(busyEvent.isBusyOnly).toBe(true);
    expect(busyEvent.privacyMode).toBe('busy-only');
    expect(busyEvent.title).toBe('Product Sync');
  });
});
