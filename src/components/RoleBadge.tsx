import { memo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MemberRole } from '@/types';
import { colors } from '@/theme/tokens';

const roleCopy: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  child: 'Child'
};

const roleColor: Record<MemberRole, string> = {
  owner: colors.primary,
  admin: colors.accent,
  member: colors.categoryTeal,
  child: colors.categoryPink
};

interface RoleBadgeProps {
  role: MemberRole;
}

export const RoleBadge = memo(({ role }: RoleBadgeProps) => (
  <View style={[styles.badge, { backgroundColor: roleColor[role] + '22' }]}
    accessibilityRole="text"
    accessibilityLabel={`Role ${roleCopy[role]}`}
  >
    <Text style={[styles.label, { color: roleColor[role] }]}>{roleCopy[role]}</Text>
  </View>
));

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start'
  },
  label: {
    fontSize: 12,
    fontWeight: '600'
  }
});
