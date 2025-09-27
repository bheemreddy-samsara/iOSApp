import { CalendarEvent } from '@/types';

type GoogleCalendarListResponse = {
  items: Array<{ id: string; summary: string }>;
};

type GoogleEventsResponse = {
  items: Array<{
    id: string;
    summary?: string;
    description?: string;
    location?: string;
    start?: { date?: string; dateTime?: string };
    end?: { date?: string; dateTime?: string };
  }>;
};

const googleDiscoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

export const googleScopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'];

export async function startGoogleOAuth() {
  // TODO: Update to use newer Expo AuthSession API
  console.warn('Google OAuth not implemented - requires Expo AuthSession update');
  return { type: 'cancel' };

  /*
  return AuthSession.startAsync({
    authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${AuthSession.getQueryParams({
      client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      response_type: 'code',
      redirect_uri: AuthSession.makeRedirectUri({ useProxy: true }),
      scope: googleScopes.join(' ')
    })}`,
    returnUrl: AuthSession.makeRedirectUri({ useProxy: true })
  });
  */
}

export async function fetchGoogleCalendars(accessToken: string): Promise<GoogleCalendarListResponse> {
  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to load Google calendars');
  }
  return response.json();
}

export async function fetchGoogleEvents(calendarId: string, accessToken: string): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    maxResults: '2500',
    orderBy: 'startTime',
    timeMin: new Date().toISOString()
  });
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to load Google events');
  }
  const body: GoogleEventsResponse = await response.json();
  return body.items.map((item) => ({
    id: item.id,
    calendarId,
    title: item.summary ?? 'Untitled',
    description: item.description ?? undefined,
    location: item.location ?? undefined,
    category: 'general',
    start: item.start?.dateTime ?? item.start?.date ?? '',
    end: item.end?.dateTime ?? item.end?.date ?? '',
    allDay: Boolean(item.start?.date),
    approvalState: 'approved',
    privacyMode: 'busy-only',
    creatorId: '',
    attendees: [],
    isBusyOnly: true,
    provider: 'google'
  }));
}

export function isGoogleBusyOnly(event: CalendarEvent) {
  return event.isBusyOnly && event.provider === 'google';
}
