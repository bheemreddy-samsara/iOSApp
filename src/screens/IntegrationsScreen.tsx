import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { ProviderCard } from '@/components/ProviderCard';
import { colors, spacing } from '@/theme/tokens';

export function IntegrationsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendar connections</Text>
      <Text style={styles.subtitle}>
        Connect your family tools. We import work events as "Title - Busy" and
        never write back without consent.
      </Text>
      <ProviderCard
        provider="google"
        status="connected"
        lastSyncedAt="5 minutes ago"
        scopes={['Family calendar', 'Birthdays']}
        onConnect={() => Alert.alert('Connected', 'Google Calendar linked!')}
        onDisconnect={() =>
          Alert.alert('Disconnected', 'Google Calendar removed')
        }
      />
      <ProviderCard
        provider="outlook"
        status="connected"
        lastSyncedAt="12 minutes ago"
        scopes={['Work busy status']}
        onConnect={() => Alert.alert('Connected', 'Outlook linked!')}
        onDisconnect={() => Alert.alert('Disconnected', 'Outlook disconnected')}
      />
      <ProviderCard
        provider="caldav"
        status="disconnected"
        scopes={['Read-only sync']}
        onConnect={() =>
          Alert.alert('Connect', 'CalDAV connection flow coming soon.')
        }
        onDisconnect={() => Alert.alert('Disconnected', 'CalDAV not connected')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: 120,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
