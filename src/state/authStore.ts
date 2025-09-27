import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from '@supabase/supabase-js';
import { Member } from '@/types';
import { secureStorage } from '@/utils/secureStorage';

interface AuthState {
  session: Session | null;
  member: Member | null;
  setSession: (session: Session | null) => void;
  setMember: (member: Member | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      member: null,
      setSession: (session) => set({ session }),
      setMember: (member) => set({ member }),
      signOut: async () => {
        await secureStorage.removeItem('supabase-session');
        set({ session: null, member: null });
      }
    }),
    {
      name: 'auth-store',
      getStorage: () => secureStorage
    }
  )
);
