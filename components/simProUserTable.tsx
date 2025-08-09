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
  Search,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"


import { SimProTable, useSimProTable } from "@/hooks/use-distributeSim"



const SimProUserTable: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("") 

  const {
   data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useSimProTable({
    page: currentPage,
    limit: 10, 
 
   
  })


 const users = data?.users || []
const pagination = data?.pagination
console.log("users", users)
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

    setFilterStatus((prev) => (prev === "active" ? "" : "active"))
    setCurrentPage(1) 
  }

  if (isLoading && !isFetching) {
   
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pro Users</CardTitle>
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
          <CardTitle>Pro Users</CardTitle>
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
                  <TableHead className="w-[100px]">S/N</TableHead>
                  <TableHead>Full Name </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-gray-50"
                  
                  >
                    <TableCell className="font-medium">
                      {(currentPage - 1) * (pagination?.limit || 10) + (index + 1)}
                    </TableCell>
                    <TableCell>
                      <span>{user.fullname }</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.phone}</span>
                    </TableCell>
                    <TableCell>
                   {user.subscriptionDate}
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
export default SimProUserTable