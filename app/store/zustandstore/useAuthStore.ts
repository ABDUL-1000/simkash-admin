// app/store/zustandstore/useAuthStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/type"

interface AuthStore {
  user: User | null // This 'user' object will contain 'isAgent'
  // Removed accessToken and refreshToken from state
  setAuthData: (user: User) => void // Removed accessToken and refreshToken from parameters
  clearAuthData: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      // Removed accessToken and refreshToken from initial state
      setAuthData: (user) => {
        // Updated parameters
        console.log("Setting user data in AuthStore:", user) // Added console.log
        set({
          user, // This line saves the entire 'user' object, including 'isAgent'
        })
      },
      clearAuthData: () => {
        console.log("Clearing AuthStore data.") // Added console.log for clarity
        set({
          user: null,
          // Removed accessToken and refreshToken from clear action
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
