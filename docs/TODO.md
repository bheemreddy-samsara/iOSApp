# Non-goals & TODOs

- CalDAV sync is stubbed in `src/services/caldav.ts`; implement production-grade sync worker.
- Conflict detection edge function (`supabase/functions/conflict-alerts`) needs real overlap logic and notifications.
- Reminder dispatch function requires Expo push integration and email provider wiring.
- OAuth token refresh persistence needs hardened storage and encryption audit.
- Build out member invitation flow (email/SMS) and Supabase trigger for sanitized invites.
- Expand Detox coverage for approval flow, filters, integration connections.
- Add localization (i18n) and timezone preference management per member.
