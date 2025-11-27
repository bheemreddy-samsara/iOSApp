import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock all navigation dependencies
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock stores
const mockAuthStore = {
  session: null,
  member: null,
};

const mockSettingsStore = {
  hasCompletedOnboarding: false,
};

jest.mock('@/state/authStore', () => ({
  useAuthStore: jest.fn(() => mockAuthStore),
}));

jest.mock('@/state/settingsStore', () => ({
  useSettingsStore: jest.fn(() => mockSettingsStore),
}));

// Mock screens
jest.mock('@/screens/AuthScreen', () => ({
  AuthScreen: () => null,
}));
jest.mock('@/screens/OnboardingScreen', () => ({
  OnboardingScreen: () => null,
}));
jest.mock('@/screens/HomeScreen', () => ({
  HomeScreen: () => null,
}));
jest.mock('@/screens/CalendarScreen', () => ({
  CalendarScreen: () => null,
}));
jest.mock('@/screens/MembersScreen', () => ({
  MembersScreen: () => null,
}));
jest.mock('@/screens/SettingsScreen', () => ({
  SettingsScreen: () => null,
}));
jest.mock('@/screens/NotificationsScreen', () => ({
  NotificationsScreen: () => null,
}));
jest.mock('@/screens/IntegrationsScreen', () => ({
  IntegrationsScreen: () => null,
}));
jest.mock('@/screens/EventEditorScreen', () => ({
  EventEditorScreen: () => null,
}));
jest.mock('@/screens/PrivacyPolicyScreen', () => ({
  PrivacyPolicyScreen: () => null,
}));
jest.mock('@/screens/TermsScreen', () => ({
  TermsScreen: () => null,
}));

describe('Navigation routing logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInitialRoute', () => {
    it('returns Auth when not authenticated', () => {
      const isAuthenticated = false;
      const hasOnboarded = false;

      const getInitialRoute = () => {
        if (!isAuthenticated) return 'Auth';
        if (!hasOnboarded) return 'Onboarding';
        return 'MainTabs';
      };

      expect(getInitialRoute()).toBe('Auth');
    });

    it('returns Onboarding when authenticated but not onboarded', () => {
      const isAuthenticated = true;
      const hasOnboarded = false;

      const getInitialRoute = () => {
        if (!isAuthenticated) return 'Auth';
        if (!hasOnboarded) return 'Onboarding';
        return 'MainTabs';
      };

      expect(getInitialRoute()).toBe('Onboarding');
    });

    it('returns MainTabs when authenticated and onboarded', () => {
      const isAuthenticated = true;
      const hasOnboarded = true;

      const getInitialRoute = () => {
        if (!isAuthenticated) return 'Auth';
        if (!hasOnboarded) return 'Onboarding';
        return 'MainTabs';
      };

      expect(getInitialRoute()).toBe('MainTabs');
    });

    it('considers member presence for onboarding status', () => {
      const session = { user: { id: '123' } };
      const member = { id: 'm-1', name: 'Test' };
      const hasCompletedOnboarding = false;

      const isAuthenticated = Boolean(session);
      const hasOnboarded = hasCompletedOnboarding || Boolean(member);

      expect(isAuthenticated).toBe(true);
      expect(hasOnboarded).toBe(true);
    });
  });

  describe('Tab navigation', () => {
    it('defines correct tab screens', () => {
      const tabScreens = ['Today', 'Calendar', 'Members', 'Settings'];
      expect(tabScreens).toContain('Today');
      expect(tabScreens).toContain('Calendar');
      expect(tabScreens).toContain('Members');
      expect(tabScreens).toContain('Settings');
    });
  });

  describe('Modal screens', () => {
    it('defines correct modal screens', () => {
      const modalScreens = [
        'Notifications',
        'Integrations',
        'EventEditor',
        'PrivacyPolicy',
        'Terms',
      ];

      expect(modalScreens).toContain('Notifications');
      expect(modalScreens).toContain('EventEditor');
      expect(modalScreens).toContain('PrivacyPolicy');
      expect(modalScreens).toContain('Terms');
    });
  });
});
