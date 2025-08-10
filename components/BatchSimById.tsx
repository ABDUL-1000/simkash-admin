"use client"

import type React from "react"
import { useState, useEffect } from "react" 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { Sim, useSimsByBatchId } from "@/hooks/use-addSim"
import Link from "next/link"

interface SimsInBatchTableProps {
  batchId: number
  batchName: string
  onBack: () => void
}

const SimsInBatchTable: React.FC<SimsInBatchTableProps> = ({ batchId, batchName, onBack }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("") // New state for search term
  const [filteredSims, setFilteredSims] = useState<Sim[]>([]) // New state for filtered SIMs

  const { data, isLoading, isError, error, refetch } = useSimsByBatchId({ batchId, page, limit })

  const sims = data?.sims || []
  const totalSims = data?.pagination.total || 0
  const totalPages = data?.pagination.totalPages || 1

  // Effect to filter SIMs based on search term
  useEffect(() => {
    if (sims) {
      const lowercasedSearchTerm = searchTerm.toLowerCase()
      const filtered = sims.filter(
        (sim) =>
          sim.sim_number.toLowerCase().includes(lowercasedSearchTerm) ||
          sim.network.toLowerCase().includes(lowercasedSearchTerm),
      )
      setFilteredSims(filtered)
    }
  }, [sims, searchTerm])

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

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
               <Button variant="outline" onClick={onBack} className="px-4 py-2 bg-black text-white rounded-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
          <h3 className="text-lg font-medium text-gray-900 mb-4">SIMs for Batch: {batchName}</h3>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading SIMs...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow">
         
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SIMs for Batch: {batchName}</h3>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Error: {error?.message || "Failed to load SIMs"}</p>
            <Button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="px-4 py-2 bg-black text-white rounded-md">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Batches
          </Button>
          <h3 className="text-lg font-medium text-gray-900">SIMs for Batch: {batchName}</h3>
          <div className="text-sm text-gray-500">
            Total: {totalSims} SIM{totalSims !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <Input
            type="text"
            placeholder="Search SIMs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {filteredSims.length === 0 && searchTerm === "" ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No SIMs found for this batch</h3>
            <p className="text-sm text-gray-500">This batch currently has no individual SIMs added.</p>
          </div>
        ) : filteredSims.length === 0 && searchTerm !== "" ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No matching SIMs found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S/N</TableHead>
                  <TableHead>SIM Number</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSims.map((sim: Sim, index) => (
                  <TableRow key={sim.id}>
                    <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{sim.sim_number}</TableCell>
                    <TableCell className={getNetworkColor(sim.network)}>{sim.network}</TableCell>
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

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={page === 1 || isLoading} variant="outline">
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages} (Total: {totalSims})
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

export default SimsInBatchTable
