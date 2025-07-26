"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "sonner" // Changed to sonner Toaster
import { Loader2 } from "lucide-react"

import PartnerDetailsModal from "./modals/pending-partner-modal"
import PartnerApplicationsTable from "./pending-partner-table"
import { usePartners } from "@/hooks/use-pending-partners"

export default function PartnerApplicationsPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentSearchTerm, setCurrentSearchTerm] = useState("") // To trigger search on button click
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, error } = usePartners({
    page,
    limit: 10, // Assuming 10 items per page as default
    searchTerm: currentSearchTerm,
    status: "pending", // Fetching only pending partners as per request
  })
  console.log(data, "partner data")

  const handleRowClick = (partnerId: number) => {
    setSelectedPartnerId(partnerId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPartnerId(null)
  }

  const handleApplyFilter = () => {
    setPage(1) // Reset to first page on new search
    setCurrentSearchTerm(searchTerm)
  }

  return (
    <main className="flex flex-1 flex-col gap-4  md:gap-2 md:p-2">
     
      <Card>
      
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : isError ? (
            <div className="text-red-500 text-center py-8">
              Error: {error?.message || "Failed to load partner applications."}
            </div>
          ) : (
            <PartnerApplicationsTable
              partners={data?.agents || []}
              onRowClick={handleRowClick}
              currentPage={data?.pagination.currentPage || 1}
              totalPages={data?.pagination.totalPages || 1}
              onPageChange={setPage}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onApplyFilter={handleApplyFilter}
            />
          )}
        </CardContent>
      </Card>
      <PartnerDetailsModal partnerId={selectedPartnerId} isOpen={isModalOpen} onClose={handleCloseModal} />
      <Toaster />
    </main>
  )
}
