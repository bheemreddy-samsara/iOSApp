import { launchArguments } from 'expo-launch-arguments';

interface LaunchArgs {
  E2E_TEST?: boolean | string | number;
  MOCK_USER_ID?: string;
  MOCK_USER_EMAIL?: string;
  MOCK_FAMILY_ID?: string;
  // Detox passes args with dashes, check both formats
  'E2E-TEST'?: boolean | string | number;
  detoxServer?: string;
  detoxSessionId?: string;
}

let cachedArgs: LaunchArgs | null = null;

export function getLaunchArgs(): LaunchArgs {
  if (cachedArgs !== null) return cachedArgs;

  try {
    cachedArgs = (launchArguments as LaunchArgs) || {};
    // Debug log in dev mode
    if (__DEV__) {
      console.log('[TestMode] Launch arguments:', JSON.stringify(cachedArgs));
    }
  } catch (e) {
    if (__DEV__) {
      console.log('[TestMode] Error reading launch args:', e);
    }
    cachedArgs = {};
  }

  return cachedArgs;
}

export function isE2ETestMode(): boolean {
  const args = getLaunchArgs();
  // Check various formats - Detox may pass as boolean, string "true"/"1", or number 1
  const e2eFlag = args.E2E_TEST ?? args['E2E-TEST'];
  const isE2E =
    e2eFlag === true ||
    e2eFlag === 'true' ||
    e2eFlag === '1' ||
    e2eFlag === 1 ||
    // Also check if Detox server is present (indicates running under Detox)
    !!args.detoxServer;

  if (__DEV__ && isE2E) {
    console.log('[TestMode] E2E test mode detected');
  }

  return isE2E;
}

export function getMockUser() {
  const args = getLaunchArgs();
  if (!isE2ETestMode()) return null;

  return {
    id: args.MOCK_USER_ID || 'e2e-test-user-id',
    email: args.MOCK_USER_EMAIL || 'e2e-test@example.com',
    familyId: args.MOCK_FAMILY_ID || 'e2e-test-family-id',
  };
}
