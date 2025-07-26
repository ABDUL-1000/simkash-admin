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

// Types for fetching ADDED SIM batches (previously useSimBatches)
export interface AddedSimBatch {
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

export interface AddedSimBatchPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AddedSimBatchResponseBody {
  simBatch: AddedSimBatch[]
  pagination: AddedSimBatchPagination
}

export interface AddedSimBatchesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: AddedSimBatchResponseBody
}

// New types for fetching DISTRIBUTABLE SIM batches (from /api/v1/admin/sim/batches)
export interface DistributableSimBatch {
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

// New API response type for /api/v1/admin/sim/batches
export interface DistributableSimBatchesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: DistributableSimBatch[] // The array of batches is inside responseBody
}

export interface DistributeSimPayload {
  batchId: number
  phone: string
}

export interface DistributeSimResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    id: number
    batch_id: number
    phone: string
    status: string
    createdAt: string
    updatedAt: string
  }
}

export const simManagementKeys = {
  all: ["sim-management"] as const,
  addedSimBatches: (page = 1, limit = 10) => [...simManagementKeys.all, "added-batches", page, limit] as const,
  distributableSimBatches: () => [...simManagementKeys.all, "distributable-batches"] as const,
  distributedSims: () => [...simManagementKeys.all, "distributed-sims"] as const, // For invalidation after distribution
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
      queryClient.invalidateQueries({ queryKey: simManagementKeys.addedSimBatches() })
      queryClient.invalidateQueries({ queryKey: simManagementKeys.distributableSimBatches() }) // Invalidate distributable batches too
    },
  })
}

// Hook to fetch ADDED SIM batches (previously useSimBatches)
interface UseAddedSimBatchesOptions {
  page?: number
  limit?: number
}

export const useAddedSimBatches = ({ page = 1, limit = 10 }: UseAddedSimBatchesOptions = {}) => {
  return useQuery<AddedSimBatchResponseBody, Error>({
    queryKey: simManagementKeys.addedSimBatches(page, limit),
    queryFn: async (): Promise<AddedSimBatchResponseBody> => {
      const { data } = await api.get<AddedSimBatchesApiResponse>(`/api/v1/admin/sim?page=${page}&limit=${limit}`)
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch added SIM batches.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// New hook to fetch DISTRIBUTABLE SIM batches
export const useDistributableSimBatches = () => {
  return useQuery<DistributableSimBatch[], Error>({
    queryKey: simManagementKeys.distributableSimBatches(),
    queryFn: async (): Promise<DistributableSimBatch[]> => {
      // Correctly expect DistributableSimBatchesApiResponse and extract responseBody
      const { data } = await api.get<DistributableSimBatchesApiResponse>(`/api/v1/admin/sim/batches`)
      if (data.responseSuccessful && Array.isArray(data.responseBody)) {
        return data.responseBody.filter(
          (batch) => batch.status === "active" && batch.quantity - batch.number_of_assigned > 0,
        )
      } else {
        throw new Error(data.responseMessage || "Invalid response format for distributable SIM batches.")
      }
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

// New mutation hook for distributing SIMs
export const useDistributeSim = () => {
  const queryClient = useQueryClient()
  return useMutation<DistributeSimResponse, Error, DistributeSimPayload>({
    mutationFn: async (payload: DistributeSimPayload) => {
      const { data } = await api.post<DistributeSimResponse>("/api/v1/admin/sim/distribute", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to distribute SIM.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: simManagementKeys.distributableSimBatches() }) // Invalidate to update available quantities
      queryClient.invalidateQueries({ queryKey: simManagementKeys.distributedSims() }) // Invalidate any table showing distributed sims
    },
  })
}
