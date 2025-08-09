"use client"

import { useEffect } from "react"
import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText } from "lucide-react" // Added FileText for empty state

import { useSimBatches, type SimBatch } from "@/hooks/use-addSim" // Import SimBatch type

interface PartnerSimTableProps {
  refreshTrigger?: number // This prop will no longer be directly used for fetching, but kept for potential external triggers
}

const AddedSimsTable: React.FC<PartnerSimTableProps> = ({ refreshTrigger = 0 }) => {
  const { data, isLoading, isError, error, refetch } = useSimBatches() // Use the new hook
  console.log("SIM Batches:", data)


  useEffect(() => {
    if (refreshTrigger > 0) {
    
      refetch()
    }
  }, [refreshTrigger, refetch])

  const simBatches = data?.simBatch || []
  const totalSims = data?.pagination.total || 0

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

const getStatusBadge = (status: string | null) => {
  if (!status) {
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Unknown</Badge>
  }
  
  switch (status.toLowerCase()) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case "inactive":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
  }
}


const getNetworkColor = (network: string | null) => {
  if (!network) {
    return "text-gray-600 font-semibold"
  }
  
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">Added sims</h3>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading Added SIMs ...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SIM Batches</h3>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {error?.message || "Failed to load SIM batches"}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
            Total: {totalSims} SIM Batch{totalSims !== 1 ? "es" : ""}
          </div>
        </div>
        {simBatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" /> {/* Using Lucide icon */}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No SIM batches added yet</h3>
            <p className="text-sm text-gray-500">Start by adding your first SIM batch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
               
                  <TableHead>Quantity</TableHead>
                  <TableHead>Remaining</TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                {simBatches.map((simBatch: SimBatch) => (
                  <TableRow key={simBatch.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{simBatch.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(simBatch.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(simBatch.createdAt)}</span>
                        {simBatch.updatedAt !== simBatch.createdAt && (
                          <span className="text-xs text-gray-500">Updated: {formatDate(simBatch.updatedAt)}</span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>{simBatch.quantity}</TableCell>
                    <TableCell>{simBatch.quantity-simBatch.number_of_assigned}</TableCell>
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

export default AddedSimsTable
