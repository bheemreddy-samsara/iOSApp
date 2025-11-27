import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarEvent, CalendarFilterState } from '@/types';
import { buildMonthMatrix, isInMonth, isSameDaySafe } from '@/utils/date';
import { colors, radii } from '@/theme/tokens';
import { format } from 'date-fns';

interface CalendarGridProps {
  view: 'month' | 'week' | 'day';
  date: string;
  events: CalendarEvent[];
  filters: CalendarFilterState;
  onSelectDay: (iso: string) => void;
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid = memo(
  ({ date, events, filters, onSelectDay }: CalendarGridProps) => {
    const matrix = useMemo(() => buildMonthMatrix(new Date(date)), [date]);
    const filtered = useMemo(() => {
      return events.filter((event) => {
        const includeMember =
          filters.memberIds.length === 0 ||
          event.attendees?.some((id) => filters.memberIds.includes(id));
        const includeCategory =
          filters.categories.length === 0 ||
          (event.category && filters.categories.includes(event.category));
        const includePending =
          filters.showPending || event.approvalState !== 'pending';
        return includeMember && includeCategory && includePending;
      });
    }, [events, filters]);

    const eventsByDay = useMemo(() => {
      const map = new Map<string, CalendarEvent[]>();
      filtered.forEach((event) => {
        const key = event.start.slice(0, 10);
        const list = map.get(key) ?? [];
        list.push(event);
        map.set(key, list);
      });
      return map;
    }, [filtered]);

    const todayIso = new Date().toISOString().slice(0, 10);
    const referenceMonth = new Date(date).getMonth();

    return (
      <View>
        <View style={styles.weekHeader}>
          {weekdayLabels.map((label) => (
            <Text key={label} style={styles.weekLabel}>
              {label}
            </Text>
          ))}
        </View>
        {matrix.map((week, index) => (
          <View key={index} style={styles.weekRow}>
            {week.map((iso) => {
              const dayKey = iso.slice(0, 10);
              const dayEvents = eventsByDay.get(dayKey) ?? [];
              const isToday = dayKey === todayIso;
              const inMonth = isInMonth(iso, new Date(date));
              return (
                <Pressable
                  key={iso}
                  accessibilityRole="button"
                  accessibilityLabel={`${format(new Date(iso), 'EEEE MMMM do')} with ${dayEvents.length} events`}
                  onPress={() => onSelectDay(iso)}
                  style={[styles.dayCell, !inMonth && styles.outsideMonth]}
                >
                  <View
                    style={[
                      styles.dayNumberWrapper,
                      isToday && styles.todayDot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumber,
                        isToday && styles.dayNumberToday,
                      ]}
                    >
                      {new Date(iso).getDate()}
                    </Text>
                  </View>
                  <View style={styles.dotsRow}>
                    {dayEvents.slice(0, 3).map((event) => (
                      <View
                        key={event.id}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: event.isBusyOnly
                              ? colors.border
                              : colors.primary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    padding: 6,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  outsideMonth: {
    opacity: 0.4,
  },
  dayNumberWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDot: {
    backgroundColor: colors.primaryLight,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dayNumberToday: {
    color: colors.primary,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
