import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '../types/api';

type AuthState = {
  auth: AuthResponse | null;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,
      setAuth: (auth) => set({ auth }),
      logout: () => set({ auth: null }),
      isAuthenticated: () => {
        const auth = get().auth;
        if (!auth?.accessToken) {
          return false;
        }

        return new Date(auth.accessTokenExpiresAt).getTime() > Date.now();
      },
    }),
    {
      name: 'football-auth',
      partialize: (state) => ({ auth: state.auth }),
    },
  ),
);
