import { useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { NotificationItem } from '@/components/NotificationItem';
import { demoNotifications } from '@/data/sampleNotifications';
import { colors, spacing } from '@/theme/tokens';

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState(demoNotifications);

  const handlePress = (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (notification) {
      Alert.alert(notification.title, notification.message);
    }
  };

  const handleSnooze = (id: string) => {
    Alert.alert('Snoozed', 'We\'ll remind you in 10 minutes.');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem notification={item} onPress={handlePress} onSnooze={handleSnooze} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>You\'re all caught up! 🎉</Text>}
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
    backgroundColor: colors.background
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20
  },
  list: {
    paddingBottom: 80
  },
  empty: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40
  }
});
