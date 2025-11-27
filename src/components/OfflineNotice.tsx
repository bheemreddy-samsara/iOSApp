import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

interface OfflineNoticeProps {
  isOffline: boolean;
  onRetry: () => void;
}

export const OfflineNotice = memo(
  ({ isOffline, onRetry }: OfflineNoticeProps) => {
    if (!isOffline) return null;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          You are working offline. Changes sync when back online.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>Try again</Text>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#1C1E26',
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1E26',
  },
});
