import { create } from 'zustand';
import * as Haptics from 'expo-haptics';

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
  toggleOfflineMode: () => void;
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void;
  toggleCalendarDensity: () => void;
  toggleHaptics: () => void;
}

const defaultPreferences: NotificationPreferences = {
  reminders: true,
  approvals: true,
  conflicts: true,
  email: true,
  push: true
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isOfflineMode: false,
  notificationPreferences: defaultPreferences,
  calendarDensity: 'comfortable',
  hapticsEnabled: true,
  toggleOfflineMode: () => set((state) => ({ isOfflineMode: !state.isOfflineMode })),
  setNotificationPreference: (key, value) =>
    set((state) => ({
      notificationPreferences: { ...state.notificationPreferences, [key]: value }
    })),
  toggleCalendarDensity: () =>
    set((state) => ({
      calendarDensity: state.calendarDensity === 'comfortable' ? 'compact' : 'comfortable'
    })),
  toggleHaptics: () => {
    const next = !get().hapticsEnabled;
    if (next) {
      Haptics.selectionAsync().catch(() => {});
    }
    set({ hapticsEnabled: next });
  }
}));
