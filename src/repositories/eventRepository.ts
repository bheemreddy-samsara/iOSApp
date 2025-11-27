import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase';
import { CalendarEvent } from '@/types';

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

export const eventRepository = {
  async fetchEvents(calendarId: string): Promise<CalendarEvent[]> {
    if (!isSupabaseConfigured()) return [];
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('calendar_id', calendarId)
      .order('start_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    return (data as DatabaseEvent[]).map(mapDatabaseToEvent);
  },

  async fetchEventsByFamily(familyId: string): Promise<CalendarEvent[]> {
    if (!isSupabaseConfigured()) return [];
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('events')
      .select(
        `
        *,
        calendars!inner(family_id)
      `,
      )
      .eq('calendars.family_id', familyId)
      .order('start_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch family events: ${error.message}`);
    }

    return (data as DatabaseEvent[]).map(mapDatabaseToEvent);
  },

  async fetchUpcomingEvents(
    calendarId: string,
    fromDate: Date = new Date(),
  ): Promise<CalendarEvent[]> {
    if (!isSupabaseConfigured()) return [];
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('calendar_id', calendarId)
      .gte('start_at', fromDate.toISOString())
      .order('start_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }

    return (data as DatabaseEvent[]).map(mapDatabaseToEvent);
  },

  async fetchEventById(eventId: string): Promise<CalendarEvent | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch event: ${error.message}`);
    }

    return mapDatabaseToEvent(data as DatabaseEvent);
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const dbEvent = mapEventToDatabase(event);

    const { data, error } = await supabase
      .from('events')
      .insert(dbEvent as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }

    return mapDatabaseToEvent(data as DatabaseEvent);
  },

  async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const dbUpdates = mapEventToDatabase(updates);

    const { data, error } = await supabase
      .from('events')
      // @ts-expect-error - Supabase types are incomplete for update operations
      .update(dbUpdates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }

    return mapDatabaseToEvent(data as DatabaseEvent);
  },

  async deleteEvent(eventId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.from('events').delete().eq('id', eventId);

    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  },

  async approveEvent(eventId: string): Promise<CalendarEvent> {
    return this.updateEvent(eventId, { approvalState: 'approved' });
  },

  async rejectEvent(eventId: string): Promise<CalendarEvent> {
    return this.updateEvent(eventId, { approvalState: 'rejected' });
  },
};
