// Event repository tests

// Type definitions for testing
interface DatabaseEvent {
  id: string;
  calendar_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  privacy_mode: 'family' | 'private' | 'busy-only';
  start_at: string;
  end_at: string;
  all_day: boolean;
  status: 'confirmed' | 'cancelled';
  approval_state: 'pending' | 'approved' | 'rejected';
  is_busy_only: boolean;
  source: string | null;
  created_at: string;
  updated_at: string;
}

interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  category: string;
  start: string;
  end: string;
  allDay: boolean;
  approvalState: 'pending' | 'approved' | 'rejected';
  isBusyOnly?: boolean;
  privacyMode: 'family' | 'private' | 'busy-only';
  creatorId: string;
  attendees: string[];
}

// Mapping functions extracted for testing
function mapDatabaseToEvent(db: DatabaseEvent): CalendarEvent {
  return {
    id: db.id,
    calendarId: db.calendar_id,
    title: db.title,
    description: db.description ?? undefined,
    location: db.location ?? undefined,
    category: db.category ?? 'general',
    start: db.start_at,
    end: db.end_at,
    allDay: db.all_day,
    approvalState: db.approval_state,
    isBusyOnly: db.is_busy_only,
    privacyMode: db.privacy_mode,
    creatorId: db.creator_id,
    attendees: [],
  };
}

function mapEventToDatabase(
  event: Partial<CalendarEvent>,
): Partial<DatabaseEvent> {
  const mapped: Partial<DatabaseEvent> = {};

  if (event.calendarId !== undefined) mapped.calendar_id = event.calendarId;
  if (event.title !== undefined) mapped.title = event.title;
  if (event.description !== undefined) mapped.description = event.description;
  if (event.location !== undefined) mapped.location = event.location;
  if (event.category !== undefined) mapped.category = event.category;
  if (event.start !== undefined) mapped.start_at = event.start;
  if (event.end !== undefined) mapped.end_at = event.end;
  if (event.allDay !== undefined) mapped.all_day = event.allDay;
  if (event.approvalState !== undefined)
    mapped.approval_state = event.approvalState;
  if (event.isBusyOnly !== undefined) mapped.is_busy_only = event.isBusyOnly;
  if (event.privacyMode !== undefined) mapped.privacy_mode = event.privacyMode;
  if (event.creatorId !== undefined) mapped.creator_id = event.creatorId;

  return mapped;
}

// Test data
const mockDbEvent: DatabaseEvent = {
  id: 'evt-1',
  calendar_id: 'cal-1',
  creator_id: 'm-1',
  title: 'Test Event',
  description: 'A test event',
  location: 'Test Location',
  category: 'meeting',
  privacy_mode: 'family',
  start_at: '2024-01-15T10:00:00Z',
  end_at: '2024-01-15T11:00:00Z',
  all_day: false,
  status: 'confirmed',
  approval_state: 'approved',
  is_busy_only: false,
  source: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('eventRepository', () => {
  describe('mapDatabaseToEvent', () => {
    it('maps all fields correctly', () => {
      const result = mapDatabaseToEvent(mockDbEvent);

      expect(result.id).toBe('evt-1');
      expect(result.calendarId).toBe('cal-1');
      expect(result.creatorId).toBe('m-1');
      expect(result.title).toBe('Test Event');
      expect(result.description).toBe('A test event');
      expect(result.location).toBe('Test Location');
      expect(result.category).toBe('meeting');
      expect(result.privacyMode).toBe('family');
      expect(result.start).toBe('2024-01-15T10:00:00Z');
      expect(result.end).toBe('2024-01-15T11:00:00Z');
      expect(result.allDay).toBe(false);
      expect(result.approvalState).toBe('approved');
      expect(result.isBusyOnly).toBe(false);
      expect(result.attendees).toEqual([]);
    });

    it('handles null description', () => {
      const dbEvent = { ...mockDbEvent, description: null };
      const result = mapDatabaseToEvent(dbEvent);
      expect(result.description).toBeUndefined();
    });

    it('handles null location', () => {
      const dbEvent = { ...mockDbEvent, location: null };
      const result = mapDatabaseToEvent(dbEvent);
      expect(result.location).toBeUndefined();
    });

    it('handles null category with default', () => {
      const dbEvent = { ...mockDbEvent, category: null };
      const result = mapDatabaseToEvent(dbEvent);
      expect(result.category).toBe('general');
    });

    it('handles all_day true', () => {
      const dbEvent = { ...mockDbEvent, all_day: true };
      const result = mapDatabaseToEvent(dbEvent);
      expect(result.allDay).toBe(true);
    });

    it('handles different approval states', () => {
      const pendingEvent = { ...mockDbEvent, approval_state: 'pending' as const };
      expect(mapDatabaseToEvent(pendingEvent).approvalState).toBe('pending');

      const rejectedEvent = { ...mockDbEvent, approval_state: 'rejected' as const };
      expect(mapDatabaseToEvent(rejectedEvent).approvalState).toBe('rejected');
    });

    it('handles different privacy modes', () => {
      const privateEvent = { ...mockDbEvent, privacy_mode: 'private' as const };
      expect(mapDatabaseToEvent(privateEvent).privacyMode).toBe('private');

      const busyOnlyEvent = { ...mockDbEvent, privacy_mode: 'busy-only' as const };
      expect(mapDatabaseToEvent(busyOnlyEvent).privacyMode).toBe('busy-only');
    });

    it('handles is_busy_only true', () => {
      const dbEvent = { ...mockDbEvent, is_busy_only: true };
      const result = mapDatabaseToEvent(dbEvent);
      expect(result.isBusyOnly).toBe(true);
    });
  });

  describe('mapEventToDatabase', () => {
    it('maps calendarId to calendar_id', () => {
      const result = mapEventToDatabase({ calendarId: 'cal-1' });
      expect(result.calendar_id).toBe('cal-1');
    });

    it('maps title', () => {
      const result = mapEventToDatabase({ title: 'Test' });
      expect(result.title).toBe('Test');
    });

    it('maps description', () => {
      const result = mapEventToDatabase({ description: 'Desc' });
      expect(result.description).toBe('Desc');
    });

    it('maps location', () => {
      const result = mapEventToDatabase({ location: 'Place' });
      expect(result.location).toBe('Place');
    });

    it('maps category', () => {
      const result = mapEventToDatabase({ category: 'meeting' });
      expect(result.category).toBe('meeting');
    });

    it('maps start to start_at', () => {
      const result = mapEventToDatabase({ start: '2024-01-15T10:00:00Z' });
      expect(result.start_at).toBe('2024-01-15T10:00:00Z');
    });

    it('maps end to end_at', () => {
      const result = mapEventToDatabase({ end: '2024-01-15T11:00:00Z' });
      expect(result.end_at).toBe('2024-01-15T11:00:00Z');
    });

    it('maps allDay to all_day', () => {
      const result = mapEventToDatabase({ allDay: true });
      expect(result.all_day).toBe(true);
    });

    it('maps approvalState to approval_state', () => {
      const result = mapEventToDatabase({ approvalState: 'pending' });
      expect(result.approval_state).toBe('pending');
    });

    it('maps isBusyOnly to is_busy_only', () => {
      const result = mapEventToDatabase({ isBusyOnly: true });
      expect(result.is_busy_only).toBe(true);
    });

    it('maps privacyMode to privacy_mode', () => {
      const result = mapEventToDatabase({ privacyMode: 'private' });
      expect(result.privacy_mode).toBe('private');
    });

    it('maps creatorId to creator_id', () => {
      const result = mapEventToDatabase({ creatorId: 'm-1' });
      expect(result.creator_id).toBe('m-1');
    });

    it('only includes defined fields', () => {
      const result = mapEventToDatabase({ title: 'Test' });
      expect(Object.keys(result)).toEqual(['title']);
    });

    it('handles empty object', () => {
      const result = mapEventToDatabase({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('maps multiple fields at once', () => {
      const result = mapEventToDatabase({
        title: 'Test',
        description: 'Desc',
        start: '2024-01-15T10:00:00Z',
        end: '2024-01-15T11:00:00Z',
      });

      expect(result.title).toBe('Test');
      expect(result.description).toBe('Desc');
      expect(result.start_at).toBe('2024-01-15T10:00:00Z');
      expect(result.end_at).toBe('2024-01-15T11:00:00Z');
    });
  });

  describe('round-trip conversion', () => {
    it('preserves data through db -> event -> db conversion', () => {
      const event = mapDatabaseToEvent(mockDbEvent);
      const dbEvent = mapEventToDatabase(event);

      expect(dbEvent.calendar_id).toBe(mockDbEvent.calendar_id);
      expect(dbEvent.title).toBe(mockDbEvent.title);
      expect(dbEvent.description).toBe(mockDbEvent.description);
      expect(dbEvent.location).toBe(mockDbEvent.location);
      expect(dbEvent.category).toBe(mockDbEvent.category);
      expect(dbEvent.start_at).toBe(mockDbEvent.start_at);
      expect(dbEvent.end_at).toBe(mockDbEvent.end_at);
      expect(dbEvent.all_day).toBe(mockDbEvent.all_day);
      expect(dbEvent.approval_state).toBe(mockDbEvent.approval_state);
      expect(dbEvent.is_busy_only).toBe(mockDbEvent.is_busy_only);
      expect(dbEvent.privacy_mode).toBe(mockDbEvent.privacy_mode);
      expect(dbEvent.creator_id).toBe(mockDbEvent.creator_id);
    });
  });
});
