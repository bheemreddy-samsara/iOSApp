import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

interface TimelineNowIndicatorProps {
  top: number;
}

export const TimelineNowIndicator = memo(({ top }: TimelineNowIndicatorProps) => (
  <View pointerEvents="none" style={[styles.container, { top }]}
    accessibilityRole="text"
    accessibilityLabel="Current time indicator"
  >
    <View style={styles.dot} />
    <View style={styles.line} />
  </View>
));

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: 6
  }
});
