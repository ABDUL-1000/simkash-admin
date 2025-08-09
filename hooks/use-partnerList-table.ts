import { useQuery } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance" // Assuming this path is correct
import type { ApiResponse, Pagination } from "@/lib/type" // Assuming this path is correct

// New Partner-specific types moved here
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
  // These fields are not directly in the provided userProfile, but were in the original mock User interface.
  // If they are needed, they might come from another API or be derived.
  simNumber?: string
  nin?: string
  bvn?: string
}

export interface AllPartnersResponse {
  agents: UserDetailsResponseBody[]
  pagination: Pagination
  states: UserDetailsResponseBody[]
}

export interface PartnerDetailsResponseBody {
  totalTransactions: number
  totalPendingTransactions: number
  totalInvestment: number // Used for totalCommissions as per API response
  user: UserDetailsResponseBody
  userProfile: PartnerProfile
  totalCommission: number
  totalSimAssigned: number
  totalSimDistributed: number 
  remainingSim: number 
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
        `api/v1/admin/partner/details?userId=${partnerId}`, // Using userId as per your API example
      )
      if (data.responseSuccessful && data.responseBody) {
        // Add mock values for totalSimsAssigned, simsDistributed, currentSims
        // as they are not in the provided API response for partner details
        return {
          ...data.responseBody,
     
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
