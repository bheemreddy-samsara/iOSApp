import { memo } from 'react';
import { Switch, Text, View, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

interface PreferenceToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const PreferenceToggle = memo(({ label, description, value, onValueChange }: PreferenceToggleProps) => (
  <View style={styles.container}
    accessibilityRole="switch"
    accessibilityLabel={label}
    accessibilityState={{ checked: value }}
  >
    <View style={styles.copy}>
      <Text style={styles.label}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
    <Switch
      trackColor={{ false: colors.surfaceMuted, true: colors.primaryLight }}
      thumbColor={value ? colors.primary : '#f4f3f4'}
      ios_backgroundColor={colors.surfaceMuted}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  copy: {
    flex: 1,
    paddingRight: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  }
});
