"use client"

import { useState, useEffect } from "react" // Added useEffect for search filtering
import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SimBatch, useSimBatches } from "@/hooks/use-addSim"
import SimsInBatchTable from "./BatchSimById"

type SimBatchesTableProps = {}

const SimBatchesTable: React.FC<SimBatchesTableProps> = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null)
  const [selectedBatchName, setSelectedBatchName] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBatches, setFilteredBatches] = useState<SimBatch[]>([]) // New state for filtered batches

  const { data, isLoading, isError, error, refetch } = useSimBatches({ page, limit })

  const simBatches = data?.simBatch || []
  const totalBatches = data?.pagination.total || 0
  const totalPages = data?.pagination.totalPages || 1

  // Effect to filter batches based on search term
  useEffect(() => {
    if (simBatches) {
      const lowercasedSearchTerm = searchTerm.toLowerCase()
      const filtered = simBatches.filter(
        (batch) =>
          batch.batch_name.toLowerCase().includes(lowercasedSearchTerm) ||
          (batch.network && batch.network.toLowerCase().includes(lowercasedSearchTerm)) ||
          batch.status.toLowerCase().includes(lowercasedSearchTerm),
      )
      setFilteredBatches(filtered)
    }
  }, [simBatches, searchTerm])

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

  const handleBatchClick = (batch: SimBatch) => {
    setSelectedBatchId(batch.id)
    setSelectedBatchName(batch.batch_name)
  }

  const handleBackToBatches = () => {
    setSelectedBatchId(null)
    setSelectedBatchName(null)
    setPage(1)
    setSearchTerm("") 
  }

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (selectedBatchId !== null && selectedBatchName !== null) {
    return <SimsInBatchTable batchId={selectedBatchId} batchName={selectedBatchName} onBack={handleBackToBatches} />
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SIM Batches</h3>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading SIM Batches ...</span>
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
            Total: {totalBatches} SIM Batch{totalBatches !== 1 ? "es" : ""}
          </div>
          <Input
            type="text"
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        {filteredBatches.length === 0 && searchTerm === "" ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No SIM batches added yet</h3>
            <p className="text-sm text-gray-500">Start by adding your first SIM batch.</p>
          </div>
        ) : filteredBatches.length === 0 && searchTerm !== "" ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No matching SIM batches found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((simBatch: SimBatch, index) => (
                  <TableRow
                    key={simBatch.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleBatchClick(simBatch)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{(page - 1) * limit + index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{simBatch.batch_name}</TableCell>
                    <TableCell className={getNetworkColor(simBatch.network)}>{simBatch.network || "N/A"}</TableCell>
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
                    <TableCell>{simBatch.quantity - simBatch.number_of_assigned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={page === 1 || isLoading} variant="outline">
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages} (Total: {totalBatches})
            </span>
            <Button onClick={handleNextPage} disabled={page === totalPages || isLoading} variant="outline">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimBatchesTable
