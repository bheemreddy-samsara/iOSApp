import { memo, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarEvent } from '@/types';
import { colors, radii } from '@/theme/tokens';
import { format } from 'date-fns';
import { TimelineNowIndicator } from './TimelineNowIndicator';

interface DayColumnProps {
  date: string;
  events: CalendarEvent[];
  onSelectEvent: (id: string) => void;
  onCreateSlot: (startISO: string) => void;
  now?: string;
}

const hours = Array.from({ length: 17 }).map((_, index) => index + 6); // 6am - 22pm

export const DayColumn = memo(
  ({ date, events, onSelectEvent, onCreateSlot, now }: DayColumnProps) => {
    const sorted = useMemo(
      () =>
        events
          .slice()
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          ),
      [events],
    );

    const nowIso = now ?? new Date().toISOString();
    const showNow =
      new Date(nowIso).toDateString() === new Date(date).toDateString();
    const nowMinutes =
      new Date(nowIso).getHours() * 60 + new Date(nowIso).getMinutes();
    const nowOffset = ((nowMinutes - 360) / (17 * 60)) * 1200; // approximate height 1200

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        accessibilityLabel={`Day view for ${format(new Date(date), 'EEEE MMMM do')}`}
      >
        <View style={styles.hoursColumn}>
          {hours.map((hour) => {
            const base = new Date(date);
            base.setHours(hour, 0, 0, 0);
            return (
              <Pressable
                key={hour}
                onPress={() => onCreateSlot(base.toISOString())}
                style={styles.hourRow}
                accessibilityRole="button"
                accessibilityLabel={`Create event at ${hour}:00`}
              >
                <Text style={styles.hourLabel}>{format(base, 'ha')}</Text>
                <View style={styles.hourLine} />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.eventsColumn}>
          {sorted.map((event) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const startMinutes =
              startDate.getHours() * 60 + startDate.getMinutes();
            const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
            const top = ((startMinutes - 360) / (17 * 60)) * 1200;
            const height = Math.max(
              ((endMinutes - startMinutes) / (17 * 60)) * 1200,
              60,
            );
            return (
              <Pressable
                key={event.id}
                onPress={() => onSelectEvent(event.id)}
                accessibilityRole="button"
                accessibilityLabel={`${event.title}. ${format(startDate, 'p')} to ${format(endDate, 'p')}`}
                style={[
                  styles.eventBlock,
                  {
                    top,
                    height,
                    backgroundColor: event.isBusyOnly
                      ? colors.surfaceMuted
                      : colors.primaryLight,
                  },
                ]}
              >
                <Text style={styles.eventTitle}>
                  {event.isBusyOnly ? `${event.title} - Busy` : event.title}
                </Text>
                {!event.isBusyOnly && (
                  <Text style={styles.eventMeta}>
                    {format(startDate, 'p')} · {event.location ?? 'No location'}
                  </Text>
                )}
              </Pressable>
            );
          })}
          {showNow && <TimelineNowIndicator top={nowOffset} />}
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
    flexDirection: 'row',
    gap: 16,
  },
  hoursColumn: {
    width: 64,
  },
  hourRow: {
    height: 70,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  hourLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  hourLine: {
    marginTop: 6,
    height: 1,
    width: '100%',
    backgroundColor: colors.border,
  },
  eventsColumn: {
    flex: 1,
    height: 1200,
    position: 'relative',
  },
  eventBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: radii.md,
    padding: 12,
    gap: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  eventMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
