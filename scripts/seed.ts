import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { demoEvents, demoMembers } from '@/data/sampleEvents';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.',
  );
}

const client = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function seed() {
  const { data: family } = await client
    .from('families')
    .upsert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Family',
      owner_id: demoMembers[0].id,
      timezone: 'America/Los_Angeles',
    })
    .select()
    .single();

  console.log('Seeded family', family?.id);

  await Promise.all(
    demoMembers.map((member) =>
      client.from('members').upsert({
        id: member.id,
        family_id: family?.id,
        user_id: member.id,
        role: member.role,
        color_hex: member.color,
        emoji: member.emoji,
        status: 'active',
      }),
    ),
  );

  await Promise.all(
    demoEvents.map((event) =>
      client.from('events').upsert({
        id: event.id,
        calendar_id: 'family-main',
        creator_id: event.creatorId,
        title: event.title,
        description: event.description,
        location: event.location,
        category: event.category,
        privacy_mode: event.privacyMode,
        start_at: event.start,
        end_at: event.end,
        all_day: event.allDay ?? false,
        approval_state: event.approvalState,
        is_busy_only: event.isBusyOnly ?? false,
        source: event.provider ?? 'internal',
      }),
    ),
  );

  console.log('Seed complete');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
