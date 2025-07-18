"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface Partner {
  id: number
  name: string
  region: string
  contact: string
  email: string
  country: string
  state: string
  lga: string
  address: string
  motivation: string
  status: "Pending" | "Approved" | "Rejected"
  documents: string[]
}

const PartnerApplicationTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Mock data - replace with API data
  const partners: Partner[] = [
    {
      id: 1,
      name: "Yusuf Adam Baba",
      region: "Lagos",
      contact: "0812-345-6789",
      email: "yusufababah50@gmail.com",
      country: "Nigeria",
      state: "Kano",
      lga: "Nigeria",
      address: "Sharada Phase II",
      motivation: "Sharada Phase II",
      status: "Pending",
      documents: ["Government Issued ID.pdf"],
    },
    {
      id: 2,
      name: "John Bello",
      region: "Kano",
      contact: "0901-234-5678",
      email: "john@gmail.com",
      country: "Nigeria",
      state: "Kano",
      lga: "Kano Municipal",
      address: "456 Kano Road",
      motivation: "To serve my community",
      status: "Pending",
      documents: ["Government Issued ID.pdf"],
    },
    {
      id: 3,
      name: "Amina Yusuf",
      region: "Lagos",
      contact: "0812-345-6789",
      email: "amina@gmail.com",
      country: "Nigeria",
      state: "Lagos",
      lga: "Lagos Mainland",
      address: "123 Lagos Street",
      motivation: "I want to expand my business",
      status: "Approved",
      documents: ["Government Issued ID.pdf", "Proof of Address.pdf"],
    },
  ]

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contact.includes(searchTerm)

    const matchesStatus = statusFilter === "All" || partner.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsSheetOpen(true)
  }

  const handleApprove = () => {
    // API call to approve partner
    console.log("Approved partner:", selectedPartner?.id)
    setIsSheetOpen(false)
  }

  const handleReject = () => {
    // API call to reject partner
    console.log("Rejected partner:", selectedPartner?.id)
    setIsSheetOpen(false)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      case "Pending":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      {/* Search and Filter */}
      <div className="flex justify-end items-center mb-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search partners..."
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
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Partners Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <TableRow
                key={partner.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handlePartnerClick(partner)}
              >
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell>{partner.region}</TableCell>
                <TableCell>{partner.contact}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(partner.status)}>{partner.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No partners found
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

      {/* Partner Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-left">Application Details</SheetTitle>
            </SheetHeader>

            {selectedPartner && (
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Full Name</p>
                    <p className="font-medium">{selectedPartner.name}</p>
                  </div>

                  {/* Email Address */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Email Address</p>
                    <p className="font-medium">{selectedPartner.email}</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                    <p className="font-medium">{selectedPartner.contact}</p>
                  </div>

                  {/* Country and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Country</p>
                      <p className="font-medium">{selectedPartner.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">State</p>
                      <p className="font-medium">{selectedPartner.state}</p>
                    </div>
                  </div>

                  {/* LGA */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">LGA</p>
                    <p className="font-medium">{selectedPartner.lga}</p>
                  </div>

                  {/* Home Address */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Home Address</p>
                    <p className="font-medium">{selectedPartner.address}</p>
                  </div>

                  {/* Motivation */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Why do you want to be simkash partner?</p>
                    <p className="font-medium">{selectedPartner.motivation}</p>
                  </div>

                  {/* Second motivation question */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Why do you want to be simkash partner?</p>
                    <p className="font-medium">{selectedPartner.motivation}</p>
                  </div>

                  {/* Documents */}
                  <div>
                    {selectedPartner.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t px-6 py-4">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReject} className="flex-1 bg-transparent">
                  Deny
                </Button>
                <Button onClick={handleApprove} className="flex-1 bg-slate-900 hover:bg-slate-800">
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default PartnerApplicationTable
