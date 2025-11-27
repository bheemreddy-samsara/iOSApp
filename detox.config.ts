// import { DetoxConfig } from 'detox';
type DetoxConfig = any; // Temporary fix for Detox types

const config: DetoxConfig = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    retries: 1,
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/TogetherCal.app',
      build:
        'xcodebuild -workspace ios/TogetherCal.xcworkspace -scheme TogetherCal -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/TogetherCal.app',
      build:
        'xcodebuild -workspace ios/TogetherCal.xcworkspace -scheme TogetherCal -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.release': {
      device: 'simulator',
      app: 'ios.release',
    },
  },
  behavior: {
    init: {
      exposeGlobals: true,
    },
    launchApp: 'auto',
    cleanup: {
      shutdownDevice: false,
    },
  },
};

export default config;
