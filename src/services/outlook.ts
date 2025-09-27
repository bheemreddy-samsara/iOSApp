import * as AuthSession from 'expo-auth-session';
import { CalendarEvent } from '@/types';

const outlookScopes = [
  'openid',
  'profile',
  'offline_access',
  'https://graph.microsoft.com/Calendars.Read'
];

export async function startOutlookOAuth() {
  // TODO: Update to use newer Expo AuthSession API
  console.warn('Outlook OAuth not implemented - requires Expo AuthSession update');
  return { type: 'cancel' };
  
  /*
  return AuthSession.startAsync({
    authUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${AuthSession.getQueryParams({
      client_id: process.env.EXPO_PUBLIC_OUTLOOK_CLIENT_ID ?? '',
      response_type: 'code',
      redirect_uri: AuthSession.makeRedirectUri({ useProxy: true }),
      response_mode: 'query',
      scope: outlookScopes.join(' ')
    })}`,
    returnUrl: AuthSession.makeRedirectUri({ useProxy: true })
  });
  */
}

export async function fetchOutlookEvents(accessToken: string): Promise<CalendarEvent[]> {
  const response = await fetch('https://graph.microsoft.com/v1.0/me/events?$top=250', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Prefer: 'outlook.timezone="UTC"'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to load Outlook events');
  }
  const data = await response.json();
  return (data.value ?? []).map((item: any) => ({
    id: item.id,
    calendarId: item.calendarId ?? 'outlook',
    title: item.subject ?? 'Busy',
    description: item.bodyPreview ?? undefined,
    location: item.location?.displayName ?? undefined,
    category: 'work',
    start: item.start?.dateTime,
    end: item.end?.dateTime,
    allDay: item.isAllDay,
    approvalState: 'approved',
    privacyMode: 'busy-only',
    creatorId: item.organizer?.emailAddress?.address ?? '',
    attendees: [],
    isBusyOnly: true,
    provider: 'outlook'
  }));
}
