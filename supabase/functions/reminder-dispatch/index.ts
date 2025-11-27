import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

serve(async (req) => {
  const payload = await req.json().catch(() => null);
  console.log('Reminder dispatch payload', payload);

  // TODO: Fetch upcoming reminders and push notifications via Expo or email provider.

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
