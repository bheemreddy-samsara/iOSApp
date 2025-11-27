import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { nanoid } from 'nanoid/non-secure';
import { EventSheet } from '@/components/EventSheet';
import { demoMembers } from '@/data/sampleEvents';
import { CategoryChip, CalendarEvent, DraftEvent } from '@/types';
import { useCalendarStore } from '@/state/calendarStore';
import { useCurrentFamily, useFamilyMembers } from '@/hooks/useFamily';
import { RootStackParamList } from '@/navigation';
import { colors } from '@/theme/tokens';

const categoryChips: CategoryChip[] = [
  { id: '🏥 Health', emoji: '🏥', label: 'Health' },
  { id: '🎒 School', emoji: '🎒', label: 'School' },
  { id: '⚽ Sports', emoji: '⚽', label: 'Sports' },
  { id: '🏠 Family', emoji: '🏠', label: 'Family' },
  { id: '🎓 Projects', emoji: '🎓', label: 'Projects' },
  { id: '🎵 Creatives', emoji: '🎵', label: 'Music' },
];

type EventEditorRoute = RouteProp<RootStackParamList, 'EventEditor'>;

export function EventEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute<EventEditorRoute>();
  const [visible, setVisible] = useState(true);
  const { eventId } = route.params ?? {};
  const events = useCalendarStore((state) => state.events);
  const upsertEvents = useCalendarStore((state) => state.upsertEvents);
  const removeEvent = useCalendarStore((state) => state.removeEvent);

  const { data: family } = useCurrentFamily();
  const { data: realMembers } = useFamilyMembers(family?.id);

  const currentEvent = useMemo(
    () => (eventId ? events[eventId] : undefined),
    [eventId, events],
  );
  const members =
    realMembers && realMembers.length > 0
      ? realMembers
      : __DEV__
        ? demoMembers
        : [];
  const existingDraft: DraftEvent | undefined = currentEvent
    ? {
        ...currentEvent,
        members: currentEvent.attendees,
        privacyMode: currentEvent.privacyMode,
        category: currentEvent.category ?? '🏠 Family',
      }
    : undefined;

  const handleDismiss = () => {
    setVisible(false);
    navigation.goBack();
  };

  const handleSubmit = (draft: DraftEvent) => {
    const multiDay =
      new Date(draft.start).toDateString() !==
      new Date(draft.end).toDateString();
    const event: CalendarEvent = {
      id: currentEvent?.id ?? nanoid(10),
      calendarId: currentEvent?.calendarId ?? 'family-main',
      title: draft.title,
      description: draft.description,
      location: draft.location,
      category: draft.category,
      start: draft.start,
      end: draft.end,
      allDay: draft.allDay ?? false,
      multiDay,
      approvalState: draft.approvalState ?? 'approved',
      privacyMode: draft.privacyMode,
      creatorId: currentEvent?.creatorId ?? demoMembers[0].id,
      attendees: draft.members,
      provider: currentEvent?.provider,
    };

    upsertEvents([event]);
    handleDismiss();
  };

  const handleDelete = (id: string) => {
    removeEvent(id);
    handleDismiss();
  };

  const requireApproval = currentEvent?.approvalState === 'pending';

  return (
    <View style={styles.screen}>
      <EventSheet
        visible={visible}
        event={existingDraft}
        members={members}
        categories={categoryChips}
        onDismiss={handleDismiss}
        onSubmit={handleSubmit}
        onDelete={currentEvent ? handleDelete : undefined}
        mode={currentEvent ? 'edit' : 'create'}
        requireApproval={requireApproval}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
