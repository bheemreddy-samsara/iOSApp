import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationPreferences {
  reminders: boolean;
  approvals: boolean;
  conflicts: boolean;
  email: boolean;
  push: boolean;
}

interface SettingsState {
  isOfflineMode: boolean;
  notificationPreferences: NotificationPreferences;
  calendarDensity: 'comfortable' | 'compact';
  hapticsEnabled: boolean;
  hasAcceptedPrivacyPolicy: boolean;
  hasCompletedOnboarding: boolean;
  toggleOfflineMode: () => void;
  setNotificationPreference: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => void;
  toggleCalendarDensity: () => void;
  toggleHaptics: () => void;
  acceptPrivacyPolicy: () => void;
  completeOnboarding: () => void;
  resetPreferences: () => void;
  reset: () => void;
}

const defaultPreferences: NotificationPreferences = {
  reminders: true,
  approvals: true,
  conflicts: true,
  email: true,
  push: true,
};

const initialState = {
  isOfflineMode: false,
  notificationPreferences: defaultPreferences,
  calendarDensity: 'comfortable' as const,
  hapticsEnabled: true,
  hasAcceptedPrivacyPolicy: false,
  hasCompletedOnboarding: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleOfflineMode: () =>
        set((state) => ({ isOfflineMode: !state.isOfflineMode })),
      setNotificationPreference: (key, value) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value,
          },
        })),
      toggleCalendarDensity: () =>
        set((state) => ({
          calendarDensity:
            state.calendarDensity === 'comfortable' ? 'compact' : 'comfortable',
        })),
      toggleHaptics: () => {
        const next = !get().hapticsEnabled;
        if (next) {
          Haptics.selectionAsync().catch(() => {});
        }
        set({ hapticsEnabled: next });
      },
      acceptPrivacyPolicy: () => set({ hasAcceptedPrivacyPolicy: true }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetPreferences: () =>
        set((state) => ({
          isOfflineMode: false,
          notificationPreferences: defaultPreferences,
          calendarDensity: 'comfortable' as const,
          hapticsEnabled: true,
          // Preserve long-term flags
          hasAcceptedPrivacyPolicy: state.hasAcceptedPrivacyPolicy,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOfflineMode: state.isOfflineMode,
        notificationPreferences: state.notificationPreferences,
        calendarDensity: state.calendarDensity,
        hapticsEnabled: state.hapticsEnabled,
        hasAcceptedPrivacyPolicy: state.hasAcceptedPrivacyPolicy,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);
