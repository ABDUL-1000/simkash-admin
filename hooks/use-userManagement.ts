
import api from "@/lib/API/axiosInstance"
import type { ApiResponse } from "@/lib/type"
import { useQuery } from "@tanstack/react-query"

interface userManagement {
    registeredUsers: number
    kycVerifiedUsers: number
    activeUsers: number
}

export const userAccountKeys = {
  all: ["user-account"] as const,
  details: () => [...userAccountKeys.all, "details"] as const,
}

export const useUserManagement = () => {
 
  const userManagementQuery = useQuery<userManagement, Error>({
    queryKey: userAccountKeys.details(),
    queryFn: async (): Promise<userManagement> => {
     
      const { data } = await api.get<ApiResponse<userManagement>>("/api/v1/admin/user/overview")

    
      if (data.responseSuccessful && data.responseBody) {
       
        return data.responseBody
      } else {
        
        throw new Error(data.responseMessage || "Failed to fetch account details.")
      }
    },
  })

  return {
    // userAccountQuery.data will now correctly be UserAccount[] | undefined
    userManagement: userManagementQuery.data,

    // Loading states
    isLoading: userManagementQuery.isLoading,
    isFetching: userManagementQuery.isFetching,

    // Error state and object
    isError: userManagementQuery.isError,
    error: userManagementQuery.error,

    // Refetch function
    refetch: userManagementQuery.refetch,

    // Query status
    status: userManagementQuery.status,
  }
}
