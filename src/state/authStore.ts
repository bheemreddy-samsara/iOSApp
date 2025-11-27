import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
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

// Wrap secureStorage to match Zustand's StateStorage interface
const zustandSecureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return secureStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await secureStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await secureStorage.removeItem(name);
  },
};

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
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => zustandSecureStorage),
      partialize: (state) => ({
        session: state.session,
        member: state.member,
      }),
    },
  ),
);
