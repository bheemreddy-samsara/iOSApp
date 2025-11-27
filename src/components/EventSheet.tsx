import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Switch,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { DraftEvent, Member, CategoryChip } from '@/types';
import { colors, radii, shadows } from '@/theme/tokens';
import { EmojiChip } from './EmojiChip';
import { MemberAvatar } from './MemberAvatar';

interface EventSheetProps {
  visible: boolean;
  event?: DraftEvent;
  members: Member[];
  categories: CategoryChip[];
  onDismiss: () => void;
  onSubmit: (draft: DraftEvent) => void;
  onDelete?: (eventId: string) => void;
  mode: 'create' | 'edit';
  requireApproval?: boolean;
}

const defaultDraft: DraftEvent = {
  title: '',
  start: new Date().toISOString(),
  end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
  privacyMode: 'family',
  members: [],
  category: '🏠 Family',
};

export function EventSheet({
  visible,
  event,
  members,
  categories,
  onDismiss,
  onSubmit,
  onDelete,
  mode,
  requireApproval = false,
}: EventSheetProps) {
  const [draft, setDraft] = useState<DraftEvent>(event ?? defaultDraft);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [needsApproval, setNeedsApproval] = useState(
    requireApproval || event?.approvalState === 'pending',
  );

  useEffect(() => {
    setDraft(event ?? defaultDraft);
    setAllDay(event?.allDay ?? false);
    setNeedsApproval(requireApproval || event?.approvalState === 'pending');
  }, [event, requireApproval, visible]);

  const updateTime =
    (type: 'start' | 'end') => (e: DateTimePickerEvent, value?: Date) => {
      if (Platform.OS !== 'ios') {
        type === 'start' ? setShowStartPicker(false) : setShowEndPicker(false);
      }
      if (value) {
        setDraft((prev) => ({ ...prev, [type]: value.toISOString() }));
      }
    };

  const toggleMember = (memberId: string) => {
    setDraft((prev) => {
      const exists = prev.members.includes(memberId);
      return {
        ...prev,
        members: exists
          ? prev.members.filter((id) => id !== memberId)
          : [...prev.members, memberId],
      };
    });
  };

  const save = () => {
    onSubmit({
      ...draft,
      allDay,
      approvalState: needsApproval ? 'pending' : 'approved',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onDismiss}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {mode === 'create' ? 'New Event' : 'Edit Event'}
          </Text>
          <Pressable accessibilityRole="button" onPress={save}>
            <Text style={styles.save}>Save</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={draft.title}
              onChangeText={(title) => setDraft((prev) => ({ ...prev, title }))}
              placeholder="What are we planning?"
              style={styles.input}
              accessibilityLabel="Event title"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={draft.description ?? ''}
              onChangeText={(description) =>
                setDraft((prev) => ({ ...prev, description }))
              }
              placeholder="Notes for your family"
              multiline
              accessibilityLabel="Event description"
              style={[styles.input, styles.multiline]}
            />
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={draft.location ?? ''}
              onChangeText={(location) =>
                setDraft((prev) => ({ ...prev, location }))
              }
              placeholder="Add a place"
              accessibilityLabel="Event location"
              style={styles.input}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Time</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowStartPicker(true)}
              style={styles.timeRow}
            >
              <Text style={styles.timeLabel}>Starts</Text>
              <Text style={styles.timeValue}>
                {new Date(draft.start).toLocaleString()}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowEndPicker(true)}
              style={styles.timeRow}
            >
              <Text style={styles.timeLabel}>Ends</Text>
              <Text style={styles.timeValue}>
                {new Date(draft.end).toLocaleString()}
              </Text>
            </Pressable>
            <View style={styles.switchRow}>
              <Text style={styles.timeLabel}>All day</Text>
              <Switch
                value={allDay}
                onValueChange={(value) => setAllDay(value)}
                trackColor={{
                  false: colors.surfaceMuted,
                  true: colors.primaryLight,
                }}
                thumbColor={allDay ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {categories.map((category) => (
                <EmojiChip
                  key={category.id}
                  emoji={category.emoji}
                  label={category.label}
                  active={draft.category === category.id}
                  onPress={() =>
                    setDraft((prev) => ({ ...prev, category: category.id }))
                  }
                />
              ))}
            </ScrollView>
            <Text style={[styles.label, styles.sectionSpacing]}>Privacy</Text>
            <View style={styles.privacyRow}>
              {['family', 'private', 'busy-only'].map((modeKey) => {
                const label =
                  modeKey === 'family'
                    ? 'Family'
                    : modeKey === 'private'
                      ? 'Private'
                      : 'Busy only';
                return (
                  <Pressable
                    key={modeKey}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: draft.privacyMode === modeKey,
                    }}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        privacyMode: modeKey as DraftEvent['privacyMode'],
                      }))
                    }
                    style={[
                      styles.privacyChip,
                      draft.privacyMode === modeKey && styles.privacyChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.privacyLabel,
                        draft.privacyMode === modeKey &&
                          styles.privacyLabelActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Participants</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membersRow}
            >
              {members.map((member) => {
                const active = draft.members.includes(member.id);
                return (
                  <Pressable
                    key={member.id}
                    style={[
                      styles.memberChip,
                      active && styles.memberChipActive,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                    accessibilityLabel={`Include ${member.name}`}
                    onPress={() => toggleMember(member.id)}
                  >
                    <MemberAvatar member={member} size={40} />
                    <Text
                      style={[
                        styles.memberName,
                        active && styles.memberNameActive,
                      ]}
                    >
                      {member.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {requireApproval && (
            <View style={styles.card}>
              <Text style={styles.label}>Parent approval</Text>
              <View style={styles.switchRow}>
                <Text style={styles.timeLabel}>Needs approval</Text>
                <Switch
                  value={needsApproval}
                  onValueChange={setNeedsApproval}
                  trackColor={{
                    false: colors.surfaceMuted,
                    true: colors.categoryPink,
                  }}
                  thumbColor={needsApproval ? colors.categoryPink : '#f4f3f4'}
                />
              </View>
              <Text style={styles.helper}>
                Kids submit events for review. Parents get a gentle ping to
                approve.
              </Text>
            </View>
          )}

          {mode === 'edit' && onDelete && event?.id && (
            <Pressable
              accessibilityRole="button"
              onPress={() => onDelete(event.id!)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteLabel}>Delete event</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {showStartPicker && (
        <DateTimePicker
          value={new Date(draft.start)}
          mode="datetime"
          onChange={updateTime('start')}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={new Date(draft.end)}
          mode="datetime"
          onChange={updateTime('end')}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: colors.surface,
  },
  cancel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  save: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: 20,
    gap: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 18,
    gap: 12,
    ...shadows.soft,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  multiline: {
    height: 90,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timeLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  timeValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryRow: {
    gap: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyChip: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  privacyChipActive: {
    backgroundColor: colors.primary,
  },
  privacyLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  privacyLabelActive: {
    color: '#FFFFFF',
  },
  sectionSpacing: {
    marginTop: 12,
  },
  membersRow: {
    gap: 12,
  },
  memberChip: {
    width: 96,
    padding: 12,
    borderRadius: radii.md,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    gap: 8,
  },
  memberChipActive: {
    backgroundColor: colors.primaryLight,
  },
  memberName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  memberNameActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  helper: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteLabel: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
