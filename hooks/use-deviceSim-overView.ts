
import api from "@/lib/API/axiosInstance"
import type { ApiResponse } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"

interface userManagement {
   totalSimAdded: number
    currentSims: number
    simsDistributed: number
}

export const userAccountKeys = {
  all: ["user-account"] as const,
  details: () => [...userAccountKeys.all, "details"] as const,
}

export const useDeviceSimOverview = () => {
 
  const userManagementQuery = useQuery<userManagement, Error>({
    queryKey: userAccountKeys.details(),
    queryFn: async (): Promise<userManagement> => {
     
      const { data } = await api.get<ApiResponse<userManagement>>("/api/v1/admin/sim/overview")

    
      if (data.responseSuccessful && data.responseBody) {
       
        return data.responseBody
      } else {
        
        throw new Error(data.responseMessage || "Failed to fetch details.")
      }
    },
  })

  return {
    
    overView: userManagementQuery.data,

   
    isLoading: userManagementQuery.isLoading,
    isFetching: userManagementQuery.isFetching,

   
    isError: userManagementQuery.isError,
    error: userManagementQuery.error,

  
    refetch: userManagementQuery.refetch,

  
    status: userManagementQuery.status,
  }
}
