import { create } from "zustand";

interface AuthState {
  address: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAddress: (address: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  address: null,
  isAuthenticated: false,
  isLoading: false,
  setAddress: (address) => set({ address }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ address: null, isAuthenticated: false, isLoading: false }),
}));
