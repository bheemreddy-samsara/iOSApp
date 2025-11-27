import { useSettingsStore } from '@/state/settingsStore';

// Mock zustand persist middleware to avoid storage issues in tests
jest.mock('zustand/middleware', () => {
  const actualMiddleware = jest.requireActual('zustand/middleware');
  return {
    ...actualMiddleware,
    persist: (config: any) => config,
    createJSONStorage: () => ({
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }),
  };
});

describe('settingsStore', () => {
  beforeEach(() => {
    // Reset store state manually since persist is mocked
    useSettingsStore.setState({
      isOfflineMode: false,
      notificationPreferences: {
        reminders: true,
        approvals: true,
        conflicts: true,
        email: true,
        push: true,
      },
      calendarDensity: 'comfortable',
      hapticsEnabled: true,
      hasAcceptedPrivacyPolicy: false,
      hasCompletedOnboarding: false,
    });
  });

  it('initializes with default values', () => {
    const state = useSettingsStore.getState();

    expect(state.isOfflineMode).toBe(false);
    expect(state.hapticsEnabled).toBe(true);
    expect(state.calendarDensity).toBe('comfortable');
    expect(state.hasAcceptedPrivacyPolicy).toBe(false);
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('toggles offline mode', () => {
    const { toggleOfflineMode } = useSettingsStore.getState();

    expect(useSettingsStore.getState().isOfflineMode).toBe(false);
    toggleOfflineMode();
    expect(useSettingsStore.getState().isOfflineMode).toBe(true);
    toggleOfflineMode();
    expect(useSettingsStore.getState().isOfflineMode).toBe(false);
  });

  it('toggles calendar density', () => {
    const { toggleCalendarDensity } = useSettingsStore.getState();

    expect(useSettingsStore.getState().calendarDensity).toBe('comfortable');
    toggleCalendarDensity();
    expect(useSettingsStore.getState().calendarDensity).toBe('compact');
    toggleCalendarDensity();
    expect(useSettingsStore.getState().calendarDensity).toBe('comfortable');
  });

  it('sets notification preferences individually', () => {
    const { setNotificationPreference } = useSettingsStore.getState();

    expect(useSettingsStore.getState().notificationPreferences.reminders).toBe(
      true,
    );
    setNotificationPreference('reminders', false);
    expect(useSettingsStore.getState().notificationPreferences.reminders).toBe(
      false,
    );

    // Other preferences should remain unchanged
    expect(useSettingsStore.getState().notificationPreferences.approvals).toBe(
      true,
    );
  });

  it('accepts privacy policy', () => {
    const { acceptPrivacyPolicy } = useSettingsStore.getState();

    expect(useSettingsStore.getState().hasAcceptedPrivacyPolicy).toBe(false);
    acceptPrivacyPolicy();
    expect(useSettingsStore.getState().hasAcceptedPrivacyPolicy).toBe(true);
  });

  it('completes onboarding', () => {
    const { completeOnboarding } = useSettingsStore.getState();

    expect(useSettingsStore.getState().hasCompletedOnboarding).toBe(false);
    completeOnboarding();
    expect(useSettingsStore.getState().hasCompletedOnboarding).toBe(true);
  });

  it('resets to initial state', () => {
    const store = useSettingsStore.getState();

    // Modify some values
    store.toggleOfflineMode();
    store.toggleCalendarDensity();
    store.acceptPrivacyPolicy();
    store.completeOnboarding();

    // Verify changes
    expect(useSettingsStore.getState().isOfflineMode).toBe(true);
    expect(useSettingsStore.getState().hasAcceptedPrivacyPolicy).toBe(true);

    // Reset
    useSettingsStore.getState().reset();

    // Verify reset
    expect(useSettingsStore.getState().isOfflineMode).toBe(false);
    expect(useSettingsStore.getState().hasAcceptedPrivacyPolicy).toBe(false);
    expect(useSettingsStore.getState().hasCompletedOnboarding).toBe(false);
  });
});
