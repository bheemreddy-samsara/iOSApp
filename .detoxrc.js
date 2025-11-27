/** @type {import('detox').DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/TogetherCal.app',
      build:
        'xcodebuild -workspace ios/TogetherCal.xcworkspace -scheme TogetherCal -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      launchArgs: {
        detoxPrintBusyIdleResources: 'YES',
      },
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
        type: 'iPhone 15 Pro',
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
  },
};
