import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '@/theme/tokens';

type Segment = {
  key: string;
  label: string;
};

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
}

export const SegmentedControl = memo(({ segments, value, onChange }: SegmentedControlProps) => {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {segments.map((segment) => {
        const isActive = value === segment.key;
        return (
          <Pressable
            key={segment.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={segment.label}
            onPress={() => onChange(segment.key)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{segment.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: 4
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center'
  },
  segmentActive: {
    backgroundColor: colors.surface,
    shadowColor: 'rgba(25, 32, 72, 0.18)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary
  },
  labelActive: {
    color: colors.textPrimary
  }
});
