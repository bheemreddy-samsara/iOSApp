// import { DetoxConfig } from 'detox';
type DetoxConfig = any; // Temporary fix for Detox types

const config: DetoxConfig = {
  testRunner: {
    args: {
      $0: 'vitest'
    },
    type: 'direct'
  },
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/TogetherCal.app',
      build: 'pnpm ios'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    }
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios'
    }
  }
};

export default config;
