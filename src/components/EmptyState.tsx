import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/tokens';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = memo(({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <View style={styles.container}
    accessibilityRole="text"
    accessibilityLabel={`${title}. ${description}`}
  >
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {actionLabel && onAction && (
      <Pressable accessibilityRole="button" onPress={onAction} style={styles.button}>
        <Text style={styles.buttonLabel}>{actionLabel}</Text>
      </Pressable>
    )}
  </View>
));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    gap: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
});
