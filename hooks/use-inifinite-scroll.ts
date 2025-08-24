// hooks/use-expenses.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/API/axiosInstance"

export interface Expense {
  id: number
  name: string
  amount: string
  date: string
  note: string
  createdAt: string
  updatedAt: string
}

export interface ExpensePagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ExpensesApiResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: {
    expenses: Expense[]
    pagination: ExpensePagination
  }
}

export interface AddExpensePayload {
  name: string
  amount: string
  date: string
  note: string
}

export interface AddExpenseResponse {
  responseSuccessful: boolean
  responseMessage: string
  responseBody?: Expense
}

export const expenseKeys = {
  all: ["expenses"] as const,
  expenses: (page = 1, limit = 10) => [...expenseKeys.all, "expenses", page, limit] as const,
}

export const useExpenses = ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: expenseKeys.expenses(page, limit),
    queryFn: async () => {
      const { data } = await api.get<ExpensesApiResponse>(
        `/api/v1/admin/inventory/service/expense/all?page=${page}&limit=${limit}`
      )
      if (data.responseSuccessful && data.responseBody) {
        return data.responseBody
      } else {
        throw new Error(data.responseMessage || "Failed to fetch expenses.")
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useAddExpense = () => {
  const queryClient = useQueryClient()
  return useMutation<AddExpenseResponse, Error, AddExpensePayload>({
    mutationFn: async (payload: AddExpensePayload) => {
      const { data } = await api.post<AddExpenseResponse>(
        "/api/v1/admin/inventory/service/expense",
        payload
      )
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to add expense.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    },
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (expenseId: number) => {
      const { data } = await api.delete(
        `/api/v1/admin/inventory/service/expense/${expenseId}`
      )
      if (data.responseSuccessful) {
        return data
      } else {
        throw new Error(data.responseMessage || "Failed to delete expense.")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all })
    },
  })
}