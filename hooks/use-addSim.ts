import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

// Existing types for SIM batch addition API
export interface AddBatchPayload {
  batch_name: string
}

export interface AddSimBatchResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    id: number
    batch_name: string
    quantity: number
    network: string | null // Updated to allow null
    status: string
    createdAt: string
    updatedAt: string
  }
}

// New types for adding SIMs to an existing batch
export interface AddSimsPayload {
  batchId: number
  network: string
  sims: string[]
}

export interface AddSimsResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    batchId: number
    network: string
    sims: string[]
  }
}

// Existing types for fetching SIM batches
export interface SimBatch {
  id: number
  admin_id: number
  agent_id: number | null
  batch_name: string
  network: string | null // Updated to allow null
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
  simsInBatch: (batchId: number) => [...simManagementKeys.all, "sims", batchId] as const,
}

// Existing hook to add a new SIM batch
export const useAddBatch = () => {
  const queryClient = useQueryClient()
  return useMutation<AddSimBatchResponse, Error, AddBatchPayload>({
    mutationFn: async (payload: AddBatchPayload) => {
      const { data } = await api.post<AddSimBatchResponse>("/api/v1/admin/sim/add-batch", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to add SIM batch.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simManagementKeys.simBatches() })
    },
  })
}

// New hook to add SIMs to an existing batch
export const useAddSimsToBatch = () => {
  const queryClient = useQueryClient()
  return useMutation<AddSimsResponse, Error, AddSimsPayload>({
    mutationFn: async (payload: AddSimsPayload) => {
      const { data } = await api.post<AddSimsResponse>("/api/v1/admin/sim/add-sim", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to add SIMs to batch.")
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: simManagementKeys.simsInBatch(variables.batchId) })
      queryClient.invalidateQueries({ queryKey: simManagementKeys.simBatches() })
    },
  })
}

// Existing hook to fetch SIM batches with pagination
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
