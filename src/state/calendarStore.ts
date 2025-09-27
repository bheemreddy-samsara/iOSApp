import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarEvent, CalendarFilterState } from '@/types';
import { produce } from 'immer';

interface CalendarState {
  events: Record<string, CalendarEvent>;
  filters: CalendarFilterState;
  selectedDate: string;
  view: 'month' | 'week' | 'day';
  setView: (view: 'month' | 'week' | 'day') => void;
  setSelectedDate: (iso: string) => void;
  upsertEvents: (events: CalendarEvent[]) => void;
  updateEvent: (event: CalendarEvent) => void;
  removeEvent: (eventId: string) => void;
  setFilters: (filters: CalendarFilterState) => void;
  reset: () => void;
}

const initialFilters: CalendarFilterState = {
  memberIds: [],
  categories: [],
  showPending: true
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: {},
      filters: initialFilters,
      selectedDate: new Date().toISOString(),
      view: 'week',
      setView: (view) => set({ view }),
      setSelectedDate: (iso) => set({ selectedDate: iso }),
      upsertEvents: (events) =>
        set(
          produce((draft: CalendarState) => {
            events.forEach((event) => {
              draft.events[event.id] = event;
            });
          })
        ),
      updateEvent: (event) =>
        set(
          produce((draft: CalendarState) => {
            draft.events[event.id] = event;
          })
        ),
      removeEvent: (eventId) =>
        set(
          produce((draft: CalendarState) => {
            delete draft.events[eventId];
          })
        ),
      setFilters: (filters) => set({ filters }),
      reset: () => set({ events: {}, filters: initialFilters })
    }),
    {
      name: 'calendar-store'
    }
  )
);
