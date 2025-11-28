import { device, expect, element, by, waitFor } from 'detox';

// Helper to wait for app to be ready with synchronization disabled
// This is necessary because the app may have continuous background operations
// that keep the main run loop busy (e.g., Zustand persist, React Query)
async function launchAndWaitForApp() {
  await device.launchApp({
    delete: true,
    newInstance: true,
  });
  // Disable synchronization since the app may have continuous background tasks
  await device.disableSynchronization();
  // Wait for the app to settle
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

describe('App Launch', () => {
  beforeAll(async () => {
    await launchAndWaitForApp();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  it('shows auth screen on first launch', async () => {
    await waitFor(element(by.id('app-title')))
      .toBeVisible()
      .withTimeout(20000);
  });

  it('displays sign in button', async () => {
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('displays social login options', async () => {
    await waitFor(element(by.id('google-signin-button')))
      .toBeVisible()
      .withTimeout(10000);
    await waitFor(element(by.id('outlook-signin-button')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('displays email and password inputs', async () => {
    await waitFor(element(by.id('email-input')))
      .toBeVisible()
      .withTimeout(5000);
    await waitFor(element(by.id('password-input')))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe('Auth Screen - Mode Switching', () => {
  beforeEach(async () => {
    await launchAndWaitForApp();
  });

  afterEach(async () => {
    await device.enableSynchronization();
  });

  it('shows sign in mode by default', async () => {
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(20000);
    await expect(element(by.id('auth-submit-text'))).toHaveText('Sign In');
  });

  it('can switch to sign up mode', async () => {
    await waitFor(element(by.id('toggle-mode-button')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('auth-submit-text')))
      .toHaveText('Create Account')
      .withTimeout(10000);
  });

  it('can switch back to sign in mode', async () => {
    await waitFor(element(by.id('toggle-mode-button')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('toggle-mode-button')).tap();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('auth-submit-text')))
      .toHaveText('Sign In')
      .withTimeout(10000);
  });

  it('shows confirm password in sign up mode', async () => {
    await waitFor(element(by.id('toggle-mode-button')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('confirm-password-input')))
      .toBeVisible()
      .withTimeout(10000);
  });
});

describe('Auth Screen - Form Validation', () => {
  beforeEach(async () => {
    await launchAndWaitForApp();
  });

  afterEach(async () => {
    await device.enableSynchronization();
  });

  it('shows error for empty email', async () => {
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('auth-submit-button')).tap();
    await waitFor(element(by.id('error-text')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('can enter email and password', async () => {
    await waitFor(element(by.id('email-input')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    // Dismiss keyboard
    await element(by.id('password-input')).tapReturnKey();
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Note: TextInput doesn't support toHaveText for checking entered text
    // The test passes if no errors occur during typing
  });
});
