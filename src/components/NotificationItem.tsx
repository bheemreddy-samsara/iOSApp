import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types';
import { colors, radii, shadows } from '@/theme/tokens';

interface NotificationItemProps {
  notification: Notification;
  onPress: (id: string) => void;
  onSnooze: (id: string) => void;
}

export const NotificationItem = memo(
  ({ notification, onPress, onSnooze }: NotificationItemProps) => {
    const relativeTime = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
    });

    return (
      <View
        style={styles.wrapper}
        accessibilityRole="text"
        accessibilityLabel={`${notification.title}. ${notification.message}. ${relativeTime}`}
      >
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => onPress(notification.id)}
        >
          <View style={styles.meta}>
            <Text style={styles.type}>{notification.type.toUpperCase()}</Text>
            <Text style={styles.time}>{relativeTime}</Text>
          </View>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSnooze(notification.id)}
            style={styles.snoozeBtn}
          >
            <Text style={styles.snoozeText}>Snooze 10 min</Text>
          </Pressable>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 18,
    gap: 10,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.9,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  snoozeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
  },
  snoozeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
