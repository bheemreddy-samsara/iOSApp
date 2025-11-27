import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Provider, ProviderStatus } from '@/types';
import { colors, radii, shadows } from '@/theme/tokens';

interface ProviderCardProps {
  provider: Provider;
  status: ProviderStatus;
  lastSyncedAt?: string;
  scopes?: string[];
  onConnect: () => void;
  onDisconnect: () => void;
}

const providerCopy: Record<Provider, { title: string; description: string }> = {
  google: {
    title: 'Google Calendar',
    description: 'Sync shared and family calendars',
  },
  outlook: {
    title: 'Outlook (Work Safe)',
    description: 'Read-only busy import for work events',
  },
  caldav: {
    title: 'Apple / CalDAV',
    description: 'Private Apple or open CalDAV calendar',
  },
};

const statusCopy: Record<ProviderStatus, string> = {
  connected: 'Connected',
  disconnected: 'Not connected',
  error: 'Needs attention',
};

const statusColor: Record<ProviderStatus, string> = {
  connected: colors.success,
  disconnected: colors.textSecondary,
  error: colors.danger,
};

export const ProviderCard = memo(
  ({
    provider,
    status,
    lastSyncedAt,
    scopes = [],
    onConnect,
    onDisconnect,
  }: ProviderCardProps) => {
    const copy = providerCopy[provider];
    const statusLabel = statusCopy[status];

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={[styles.status, { color: statusColor[status] }]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.description}>{copy.description}</Text>
        {lastSyncedAt && (
          <Text style={styles.meta}>Last synced {lastSyncedAt}</Text>
        )}
        {scopes.length > 0 && (
          <View style={styles.scopes}>
            {scopes.map((scope) => (
              <View key={scope} style={styles.scopeChip}>
                <Text style={styles.scopeLabel}>{scope}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.actions}>
          {status !== 'connected' ? (
            <Pressable
              accessibilityRole="button"
              onPress={onConnect}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryLabel}>Connect</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={onDisconnect}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryLabel}>Disconnect</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 20,
    gap: 12,
    ...shadows.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scopes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scopeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
  },
  scopeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
  },
  secondaryLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
});
