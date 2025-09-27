# Screen Specs & Accessibility Notes

## Home / Today
- **Hero summary** with large date, upcoming family events, quick actions.
- **Kid-friendly cards** showing next events with emoji + member avatars.
- **A11y:** VoiceOver labels include member names, event privacy; supports Dynamic Type; top actions >44pt touch targets; subtle haptics on filter toggles.

## Calendar (Month / Week / Day)
- **Segmented control** to switch views with spring animation.
- Month grid with pastel chips, week view with scrollable columns, day view with draggable timeline.
- **A11y:** Grid uses `accessibilityRole="grid"`; announces date + event count; ensures focus order matches visual layout; includes high contrast toggles.

## Create / Edit Event Sheet
- Sheet modal with fields: title, description, location, start/end pickers, all-day toggle, emoji category chips, privacy mode radio, member assignment pills, approval toggle when child.
- **A11y:** Fields labelled; child approval switch explains requirement; keyboard and VoiceOver friendly; confirm button announces action.

## Notifications Inbox
- Timeline of reminders, approvals, conflict alerts with swipe actions.
- **A11y:** Items announced with type + time; ensures `accessibilityHint` for swipe actions; respects reduced motion.

## Members & Roles
- List of members with avatars, role badges, status (online/pending invite), manage approvals queue.
- **A11y:** Manage buttons with explicit labels ("Change role for Jamie to Admin"); ensures color not sole indicator.

## Integrations Hub
- Cards for Google, Outlook, Apple (CalDAV) with connection state, last sync, scopes summary.
- **A11y:** Connect buttons describe provider; error states persistent and spoken; instructions readable at large text sizes.

## Settings
- Preferences for notifications, privacy safeguards, export data, offline mode toggle.
- **A11y:** Toggles sized 52×32; uses `accessibilityValue` to announce state; sections contain headings for VoiceOver navigation.

## Onboarding
- Slides introducing privacy-first promise, quick family setup, permission requests for notifications/calendar.
- SF Pro text with illustrated cards; final step collects family name + timezone.
- **A11y:** Skip button focusable; progress indicators with text; permission prompts accompanied by rationale.
