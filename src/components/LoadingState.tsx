import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '@/theme/tokens';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
