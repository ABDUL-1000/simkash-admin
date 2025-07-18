"use client"

import { useState } from "react"
import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  ArrowLeft,
  Search,
  Filter,
  FileText,
  CheckCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { format } from "date-fns"
import type { Transaction } from "@/lib/type" // Import User and UserTransaction from your lib/type.ts
import { useUserDetails, useUsers, useUserTransactions } from "@/hooks/use-userManagement-table"

const UserManagementTable: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("") // State for status filter

  const {
    data: usersData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUsers({
    page: currentPage,
    limit: 10, // You can make this dynamic if needed
    searchTerm,
    status: filterStatus,
  })

  const users = usersData?.users || []
  const pagination = usersData?.pagination

  const handleRowClick = (userId: number) => {
    setSelectedUserId(userId)
  }

  const handleBackClick = () => {
    setSelectedUserId(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFilterToggle = () => {
    // This is a placeholder for actual filter logic.
    // You might open a dialog/dropdown to select filter options.
    // For now, let's toggle between "active" and "" (all)
    setFilterStatus((prev) => (prev === "active" ? "" : "active"))
    setCurrentPage(1) // Reset to first page on filter change
  }

  if (isLoading && !isFetching) {
    // Only show full loading spinner on initial load
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{"Error: " + error?.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedUserId !== null) {
    return <UserDetailsView userId={selectedUserId} onBack={handleBackClick} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or phone"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleFilterToggle}>
            <Filter className="h-4 w-4 mr-2" />
            {filterStatus === "active" ? "Show All" : "Filter Active"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 && !isFetching ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-500">No users match your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">User ID</TableHead>
                  <TableHead>Full Name / Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(user.id)}
                  >
                    <TableCell className="font-medium">
                      <span className="font-mono text-sm">{user.id}</span>
                    </TableCell>
                    <TableCell>
                      <span>{user.username || user.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.phone}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "verified" : "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {isFetching && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                      Fetching more users...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "bg-gray-100" : ""}
                    disabled={isFetching}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages || isFetching}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface UserDetailsViewProps {
  userId: number
  onBack: () => void
}

const UserDetailsView: React.FC<UserDetailsViewProps> = ({ userId, onBack }) => {
  const [transactionPage, setTransactionPage] = useState(1)
  const [transactionFilterStatus, setTransactionFilterStatus] = useState("") // e.g., "success", "failed", "pending"
  const transactionLimit = 10 // Can be dynamic

  const {
    data: userDetailsData,
    isLoading: isUserDetailsLoading,
    isError: isUserDetailsError,
    error: userDetailsError,
    refetch: refetchUserDetails,
  } = useUserDetails(userId)

  const {
    data: userTransactionsData,
    isLoading: isUserTransactionsLoading,
    isFetching: isUserTransactionsFetching,
    isError: isUserTransactionsError,
    error: userTransactionsError,
    refetch: refetchUserTransactions,
  } = useUserTransactions({
    userId,
    page: transactionPage,
    limit: transactionLimit,
    status: transactionFilterStatus,
  })

  const user = userDetailsData?.user
  const userProfile = userDetailsData?.userProfile
  const transactions = userTransactionsData?.transactions || []
  const transactionPagination = userTransactionsData?.pagination

const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return { 
          backgroundColor: "#F0FDF5",
          color: "#16A34A"
        }
      case "pending":
        return { 
          backgroundColor: "#FDCA8647", // example secondary bg
          color: "#FF9100"           // example secondary text
        }
      case "failed":
        return { 
          backgroundColor: "#FEF1F2", // example destructive bg
          color: "#E02D3C"            // example destructive text
        }
      default:
        return { 
          backgroundColor: "#F3F4F6",
          color: "#4B5563"
        }
    }
}

  const handleTransactionPageChange = (page: number) => {
    setTransactionPage(page)
  }

  const handleTransactionFilterToggle = () => {
    // Example: toggle between "success" and ""
    setTransactionFilterStatus((prev) => (prev === "success" ? "" : "success"))
    setTransactionPage(1) // Reset to first page on filter change
  }

  if (isUserDetailsLoading && !isUserTransactionsLoading) {
    // Show loading for user details first
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading user details...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isUserDetailsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{"Error fetching user details: " + userDetailsError?.message}</p>
            <Button onClick={() => refetchUserDetails()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user || !userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No user data available.</p>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    )
  };
   
  if (isUserDetailsLoading){
    return <div>Loading...</div>
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[#000000]">
          <ArrowLeft className="h-8 w-8 mr-1 rounded border-[#7E8494] p-[0.09rem] border-[0.05rem] " />
          User Details
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left Column - 40% (2/5) */}
        <div className="col-span-2 space-y-6">
          {/* User Details Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
                      {userProfile.fullname ? userProfile.fullname.substring(0, 3).toUpperCase() : "N/A"}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {userProfile.fullname || `${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="text-sm text-muted-foreground">{"ID: " + user.id}</div>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className={
                    userDetailsData.user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }
                >
                  {userDetailsData.user.status}
                </Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  <div>{userProfile.user_id ? userProfile.user_id : "N/A"}</div>{" "}
                  {/* Assuming user_id might be phone or similar, otherwise remove */}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gender</div>
                  <div>{userProfile.gender || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Country</div>
                  <div>{userProfile.country || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date Joined</div>
                  <div>{user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>KYC Details</CardTitle>
                <Badge
                  variant="default"
                  className={
                    userDetailsData.user.isVerified ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }
                >
                  {userDetailsData.user.isVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">NIN</div>
                  <div>{"N/A"}</div> {/* NIN/BVN not in provided API response */}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">BVN</div>
                  <div>{"N/A"}</div> {/* NIN/BVN not in provided API response */}
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
                <div className="text-2xl font-bold">{userDetailsData.totalTransactions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Investment</div>
                <div className="text-2xl font-bold">₦{userDetailsData.totalInvestment}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Pending Transactions</div>
                <div className="text-2xl font-bold">{userDetailsData.totalPendingTransactions}</div>
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
                      placeholder="Search transactions"
                      value={""} // Search not implemented for transactions in hook yet
                      onChange={(e) => {}}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleTransactionFilterToggle}>
                  <Filter className="h-4 w-4 mr-2" />
                  {transactionFilterStatus === "success" ? "Show All" : "Filter Successful"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isUserTransactionsLoading && !isUserTransactionsFetching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Loading transactions...</span>
                </div>
              ) : isUserTransactionsError ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">
                    {"Error fetching transactions: " + userTransactionsError?.message}
                  </p>
                  <Button onClick={() => refetchUserTransactions()}>Try Again</Button>
                </div>
              ) : transactions.length === 0 && !isUserTransactionsFetching ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FileText className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No transactions found</h3>
                  <p className="text-sm text-gray-500">This user has no transactions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                    <div>Type/Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  {transactions.map((transaction: Transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-3 gap-4 items-center py-3 border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{transaction.transaction_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.createdAt ? format(new Date(transaction.createdAt), "PPP - hh:mm a") : "N/A"}
                        </div>
                      </div>
                      <div className="font-medium">₦{transaction.amount}</div>
                      <div className="flex items-center justify-between">
                        <Badge style={getStatusStyle(transaction.status)}>{transaction.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {isUserTransactionsFetching && (
                    <div className="text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                      Fetching more transactions...
                    </div>
                  )}
                  {transactionPagination && transactionPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionPageChange(transactionPage - 1)}
                        disabled={transactionPage === 1 || isUserTransactionsFetching}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      {Array.from({ length: transactionPagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTransactionPageChange(pageNumber)}
                          className={transactionPage === pageNumber ? "bg-gray-100" : ""}
                          disabled={isUserTransactionsFetching}
                        >
                          {pageNumber}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransactionPageChange(transactionPage + 1)}
                        disabled={transactionPage === transactionPagination.totalPages || isUserTransactionsFetching}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default UserManagementTable
