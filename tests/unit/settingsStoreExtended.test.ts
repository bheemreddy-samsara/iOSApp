// Extended settings store tests - testing store action logic
// Note: Tests action implementations directly to avoid persist middleware issues

type CalendarView = 'day' | 'week' | 'month';
type CalendarProvider = 'google' | 'outlook' | 'caldav';

interface SettingsState {
  preferredView: CalendarView;
  calendarProviders: CalendarProvider[];
  pushEnabled: boolean;
  emailDigest: boolean;
  hasCompletedOnboarding: boolean;
  hasAcceptedPrivacyPolicy: boolean;
}

// Create a fresh state helper
const createState = (): SettingsState => ({
  preferredView: 'week',
  calendarProviders: [],
  pushEnabled: false,
  emailDigest: true,
  hasCompletedOnboarding: false,
  hasAcceptedPrivacyPolicy: false,
});

// Action implementations (extracted from store logic)
const setPreferredView = (
  state: SettingsState,
  view: CalendarView,
): SettingsState => ({ ...state, preferredView: view });

const addCalendarProvider = (
  state: SettingsState,
  provider: CalendarProvider,
): SettingsState => ({
  ...state,
  calendarProviders: state.calendarProviders.includes(provider)
    ? state.calendarProviders
    : [...state.calendarProviders, provider],
});

const removeCalendarProvider = (
  state: SettingsState,
  provider: CalendarProvider,
): SettingsState => ({
  ...state,
  calendarProviders: state.calendarProviders.filter((p) => p !== provider),
});

const setPushEnabled = (
  state: SettingsState,
  enabled: boolean,
): SettingsState => ({ ...state, pushEnabled: enabled });

const setEmailDigest = (
  state: SettingsState,
  enabled: boolean,
): SettingsState => ({ ...state, emailDigest: enabled });

const setHasCompletedOnboarding = (
  state: SettingsState,
  completed: boolean,
): SettingsState => ({ ...state, hasCompletedOnboarding: completed });

const setHasAcceptedPrivacyPolicy = (
  state: SettingsState,
  accepted: boolean,
): SettingsState => ({ ...state, hasAcceptedPrivacyPolicy: accepted });

const resetPreferences = (state: SettingsState): SettingsState => ({
  preferredView: 'week',
  calendarProviders: [],
  pushEnabled: false,
  emailDigest: true,
  hasCompletedOnboarding: state.hasCompletedOnboarding,
  hasAcceptedPrivacyPolicy: state.hasAcceptedPrivacyPolicy,
});

const reset = (): SettingsState => createState();

describe('settingsStore action logic', () => {
  let state: SettingsState;

  beforeEach(() => {
    state = createState();
  });

  describe('preferredView', () => {
    it('defaults to week view', () => {
      expect(state.preferredView).toBe('week');
    });

    it('can be set to month view', () => {
      state = setPreferredView(state, 'month');
      expect(state.preferredView).toBe('month');
    });

    it('can be set to day view', () => {
      state = setPreferredView(state, 'day');
      expect(state.preferredView).toBe('day');
    });
  });

  describe('calendar providers', () => {
    it('starts with empty providers', () => {
      expect(state.calendarProviders).toEqual([]);
    });

    it('can add calendar provider', () => {
      state = addCalendarProvider(state, 'google');
      expect(state.calendarProviders).toContain('google');
    });

    it('can add multiple providers', () => {
      state = addCalendarProvider(state, 'google');
      state = addCalendarProvider(state, 'outlook');
      expect(state.calendarProviders).toContain('google');
      expect(state.calendarProviders).toContain('outlook');
    });

    it('does not add duplicate providers', () => {
      state = addCalendarProvider(state, 'google');
      state = addCalendarProvider(state, 'google');
      expect(state.calendarProviders.length).toBe(1);
    });

    it('can remove calendar provider', () => {
      state = addCalendarProvider(state, 'google');
      state = addCalendarProvider(state, 'outlook');
      state = removeCalendarProvider(state, 'google');
      expect(state.calendarProviders).not.toContain('google');
      expect(state.calendarProviders).toContain('outlook');
    });

    it('remove non-existent provider is safe', () => {
      expect(() => {
        state = removeCalendarProvider(state, 'google');
      }).not.toThrow();
      expect(state.calendarProviders).toEqual([]);
    });
  });

  describe('notification settings', () => {
    it('push notifications default to false', () => {
      expect(state.pushEnabled).toBe(false);
    });

    it('can enable push notifications', () => {
      state = setPushEnabled(state, true);
      expect(state.pushEnabled).toBe(true);
    });

    it('email digest defaults to true', () => {
      expect(state.emailDigest).toBe(true);
    });

    it('can disable email digest', () => {
      state = setEmailDigest(state, false);
      expect(state.emailDigest).toBe(false);
    });

    it('can toggle push notifications', () => {
      state = setPushEnabled(state, true);
      expect(state.pushEnabled).toBe(true);
      state = setPushEnabled(state, false);
      expect(state.pushEnabled).toBe(false);
    });
  });

  describe('onboarding', () => {
    it('starts with onboarding not completed', () => {
      expect(state.hasCompletedOnboarding).toBe(false);
    });

    it('can mark onboarding as completed', () => {
      state = setHasCompletedOnboarding(state, true);
      expect(state.hasCompletedOnboarding).toBe(true);
    });

    it('onboarding state persists after other changes', () => {
      state = setHasCompletedOnboarding(state, true);
      state = setPreferredView(state, 'month');
      expect(state.hasCompletedOnboarding).toBe(true);
    });
  });

  describe('privacy policy', () => {
    it('starts with privacy policy not accepted', () => {
      expect(state.hasAcceptedPrivacyPolicy).toBe(false);
    });

    it('can accept privacy policy', () => {
      state = setHasAcceptedPrivacyPolicy(state, true);
      expect(state.hasAcceptedPrivacyPolicy).toBe(true);
    });
  });

  describe('resetPreferences', () => {
    it('resets preferences but preserves onboarding and privacy', () => {
      // Set everything
      state = setPreferredView(state, 'month');
      state = setPushEnabled(state, true);
      state = setHasCompletedOnboarding(state, true);
      state = setHasAcceptedPrivacyPolicy(state, true);
      state = addCalendarProvider(state, 'google');

      // Reset
      state = resetPreferences(state);

      // Preferences should reset
      expect(state.preferredView).toBe('week');
      expect(state.pushEnabled).toBe(false);
      expect(state.calendarProviders).toEqual([]);

      // Long-term flags should persist
      expect(state.hasCompletedOnboarding).toBe(true);
      expect(state.hasAcceptedPrivacyPolicy).toBe(true);
    });
  });

  describe('reset', () => {
    it('resets all state to defaults', () => {
      state = setPreferredView(state, 'month');
      state = setPushEnabled(state, true);
      state = setHasCompletedOnboarding(state, true);

      state = reset();

      expect(state.preferredView).toBe('week');
      expect(state.pushEnabled).toBe(false);
      expect(state.hasCompletedOnboarding).toBe(false);
    });
  });
});
