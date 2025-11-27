import { device, expect, element, by, waitFor } from 'detox';

// Helper to wait for app to be ready
async function waitForAppReady() {
  await device.disableSynchronization();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await device.enableSynchronization();
}

// Mock session data to simulate logged-in state
const mockAuthData = JSON.stringify({
  state: {
    session: {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        aud: 'authenticated',
        created_at: '2024-01-01',
      },
    },
    member: {
      id: 'test-member-id',
      familyId: 'test-family-id',
      name: 'Test User',
      role: 'owner',
      color: '#5E6AD2',
      emoji: '😊',
    },
  },
  version: 0,
});

const mockSettingsData = JSON.stringify({
  state: {
    hasCompletedOnboarding: true,
    hasAcceptedPrivacyPolicy: true,
  },
  version: 0,
});

describe('Post-Login - Main Tabs', () => {
  beforeAll(async () => {
    // Launch app with user defaults to simulate logged-in state
    await device.launchApp({
      delete: true,
      newInstance: true,
      launchArgs: {
        detoxDebugVisibility: 'YES',
      },
      // Pre-set auth state via user defaults (iOS) or shared preferences (Android)
      userDefaults: {
        'auth-store': mockAuthData,
        'settings-store': mockSettingsData,
      },
    });
    await waitForAppReady();
  });

  it('shows main tabs after login', async () => {
    // Should see bottom tab bar with Today, Calendar, Members, Settings
    await waitFor(element(by.text('Today')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('displays Today tab content', async () => {
    await waitFor(element(by.text('Today')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text('Today')).tap();
    // Should see the home screen content
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('can navigate to Calendar tab', async () => {
    await element(by.text('Calendar')).tap();
    await waitFor(element(by.id('calendar-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('can navigate to Members tab', async () => {
    await element(by.text('Members')).tap();
    await waitFor(element(by.id('members-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('can navigate to Settings tab', async () => {
    await element(by.text('Settings')).tap();
    await waitFor(element(by.id('settings-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe('Post-Login - Settings', () => {
  beforeEach(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      userDefaults: {
        'auth-store': mockAuthData,
        'settings-store': mockSettingsData,
      },
    });
    await waitForAppReady();
    await waitFor(element(by.text('Settings')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.text('Settings')).tap();
  });

  it('displays user info', async () => {
    await waitFor(element(by.id('settings-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('shows sign out button', async () => {
    await waitFor(element(by.id('sign-out-button')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
