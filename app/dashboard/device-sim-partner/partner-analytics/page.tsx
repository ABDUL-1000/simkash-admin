"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, TrendingUp, CheckCircle, Filter, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface LeaderboardEntry {
  id: string
  name: string
  region: string
  simsAssigned: number
  activationPercentage: string
  dateJoined: string
  status: "Active" | "Inactive" | "Suspended"
}

const AnalyticsPage: React.FC = () => {
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8) // Based on the image showing 8 rows

  // Mock data for leaderboard
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Amina Yusuf",
      region: "Lagos",
      simsAssigned: 10,
      activationPercentage: "90%",
      dateJoined: "Mar 10, 2025",
      status: "Active",
    },
    {
      id: "2",
      name: "John Bello",
      region: "Kano",
      simsAssigned: 20,
      activationPercentage: "87%",
      dateJoined: "Feb 22, 2025",
      status: "Active",
    },
    {
      id: "3",
      name: "Chika Umeh",
      region: "Kano",
      simsAssigned: 40,
      activationPercentage: "85%",
      dateJoined: "Jan 05, 2025",
      status: "Active",
    },
    {
      id: "4",
      name: "Fatima Sanni",
      region: "Kano",
      simsAssigned: 300,
      activationPercentage: "80%",
      dateJoined: "Feb 22, 2025",
      status: "Active",
    },
    {
      id: "5",
      name: "Musa Haruna",
      region: "Yobe",
      simsAssigned: 30,
      activationPercentage: "30%",
      dateJoined: "Jan 05, 2025",
      status: "Active",
    },
    {
      id: "6",
      name: "Haruna James",
      region: "Abuja",
      simsAssigned: 13,
      activationPercentage: "13%",
      dateJoined: "Jan 05, 2025",
      status: "Active",
    },
    {
      id: "7",
      name: "Haruna James",
      region: "Abuja",
      simsAssigned: 19,
      activationPercentage: "19%",
      dateJoined: "Mar 10, 2025",
      status: "Inactive", // Example of different status
    },
    {
      id: "8",
      name: "Fatima Sanni",
      region: "Abuja",
      simsAssigned: 20,
      activationPercentage: "20%",
      dateJoined: "Mar 10, 2025",
      status: "Suspended", // Example of different status
    },
    {
      id: "9",
      name: "Usman Ali",
      region: "Kaduna",
      simsAssigned: 50,
      activationPercentage: "70%",
      dateJoined: "Apr 01, 2025",
      status: "Active",
    },
    {
      id: "10",
      name: "Blessing Nnamdi",
      region: "Rivers",
      simsAssigned: 15,
      activationPercentage: "60%",
      dateJoined: "May 05, 2025",
      status: "Active",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-medium">Active</Badge>
      case "Suspended":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 font-medium">Suspended</Badge>
        )
      case "Inactive":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-medium">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0 font-medium">{status}</Badge>
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLeaderboardEntries = leaderboardData.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(new Set(currentLeaderboardEntries.map((entry) => entry.id)))
    } else {
      setSelectedEntries(new Set())
    }
  }

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    const newSelected = new Set(selectedEntries)
    if (checked) {
      newSelected.add(entryId)
    } else {
      newSelected.delete(entryId)
    }
    setSelectedEntries(newSelected)
  }

  const isAllSelected =
    currentLeaderboardEntries.length > 0 && currentLeaderboardEntries.every((entry) => selectedEntries.has(entry.id))

  return (
    <DashboardLayout>
    <div className="space-y-8 p-6">
      {/* Overview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Approved Partners</p>
                <p className="text-3xl font-bold">500</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total SIMs Distributed</p>
                <p className="text-3xl font-bold">132</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total SIMs Activated</p>
                <p className="text-3xl font-bold">300</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-64 flex items-center justify-center text-muted-foreground">
          {/* Placeholder for Chart 1 */}
          Chart Placeholder
        </Card>
        <Card className="h-64 flex items-center justify-center text-muted-foreground">
          {/* Placeholder for Chart 2 */}
          Chart Placeholder
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <Button variant="outline" className="border-gray-200 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            This week
          </Button>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="w-12 pl-6">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all leaderboard entries"
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </TableHead>
                    <TableHead className="font-medium text-gray-700">User ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Region</TableHead>
                    <TableHead className="font-medium text-gray-700">SIMs Assigned</TableHead>
                    <TableHead className="font-medium text-gray-700">Activation %</TableHead>
                    <TableHead className="font-medium text-gray-700">Date Joined</TableHead>
                    <TableHead className="font-medium text-gray-700">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLeaderboardEntries.map((entry) => (
                    <TableRow key={entry.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedEntries.has(entry.id)}
                          onCheckedChange={(checked) => handleSelectEntry(entry.id, checked as boolean)}
                          aria-label={`Select ${entry.name}`}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{entry.name}</TableCell>
                      <TableCell className="text-gray-700">{entry.region}</TableCell>
                      <TableCell className="text-gray-700">{entry.simsAssigned}</TableCell>
                      <TableCell className="text-gray-700">{entry.activationPercentage}</TableCell>
                      <TableCell className="text-gray-700">{entry.dateJoined}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="pr-6">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 p-0 ${
                          currentPage === pageNum
                            ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  {totalPages > 10 && (
                    <>
                      <span className="text-gray-400 px-2">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="w-8 h-8 p-0 border-gray-200 hover:bg-gray-50"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage
