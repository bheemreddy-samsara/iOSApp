# Component Inventory

- **CalendarGrid** `(props: { view: 'month' | 'week' | 'day'; date: string; events: CalendarEvent[]; onSelectSlot(date: string): void; onSelectEvent(eventId: string): void; filters: CalendarFilterState; })`
- **DayColumn** `(props: { date: string; events: CalendarEvent[]; onSelectEvent(id: string): void; onCreateSlot(startISO: string): void; now?: string; })`
- **EventCard** `(props: { event: CalendarEvent; onPress(id: string): void; showStatus?: boolean; compact?: boolean; })`
- **EmojiChip** `(props: { emoji: string; label: string; active?: boolean; onPress(): void; })`
- **MemberAvatar** `(props: { member: Member; size?: number; showPresence?: boolean; })`
- **SegmentedControl** `(props: { segments: { key: string; label: string }[]; value: string; onChange(key: string): void; })`
- **FAB** `(props: { icon: LucideIcon; label?: string; onPress(): void; })`
- **EventSheet** `(props: { visible: boolean; event?: DraftEvent; onDismiss(): void; onSubmit(draft: DraftEvent): void; onDelete?(eventId: string): void; mode: 'create' | 'edit'; })`
- **FilterBar** `(props: { members: Member[]; selectedMemberIds: string[]; categories: CategoryChip[]; onToggleMember(id: string): void; onToggleCategory(id: string): void; onReset(): void; })`
- **RoleBadge** `(props: { role: MemberRole; })`
- **NotificationItem** `(props: { notification: Notification; onPress(id: string): void; onSnooze(id: string): void; })`
- **EmptyState** `(props: { title: string; description: string; actionLabel?: string; onAction?(): void; })`
- **ApprovalPill** `(props: { state: 'pending' | 'approved' | 'rejected'; onPress?(): void; })`
- **ProviderCard** `(props: { provider: CalendarProvider; status: ProviderStatus; onConnect(): void; onDisconnect(): void; })`
- **PreferenceToggle** `(props: { label: string; value: boolean; onValueChange(next: boolean): void; description?: string; })`
- **TimelineNowIndicator** `(props: { top: number; })`
- **OfflineNotice** `(props: { isOffline: boolean; onRetry(): void; })`
