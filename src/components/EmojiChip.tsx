import { memo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

interface EmojiChipProps {
  emoji: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export const EmojiChip = memo(({ emoji, label, active = false, onPress }: EmojiChipProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    accessibilityLabel={`${label} category`}
    onPress={onPress}
    style={[styles.chip, active && styles.activeChip]}
  >
    <Text style={styles.emoji}>{emoji}</Text>
    <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
  </Pressable>
));

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted
  },
  activeChip: {
    backgroundColor: colors.primary,
    shadowColor: 'rgba(94, 106, 210, 0.3)',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  emoji: {
    fontSize: 18
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  activeLabel: {
    color: '#FFFFFF'
  }
});
