// components/transaction-table.tsx
"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useTransactions } from "@/hooks/use-transactions"

export default function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Reset to first page when search changes
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: transactionsData,
    isLoading,
    isError,
    error,
  } = useTransactions({
    page: currentPage,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: debouncedSearch || undefined,
  })

  const transactions = transactionsData?.transactions || []
  const pagination = transactionsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "delivered":
        return "bg-[#F0FDF5] text-[#16A34A]"
      case "pending":
        return "bg-[#FDCA8647] text-[#FF9100]"
      case "failed":
        return "bg-[#FEF1F2] text-[#981B25]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
    }
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-red-500 mb-4">Error: {error?.message || "Failed to load transactions"}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search transactions" 
              className="pl-10 bg-white border border-gray-200 rounded-full h-10" 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Select 
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-full sm:w-30 bg-white border border-gray-200 rounded-full h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium">Reference</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Description</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Loading transactions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {debouncedSearch || statusFilter !== "all" 
                      ? "No transactions match your search criteria" 
                      : "No transactions found"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium py-5">
                      {transaction.transaction_reference.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="py-5 capitalize">{transaction.transaction_type.toLowerCase()}</TableCell>
                    <TableCell className="py-5">₦{transaction.amount}</TableCell>
                    <TableCell className="py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-5">{transaction.description}</TableCell>
                    <TableCell className="py-5">{formatDate(transaction.processed_at)}</TableCell>
                    <TableCell className="text-right py-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-white shadow-md rounded-md border border-gray-200">
                          <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                            <span>Details</span>
                            <Image src="/arrow-right.png" alt="Details" width={20} height={20} className="w-2 h-2" />
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between">
                            <span>Repeat</span>
                            <Image src="/arrow-right.png" alt="Repeat" width={20} height={20} className="w-2 h-2" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="text-sm rounded-full"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || isLoading}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      className={`w-8 h-8 p-0 text-sm rounded-full ${pagination.page === pageNum ? "bg-primary text-white" : "bg-white"}`}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="default"
                className="text-sm rounded-full bg-[#111827]"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}