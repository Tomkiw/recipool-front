import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  clearIsAuthenticated: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user: User) => set(() => ({ user, isAuthenticated: true })),
      clearIsAuthenticated: () =>
        set(() => ({ isAuthenticated: false, user: null })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
