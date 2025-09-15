// hooks/use-activated-sims.ts
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

export interface ActivatedSim {
  id: number
  agent_id: number
  user_id: number
  batch_id: number
  network: string
  sim_number: string
  status: "success" | "failed" | "pending"
  createdAt: string
  updatedAt: string
  agentName: string
  userFullName: string
  batchName: string
}

export interface SimPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ActivatedSimsApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    users: ActivatedSim[]
    pagination: SimPagination
  }
}

export const activatedSimKeys = {
  all: ["activated-sims"] as const,
  list: (filters: { page: number; limit: number; status?: string; search?: string }) => 
    [...activatedSimKeys.all, "list", filters] as const,
}

interface UseActivatedSimsOptions {
  page?: number
  limit?: number
  status?: string
  search?: string
}

export const useActivatedSims = ({ 
  page = 1, 
  limit = 10, 
  status = "all",
  search = "" 
}: UseActivatedSimsOptions = {}) => {
  return useQuery({
    queryKey: activatedSimKeys.list({ page, limit, status, search }),
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (status && status !== 'all') params.append('status', status)
      if (search) params.append('search', search)

      const { data } = await api.get<ActivatedSimsApiResponse>(
        `/api/v1/admin/sim/activated?${params.toString()}`
      )
      
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch activated SIMs.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}