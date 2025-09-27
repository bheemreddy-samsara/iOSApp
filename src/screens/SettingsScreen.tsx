import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { PreferenceToggle } from '@/components/PreferenceToggle';
import { colors, spacing } from '@/theme/tokens';
import { useSettingsStore } from '@/state/settingsStore';

export function SettingsScreen() {
  const {
    notificationPreferences,
    setNotificationPreference,
    toggleOfflineMode,
    isOfflineMode,
    hapticsEnabled,
    toggleHaptics,
    calendarDensity,
    toggleCalendarDensity
  } = useSettingsStore();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Control notifications, privacy, and offline protections for your family.</Text>
      <View style={styles.card}>
        <Text style={styles.section}>Notifications</Text>
        <PreferenceToggle
          label="Reminders"
          value={notificationPreferences.reminders}
          onValueChange={(value) => setNotificationPreference('reminders', value)}
          description="Event reminders delivered via push or email."
        />
        <PreferenceToggle
          label="Approvals"
          value={notificationPreferences.approvals}
          onValueChange={(value) => setNotificationPreference('approvals', value)}
          description="Ping parents when kids create new events."
        />
        <PreferenceToggle
          label="Conflict alerts"
          value={notificationPreferences.conflicts}
          onValueChange={(value) => setNotificationPreference('conflicts', value)}
          description="Detect overlapping commitments early."
        />
        <PreferenceToggle
          label="Email updates"
          value={notificationPreferences.email}
          onValueChange={(value) => setNotificationPreference('email', value)}
        />
        <PreferenceToggle
          label="Push notifications"
          value={notificationPreferences.push}
          onValueChange={(value) => setNotificationPreference('push', value)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Experience</Text>
        <PreferenceToggle
          label="Offline mode"
          description="Keep data on-device when traveling."
          value={isOfflineMode}
          onValueChange={() => toggleOfflineMode()}
        />
        <PreferenceToggle
          label="Haptics"
          description="Soft taps when interacting with controls."
          value={hapticsEnabled}
          onValueChange={() => toggleHaptics()}
        />
        <PreferenceToggle
          label="Compact calendar"
          description="More events per screen."
          value={calendarDensity === 'compact'}
          onValueChange={() => toggleCalendarDensity()}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Privacy & data</Text>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Export started', 'We will email your ICS export shortly.')} style={styles.actionRow}>
          <Text style={styles.actionLabel}>Export calendar (ICS)</Text>
          <Text style={styles.actionHint}>Send to email</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Cleanup scheduled', 'Work calendar copies will be pruned.')} style={styles.actionRow}>
          <Text style={styles.actionLabel}>Clean up imported work events</Text>
          <Text style={styles.actionHint}>Remove stale busy blocks</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert('Request received', 'We will guide you through deleting data.')} style={styles.actionRow}>
          <Text style={[styles.actionLabel, styles.destructive]}>Delete family space</Text>
          <Text style={styles.actionHint}>Transfer ownership or remove data</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: 120,
    gap: 18
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: 'rgba(25, 32, 72, 0.12)',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 3
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 12
  },
  actionRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary
  },
  actionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4
  },
  destructive: {
    color: colors.danger
  }
});
