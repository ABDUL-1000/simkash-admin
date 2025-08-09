
import api from "@/lib/API/axiosInstance"
import type { ApiResponse } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"

interface userManagement {
    totalSubscribeUser: number
    totalCommissionEarned: number
    averageCommission: number
}

export const userAccountKeys = {
  all: ["user-account"] as const,
  details: () => [...userAccountKeys.all, "details"] as const,
}

export const useProUsers = () => {
 
  const userManagementQuery = useQuery<userManagement, Error>({
    queryKey: userAccountKeys.details(),
    queryFn: async (): Promise<userManagement> => {
     
      const { data } = await api.get<ApiResponse<userManagement>>("/api/v1/admin/sim/pro/overview")

    
      if (data.responseSuccessful && data.responseBody) {
       
        return data.responseBody
      } else {
        
        throw new Error(data.responseMessage || "Failed to fetch account details.")
      }
    },
  })

  return {
    
    proUsers: userManagementQuery.data,

   
    isLoading: userManagementQuery.isLoading,
    isFetching: userManagementQuery.isFetching,

   
    isError: userManagementQuery.isError,
    error: userManagementQuery.error,

  
    refetch: userManagementQuery.refetch,

  
    status: userManagementQuery.status,
  }
}
