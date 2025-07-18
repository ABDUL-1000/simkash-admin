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

interface User {
  id: number
  name: string
  region: string
  contact: string
  distributedSims: number
  dateJoined: string
  status: "Active" | "Inactive" | "Suspended"
  // Additional details for partner view
  email?: string
  phone?: string
  gender?: string
  country?: string
  simNumber?: string
  nin?: string
  bvn?: string
  totalTransactions?: string
  totalCommissions?: string
  pendings?: number
}

interface PartnershipData {
  id: string
  simBatchId: string
  stateCoordinator: string
  status: "Active" | "Inactive"
  dateReceived: string
  quantity: number
  remaining: number
}

interface Transaction {
  id: string
  type: string
  date: string
  amount: string
  status: "Successful" | "Failed" | "Pending"
}

const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())

  // Mock data - replace with API data
  const users: User[] = [
    {
      id: 1,
      name: "Yusuf Adam Baba",
      region: "Lagos",
      contact: "0812-345-6789",
      distributedSims: 100,
      dateJoined: "Mar 10, 2025",
      status: "Active",
      // Additional details
      email: "yusufababah50@gmail.com",
      phone: "+234 801 234 5678",
      gender: "Male",
      country: "Nigeria",
      simNumber: "#SIM12345",
      nin: "12345678901",
      bvn: "2211334455",
      totalTransactions: "200,000",
      totalCommissions: "100.00",
      pendings: 2,
    },
    {
      id: 2,
      name: "John Bello",
      region: "Kano",
      contact: "0901-234-5678",
      distributedSims: 32,
      dateJoined: "Feb 22, 2025",
      status: "Active",
      email: "john.bello@example.com",
      phone: "+234 901 234 5678",
      gender: "Male",
      country: "Nigeria",
      simNumber: "#SIM12346",
      nin: "12345678902",
      bvn: "2211334456",
      totalTransactions: "150,000",
      totalCommissions: "75.00",
      pendings: 1,
    },
    {
      id: 3,
      name: "Amina Yusuf",
      region: "Lagos",
      contact: "0812-345-6789",
      distributedSims: 100,
      dateJoined: "Mar 10, 2025",
      status: "Active",
      email: "amina.yusuf@example.com",
      phone: "+234 812 345 6789",
      gender: "Female",
      country: "Nigeria",
      simNumber: "#SIM12347",
      nin: "12345678903",
      bvn: "2211334457",
      totalTransactions: "180,000",
      totalCommissions: "90.00",
      pendings: 3,
    },
  ]

  // Mock partnership data
  const partnershipData: PartnershipData[] = [
    {
      id: "1",
      simBatchId: "SIMB-001",
      stateCoordinator: "Buhari Abdulrahman",
      status: "Active",
      dateReceived: "01/07/2025",
      quantity: 500,
      remaining: 300,
    },
    {
      id: "2",
      simBatchId: "SIMB-001",
      stateCoordinator: "Regional Manager",
      status: "Active",
      dateReceived: "01/07/2025",
      quantity: 500,
      remaining: 340,
    },
    {
      id: "3",
      simBatchId: "0901XXX456",
      stateCoordinator: "Airtel",
      status: "Active",
      dateReceived: "Yesterday, 4:50 PM",
      quantity: 0,
      remaining: 0,
    },
  ]

  // Mock transaction data
  const transactions: Transaction[] = [
    { id: "1", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦500", status: "Failed" },
    { id: "2", type: "Transfer", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦500", status: "Successful" },
    { id: "3", type: "Data Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
    { id: "4", type: "Bill Payment", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Pending" },
    { id: "5", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
    { id: "6", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.contact.includes(searchTerm)

    const matchesStatus = statusFilter === "All" || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Successful":
        return "default"
      case "Pending":
        return "secondary"
      case "Failed":
        return "destructive"
      default:
        return "secondary"
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
      setSelectedUsers(new Set(filteredUsers.map((user) => user.id)))
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

  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedUsers.has(user.id))

  if (selectedUser) {
    return <PartnerDetailsView user={selectedUser} onBack={handleBackClick} />
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
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
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
            <TableHead>Distributed SIMs</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleRowClick(user)}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedUsers.has(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.region}</TableCell>
                <TableCell>{user.contact}</TableCell>
                <TableCell>{user.distributedSims}</TableCell>
                <TableCell>{user.dateJoined}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button className="px-3 py-1 rounded border">Previous</button>
        <button className="px-3 py-1 rounded border bg-gray-100">1</button>
        <button className="px-3 py-1 rounded border">2</button>
        <button className="px-3 py-1 rounded border">3</button>
        <span>...</span>
        <button className="px-3 py-1 rounded border">8</button>
        <button className="px-3 py-1 rounded border">9</button>
        <button className="px-3 py-1 rounded border">10</button>
        <button className="px-3 py-1 rounded border">Next →</button>
      </div>
    </div>
  )
}

interface PartnerDetailsViewProps {
  user: User
  onBack: () => void
}

const PartnerDetailsView: React.FC<PartnerDetailsViewProps> = ({ user, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock partnership data
  const partnershipData: PartnershipData[] = [
    {
      id: "1",
      simBatchId: "SIMB-001",
      stateCoordinator: "Buhari Abdulrahman",
      status: "Active",
      dateReceived: "01/07/2025",
      quantity: 500,
      remaining: 300,
    },
    {
      id: "2",
      simBatchId: "SIMB-001",
      stateCoordinator: "Regional Manager",
      status: "Active",
      dateReceived: "01/07/2025",
      quantity: 500,
      remaining: 340,
    },
    {
      id: "3",
      simBatchId: "0901XXX456",
      stateCoordinator: "Airtel",
      status: "Active",
      dateReceived: "Yesterday, 4:50 PM",
      quantity: 0,
      remaining: 0,
    },
  ]

  // Mock transaction data
  const transactions: Transaction[] = [
    { id: "1", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦500", status: "Failed" },
    { id: "2", type: "Transfer", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦500", status: "Successful" },
    { id: "3", type: "Data Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
    { id: "4", type: "Bill Payment", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Pending" },
    { id: "5", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
    { id: "6", type: "Airtime Purchase", date: "Sun Jul 4 2025 - 1:00AM", amount: "₦1,000", status: "Successful" },
  ]

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "Successful":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Successful</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  const getPartnershipStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
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
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">YAB</div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.simNumber}</div>
                    </div>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone Number</div>
                  <div>{user.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Gender</div>
                  <div>{user.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Country</div>
                  <div>{user.country}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Date Joined</div>
                  <div>April 12, 2025</div>
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
                  <div>{user.nin}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">BVN</div>
                  <div>{user.bvn}</div>
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
                <div className="text-2xl font-bold">₦{user.totalTransactions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Commissions</div>
                <div className="text-2xl font-bold">₦{user.totalCommissions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Pendings</div>
                <div className="text-2xl font-bold">{user.pendings}</div>
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
                      <div className="font-medium">{transaction.type}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className="font-medium">{transaction.amount}</div>
                    <div className="flex items-center justify-between">
                      {getTransactionStatusBadge(transaction.status)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-100">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <span className="text-muted-foreground">...</span>
                  <Button variant="outline" size="sm">
                    8
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Partnership Summary Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Partnership Summary</h2>

        {/* Partnership Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Commissions</div>
              <div className="text-2xl font-bold">$300</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Total SIMs Assigned</div>
              <div className="text-2xl font-bold">500</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">SIMs Distributed</div>
              <div className="text-2xl font-bold">132</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Current SIMs</div>
              <div className="text-2xl font-bold">300</div>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Table */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SIM Batch ID</TableHead>
                  <TableHead>State Coordinator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnershipData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.simBatchId}</TableCell>
                    <TableCell>{item.stateCoordinator}</TableCell>
                    <TableCell>{getPartnershipStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.dateReceived}</TableCell>
                    <TableCell>{item.quantity === 0 ? "2nd June, 2026" : item.quantity}</TableCell>
                    <TableCell>{item.remaining === 0 ? "Unlimited Yearly" : item.remaining}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserTable
