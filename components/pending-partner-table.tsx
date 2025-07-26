"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination"

import { Search, Filter, MoreHorizontal } from "lucide-react"
import { UserDetailsResponseBody } from "@/hooks/use-partnerList-table"

interface PartnerApplicationsTableProps {
  partners: UserDetailsResponseBody[]
  onRowClick: (partnerId: number) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  onApplyFilter: () => void
}

export default function PartnerApplicationsTable({
  partners,
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  onApplyFilter,
}: PartnerApplicationsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 ">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onApplyFilter()
              }
            }}
          />
        </div>
        <Button
          variant="outline"
          onClick={onApplyFilter}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Apply Filter
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
              </TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>fullname</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead> {/* For the three dots menu */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No pending applications found.
                </TableCell>
              </TableRow>
            ) : (
              partners.map((partner) => (
                <TableRow
                  key={partner.id}
                  onClick={() => onRowClick(partner.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" />
                  </TableCell>
                  <TableCell>{partner.id}</TableCell>
                  <TableCell>{partner.fullname || "N/A"}</TableCell> 
                  <TableCell>{partner.state || "N/A"}</TableCell> 
                  <TableCell>{partner.phone || "N/A"}</TableCell>
                  <TableCell>{new Date(partner.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        partner.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : partner.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : partner.status === "suspended"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {partner.status || "Pending"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {partners.length} of {totalPages * 10} entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => onPageChange(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" isActive={page === currentPage} onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
