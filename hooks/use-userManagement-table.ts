import { useQuery } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance" // Assuming this path is correct
import type {
    AllUsersResponse,
  ApiResponse,
 
  UserDetailsResponseBody,
  UserTransactionsResponseBody,
} from "@/lib/type"

export const userManagementKeys = {
  all: ["user-management"] as const,
  users: (page: number, limit: number, searchTerm: string, status: string) =>
    [...userManagementKeys.all, "users", page, limit, searchTerm, status] as const,
  userDetails: (userId: number | null) => [...userManagementKeys.all, "details", userId] as const,
  userTransactions: (userId: number | null, page: number, limit: number, status: string) =>
    [...userManagementKeys.all, "transactions", userId, page, limit, status] as const,
}

interface UseUsersOptions {
  page?: number
  limit?: number
  searchTerm?: string
  status?: string
}

export const useUsers = ({ page = 1, limit = 10, searchTerm = "", status = "" }: UseUsersOptions) => {
  return useQuery<AllUsersResponse, Error>({
    queryKey: userManagementKeys.users(page, limit, searchTerm, status),
    queryFn: async (): Promise<AllUsersResponse> => {
      const { data } = await api.get<ApiResponse<AllUsersResponse>>(
        `/api/v1/admin/user`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch users.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUserDetails = (userId: number | null) => {
    console.log("userId", userId);
  return useQuery<UserDetailsResponseBody, Error>({
    queryKey: userManagementKeys.userDetails(userId),
    queryFn: async (): Promise<UserDetailsResponseBody> => {
      if (!userId) throw new Error("User ID is required to fetch details.")
      const { data } = await api.get<ApiResponse<UserDetailsResponseBody>>(
        `api/v1/admin/user/details?userId=${userId}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch user details.")
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

interface UseUserTransactionsOptions {
  userId: number | null
  page?: number
  limit?: number
  status?: string
}

export const useUserTransactions = ({ userId, page = 1, limit = 10, status = "" }: UseUserTransactionsOptions) => {
  return useQuery<UserTransactionsResponseBody, Error>({
    queryKey: userManagementKeys.userTransactions(userId, page, limit, status),
    queryFn: async (): Promise<UserTransactionsResponseBody> => {
      if (!userId) throw new Error("User ID is required to fetch transactions.")
      const { data } = await api.get<ApiResponse<UserTransactionsResponseBody>>(
        `/api/v1/admin/user/transactions?userId=${userId}&page=${page}&limit=${limit}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch user transactions.")
      }
    },
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
