import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/tokens';

interface ApprovalPillProps {
  state: 'pending' | 'approved' | 'rejected';
  onPress?: () => void;
}

const copy = {
  pending: 'Awaiting approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

const background = {
  pending: '#FFE17733',
  approved: '#48B27F22',
  rejected: '#F1666722',
};

const textColor = {
  pending: colors.warning,
  approved: colors.success,
  rejected: colors.danger,
};

export const ApprovalPill = memo(({ state, onPress }: ApprovalPillProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={copy[state]}
    onPress={onPress}
    disabled={!onPress}
    style={[styles.container, { backgroundColor: background[state] }]}
  >
    <Text style={[styles.label, { color: textColor[state] }]}>
      {copy[state]}
    </Text>
  </Pressable>
));

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
