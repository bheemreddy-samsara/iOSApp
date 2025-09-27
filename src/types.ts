export type MemberRole = 'owner' | 'admin' | 'member' | 'child';

export type Provider = 'google' | 'outlook' | 'caldav';
export type ProviderStatus = 'connected' | 'disconnected' | 'error';

export type EventApprovalState = 'pending' | 'approved' | 'rejected';

export interface Member {
  id: string;
  familyId: string;
  name: string;
  role: MemberRole;
  color: string;
  emoji: string;
  avatarBackground: string;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  category: string;
  start: string;
  end: string;
  allDay?: boolean;
  multiDay?: boolean;
  approvalState: EventApprovalState;
  isBusyOnly?: boolean;
  privacyMode: 'family' | 'private' | 'busy-only';
  creatorId: string;
  attendees: string[];
  provider?: Provider;
}

export interface Notification {
  id: string;
  memberId: string;
  type: 'reminder' | 'approval' | 'conflict' | 'digest';
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
}

export interface CalendarFilterState {
  memberIds: string[];
  categories: string[];
  showPending: boolean;
}

export interface DraftEvent extends Partial<CalendarEvent> {
  title: string;
  start: string;
  end: string;
  members: string[];
  category: string;
  privacyMode: 'family' | 'private' | 'busy-only';
}

export interface CategoryChip {
  id: string;
  emoji: string;
  label: string;
}
