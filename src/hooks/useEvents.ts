import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventRepository } from '@/repositories/eventRepository';
import { CalendarEvent } from '@/types';
import { useCalendarStore } from '@/state/calendarStore';

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (calendarId: string) => [...eventKeys.lists(), calendarId] as const,
  family: (familyId: string) => [...eventKeys.all, 'family', familyId] as const,
  upcoming: (calendarId: string) =>
    [...eventKeys.all, 'upcoming', calendarId] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};

// Common query options for better error handling
const defaultQueryOptions = {
  retry: 2,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

export function useEvents(calendarId: string) {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);

  return useQuery({
    queryKey: eventKeys.list(calendarId),
    queryFn: async () => {
      const events = await eventRepository.fetchEvents(calendarId);
      upsertEvents(events);
      return events;
    },
    staleTime: 60_000,
    ...defaultQueryOptions,
    meta: {
      errorMessage: 'Failed to load events',
    },
  });
}

export function useFamilyEvents(familyId: string | undefined) {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);

  return useQuery({
    queryKey: eventKeys.family(familyId ?? ''),
    queryFn: async () => {
      if (!familyId) return [];
      const events = await eventRepository.fetchEventsByFamily(familyId);
      upsertEvents(events);
      return events;
    },
    enabled: Boolean(familyId),
    staleTime: 60_000,
    ...defaultQueryOptions,
    meta: {
      errorMessage: 'Failed to load family events',
    },
  });
}

export function useUpcomingEvents(calendarId: string) {
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);

  return useQuery({
    queryKey: eventKeys.upcoming(calendarId),
    queryFn: async () => {
      const events = await eventRepository.fetchUpcomingEvents(calendarId);
      upsertEvents(events);
      return events;
    },
    staleTime: 30_000,
    ...defaultQueryOptions,
    meta: {
      errorMessage: 'Failed to load upcoming events',
    },
  });
}

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: eventKeys.detail(eventId ?? ''),
    queryFn: () => eventRepository.fetchEventById(eventId!),
    enabled: Boolean(eventId),
    ...defaultQueryOptions,
    meta: {
      errorMessage: 'Failed to load event details',
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);

  return useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id'>) =>
      eventRepository.createEvent(event),
    onSuccess: (newEvent) => {
      upsertEvents([newEvent]);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const updateEventStore = useCalendarStore((state) => state.updateEvent);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CalendarEvent>;
    }) => eventRepository.updateEvent(id, updates),
    onSuccess: (updatedEvent) => {
      updateEventStore(updatedEvent);
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(updatedEvent.id),
      });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update event:', error);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const removeEvent = useCalendarStore((state) => state.removeEvent);

  return useMutation({
    mutationFn: (eventId: string) => eventRepository.deleteEvent(eventId),
    onSuccess: (_, eventId) => {
      removeEvent(eventId);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete event:', error);
    },
  });
}

export function useApproveEvent() {
  const queryClient = useQueryClient();
  const updateEventStore = useCalendarStore((state) => state.updateEvent);

  return useMutation({
    mutationFn: (eventId: string) => eventRepository.approveEvent(eventId),
    onSuccess: (updatedEvent) => {
      updateEventStore(updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to approve event:', error);
    },
  });
}

export function useRejectEvent() {
  const queryClient = useQueryClient();
  const updateEventStore = useCalendarStore((state) => state.updateEvent);

  return useMutation({
    mutationFn: (eventId: string) => eventRepository.rejectEvent(eventId),
    onSuccess: (updatedEvent) => {
      updateEventStore(updatedEvent);
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to reject event:', error);
    },
  });
}
