import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '@devvai/devv-code-backend';

interface User {
  projectId: string;
  uid: string;
  name: string;
  email: string;
  createdTime: number;
  lastLoginTime: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      sendOTP: async (email: string) => {
        set({ isLoading: true });
        try {
          await auth.sendOTP(email);
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await auth.verifyOTP(email, otp);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await auth.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      checkAuthStatus: () => {
        const sid = localStorage.getItem('DEVV_CODE_SID');
        const { user } = get();
        if (sid && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
