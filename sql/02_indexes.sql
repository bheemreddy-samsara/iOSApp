-- Performance indexes for TogetherCal
-- Run this migration after 01_schema.sql

-- Members table indexes
CREATE INDEX IF NOT EXISTS idx_members_family_id ON public.members(family_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status) WHERE status = 'active';

-- Member devices indexes
CREATE INDEX IF NOT EXISTS idx_member_devices_member_id ON public.member_devices(member_id);

-- Member links indexes
CREATE INDEX IF NOT EXISTS idx_member_links_member_id ON public.member_links(member_id);
CREATE INDEX IF NOT EXISTS idx_member_links_provider ON public.member_links(provider);

-- Calendars table indexes
CREATE INDEX IF NOT EXISTS idx_calendars_family_id ON public.calendars(family_id);
CREATE INDEX IF NOT EXISTS idx_calendars_provider ON public.calendars(provider);

-- Events table indexes (critical for performance)
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON public.events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON public.events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_start_at ON public.events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_end_at ON public.events(end_at);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_approval_state ON public.events(approval_state);
-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_events_calendar_start ON public.events(calendar_id, start_at);
CREATE INDEX IF NOT EXISTS idx_events_calendar_status ON public.events(calendar_id, status) WHERE status = 'confirmed';

-- Event attendees indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_member_id ON public.event_attendees(member_id);
-- Unique constraint to prevent duplicate attendees
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_attendees_unique ON public.event_attendees(event_id, member_id);

-- Event reminders indexes
CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON public.event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_delivered ON public.event_reminders(delivered_at) WHERE delivered_at IS NULL;

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_member_id ON public.notifications(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
-- Composite for unread notifications query
CREATE INDEX IF NOT EXISTS idx_notifications_member_unread ON public.notifications(member_id, status) WHERE status != 'read';

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_family_id ON public.audit_logs(family_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_member_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- Families table (owner lookup)
CREATE INDEX IF NOT EXISTS idx_families_owner_id ON public.families(owner_id);
