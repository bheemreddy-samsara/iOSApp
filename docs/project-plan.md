# TogetherCal Project Plan

## Milestones
1. **Foundation & Tooling** — Set up Expo project, linting/testing tools, core theme tokens, Supabase client stubs. _Target:_ Week 1
2. **Core Calendar Experience** — Implement Today & Calendar views with navigation, state management, sample data, and offline cache. _Target:_ Week 2-3
3. **Collaboration & Permissions** — Add roles, approvals workflow, member management, notifications wiring, and Supabase schema + RLS. _Target:_ Week 3-4
4. **Integrations & Sync** — Implement OAuth flows, provider syncing (read-only where required), ICS import/export, duplicate detection heuristics. _Target:_ Week 5-6
5. **Polish & Compliance** — Accessibility audit, performance tuning, runbook & deployment hardening, app store assets. _Target:_ Week 7

## ASCII ERD
```
+-------------+       +----------------+       +-----------------+
| families    |1     *| members        |1     *| member_devices  |
|-------------|       |----------------|       |-----------------|
| id (PK)     |       | id (PK)        |       | id (PK)         |
| name        |       | family_id (FK) |       | member_id (FK)  |
| owner_id FK |       | role           |       | push_token      |
| timezone    |       | color_hex      |       | device_type     |
| created_at  |       | emoji          |       | notifications   |
| updated_at  |       | user_id        |       | created_at      |
+-------------+       | status         |       | updated_at      |
                     | created_at     |       +-----------------+
                     | updated_at     |
                     +----------------+
                            |
                            |1
                            |    +----------------+
                            +---<| member_links   |
                                 |----------------|
                                 | id (PK)        |
                                 | member_id (FK) |
                                 | provider       |
                                 | provider_uid   |
                                 | access_token   |
                                 | refresh_token  |
                                 | scopes         |
                                 | last_synced_at |
                                 +----------------+

+-------------+       +----------------+       +--------------------+
| calendars   |1     *| events         |1     *| event_attendees    |
|-------------|       |----------------|       |--------------------|
| id (PK)     |       | id (PK)        |       | id (PK)            |
| family_idFK |       | calendar_id FK |       | event_id (FK)      |
| provider    |       | creator_id FK  |       | member_id (FK)     |
| provider_id |       | title          |       | status             |
| name        |       | description    |       | rsvp_state         |
| emoji       |       | location       |       | role               |
| color_hex   |       | category       |       | created_at         |
| visibility  |       | privacy_mode   |       | updated_at         |
| sync_mode   |       | start_at       |       +--------------------+
| created_at  |       | end_at         |
| updated_at  |       | all_day        |   +---------------------+
+-------------+       | status         |1 *| event_reminders     |
                      | approval_state |   |---------------------|
                      | is_busy_only   |   | id (PK)             |
                      | source         |   | event_id (FK)       |
                      | created_at     |   | reminder_type       |
                      | updated_at     |   | offset_minutes      |
                      +----------------+   | delivered_at        |
                                           | channel             |
                                           +---------------------+

+-----------------+     +-------------------+
| notifications   |     | audit_logs        |
|-----------------|     |-------------------|
| id (PK)         |     | id (PK)           |
| member_id (FK)  |     | family_id (FK)    |
| payload         |     | actor_member_id FK|
| channel         |     | action            |
| status          |     | target_type       |
| delivered_at    |     | target_id         |
| created_at      |     | metadata          |
| updated_at      |     | created_at        |
+-----------------+     +-------------------+
```

## Screen Map
```
Onboarding → Auth (Supabase OAuth)
          ↓
     Home/Today ⇄ Calendar (Month | Week | Day)
          ↓                   ↓
   Event Sheet (Create/Edit)  ↔ Filters
          ↓
   Notifications Inbox
          ↓
   Members & Roles ⇄ Member Detail
          ↓
   Integrations Hub (Google | Outlook | Apple)
          ↓
   Settings (Preferences, Privacy, Export)
```

## Key Flows
- **Child event creation & approval:** Child member creates event → event stored as `pending` → push/email to parents → parent approves → event propagates to shared calendar + sends reminders.
- **Work calendar import:** User connects Outlook/Google work calendar → events ingested with `is_busy_only` set → UI renders "Title – Busy" with privacy badge → never writes back.
- **Conflict detection:** When new event scheduled, edge function checks overlapping critical events → sends conflict notification with options to adjust.
- **ICS export:** Owner triggers export → server bundles filtered events respecting privacy → download/email ICS link.
- **Notification preferences:** Member updates per-channel preferences → stored in Supabase with RLS → haptics confirm update → future notifications respect settings.
