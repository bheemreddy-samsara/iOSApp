// Dynamic Expo configuration
// This file allows environment variables to be used in app configuration
// See: https://docs.expo.dev/workflow/configuration/#dynamic-configuration

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.togethercal.app.dev';
  if (IS_PREVIEW) return 'com.togethercal.app.preview';
  return 'com.togethercal.app';
};

const getAppName = () => {
  if (IS_DEV) return 'TogetherCal (Dev)';
  if (IS_PREVIEW) return 'TogetherCal (Preview)';
  return 'TogetherCal';
};

export default {
  expo: {
    name: getAppName(),
    slug: 'togethercal',
    scheme: 'togethercal',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#F7F7FB',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#5E6AD2',
        },
      ],
      'expo-secure-store',
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      buildNumber: '1',
      infoPlist: {
        NSCalendarsUsageDescription:
          'TogetherCal reads your calendar to keep your family in sync without uploading private details.',
        NSContactsUsageDescription:
          'TogetherCal can suggest family members from your contacts to quickly set up your family group.',
        NSUserTrackingUsageDescription:
          'Tracking is disabled by default. We never share your data with advertisers.',
        UIBackgroundModes: ['fetch', 'remote-notification'],
      },
      entitlements: {
        'aps-environment': IS_DEV ? 'development' : 'production',
      },
    },
    android: {
      package: getUniqueIdentifier(),
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F7F7FB',
      },
      permissions: [
        'android.permission.READ_CALENDAR',
        'android.permission.READ_CONTACTS',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.VIBRATE',
      ],
    },
    web: {
      bundler: 'metro',
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '',
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    owner: process.env.EXPO_PUBLIC_OWNER || '',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
        ? `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}`
        : '',
    },
  },
};
