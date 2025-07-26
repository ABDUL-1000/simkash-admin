import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

// Define all types directly in this file
export interface ApiResponse<T> {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: T
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}

// Updated UserDetailsResponseBody to match the 'agent' structure
export interface UserDetailsResponseBody {
  id: number
  user_id: number // Added based on new response
  fullname: string // Added based on new response
  email: string
  phone: string // Now directly on agent
  gender: string // Now directly on agent
  dob: string // Now directly on agent
  role: string // Now directly on agent
  country: string // Now directly on agent
  state: string // Now directly on agent
  lga: string // Now directly on agent
  address: string // Now directly on agent
  reason: string | null // Now directly on agent
  idCard: string | null // Now directly on agent
  status: "approved" | "pending" | "suspended" | "inactive" // Now directly on agent
  createdAt: string
  updatedAt: string
}

export interface AllPartnersResponse {
  agents: UserDetailsResponseBody[]
  pagination: Pagination
}

// Updated PartnerDetailsResponseBody to match the new 'agent' structure
export interface PartnerDetailsResponseBody {
  totalTransactions: number
  totalPendingTransactions: number
  totalInvestment: number
  agent: UserDetailsResponseBody // Changed from 'user' and 'userProfile' to 'agent'
  totalSimsAssigned?: number
  simsDistributed?: number
  currentSims?: number
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
  createdAt: string
  updatedAt: string
}

export interface PartnerTransactionsResponseBody {
  transactions: Transaction[]
  pagination: Pagination
}

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

export const useCordinators = ({ page = 1, limit = 10, searchTerm = "", status = "" }: UsePartnersOptions) => {
  return useQuery<AllPartnersResponse, Error>({
    queryKey: partnerManagementKeys.partners(page, limit, searchTerm, status),
    queryFn: async (): Promise<AllPartnersResponse> => {
      const { data } = await api.get<ApiResponse<AllPartnersResponse>>(
        `/api/v1/admin/state/pending`,
      )
      console.log(data, 'cordinator')
      if (data.responseSuccessful && data.responseBody) {
        console.log(data.responseBody)
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch cordinator.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCordinatorDetails = (partnerId: number | null) => {
  return useQuery<PartnerDetailsResponseBody, Error>({
    queryKey: partnerManagementKeys.partnerDetails(partnerId),
    queryFn: async (): Promise<PartnerDetailsResponseBody> => {
      if (!partnerId) throw new Error("cordinator ID is required to fetch details.")
      const { data } = await api.get<ApiResponse<PartnerDetailsResponseBody>>(
        `api/v1/admin/state/pending/details?userId=${partnerId}`, 
      )
      if (data.responseSuccessful && data.responseBody) {
      
        return {
          ...data.responseBody,
          totalSimsAssigned: data.responseBody.totalSimsAssigned || 500, 
          simsDistributed: data.responseBody.simsDistributed || 132, 
          currentSims: data.responseBody.currentSims || 300, 
        }
      } else {
        throw new Error(data.responseMessage || "Failed to fetch cordinator details.")
      }
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5, 
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
        `/api/v1/admin/state/transactions?userId=${partnerId}&page=${page}&limit=${limit}&status=${status}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch cordinator transactions.")
      }
    },
    enabled: !!partnerId,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, 
  })
}

export const useApproveCordinator = () => {
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<any>, Error, number>({
    mutationFn: async (partnerId: number) => {
  
      const { data } = await api.put<ApiResponse<any>>(`/api/v1/admin/state/approve/${partnerId}`, {
        status: "approved",
      })
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to approve customer.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerManagementKeys.partners(1, 10, "", "pending") })
      queryClient.invalidateQueries({ queryKey: partnerManagementKeys.partners(1, 10, "", "approved") })
    },
  })
}
