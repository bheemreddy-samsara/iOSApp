import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { CalendarEvent } from '@/types';

// Required for web browser auth
WebBrowser.maybeCompleteAuthSession();

export const outlookScopes = [
  'openid',
  'profile',
  'offline_access',
  'https://graph.microsoft.com/Calendars.Read',
];

const outlookDiscovery = {
  authorizationEndpoint:
    'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  revocationEndpoint:
    'https://login.microsoftonline.com/common/oauth2/v2.0/logout',
};

export function useOutlookAuth() {
  const clientId = process.env.EXPO_PUBLIC_OUTLOOK_CLIENT_ID ?? '';
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'togethercal',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: outlookScopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    outlookDiscovery,
  );

  return { request, response, promptAsync };
}

export async function exchangeOutlookCode(
  code: string,
  codeVerifier: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const clientId = process.env.EXPO_PUBLIC_OUTLOOK_CLIENT_ID ?? '';
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
    outlookDiscovery,
  );

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken ?? undefined,
  };
}

export async function refreshOutlookToken(
  refreshToken: string,
): Promise<{ accessToken: string }> {
  const clientId = process.env.EXPO_PUBLIC_OUTLOOK_CLIENT_ID ?? '';

  const tokenResponse = await AuthSession.refreshAsync(
    {
      clientId,
      refreshToken,
    },
    outlookDiscovery,
  );

  return {
    accessToken: tokenResponse.accessToken,
  };
}

export async function fetchOutlookEvents(
  accessToken: string,
): Promise<CalendarEvent[]> {
  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/events?$top=250',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'outlook.timezone="UTC"',
      },
    },
  );
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
    provider: 'outlook',
  }));
}
