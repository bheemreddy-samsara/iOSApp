import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface ReminderPayload {
  event_id?: string;
  batch_size?: number;
}

interface EventReminder {
  id: string;
  event_id: string;
  reminder_type: string;
  offset_minutes: number;
  events: {
    id: string;
    title: string;
    start_at: string;
    creator_id: string;
  };
}

interface MemberDevice {
  push_token: string;
  member_id: string;
}

async function sendExpoPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
) {
  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      to: pushToken,
      title,
      body,
      data,
      sound: 'default',
      priority: 'high',
    }),
  });

  return response.json();
}

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: ReminderPayload = await req.json().catch(() => ({}));
    const batchSize = payload.batch_size || 100;

    // Find reminders that should be sent (within the next minute, not yet delivered)
    const now = new Date();
    const { data: reminders, error: reminderError } = await supabase
      .from('event_reminders')
      .select(
        `
        id,
        event_id,
        reminder_type,
        offset_minutes,
        events!inner (
          id,
          title,
          start_at,
          creator_id
        )
      `,
      )
      .is('delivered_at', null)
      .eq('reminder_type', 'push')
      .limit(batchSize);

    if (reminderError) {
      throw new Error(`Failed to fetch reminders: ${reminderError.message}`);
    }

    const results: Array<{
      reminder_id: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const reminder of (reminders as EventReminder[]) || []) {
      const event = reminder.events;
      const eventStart = new Date(event.start_at);
      const reminderTime = new Date(
        eventStart.getTime() - reminder.offset_minutes * 60 * 1000,
      );

      // Check if reminder should be sent now (within 1 minute window)
      const timeDiff = reminderTime.getTime() - now.getTime();
      if (timeDiff > 60000 || timeDiff < -60000) {
        continue; // Skip - not time yet or already passed
      }

      // Get push tokens for event attendees
      const { data: attendees } = await supabase
        .from('event_attendees')
        .select('member_id')
        .eq('event_id', event.id);

      const memberIds = attendees?.map((a) => a.member_id) || [
        event.creator_id,
      ];

      const { data: devices } = await supabase
        .from('member_devices')
        .select('push_token, member_id')
        .in('member_id', memberIds)
        .not('push_token', 'is', null);

      // Send notifications
      for (const device of (devices as MemberDevice[]) || []) {
        try {
          const minutesUntil = reminder.offset_minutes;
          const body =
            minutesUntil === 0
              ? 'Starting now'
              : `Starting in ${minutesUntil} minute${minutesUntil > 1 ? 's' : ''}`;

          const pushResult = await sendExpoPushNotification(
            device.push_token,
            event.title,
            body,
            {
              event_id: event.id,
              type: 'reminder',
            },
          );

          // Check for Expo push API errors (can return 200 with error body)
          if (pushResult.data?.[0]?.status === 'error') {
            throw new Error(
              pushResult.data[0].message || 'Push notification failed',
            );
          }

          results.push({ reminder_id: reminder.id, success: true });
        } catch (err) {
          results.push({
            reminder_id: reminder.id,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }

      // Only mark reminder as delivered if at least one notification succeeded
      const successCount = results.filter(
        (r) => r.reminder_id === reminder.id && r.success,
      ).length;
      if (successCount > 0) {
        await supabase
          .from('event_reminders')
          .update({ delivered_at: now.toISOString() })
          .eq('id', reminder.id);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        processed: results.length,
        results,
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
