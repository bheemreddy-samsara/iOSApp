import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, shadows } from '@/theme/tokens';
import { LucideIcon } from 'lucide-react-native';

interface FABProps {
  icon: LucideIcon;
  label?: string;
  onPress: () => void;
}

export const FAB = memo(({ icon: Icon, label, onPress }: FABProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label ? label : 'Create Event'}
    onPress={onPress}
    style={({ pressed }) => [styles.container, pressed && styles.pressed]}
  >
    <Icon color="#FFFFFF" size={24} />
    {label && <Text style={styles.label}>{label}</Text>}
  </Pressable>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: 999,
    ...shadows.elevated,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
