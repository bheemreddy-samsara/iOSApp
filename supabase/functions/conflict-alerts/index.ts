import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ConflictPayload {
  event_id?: string;
  family_id?: string;
  check_window_hours?: number;
}

interface Event {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  calendar_id: string;
  creator_id: string;
}

interface Conflict {
  event_a: { id: string; title: string; start: string; end: string };
  event_b: { id: string; title: string; start: string; end: string };
  overlap_minutes: number;
  members_affected: string[];
}

function eventsOverlap(a: Event, b: Event): number {
  const aStart = new Date(a.start_at).getTime();
  const aEnd = new Date(a.end_at).getTime();
  const bStart = new Date(b.start_at).getTime();
  const bEnd = new Date(b.end_at).getTime();

  const overlapStart = Math.max(aStart, bStart);
  const overlapEnd = Math.min(aEnd, bEnd);

  if (overlapStart < overlapEnd) {
    return Math.round((overlapEnd - overlapStart) / 60000);
  }
  return 0;
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: ConflictPayload = await req.json().catch(() => ({}));
    const checkWindowHours = payload.check_window_hours || 24 * 7; // Default: 1 week

    const now = new Date();
    const windowEnd = new Date(
      now.getTime() + checkWindowHours * 60 * 60 * 1000,
    );

    // Build query based on payload
    let query = supabase
      .from('events')
      .select(
        `
        id,
        title,
        start_at,
        end_at,
        calendar_id,
        creator_id,
        event_attendees(member_id),
        calendars!inner(family_id)
      `,
      )
      .gte('start_at', now.toISOString())
      .lte('start_at', windowEnd.toISOString())
      .eq('status', 'confirmed');

    if (payload.event_id) {
      // Check conflicts for a specific event
      const { data: targetEvent } = await supabase
        .from('events')
        .select('*, calendars!inner(family_id)')
        .eq('id', payload.event_id)
        .single();

      if (!targetEvent) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Event not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      query = query.eq('calendars.family_id', targetEvent.calendars.family_id);
    } else if (payload.family_id) {
      query = query.eq('calendars.family_id', payload.family_id);
    }

    const { data: events, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }

    const conflicts: Conflict[] = [];
    const eventList = (events as Event[]) || [];

    // Build member-to-events mapping
    const memberEvents = new Map<string, Event[]>();
    for (const event of eventList) {
      const attendees = (event as any).event_attendees || [];
      const memberIds = attendees.map((a: any) => a.member_id);
      memberIds.push(event.creator_id);

      for (const memberId of memberIds) {
        if (!memberEvents.has(memberId)) {
          memberEvents.set(memberId, []);
        }
        memberEvents.get(memberId)!.push(event);
      }
    }

    // Check for conflicts per member
    const seenConflicts = new Set<string>();

    for (const [_memberId, memberEventList] of memberEvents) {
      for (let i = 0; i < memberEventList.length; i++) {
        for (let j = i + 1; j < memberEventList.length; j++) {
          const eventA = memberEventList[i];
          const eventB = memberEventList[j];
          const overlapMinutes = eventsOverlap(eventA, eventB);

          if (overlapMinutes > 0) {
            const conflictKey = [eventA.id, eventB.id].sort().join('-');

            if (!seenConflicts.has(conflictKey)) {
              seenConflicts.add(conflictKey);

              // Find all members affected by this conflict
              const affectedMembers: string[] = [];
              for (const [mId, mEvents] of memberEvents) {
                if (mEvents.includes(eventA) && mEvents.includes(eventB)) {
                  affectedMembers.push(mId);
                }
              }

              conflicts.push({
                event_a: {
                  id: eventA.id,
                  title: eventA.title,
                  start: eventA.start_at,
                  end: eventA.end_at,
                },
                event_b: {
                  id: eventB.id,
                  title: eventB.title,
                  start: eventB.start_at,
                  end: eventB.end_at,
                },
                overlap_minutes: overlapMinutes,
                members_affected: affectedMembers,
              });
            }
          }
        }
      }
    }

    // Create notifications for conflicts
    for (const conflict of conflicts) {
      for (const memberId of conflict.members_affected) {
        await supabase.from('notifications').insert({
          member_id: memberId,
          payload: {
            type: 'conflict',
            event_a_id: conflict.event_a.id,
            event_a_title: conflict.event_a.title,
            event_b_id: conflict.event_b.id,
            event_b_title: conflict.event_b.title,
            overlap_minutes: conflict.overlap_minutes,
          },
          channel: 'in_app',
          status: 'queued',
        });
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        conflicts_found: conflicts.length,
        conflicts,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
