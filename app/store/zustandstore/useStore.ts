// store/dashboardStore.ts

import { DashboardData, Transaction, UserDetails, UserProfile, Wallet } from '@/lib/type';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DashboardStore {
  dashboardData: DashboardData | null;
  userDetails: UserDetails | null;
  userProfile: UserProfile | null;
  wallet: Wallet | null;
  transactions: Transaction[];

  setDashboardData: (data: DashboardData) => void;
  clearDashboardData: () => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      dashboardData: null,
      userDetails: null,
      userProfile: null,
      wallet: null,
      transactions: [],

      setDashboardData: (data) => set({
        dashboardData: data,
        userDetails: data.userDetails,
        userProfile: data.userProfile,
        wallet: data.wallet,
        transactions: data.transaction
      }),

      clearDashboardData: () => set({
        dashboardData: null,
        userDetails: null,
        userProfile: null,
        wallet: null,
        transactions: []
      })
    }),
    {
      name: 'dashboard-storage' // this key will be used in localStorage
    }
  )
)
