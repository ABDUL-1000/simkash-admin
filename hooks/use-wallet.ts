import { useQuery } from "@tanstack/react-query"
import { AuthAPI } from "@/lib/API/api" // Assuming AuthAPI is correctly imported
import { UserDetails, UserProfile, Wallet } from "@/lib/type"
import { useDashboardStore } from "@/app/store/zustandstore/useStore"

// Define the DashboardData and Transaction interfaces
export interface DashboardData {
   isSubscribed: boolean
  date: string
  wallet: {
    balance: string
    commission_balance: string
  }
  transaction: Transaction[]
}

export interface Transaction {
  id: number
  amount: string
  transaction_type: string
  description: string
  status: "success" | "Pending" | "Failed"
  createdAt: string
    transaction: Transaction[];
    userDetails: UserDetails;
    userProfile: UserProfile;
    wallet: Wallet;
    isAgent: boolean;
}

// Define the expected response structure from AuthAPI.getDashboardData()
// This is based on your original useEffect logic: response.success, response.data, response.message
interface GetDashboardDataResponse {
  success: boolean
  data?: DashboardData
  message?: string
}

export const dashboardKeys = {
  all: ["dashboard"] as const,
  details: () => [...dashboardKeys.all, "details"] as const,
}

export const useDashboardData = () => {
   const setDashboardDatas = useDashboardStore((state) => state.setDashboardData)
  const dashboardQuery = useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.details(),
    queryFn: async (): Promise<DashboardData> => {
      const response: GetDashboardDataResponse = await AuthAPI.getDashboardData()

      if (response.success && response.data) {
       
        return response.data
      } else {
        // Throw an error if the API call was not successful or data is missing
        throw new Error(response.message || "Failed to load dashboard data")
      }
    },
    // Optional: Configure react-query behavior
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevents refetching every time window regains focus
  })

  return {
    dashboardData: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isFetching: dashboardQuery.isFetching,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    status: dashboardQuery.status,
  }
}
