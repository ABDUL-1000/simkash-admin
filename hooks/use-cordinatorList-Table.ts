import { useQuery } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"
import type { ApiResponse, Pagination } from "@/lib/type"

// Re-using existing types as per your request that response bodies are the same
export interface UserDetailsResponseBody {
  id: number
  user_id: number
  fullname: string
  email: string
  phone: string
  gender: string
  dob: string
  role: string
  country: string
  state: string
  lga: string
  address: string
  reason: string | null
  idCard: string | null
  status: "approved" | "pending" | "suspended" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface PartnerProfile {
  id: number
  user_id: number
  fullname: string
  gender: string
  country: string
  currency: string
  profile_picture: string
  createdAt: string
  updatedAt: string
  simNumber?: string // Added based on original mock, ensure your API provides this if needed
  nin?: string // Added based on original mock, ensure your API provides this if needed
  bvn?: string // Added based on original mock, ensure your API provides this if needed
}

export interface AllPartnersResponse {
  agents: UserDetailsResponseBody[]
  pagination: Pagination
}

export interface PartnerDetailsResponseBody {
  totalTransactions: number
  totalPendingTransactions: number
  totalInvestment: number // Used for totalCommissions as per API response
  user: UserDetailsResponseBody
  userProfile: PartnerProfile
  totalSimsAssigned: number // Added based on the original mock data and common sense for a partner view
  simsDistributed: number // Added based on the original mock data
  currentSims: number // Added based on the original mock data
}

export interface Transaction {
  id: number
  wallet_id: number
  transaction_type: string
  amount: string
  transaction_reference: string
  status: "success" | "failed" | "pending"
  description: string
  metadata: string
  recipientId: number | null
  processed_at: string
  createdAt: string
  updatedAt: string
}

export interface PartnerTransactionsResponseBody {
  transactions: Transaction[]
  pagination: Pagination
}

// --- Partner Management Hooks (unchanged) ---
export const partnerManagementKeys = {
  all: ["partner-management"] as const,
  partners: (page: number, limit: number, searchTerm: string, status: string) =>
    [...partnerManagementKeys.all, "partners", page, limit, searchTerm, status] as const,
  partnerDetails: (partnerId: number | null) => [...partnerManagementKeys.all, "details", partnerId] as const,
  partnerTransactions: (partnerId: number | null, page: number, limit: number, status: string) =>
    [...partnerManagementKeys.all, "transactions", partnerId, page, limit, status] as const,
}

interface UsePartnersOptions {
  page?: number
  limit?: number
  searchTerm?: string
  status?: string
}

export const usePartners = ({ page = 1, limit = 10, searchTerm = "", status = "" }: UsePartnersOptions) => {
  return useQuery<AllPartnersResponse, Error>({
    queryKey: partnerManagementKeys.partners(page, limit, searchTerm, status),
    queryFn: async (): Promise<AllPartnersResponse> => {
      const { data } = await api.get<ApiResponse<AllPartnersResponse>>(
        `/api/v1/admin/partner?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch partners.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const usePartnerDetails = (partnerId: number | null) => {
  return useQuery<PartnerDetailsResponseBody, Error>({
    queryKey: partnerManagementKeys.partnerDetails(partnerId),
    queryFn: async (): Promise<PartnerDetailsResponseBody> => {
      if (!partnerId) throw new Error("Partner ID is required to fetch details.")
      const { data } = await api.get<ApiResponse<PartnerDetailsResponseBody>>(
        `api/v1/admin/partner/details?userId=${partnerId}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        // Add mock values for totalSimsAssigned, simsDistributed, currentSims
        // as they are not in the provided API response for partner details
        return {
          ...data.responseBody,
          totalSimsAssigned: 500, // Example mock value
          simsDistributed: 132, // Example mock value
          currentSims: 300, // Example mock value
        }
      } else {
        throw new Error(data.responseMessage || "Failed to fetch partner details.")
      }
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

interface UsePartnerTransactionsOptions {
  partnerId: number | null
  page?: number
  limit?: number
  status?: string
}

export const usePartnerTransactions = ({
  partnerId,
  page = 1,
  limit = 10,
  status = "",
}: UsePartnerTransactionsOptions) => {
  return useQuery<PartnerTransactionsResponseBody, Error>({
    queryKey: partnerManagementKeys.partnerTransactions(partnerId, page, limit, status),
    queryFn: async (): Promise<PartnerTransactionsResponseBody> => {
      if (!partnerId) throw new Error("Partner ID is required to fetch transactions.")
      const { data } = await api.get<ApiResponse<PartnerTransactionsResponseBody>>(
        `/api/v1/admin/partner/transactions?userId=${partnerId}&page=${page}&limit=${limit}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch partner transactions.")
      }
    },
    enabled: !!partnerId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// --- Coordinator Management Hooks (renamed from State Coordinator) ---
export const coordinatorManagementKeys = {
  all: ["coordinator-management"] as const,
  coordinators: (page: number, limit: number, searchTerm: string, status: string) =>
    [...coordinatorManagementKeys.all, "coordinators", page, limit, searchTerm, status] as const,
  coordinatorDetails: (coordinatorId: number | null) =>
    [...coordinatorManagementKeys.all, "details", coordinatorId] as const,
  coordinatorTransactions: (coordinatorId: number | null, page: number, limit: number, status: string) =>
    [...coordinatorManagementKeys.all, "transactions", coordinatorId, page, limit, status] as const,
}

interface UseCoordinatorsOptions {
  page?: number
  limit?: number
  searchTerm?: string
  status?: string
}

export const useCoordinators = ({ page = 1, limit = 10, searchTerm = "", status = "" }: UseCoordinatorsOptions) => {
  return useQuery<AllPartnersResponse, Error>({
    queryKey: coordinatorManagementKeys.coordinators(page, limit, searchTerm, status),
    queryFn: async (): Promise<AllPartnersResponse> => {
      const { data } = await api.get<ApiResponse<AllPartnersResponse>>(
        `/api/v1/admin/state?page=${page}&limit=${limit}&searchTerm=${searchTerm}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch coordinators.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCoordinatorDetails = (coordinatorId: number | null) => {
  return useQuery<PartnerDetailsResponseBody, Error>({
    queryKey: coordinatorManagementKeys.coordinatorDetails(coordinatorId),
    queryFn: async (): Promise<PartnerDetailsResponseBody> => {
      if (!coordinatorId) throw new Error("Coordinator ID is required to fetch details.")
      const { data } = await api.get<ApiResponse<PartnerDetailsResponseBody>>(
        `api/v1/admin/state/details?userId=${coordinatorId}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        // Add mock values for totalSimsAssigned, simsDistributed, currentSims
        // as they are not in the provided API response for partner details
        return {
          ...data.responseBody,
          totalSimsAssigned: 500, // Example mock value
          simsDistributed: 132, // Example mock value
          currentSims: 300, // Example mock value
        }
      } else {
        throw new Error(data.responseMessage || "Failed to fetch coordinator details.")
      }
    },
    enabled: !!coordinatorId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

interface UseCoordinatorTransactionsOptions {
  coordinatorId: number | null
  page?: number
  limit?: number
  status?: string
}

export const useCoordinatorTransactions = ({
  coordinatorId,
  page = 1,
  limit = 10,
  status = "",
}: UseCoordinatorTransactionsOptions) => {
  return useQuery<PartnerTransactionsResponseBody, Error>({
    queryKey: coordinatorManagementKeys.coordinatorTransactions(coordinatorId, page, limit, status),
    queryFn: async (): Promise<PartnerTransactionsResponseBody> => {
      if (!coordinatorId) throw new Error("Coordinator ID is required to fetch transactions.")
      const { data } = await api.get<ApiResponse<PartnerTransactionsResponseBody>>(
        `/api/v1/admin/state/transactions?userId=${coordinatorId}&page=${page}&limit=${limit}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch coordinator transactions.")
      }
    },
    enabled: !!coordinatorId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
