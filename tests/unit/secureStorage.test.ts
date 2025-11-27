// SecureStorage utilities tests
import * as SecureStore from 'expo-secure-store';
import { secureStorage } from '@/utils/secureStorage';

// Mock expo-secure-store is already in jest.setup.js

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('returns value from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test-value');

      const result = await secureStorage.getItem('test-key');

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(result).toBe('test-value');
    });

    it('returns null when key does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await secureStorage.getItem('non-existent');

      expect(result).toBeNull();
    });

    it('returns null and logs warning on error', async () => {
      const error = new Error('SecureStore error');
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(error);

      const result = await secureStorage.getItem('test-key');

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        'SecureStore getItem error:',
        error,
      );
    });
  });

  describe('setItem', () => {
    it('stores value in SecureStore', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.setItem('test-key', 'test-value');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'test-key',
        'test-value',
      );
    });

    it('handles empty string value', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.setItem('test-key', '');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('test-key', '');
    });

    it('throws SecureStorageError on write failure', async () => {
      const error = new Error('SecureStore error');
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(error);

      await expect(secureStorage.setItem('test-key', 'value')).rejects.toThrow(
        'Failed to save secure data',
      );
    });
  });

  describe('removeItem', () => {
    it('deletes item from SecureStore', async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.removeItem('test-key');

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
    });

    it('does not throw on error (graceful degradation)', async () => {
      const error = new Error('SecureStore error');
      (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(error);

      // Should not throw - remove errors are not critical
      await expect(secureStorage.removeItem('test-key')).resolves.toBeUndefined();
    });
  });

  describe('integration scenarios', () => {
    it('can store and retrieve a value', async () => {
      let storage: Record<string, string> = {};

      (SecureStore.setItemAsync as jest.Mock).mockImplementation(
        async (key, value) => {
          storage[key] = value;
        },
      );

      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          return storage[key] || null;
        },
      );

      await secureStorage.setItem('user-token', 'abc123');
      const result = await secureStorage.getItem('user-token');

      expect(result).toBe('abc123');
    });

    it('can store and remove a value', async () => {
      let storage: Record<string, string> = { 'user-token': 'abc123' };

      (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          delete storage[key];
        },
      );

      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key) => {
          return storage[key] || null;
        },
      );

      await secureStorage.removeItem('user-token');
      const result = await secureStorage.getItem('user-token');

      expect(result).toBeNull();
    });

    it('handles JSON data', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify({ userId: '123', role: 'admin' }),
      );

      const data = { userId: '123', role: 'admin' };
      await secureStorage.setItem('user-data', JSON.stringify(data));

      const result = await secureStorage.getItem('user-data');
      expect(JSON.parse(result!)).toEqual(data);
    });
  });
});
