import { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
// import { styled } from 'nativewind';
import { format } from 'date-fns';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { colors, spacing } from '@/theme/tokens';
import { useDemoData } from '@/hooks/useDemoData';
import { useDemoMembers } from '@/hooks/useDemoMembers';
import { useCalendarStore } from '@/state/calendarStore';
import { useSettingsStore } from '@/state/settingsStore';
import { EventCard } from '@/components/EventCard';
import { FAB } from '@/components/FAB';
import { FilterBar } from '@/components/FilterBar';
import { OfflineNotice } from '@/components/OfflineNotice';
import { CategoryChip } from '@/types';
import { RootStackParamList } from '@/navigation';
import { Plus, Bell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const categoryChips: CategoryChip[] = [
  { id: '🏥 Health', emoji: '🏥', label: 'Health' },
  { id: '🎒 School', emoji: '🎒', label: 'School' },
  { id: '⚽ Sports', emoji: '⚽', label: 'Sports' },
  { id: '🏠 Family', emoji: '🏠', label: 'Family' },
  { id: '🎨 School', emoji: '🎨', label: 'Arts' },
  { id: '🎓 Projects', emoji: '🎓', label: 'Projects' },
];

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useDemoData();
  const members = useDemoMembers();
  const { isOfflineMode, toggleOfflineMode } = useSettingsStore((state) => ({
    isOfflineMode: state.isOfflineMode,
    toggleOfflineMode: state.toggleOfflineMode,
  }));
  const filters = useCalendarStore((state) => state.filters);
  const setFilters = useCalendarStore((state) => state.setFilters);
  const events = useCalendarStore((state) => Object.values(state.events));

  const upcoming = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => new Date(event.start) >= now)
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [events]);

  const heroDate = format(new Date(), 'EEEE, MMMM do');

  const applyMember = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    const next = filters.memberIds.includes(id)
      ? filters.memberIds.filter((memberId) => memberId !== id)
      : [...filters.memberIds, id];
    setFilters({ ...filters, memberIds: next });
  };

  const applyCategory = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    const next = filters.categories.includes(id)
      ? filters.categories.filter((catId) => catId !== id)
      : [...filters.categories, id];
    setFilters({ ...filters, categories: next });
  };

  const resetFilters = () =>
    setFilters({ memberIds: [], categories: [], showPending: true });

  const filteredEvents = useMemo(() => {
    return upcoming.filter((event) => {
      const memberMatch =
        filters.memberIds.length === 0 ||
        event.attendees?.some((id) => filters.memberIds.includes(id));
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(event.category ?? '');
      return memberMatch && categoryMatch;
    });
  }, [filters, upcoming]);

  const goToNotifications = () => navigation.navigate('Notifications');

  // const HeroRow = styled(View); // Commented out - NativeWind styled not available

  return (
    <View style={styles.screen}>
      <OfflineNotice isOffline={isOfflineMode} onRetry={toggleOfflineMode} />
      <FlashList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigation.navigate('EventEditor', { eventId: item.id })
            }
          />
        )}
        estimatedItemSize={140}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <View
              style={[
                styles.heroRow,
                {
                  marginTop: 32,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View>
                <Text style={styles.heroLabel}>Today</Text>
                <Text style={styles.heroDate}>{heroDate}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={goToNotifications}
                style={styles.notificationBtn}
              >
                <Bell color={colors.primary} size={24} />
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>This week feels calm ✨</Text>
              <Text style={styles.sectionCopy}>
                {filteredEvents.length > 0
                  ? `You have ${filteredEvents.length} upcoming family moments.`
                  : 'No events yet. Tap the + button to add something fun!'}
              </Text>
              <FilterBar
                members={members}
                selectedMemberIds={filters.memberIds}
                categories={categoryChips}
                selectedCategories={filters.categories}
                onToggleMember={applyMember}
                onToggleCategory={applyCategory}
                onReset={resetFilters}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Catch your breath</Text>
            <Text style={styles.emptyCopy}>
              Nothing on the horizon. Maybe plan a picnic?
            </Text>
          </View>
        )}
      />
      <View style={styles.fabContainer}>
        <FAB
          icon={Plus}
          label="Plan event"
          onPress={() => navigation.navigate('EventEditor')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing['3xl'],
    paddingBottom: 140,
    gap: 24,
  },
  headerSection: {
    gap: 24,
  },
  heroRow: {
    // Base style for hero row
  },
  heroLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  heroDate: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: 'rgba(25, 32, 72, 0.12)',
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionCopy: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyCopy: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 36,
    right: 24,
  },
});
