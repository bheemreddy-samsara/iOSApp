import { device, expect, element, by } from 'detox';

describe('Create event approval flow', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: true });
  });

  it('creates a child event and requests approval', async () => {
    await element(by.text('Get started')).tap();
    await element(by.text('Plan event')).tap();
    await element(by.label('Event title')).typeText('Sleepover at Nora\'s');
    await element(by.text('Save')).tap();
    await expect(element(by.text('Sleepover at Nora\'s'))).toBeVisible();
  });
});
