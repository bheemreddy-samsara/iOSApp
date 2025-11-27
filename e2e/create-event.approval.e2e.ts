import { device, expect, element, by, waitFor } from 'detox';

// Helper to wait for app to be ready
async function waitForAppReady() {
  await device.disableSynchronization();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await device.enableSynchronization();
}

describe('App Launch', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await waitForAppReady();
  });

  it('shows auth screen on first launch', async () => {
    await waitFor(element(by.id('app-title')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('displays sign in button', async () => {
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('displays social login options', async () => {
    await waitFor(element(by.id('google-signin-button')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('outlook-signin-button'))).toBeVisible();
  });

  it('displays email and password inputs', async () => {
    await expect(element(by.id('email-input'))).toBeVisible();
    await expect(element(by.id('password-input'))).toBeVisible();
  });
});

describe('Auth Screen - Mode Switching', () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await waitForAppReady();
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('shows sign in mode by default', async () => {
    await expect(element(by.id('auth-submit-text'))).toHaveText('Sign In');
  });

  it('can switch to sign up mode', async () => {
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('auth-submit-text')))
      .toHaveText('Create Account')
      .withTimeout(5000);
  });

  it('can switch back to sign in mode', async () => {
    await element(by.id('toggle-mode-button')).tap();
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('auth-submit-text')))
      .toHaveText('Sign In')
      .withTimeout(5000);
  });

  it('shows confirm password in sign up mode', async () => {
    await element(by.id('toggle-mode-button')).tap();
    await waitFor(element(by.id('confirm-password-input')))
      .toBeVisible()
      .withTimeout(5000);
  });
});

describe('Auth Screen - Form Validation', () => {
  beforeEach(async () => {
    await device.launchApp({ delete: true, newInstance: true });
    await waitForAppReady();
    await waitFor(element(by.id('auth-submit-button')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('shows error for empty email', async () => {
    await element(by.id('auth-submit-button')).tap();
    await waitFor(element(by.id('error-text')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('can enter email and password', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await expect(element(by.id('email-input'))).toHaveText('test@example.com');
  });
});
