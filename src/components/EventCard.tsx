import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types';
import { colors, radii, shadows } from '@/theme/tokens';
import { ApprovalPill } from './ApprovalPill';
import { MemberAvatar } from './MemberAvatar';
import { demoMembers } from '@/data/sampleEvents';

interface EventCardProps {
  event: CalendarEvent;
  onPress: (id: string) => void;
  showStatus?: boolean;
  compact?: boolean;
}

const getTimeRange = (event: CalendarEvent) => {
  if (event.allDay) {
    return 'All day';
  }
  try {
    return `${format(new Date(event.start), 'p')} - ${format(new Date(event.end), 'p')}`;
  } catch (error) {
    return '';
  }
};

const privacyBadge = (event: CalendarEvent) => {
  if (event.privacyMode === 'busy-only') {
    return 'Busy only';
  }
  if (event.privacyMode === 'private') {
    return 'Private';
  }
  return undefined;
};

export const EventCard = memo(
  ({ event, onPress, showStatus = true, compact = false }: EventCardProps) => {
    const timeRange = getTimeRange(event);
    const badge = privacyBadge(event);
    const title = event.isBusyOnly ? `${event.title} - Busy` : event.title;
    const memberLookup = new Map(demoMembers.map((m) => [m.id, m]));
    const attendees =
      event.attendees
        ?.map((id) => memberLookup.get(id))
        .filter(Boolean)
        .slice(0, 3) ?? [];

    return (
      <Pressable
        onPress={() => onPress(event.id)}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${timeRange}`}
        style={({ pressed }) => [
          styles.container,
          compact && styles.compact,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.time}>{timeRange}</Text>
            <Text style={styles.title}>{title}</Text>
            {event.location && !event.isBusyOnly && (
              <Text style={styles.location}>{event.location}</Text>
            )}
          </View>
          {showStatus && <ApprovalPill state={event.approvalState} />}
        </View>
        {!event.isBusyOnly && event.description && !compact && (
          <Text style={styles.description}>{event.description}</Text>
        )}
        <View style={styles.footer}>
          <View style={styles.attendees}>
            {attendees.map((member) => (
              <MemberAvatar key={member!.id} member={member!} size={32} />
            ))}
          </View>
          {badge && <Text style={styles.badge}>{badge}</Text>}
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    marginBottom: 16,
    gap: 12,
    ...shadows.soft,
  },
  compact: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendees: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warning,
  },
});
