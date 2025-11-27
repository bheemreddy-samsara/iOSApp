import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/theme/tokens';
import { SegmentedControl } from '@/components/SegmentedControl';
import { CalendarGrid } from '@/components/CalendarGrid';
import { DayColumn } from '@/components/DayColumn';
import { FilterBar } from '@/components/FilterBar';
import { FAB } from '@/components/FAB';
import { Plus } from 'lucide-react-native';
import { useCalendarStore } from '@/state/calendarStore';
import { useDemoData } from '@/hooks/useDemoData';
import { useDemoMembers } from '@/hooks/useDemoMembers';
import { buildWeekDays } from '@/utils/date';
import { CalendarEvent, CategoryChip, CalendarFilterState } from '@/types';
import { RootStackParamList } from '@/navigation';

const segments = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
] as Array<{ key: string; label: string }>;

const categoryChips: CategoryChip[] = [
  { id: '🏥 Health', emoji: '🏥', label: 'Health' },
  { id: '🎒 School', emoji: '🎒', label: 'School' },
  { id: '⚽ Sports', emoji: '⚽', label: 'Sports' },
  { id: '🏠 Family', emoji: '🏠', label: 'Family' },
  { id: '🎓 Projects', emoji: '🎓', label: 'Projects' },
];

export function CalendarScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useDemoData();
  const members = useDemoMembers();
  const eventsMap = useCalendarStore((state) => state.events);
  const filters = useCalendarStore((state) => state.filters);
  const setFilters = useCalendarStore((state) => state.setFilters);
  const view = useCalendarStore((state) => state.view);
  const setView = useCalendarStore((state) => state.setView);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);

  const events = useMemo(() => Object.values(eventsMap), [eventsMap]);
  const filteredEvents = useMemo(
    () => filterEvents(events, filters),
    [events, filters],
  );

  const weekDays = useMemo(
    () => buildWeekDays(new Date(selectedDate)),
    [selectedDate],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    filteredEvents.forEach((event) => {
      const key = event.start.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [filteredEvents]);

  const handleToggleMember = (id: string) => {
    const next = filters.memberIds.includes(id)
      ? filters.memberIds.filter((value) => value !== id)
      : [...filters.memberIds, id];
    setFilters({ ...filters, memberIds: next });
  };

  const handleToggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((value) => value !== id)
      : [...filters.categories, id];
    setFilters({ ...filters, categories: next });
  };

  const resetFilters = () =>
    setFilters({ ...filters, memberIds: [], categories: [] });

  const headerDate = format(
    new Date(selectedDate),
    view === 'month' ? 'MMMM yyyy' : 'EEEE, MMMM do',
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <View>
          <Text style={styles.label}>Calendar</Text>
          <Text style={styles.date}>{headerDate}</Text>
        </View>
        <SegmentedControl
          segments={segments}
          value={view}
          onChange={(key) => setView(key as typeof view)}
        />
      </View>
      <FilterBar
        members={members}
        selectedMemberIds={filters.memberIds}
        categories={categoryChips}
        selectedCategories={filters.categories}
        onToggleMember={handleToggleMember}
        onToggleCategory={handleToggleCategory}
        onReset={resetFilters}
      />
      <View style={styles.calendarContainer}>
        {view === 'month' && (
          <CalendarGrid
            view="month"
            date={selectedDate}
            events={filteredEvents}
            filters={filters}
            onSelectDay={(iso) => setSelectedDate(iso)}
          />
        )}
        {view === 'week' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weekContent}
          >
            {weekDays.map((day) => {
              const dayIso = day.toISOString();
              return (
                <View key={dayIso} style={styles.weekDay}>
                  <Text style={styles.weekDayLabel}>
                    {format(day, 'EEE dd')}
                  </Text>
                  <DayColumn
                    date={dayIso}
                    events={eventsByDate.get(dayIso.slice(0, 10)) ?? []}
                    onSelectEvent={(eventId) =>
                      navigation.navigate('EventEditor', { eventId })
                    }
                    onCreateSlot={(iso) =>
                      navigation.navigate('EventEditor', { eventId: undefined })
                    }
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
        {view === 'day' && (
          <DayColumn
            date={selectedDate}
            events={eventsByDate.get(selectedDate.slice(0, 10)) ?? []}
            onSelectEvent={(eventId) =>
              navigation.navigate('EventEditor', { eventId })
            }
            onCreateSlot={(iso) =>
              navigation.navigate('EventEditor', { eventId: undefined })
            }
          />
        )}
      </View>
      <View style={styles.fabContainer}>
        <FAB icon={Plus} onPress={() => navigation.navigate('EventEditor')} />
      </View>
    </View>
  );
}

function filterEvents(events: CalendarEvent[], filters: CalendarFilterState) {
  return events.filter((event) => {
    const memberMatch =
      filters.memberIds.length === 0 ||
      event.attendees?.some((id) => filters.memberIds.includes(id));
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(event.category ?? '');
    const pendingMatch =
      filters.showPending || event.approvalState !== 'pending';
    return memberMatch && categoryMatch && pendingMatch;
  });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['3xl'],
    backgroundColor: colors.background,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  calendarContainer: {
    flex: 1,
    marginTop: 16,
  },
  weekContent: {
    gap: 16,
    paddingBottom: 120,
  },
  weekDay: {
    width: 280,
  },
  weekDayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 36,
  },
});
