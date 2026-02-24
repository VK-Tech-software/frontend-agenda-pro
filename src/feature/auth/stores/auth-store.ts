import { create } from "zustand"
import { AuthService } from "../services/auth-services";

export interface User {
  id: number;
  name: string;
  email: string;
  empresaId?: number;
  tipoConta?: string;
}

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean,
  bootstrap: () => Promise<void>;
  onLogin: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetAuth: () => void;
}

export const AuthStore = create<AuthState>()(
  (set): AuthState => ({
    user: null,
    isAuthenticated: false,
    initialized: false,
    loading: false,
    bootstrap: async () => {
      set({ loading: true });
      try {
        const data = await AuthService.me();
        set({
          user: data?.data?.user ?? null,
          isAuthenticated: true,
          initialized: true,
          loading: false,
        });
      } catch {
        set({
          user: null,
          isAuthenticated: false,
          initialized: true,
          loading: false,
        });
      }
    },
    onLogin: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const data = await AuthService.login({ email, password });
        const user = data?.data?.user as User;

        set({
          user,
          isAuthenticated: true,
          initialized: true,
          loading: false,
        });

        return user;
      } catch (error) {
        set({ loading: false });
        throw error;
      }
    },
    logout: async () => {
      try {
        await AuthService.logout();
      } finally {
        set({ user: null, isAuthenticated: false, initialized: true, loading: false });
      }
    },
    resetAuth: () => {
      set({ user: null, isAuthenticated: false, initialized: true, loading: false });
    },
  })
)