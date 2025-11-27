import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { MemberAvatar } from '@/components/MemberAvatar';
import { RoleBadge } from '@/components/RoleBadge';
import { ApprovalPill } from '@/components/ApprovalPill';
import { demoMembers } from '@/data/sampleEvents';
import { colors, spacing } from '@/theme/tokens';
import { useCurrentFamily, useFamilyMembers } from '@/hooks/useFamily';

export function MembersScreen() {
  const { data: family, isLoading: familyLoading } = useCurrentFamily();
  const { data: members, isLoading: membersLoading } = useFamilyMembers(
    family?.id,
  );

  const isLoading = familyLoading || membersLoading;
  const displayMembers =
    members && members.length > 0
      ? members
      : __DEV__
        ? demoMembers
        : [];

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading family...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Family Crew</Text>
      <Text style={styles.subtitle}>
        Invite grandparents, approve child events, and celebrate big wins
        together.
      </Text>
      <FlatList
        data={displayMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.memberCard}
            accessibilityRole="button"
            accessibilityLabel={`${item.name} ${item.role}`}
            onPress={() => {}}
          >
            <View style={styles.memberInfo}>
              <MemberAvatar member={item} size={52} />
              <View style={styles.memberCopy}>
                <Text style={styles.memberName}>{item.name}</Text>
                <RoleBadge role={item.role} />
              </View>
            </View>
            {item.role === 'child' && <ApprovalPill state="pending" />}
          </Pressable>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No family members yet</Text>
            <Text style={styles.emptyText}>
              Invite your family to get started!
            </Text>
          </View>
        )}
      />
      <Pressable accessibilityRole="button" style={styles.inviteButton}>
        <Text style={styles.inviteLabel}>Invite new member</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['3xl'],
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 22,
  },
  list: {
    paddingBottom: 120,
  },
  memberCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'rgba(25, 32, 72, 0.12)',
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  memberCopy: {
    gap: 6,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inviteButton: {
    position: 'absolute',
    bottom: 40,
    left: spacing['3xl'],
    right: spacing['3xl'],
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  inviteLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
