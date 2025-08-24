// hooks/use-transactions.ts
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

export interface Transaction {
  id: number
  wallet_id: number
  transaction_type: string
  amount: string
  transaction_reference: string
  status: "success" | "failed" | "pending" | "delivered"
  description: string
  metadata: string | null
  recipientId: string | null
  processed_at: string
  createdAt: string
  updatedAt: string
}

export interface TransactionPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TransactionsApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    transactions: Transaction[]
    pagination: TransactionPagination
  }
}

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (filters: { page: number; limit: number; status?: string; search?: string }) => 
    [...transactionKeys.all, "list", filters] as const,
}

interface UseTransactionsOptions {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export const useTransactions = ({ 
  page = 1, 
  limit = 10, 
  status = "all",
  search = "" 
}: UseTransactionsOptions = {}) => {
  return useQuery({
    queryKey: transactionKeys.list({ page, limit, status, search }),
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (status && status !== 'all') params.append('status', status)
      if (search) params.append('search', search)

      const { data } = await api.get<TransactionsApiResponse>(
        `/api/v1/admin/user/transactions/all?${params.toString()}`
      )
      
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch transactions.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}