import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from '@/supabase/types';

let client: SupabaseClient<Database> | null = null;

export const getSupabaseClient = () => {
  if (client) return client;
  const { expoConfig } = Constants;
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? (expoConfig?.extra?.supabaseUrl as string | undefined);
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (expoConfig?.extra?.supabaseAnonKey as string | undefined);
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials are not configured');
  }
  client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: {
        getItem: async (key) => {
          const { secureStorage } = await import('@/utils/secureStorage');
          return secureStorage.getItem(key);
        },
        setItem: async (key, value) => {
          const { secureStorage } = await import('@/utils/secureStorage');
          await secureStorage.setItem(key, value);
        },
        removeItem: async (key) => {
          const { secureStorage } = await import('@/utils/secureStorage');
          await secureStorage.removeItem(key);
        }
      }
    }
  });
  return client;
};
