// components/service-customization-table.tsx
"use client"

import { useState } from "react"
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
  Edit,
} from "lucide-react"


import { useServices } from "@/hooks/use-inventory"
import ServiceEditSheet from "@/components/modals/inventorySheet"
import { DashboardLayout } from "@/components/dashboard-layout"

const ServiceCustomizationTable: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterActive, setFilterActive] = useState<boolean | null>(null)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useServices({
    page: currentPage,
    limit: 10,
  })

  const services = data?.services || []
  const pagination = data?.pagination

  const handleEditClick = (serviceId: number) => {
    setSelectedServiceId(serviceId)
  }

  const handleCloseSheet = () => {
    setSelectedServiceId(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFilterToggle = () => {
    setFilterActive(prev => prev === null ? true : prev === true ? false : null)
    setCurrentPage(1)
  }

  // Filter services based on search term and active status
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === null ? true : service.isActive === filterActive
    return matchesSearch && matchesFilter
  })

  if (isLoading && !isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing & Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading services...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
         <DashboardLayout>

       
      <Card>
        <CardHeader>
          <CardTitle>Service Pricing & Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{"Error: " + error?.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
      
      </DashboardLayout>
    )
  }

  return (
    <>
     <DashboardLayout>

    
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleFilterToggle}>
              <Filter className="h-4 w-4 mr-2" />
              {filterActive === null 
                ? "Show All" 
                : filterActive 
                  ? "Show Active Only" 
                  : "Show Inactive Only"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 && !isFetching ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No services found</h3>
              <p className="text-sm text-gray-500">No services match your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">S/N</TableHead>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Discount Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * (pagination?.limit || 10) + (index + 1)}
                      </TableCell>
                      <TableCell>
                        <span>{service.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {service.discount_percentage}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.isActive ? "default" : "destructive"}>
                          {service.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(service.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {isFetching && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
                        Fetching more services...
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

      {selectedServiceId && (
        <ServiceEditSheet
          serviceId={selectedServiceId}
          open={!!selectedServiceId}
          onClose={handleCloseSheet}
        />
      )}
       </DashboardLayout>
    </>
  )
}

export default ServiceCustomizationTable