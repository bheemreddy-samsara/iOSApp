import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Member, CategoryChip as CategoryChipType } from '@/types';
import { colors } from '@/theme/tokens';
import { MemberAvatar } from './MemberAvatar';
import { EmojiChip } from './EmojiChip';

interface FilterBarProps {
  members: Member[];
  selectedMemberIds: string[];
  categories: CategoryChipType[];
  selectedCategories: string[];
  onToggleMember: (id: string) => void;
  onToggleCategory: (id: string) => void;
  onReset: () => void;
}

export const FilterBar = memo(({
  members,
  selectedMemberIds,
  categories,
  selectedCategories,
  onToggleMember,
  onToggleCategory,
  onReset
}: FilterBarProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Filters</Text>
        <Pressable accessibilityRole="button" onPress={onReset}><Text style={styles.reset}>Reset</Text></Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {members.map((member) => {
          const active = selectedMemberIds.includes(member.id);
          return (
            <Pressable
              key={member.id}
              style={[styles.memberChip, active && styles.memberChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Filter by ${member.name}`}
              onPress={() => onToggleMember(member.id)}
            >
              <MemberAvatar member={member} size={36} />
              <Text style={[styles.memberName, active && styles.memberNameActive]} numberOfLines={1}>
                {member.name.split(' ')[0]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {categories.map((chip) => (
          <EmojiChip
            key={chip.id}
            emoji={chip.emoji}
            label={chip.label}
            active={selectedCategories.includes(chip.id)}
            onPress={() => onToggleCategory(chip.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  reset: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary
  },
  content: {
    gap: 12,
    paddingBottom: 14
  },
  memberChip: {
    width: 84,
    padding: 12,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted
  },
  memberChipActive: {
    backgroundColor: colors.primaryLight
  },
  memberName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center'
  },
  memberNameActive: {
    color: colors.textPrimary,
    fontWeight: '600'
  }
});
