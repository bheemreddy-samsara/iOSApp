import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NotificationItem } from '@/components/NotificationItem';
import { demoNotifications } from '@/data/sampleNotifications';
import { colors, spacing } from '@/theme/tokens';
import { useNotifications, useMarkAsRead } from '@/hooks/useNotifications';

export function NotificationsScreen() {
  const { data: realNotifications, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();

  const notifications =
    realNotifications && realNotifications.length > 0
      ? realNotifications
      : __DEV__
        ? demoNotifications
        : [];

  const handlePress = (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (notification) {
      Alert.alert(notification.title, notification.message);
      if (!notification.readAt) {
        markAsRead(id);
      }
    }
  };

  const handleSnooze = (_id: string) => {
    Alert.alert('Snoozed', "We'll remind you in 10 minutes.");
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handlePress}
            onSnooze={handleSnooze}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>You\'re all caught up! 🎉</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['3xl'],
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 80,
  },
  empty: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
