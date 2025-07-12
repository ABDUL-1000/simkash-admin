"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AuthAPI } from "@/lib/API/api"
import { Loader2 } from "lucide-react"

interface AssignedSim {
  id: number
  agent_id: number
  user_id: number
  batch_id: number
  network: string
  sim_number: string
  status: string
  createdAt: string
  updatedAt: string
  batch: {
    batch_name: string
  }
}

interface PartnerSimTableProps {
  refreshTrigger?: number // Add this to trigger refresh when new SIM is added
}

const PartnerSimTable: React.FC<PartnerSimTableProps> = ({ refreshTrigger = 0 }) => {
  const [assignedSims, setAssignedSims] = useState<AssignedSim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignedSims = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await AuthAPI.getAgentAssignedSims()

      if (response.success) {
        setAssignedSims(response.data || [])
      } else {
        setError(response.message || "Failed to fetch assigned SIMs")
      }
    } catch (error) {
      console.error("Error fetching assigned SIMs:", error)
      setError("An error occurred while fetching SIMs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignedSims()
  }, [refreshTrigger]) // Refetch when refreshTrigger changes

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case "mtn":
        return "text-yellow-600 font-semibold"
      case "airtel":
        return "text-red-600 font-semibold"
      case "glo":
        return "text-green-600 font-semibold"
      case "9mobile":
        return "text-green-800 font-semibold"
      default:
        return "text-gray-600 font-semibold"
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned SIMs</h3>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading SIMs...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned SIMs</h3>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchAssignedSims} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Total: {assignedSims.length} SIM{assignedSims.length !== 1 ? "s" : ""}
          </div>
        </div>

        {assignedSims.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No SIMs assigned yet</h3>
            <p className="text-sm text-gray-500">Start by adding your first SIM card.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">SIM Batch ID</TableHead>
                  <TableHead>State Cordinator</TableHead>
                 
                  <TableHead>Status</TableHead>
                   <TableHead>Quantity</TableHead>
                  <TableHead>Date Added</TableHead>
          
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedSims.map((sim) => (
                  <TableRow key={sim.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{sim.sim_number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={getNetworkColor(sim.network)}>{sim.network}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{sim.batch.batch_name}</span>
                
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(sim.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(sim.createdAt)}</span>
                        {sim.updatedAt !== sim.createdAt && (
                          <span className="text-xs text-gray-500">Updated: {formatDate(sim.updatedAt)}</span>
                        )}
                      </div>
                    </TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerSimTable
