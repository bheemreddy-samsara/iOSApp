import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from '@/supabase/types';

let client: SupabaseClient<Database> | null = null;
let isConfigured = false;

export const isSupabaseConfigured = (): boolean => {
  if (isConfigured) return true;
  const { expoConfig } = Constants;
  const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    (expoConfig?.extra?.supabaseUrl as string | undefined);
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    (expoConfig?.extra?.supabaseAnonKey as string | undefined);
  isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
  return isConfigured;
};

export const getSupabaseClient = () => {
  if (client) return client;
  const { expoConfig } = Constants;
  const supabaseUrl =
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    (expoConfig?.extra?.supabaseUrl as string | undefined);
  const supabaseAnonKey =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    (expoConfig?.extra?.supabaseAnonKey as string | undefined);
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't actually connect
    // This allows the app to run in demo mode without Supabase
    if (__DEV__)
      console.warn(
        'Supabase credentials not configured - running in demo mode',
      );
    return null as unknown as SupabaseClient<Database>;
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
        },
      },
    },
  });
  return client;
};
