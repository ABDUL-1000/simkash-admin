import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

// Define types for the SIM batch addition API
export interface AddSimBatchPayload {
  batch_name: string
  network: string
  quantity: number
}

export interface AddSimBatchResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    id: number
    batch_name: string
    quantity: number
    network: string
    status: string
    createdAt: string
    updatedAt: string
  }
}

// New types for fetching SIM batches
export interface SimBatch {
  id: number
  admin_id: number
  agent_id: number | null
  batch_name: string
  network: string
  quantity: number
  number_of_assigned: number
  status: string
  date_assigned: string | null
  createdAt: string
  updatedAt: string
}

export interface SimBatchPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface SimBatchResponseBody {
  simBatch: SimBatch[]
  pagination: SimBatchPagination
}

export interface SimBatchesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: SimBatchResponseBody
}

export const simManagementKeys = {
  all: ["sim-management"] as const,
  simBatches: (page = 1, limit = 10) => [...simManagementKeys.all, "batches", page, limit] as const,
}

export const useAddSimBatch = () => {
  const queryClient = useQueryClient()
  return useMutation<AddSimBatchResponse, Error, AddSimBatchPayload>({
    mutationFn: async (payload: AddSimBatchPayload) => {
      const { data } = await api.post<AddSimBatchResponse>("/api/v1/admin/sim/add", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to add SIM batch.")
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch SIM batches after a successful addition
      queryClient.invalidateQueries({ queryKey: simManagementKeys.simBatches() })
    },
  })
}

// New hook to fetch SIM batches
interface UseSimBatchesOptions {
  page?: number
  limit?: number
}

export const useSimBatches = ({ page = 1, limit = 10 }: UseSimBatchesOptions = {}) => {
  return useQuery<SimBatchResponseBody, Error>({
    queryKey: simManagementKeys.simBatches(page, limit),
    queryFn: async (): Promise<SimBatchResponseBody> => {
      const { data } = await api.get<SimBatchesApiResponse>(`/api/v1/admin/sim?page=${page}&limit=${limit}`)
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch SIM batches.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
