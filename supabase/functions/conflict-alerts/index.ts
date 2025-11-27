import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

serve(async (req) => {
  const payload = await req.json().catch(() => null);
  console.log('Conflict check payload', payload);

  // TODO: Implement overlap detection and notifications.

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
