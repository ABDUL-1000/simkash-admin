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
import { usePartnerDetails, usePartners, usePartnerTransactions, UserDetailsResponseBody } from "@/hooks/use-partnerList-table"
import Loader from "./Loader"


// Define the User type to match UserDetailsResponseBody for the table display
interface User extends UserDetailsResponseBody {}

const PartnerListTable= () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all") // Default to "all" for API
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())

  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10 // Number of items per page

  const { data, isLoading, isError, error } = usePartners({
    page: currentPage,
    limit: limit,
    searchTerm: searchTerm,
    status: statusFilter === "all" ? "" : statusFilter, // Send empty string for "all"
  
  })

  const users = data?.agents || []
  const totalPages = data?.pagination?.totalPages || 1
  console.log(users, 'agentss')

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

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
  }

  const handleBackClick = () => {
    setSelectedUser(null)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map((user) => user.user_id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    const newSelected = new Set(selectedUsers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedUsers(newSelected)
  }

  const isAllSelected = users.length > 0 && users.every((user) => selectedUsers.has(user.user_id))

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (selectedUser) {
    return <PartnerDetailsView user={selectedUser} onBack={handleBackClick} />
  }

  if (isLoading) {
    return <Loader/>
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
            placeholder="Search users..."
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
              <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all users" />
            </TableHead>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(user)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.fullname}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.fullname}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found
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

interface PartnerDetailsViewProps {
  user: UserDetailsResponseBody
  onBack: () => void
}

const PartnerDetailsView: React.FC<PartnerDetailsViewProps> = ({ user, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
  const transactionLimit = 10

  const {
    data: partnerDetailsData,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
    error: errorDetails,
  } = usePartnerDetails(user.id)

  const {
    data: partnerTransactionsData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
  } = usePartnerTransactions({
    partnerId: user.id,
    page: currentTransactionPage,
    limit: transactionLimit,
    status: "", // Assuming no status filter for transactions for now
  })

  const transactions = partnerTransactionsData?.transactions || []
  const totalTransactionPages = partnerTransactionsData?.pagination?.totalPages || 1

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
    return <Loader/>
  }

  if (isErrorDetails) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error loading partner details: {errorDetails?.message}
      </div>
    )
  }

  const partner = partnerDetailsData?.user
  const partnerProfile = partnerDetailsData?.userProfile

  if (!partner) {
    return  <Loader/>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
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
                      {partner.fullname.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{partner.fullname}</div>
                      <div className="text-sm text-muted-foreground">{partnerProfile?.simNumber || "N/A"}</div>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {partner.status}
                </Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{partner.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  <div>{partner.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gender</div>
                  <div>{partner.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Country</div>
                  <div>{partner.country}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date Joined</div>
                  <div>{new Date(partner.createdAt).toLocaleDateString()}</div>
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
                  <div>{partnerProfile?.nin || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">BVN</div>
                  <div>{partnerProfile?.bvn || "N/A"}</div>
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
                  ₦{partnerDetailsData?.totalTransactions?.toLocaleString() || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Investment</div>
                <div className="text-2xl font-bold">
                  ₦{partnerDetailsData?.totalInvestment?.toLocaleString() || "0"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Pendings</div>
                <div className="text-2xl font-bold">{partnerDetailsData?.totalPendingTransactions || "0"}</div>
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
      {/* Partnership Summary Section - Removed as per API response structure */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Partnership Summary</h2>
       <div className="grid grid-cols-4 gap-4">
             
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Total Commissions</div>
                    <div className="text-2xl font-bold">{partnerDetailsData?.totalCommission}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Total SIMs Assigned</div>
                    <div className="text-2xl font-bold">{partnerDetailsData?.totalSimAssigned}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1"> SIMs Distributed</div>
                    <div className="text-2xl font-bold">{partnerDetailsData?.totalSimDistributed}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1"> Remaining Sims</div>
                    <div className="text-2xl font-bold">{partnerDetailsData?.remainingSim}</div>
                  </CardContent>
                </Card>
              </div>
        {/* Partnership Table - Removed as per API response structure */}
      </div>
    </div>
  )
}

export default PartnerListTable
