// app/store/zustandstore/useAuthStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/type"

interface AuthStore {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuthData: (data: {
    user: User
    accessToken: string
    refreshToken: string
  }) => void
  clearAuthData: () => void
  isAgent: () => boolean // Helper function to check agent status
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuthData: (data) => {
        console.log("Setting auth data:", data)
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        })
      },

      clearAuthData: () => {
        console.log("Clearing auth data")
        set({
          user: null,
          accessToken: null,
          refreshToken: null
        })
      },

      isAgent: () => {
        return get().user?.isAgent || false
      }
    }),
    {
      name: "auth-storage",
      // Only persist the essential data
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken
      })
    }
  )
)