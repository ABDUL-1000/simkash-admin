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

// New types for fetching individual SIMs within a batch
export interface Sim {
  id: number
  batchId: number
  sim_number: string
  network: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface SimBatchResponseBody {
  simBatch: SimBatch[]
  pagination: Pagination
}

export interface SimsResponseBody {
  sims: Sim[]
  pagination: Pagination
}

export interface SimBatchesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: SimBatchResponseBody
}

export interface SimsApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: SimsResponseBody
}

// New types for distributable batches and distribution payload/response
export interface DistributableSimBatch {
  id: number
  batch_name: string
  quantity: number
  number_of_assigned: number
  network: string | null
  status: string
}

export interface DistributableSimBatchesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: DistributableSimBatch[]
}

export interface DistributeSimPayload {
  batchId: number
  phone: string
}

export interface DistributeSimResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    simId: number
    batchId: number
    phone: string
    
  }
}

export const simManagementKeys = {
  all: ["sim-management"] as const,
  simBatches: (page = 1, limit = 10) => [...simManagementKeys.all, "batches", page, limit] as const,
  simsInBatch: (batchId: number, page = 1, limit = 10) =>
    [...simManagementKeys.all, "sims", batchId, page, limit] as const,
  distributableBatches: () => [...simManagementKeys.all, "distributable-batches"] as const,
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
      queryClient.invalidateQueries({ queryKey: simManagementKeys.all })
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

// New hook to fetch SIMs by batch ID with pagination
interface UseSimsByBatchIdOptions {
  batchId: number
  page?: number
  limit?: number
}

export const useSimsByBatchId = ({ batchId, page = 1, limit = 10 }: UseSimsByBatchIdOptions) => {
  return useQuery<SimsResponseBody, Error>({
    queryKey: simManagementKeys.simsInBatch(batchId, page, limit),
    queryFn: async (): Promise<SimsResponseBody> => {
      const { data } = await api.get<SimsApiResponse>(
        `/api/v1/admin/sim/batch/${batchId}/sims?page=${page}&limit=${limit}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || `Failed to fetch SIMs for batch ${batchId}.`)
      }
    },
    enabled: !!batchId, // Only run query if batchId is provided
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// New hook to fetch distributable SIM batches
export const useDistributableSimBatches = () => {
  return useQuery<DistributableSimBatch[], Error>({
    queryKey: simManagementKeys.distributableBatches(),
    queryFn: async (): Promise<DistributableSimBatch[]> => {
      // This is a placeholder endpoint. Adjust to your actual API endpoint for distributable batches.
      const { data } = await api.get<DistributableSimBatchesApiResponse>("/api/v1/admin/sim/distributable-batches")
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch distributable SIM batches.")
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// New hook to distribute SIMs
export const useDistributeSim = () => {
  const queryClient = useQueryClient()
  return useMutation<DistributeSimResponse, Error, DistributeSimPayload>({
    mutationFn: async (payload: DistributeSimPayload) => {
      // This is a placeholder endpoint. Adjust to your actual API endpoint for distributing SIMs.
      const { data } = await api.post<DistributeSimResponse>("/api/v1/admin/sim/distribute", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to distribute SIM.")
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: simManagementKeys.all }) // Invalidate all sim-management queries
    },
  })
}
