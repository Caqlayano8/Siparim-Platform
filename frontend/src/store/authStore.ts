import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  isRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('siparim_token', token);
          localStorage.setItem('siparim_user', JSON.stringify(user));
        }
        set({ user, token });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('siparim_token');
          localStorage.removeItem('siparim_user');
        }
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      isAuthenticated: () => !!get().token && !!get().user,

      isRole: (role) => get().user?.role === role,
    }),
    {
      name: 'siparim-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
