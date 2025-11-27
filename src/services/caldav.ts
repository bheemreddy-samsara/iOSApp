import { CalendarEvent } from '@/types';

export interface CalDavCredentials {
  endpoint: string;
  username: string;
  appPassword: string;
}

export async function fetchCalDavEvents(
  _credentials: CalDavCredentials,
): Promise<CalendarEvent[]> {
  // TODO: Implement CalDAV sync (read-only) using an edge worker or native module.
  return [];
}

export async function testCalDavConnection(
  _credentials: CalDavCredentials,
): Promise<boolean> {
  // TODO: Ping CalDAV endpoint for validation.
  return true;
}
