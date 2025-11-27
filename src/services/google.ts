import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { CalendarEvent } from '@/types';

// Required for web browser auth
WebBrowser.maybeCompleteAuthSession();

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

export const googleScopes = [
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/calendar.readonly',
];

const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleAuth() {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'togethercal',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: googleScopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    googleDiscovery,
  );

  return { request, response, promptAsync };
}

export async function exchangeGoogleCode(
  code: string,
  codeVerifier: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'togethercal',
  });

  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId,
      code,
      redirectUri,
      extraParams: {
        code_verifier: codeVerifier,
      },
    },
    googleDiscovery,
  );

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken ?? undefined,
  };
}

export async function refreshGoogleToken(
  refreshToken: string,
): Promise<{ accessToken: string }> {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  const tokenResponse = await AuthSession.refreshAsync(
    {
      clientId,
      refreshToken,
    },
    googleDiscovery,
  );

  return {
    accessToken: tokenResponse.accessToken,
  };
}

export async function fetchGoogleCalendars(
  accessToken: string,
): Promise<GoogleCalendarListResponse> {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to load Google calendars');
  }
  return response.json();
}

export async function fetchGoogleEvents(
  calendarId: string,
  accessToken: string,
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    singleEvents: 'true',
    maxResults: '2500',
    orderBy: 'startTime',
    timeMin: new Date().toISOString(),
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
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
    provider: 'google',
  }));
}

export function isGoogleBusyOnly(event: CalendarEvent) {
  return event.isBusyOnly && event.provider === 'google';
}
