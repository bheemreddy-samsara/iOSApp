// Jest setup for Node environment testing
// Mock React Native modules for Node testing

// Define __DEV__ global for React Native
global.__DEV__ = true;

global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-apple-authentication
jest.mock('expo-apple-authentication', () => ({
  signInAsync: jest.fn(),
  AppleAuthenticationButton: () => null,
  AppleAuthenticationButtonType: {
    SIGN_IN: 0,
    CONTINUE: 1,
    SIGN_UP: 2,
  },
  AppleAuthenticationButtonStyle: {
    WHITE: 0,
    WHITE_OUTLINE: 1,
    BLACK: 2,
  },
  AppleAuthenticationScope: {
    FULL_NAME: 0,
    EMAIL: 1,
  },
}));

// Mock @react-native-async-storage/async-storage
const mockStorage = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn((key) => Promise.resolve(mockStorage.get(key) || null)),
    setItem: jest.fn((key, value) => {
      mockStorage.set(key, value);
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      mockStorage.delete(key);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      mockStorage.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve([...mockStorage.keys()])),
    multiGet: jest.fn((keys) =>
      Promise.resolve(keys.map((key) => [key, mockStorage.get(key) || null])),
    ),
    multiSet: jest.fn((pairs) => {
      pairs.forEach(([key, value]) => mockStorage.set(key, value));
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach((key) => mockStorage.delete(key));
      return Promise.resolve();
    }),
  },
}));
