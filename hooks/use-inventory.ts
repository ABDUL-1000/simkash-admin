// hooks/use-inventory-customization.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

export interface Service {
  id: number
  name: string
  discount_percentage: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServicePagination {
  page: number
  limit: number
  total: number
  totalPages: number
  
}

export interface ServicesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    services: Service[]
    pagination: ServicePagination
  }
}

export interface ServiceApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    service: Service
  }
}

export interface UpdateServicePayload {
  id: number
  percentage?: string
  isActive?: boolean
}

export const inventoryKeys = {
  all: ["inventory"] as const,
  services: (page = 1, limit = 10) => [...inventoryKeys.all, "services", page, limit] as const,
  service: (id: number) => [...inventoryKeys.all, "service", id] as const,
}

export const useServices = ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: inventoryKeys.services(page, limit),
    queryFn: async () => {
      const { data } = await api.get<ServicesApiResponse>(
        `/api/v1/admin/inventory/services?page=${page}&limit=${limit}`,
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch services.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useService = (id: number) => {
  return useQuery({
    queryKey: inventoryKeys.service(id),
    queryFn: async () => {
      const { data } = await api.get<ServiceApiResponse>(`/api/v1/admin/inventory/service/${id}`)
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody.service
      } else {
        throw new Error(data.responseMessage || "Failed to fetch service details.")
      }
    },
    enabled: !!id, // Only run query if id is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation<ServiceApiResponse, Error, UpdateServicePayload>({
    mutationFn: async (payload: UpdateServicePayload) => {
      const { data } = await api.put<ServiceApiResponse>("/api/v1/admin/inventory/service", payload)
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to update service.")
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate the specific service query
      queryClient.invalidateQueries({ queryKey: inventoryKeys.service(variables.id) })
      // Invalidate the services list query
      queryClient.invalidateQueries({ queryKey: inventoryKeys.services() })
    },
  })
}
