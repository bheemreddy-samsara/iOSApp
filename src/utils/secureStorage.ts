import * as SecureStore from 'expo-secure-store';

export class SecureStorageError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'SecureStorageError';
  }
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn('SecureStore getItem error:', error);
      // Return null for read errors - graceful degradation
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      if (__DEV__) console.warn('SecureStore setItem error:', error);
      // Throw for write errors - critical for session persistence
      throw new SecureStorageError(
        'Failed to save secure data',
        'setItem',
        error,
      );
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      if (__DEV__) console.warn('SecureStore removeItem error:', error);
      // Don't throw for remove errors - not critical
    }
  },
};
