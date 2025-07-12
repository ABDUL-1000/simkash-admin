// app/store/zustandstore/useAuthStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/type" // Import the User type from your lib/type.ts

interface AuthStore {
  user: User | null // Stores the full user object from login response
  accessToken: string | null
  refreshToken: string | null
  setAuthData: (user: User, accessToken: string, refreshToken: string) => void
  clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuthData: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
        }),
      clearAuthData: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "auth-storage", // This key will be used in localStorage for auth data
    },
  ),
)
