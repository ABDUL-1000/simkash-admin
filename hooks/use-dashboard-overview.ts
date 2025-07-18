import { useQuery } from "@tanstack/react-query"
import { AuthAPI } from "@/lib/API/api" // Assuming AuthAPI is correctly imported

interface DashboardData {
  revenue: number
  users: number
  activatedSims: number
}



export const dashboardKeys = {
  all: ["dashboard"] as const,
  details: () => [...dashboardKeys.all, "details"] as const,
}

export const useDashboardData = () => {
  const dashboardQuery = useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.details(),
    queryFn: async (): Promise<DashboardData> => {
    
        const response = await AuthAPI.getDashboardData()
        console.log(response, "responsssse")
      if (response.success === true) {
        return response?.data
      } else {
        throw new Error(response.message || "Failed to load dashboard data")
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
