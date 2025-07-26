"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCoordinatorDetails, useCoordinators, useCoordinatorTransactions, UserDetailsResponseBody } from "@/hooks/use-cordinatorList-Table"



// Define the Coordinator type to match UserDetailsResponseBody for the table display
interface Coordinator extends UserDetailsResponseBody {}

const StateCoordinatorTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // Default to "all" for API
  const [selectedCoordinator, setSelectedCoordinator] = useState<Coordinator | null>(null)
  const [selectedCoordinators, setSelectedCoordinators] = useState<Set<number>>(new Set())

  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10 // Number of items per page

  const { data, isLoading, isError, error } = useCoordinators({
    // Using renamed hook
    page: currentPage,
    limit: limit,
    searchTerm: searchTerm,
    status: statusFilter === "all" ? "" : statusFilter, // Send empty string for "all"
  })

  const coordinators = data?.agents || []
  const totalPages = data?.pagination?.totalPages || 1

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleRowClick = (coordinator: Coordinator) => {
    setSelectedCoordinator(coordinator)
  }

  const handleBackClick = () => {
    setSelectedCoordinator(null)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoordinators(new Set(coordinators.map((coordinator) => coordinator.user_id)))
    } else {
      setSelectedCoordinators(new Set())
    }
  }

  const handleSelectCoordinator = (coordinatorId: number, checked: boolean) => {
    const newSelected = new Set(selectedCoordinators)
    if (checked) {
      newSelected.add(coordinatorId)
    } else {
      newSelected.delete(coordinatorId)
    }
    setSelectedCoordinators(newSelected)
  }

  const isAllSelected =
    coordinators.length > 0 && coordinators.every((coordinator) => selectedCoordinators.has(coordinator.user_id))

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (selectedCoordinator) {
    return <StateCoordinatorDetailsView coordinator={selectedCoordinator} onBack={handleBackClick} />
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading state coordinators...</div>
  }

  if (isError) {
    return <div className="flex justify-center items-center h-64 text-red-500">Error: {error?.message}</div>
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-end items-center mb-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search coordinators..."
            className="w-[200px] pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all coordinators"
              />
            </TableHead>
            <TableHead className="w-[200px]">Coordinator</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coordinators.length > 0 ? (
            coordinators.map((coordinator) => (
              <TableRow
                key={coordinator.user_id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(coordinator)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedCoordinators.has(coordinator.user_id)}
                    onCheckedChange={(checked) => handleSelectCoordinator(coordinator.user_id, checked as boolean)}
                    aria-label={`Select ${coordinator.fullname}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{coordinator.fullname}</TableCell>
                <TableCell>{coordinator.state}</TableCell>
                <TableCell>{coordinator.phone}</TableCell>
                <TableCell>{new Date(coordinator.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(coordinator.status)}>{coordinator.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No state coordinators found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "bg-gray-100" : ""}
            variant="outline"
            size="sm"
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

interface StateCoordinatorDetailsViewProps {
  coordinator: UserDetailsResponseBody
  onBack: () => void
}

const StateCoordinatorDetailsView: React.FC<StateCoordinatorDetailsViewProps> = ({ coordinator, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
  const transactionLimit = 10

  const {
    data: coordinatorDetailsData,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: errorDetails,
  } = useCoordinatorDetails(coordinator.user_id) // Using renamed hook

  const {
    data: coordinatorTransactionsData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
  } = useCoordinatorTransactions({
    // Using renamed hook
    coordinatorId: coordinator.user_id,
    page: currentTransactionPage,
    limit: transactionLimit,
    status: "", // Assuming no status filter for transactions for now
  })

  const transactions = coordinatorTransactionsData?.transactions || []
  const totalTransactionPages = coordinatorTransactionsData?.pagination?.totalPages || 1

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Successful</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  const handleTransactionPageChange = (page: number) => {
    if (page >= 1 && page <= totalTransactionPages) {
      setCurrentTransactionPage(page)
    }
  }

  if (isLoadingDetails) {
    return <div className="flex justify-center items-center h-64">Loading coordinator details...</div>
  }

  if (isErrorDetails) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading coordinator details: {errorDetails?.message}
      </div>
    )
  }

  const coordinatorData = coordinatorDetailsData?.user
  const coordinatorProfile = coordinatorDetailsData?.userProfile

  if (!coordinatorData) {
    return <div className="flex justify-center items-center h-64 text-red-500">Coordinator data not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          State Coordinator Details
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left Column - 40% (2/5) */}
        <div className="col-span-2 space-y-6">
          {/* Coordinator Details Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                      {coordinatorData.fullname.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{coordinatorData.fullname}</div>
                      <div className="text-sm text-muted-foreground">{coordinatorProfile?.simNumber || "N/A"}</div>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {coordinatorData.status}
                </Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{coordinatorData.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  <div>{coordinatorData.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gender</div>
                  <div>{coordinatorData.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Country</div>
                  <div>{coordinatorData.country}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date Joined</div>
                  <div>{new Date(coordinatorData.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* KYC Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>KYC Details</CardTitle>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">NIN</div>
                  <div>{coordinatorProfile?.nin || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">BVN</div>
                  <div>{coordinatorProfile?.bvn || "N/A"}</div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Face Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Address Document Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Physical Address Verification</span>
                </div>
              </div>
              <div>
                <div className="font-medium mb-3">Documents Uploaded</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Government Issued ID.pdf</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">My NIN.png</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column - 60% (3/5) */}
        <div className="col-span-3 space-y-6">
          {/* Transaction Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                <div className="text-2xl font-bold">
                  ₦{coordinatorDetailsData?.totalTransactions?.toLocaleString() || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Investment</div>
                <div className="text-2xl font-bold">
                  ₦{coordinatorDetailsData?.totalInvestment?.toLocaleString() || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Pendings</div>
                <div className="text-2xl font-bold">{coordinatorDetailsData?.totalPendingTransactions || "0"}</div>
              </CardContent>
            </Card>
          </div>
          {/* Transactions Card */}
          <Card className="flex-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex justify-center items-center h-32">Loading transactions...</div>
              ) : isErrorTransactions ? (
                <div className="flex justify-center items-center h-32 text-red-500">
                  Error loading transactions: {errorTransactions?.message}
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div>Type/Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-3 gap-4 items-center py-3 border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{transaction.transaction_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="font-medium">₦{transaction.amount}</div>
                      <div className="flex items-center justify-between">
                        {getTransactionStatusBadge(transaction.status)}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* Transaction Pagination */}
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransactionPageChange(currentTransactionPage - 1)}
                      disabled={currentTransactionPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    {Array.from({ length: totalTransactionPages }, (_, i) => i + 1).map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionPageChange(pageNumber)}
                        className={currentTransactionPage === pageNumber ? "bg-gray-100" : ""}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransactionPageChange(currentTransactionPage + 1)}
                      disabled={currentTransactionPage === totalTransactionPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No transactions found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* SIMs Summary Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">SIMs Summary</h2>
        {/* SIMs Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Total SIMs Assigned</div>
              <div className="text-2xl font-bold">{coordinatorDetailsData?.totalSimsAssigned || "0"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">SIMs Distributed</div>
              <div className="text-2xl font-bold">{coordinatorDetailsData?.simsDistributed || "0"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Current SIMs</div>
              <div className="text-2xl font-bold">{coordinatorDetailsData?.currentSims || "0"}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StateCoordinatorTable
